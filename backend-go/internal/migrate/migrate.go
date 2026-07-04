// Package migrate turns the Phase-0 S3 salvage into the live data layout the Go
// backend serves: photo files hardlinked into DATA_DIR/photos, external-article
// files hardlinked into a public static dir, and one SQLite photos row per photo
// object.
//
// It is deliberately non-destructive toward the salvage: every file is
// HARDLINKED (never copied), so the salvage tree stays pristine and the copy
// costs ~zero bytes. That matters because the Hetzner volume has less free space
// than the photos occupy, so a copy is impossible.
//
// The tool is idempotent. Re-running skips files already linked (same inode) and
// upserts photo rows by their unique storage path, so a partial or repeated run
// converges without duplication or error.
//
// Metadata gotcha (load-bearing): every S3 custom-metadata VALUE (uuid,
// original-file-name, email-address, title) is percent-encoded UTF-8 in the
// salvage manifest. This package decodes them before storing, matching the
// backend, which keeps metadata decoded in SQLite (see
// docs/backend-go-divergences.md).
package migrate

import (
	"bufio"
	"context"
	"crypto/md5"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/vdavid/photato/backend-go/internal/photos"
	"github.com/vdavid/photato/backend-go/internal/store"
)

// photoEnvironments are the salvage top-level dirs whose `photos/` subtrees hold
// student uploads. external-articles is handled as static content, not photos.
var photoEnvironments = map[string]bool{
	"production":  true,
	"development": true,
	"staging":     true,
}

// Kind classifies a manifest entry by where its bytes belong.
type Kind int

const (
	// KindUnknown is an entry that matches neither the photo nor the
	// external-article shape. It is reported and skipped, never guessed at.
	KindUnknown Kind = iota
	// KindPhoto is a student upload: key `<env>/photos/<course>/week-<n>/<email>.jpg`.
	KindPhoto
	// KindExternalArticle is a public static asset under `external-articles/`.
	KindExternalArticle
)

// Entry is one decoded manifest line. Metadata fields are populated (decoded)
// only for photo entries; external-article and unknown entries carry empty
// metadata by design.
type Entry struct {
	Key          string
	Size         int64
	ETag         string // plain MD5 hex (no multipart uploads), so == content MD5
	LastModified time.Time
	ContentType  string
	Kind         Kind

	// Decoded photo metadata (photo entries only).
	UUID             string
	EmailAddress     string
	OriginalFileName string
	Title            string
}

// manifestLine mirrors one raw JSON-lines record in metadata.json.
type manifestLine struct {
	Key          string            `json:"key"`
	Size         int64             `json:"size"`
	ETag         string            `json:"etag"`
	LastModified string            `json:"last_modified"`
	ContentType  string            `json:"content_type"`
	Metadata     map[string]string `json:"metadata"`
}

// Options configures a migration run.
type Options struct {
	// SourceDir is the salvage root: the dir holding `s3/` and `metadata.json`.
	SourceDir string
	// DataDir is the backend's DATA_DIR; photos land under DataDir/photos.
	DataDir string
	// SQLitePath is the database file. Empty means DataDir/photato.db (matching
	// the server's default).
	SQLitePath string
	// ExternalArticlesDir is where external-article files are hardlinked. Empty
	// means DataDir/external-articles.
	ExternalArticlesDir string
	// DryRun plans and counts without writing anything (no links, no rows, no db).
	DryRun bool
}

// s3Dir returns the salvage file tree root (SourceDir/s3).
func (o Options) s3Dir() string { return filepath.Join(o.SourceDir, "s3") }

// manifestPath returns the salvage manifest path (SourceDir/metadata.json).
func (o Options) manifestPath() string { return filepath.Join(o.SourceDir, "metadata.json") }

// dbPath returns the resolved SQLite path.
func (o Options) dbPath() string {
	if o.SQLitePath != "" {
		return o.SQLitePath
	}
	return filepath.Join(o.DataDir, "photato.db")
}

// photosDir returns the resolved photos root (DataDir/photos), matching the
// server's layout.
func (o Options) photosDir() string { return filepath.Join(o.DataDir, "photos") }

// externalArticlesDir returns the resolved external-articles root.
func (o Options) externalArticlesDir() string {
	if o.ExternalArticlesDir != "" {
		return o.ExternalArticlesDir
	}
	return filepath.Join(o.DataDir, "external-articles")
}

// Result reports what a run did (or, for a dry run, would do).
type Result struct {
	PhotosLinked    int // photo files newly hardlinked
	PhotosSkipped   int // photo files already linked (idempotent skip)
	PhotoRows       int // photo rows upserted
	ExternalLinked  int // external-article files newly hardlinked
	ExternalSkipped int // external-article files already linked
	Unknown         int // entries matching no known shape (skipped)
	MissingSource   int // manifest entries whose salvage file is absent
	LinkConflicts   int // target exists but is a different file (left untouched)
	Warnings        []string
}

// classify decides where a manifest key's bytes belong from the key shape alone.
func classify(key string) Kind {
	seg := strings.Split(key, "/")
	if len(seg) >= 5 && photoEnvironments[seg[0]] && seg[1] == "photos" {
		return KindPhoto
	}
	if len(seg) >= 2 && seg[0] == "external-articles" {
		return KindExternalArticle
	}
	return KindUnknown
}

// decode percent-decodes an S3 custom-metadata value. PathUnescape (not
// QueryUnescape) is used so a literal '+' is preserved rather than turned into a
// space; salvaged spaces are encoded as %20. On a decode error the raw value is
// returned unchanged (better a slightly-off name than a dropped record).
func decode(v string) (string, bool) {
	if v == "" {
		return "", true
	}
	dec, err := url.PathUnescape(v)
	if err != nil {
		return v, false
	}
	return dec, true
}

// ParseManifest reads JSON-lines from r into decoded Entries, in file order.
// Malformed lines and unparseable timestamps are collected as warnings rather
// than aborting the whole migration.
func ParseManifest(r io.Reader) ([]Entry, []string, error) {
	var (
		entries  []Entry
		warnings []string
	)
	sc := bufio.NewScanner(r)
	// Photo files can carry very long keys/metadata; raise the line cap well
	// above bufio's 64 KB default.
	sc.Buffer(make([]byte, 0, 64*1024), 4*1024*1024)

	lineNo := 0
	for sc.Scan() {
		lineNo++
		raw := strings.TrimSpace(sc.Text())
		if raw == "" {
			continue
		}
		var ml manifestLine
		if err := json.Unmarshal([]byte(raw), &ml); err != nil {
			warnings = append(warnings, fmt.Sprintf("line %d: bad JSON: %v", lineNo, err))
			continue
		}

		e := Entry{
			Key:         ml.Key,
			Size:        ml.Size,
			ETag:        ml.ETag,
			ContentType: ml.ContentType,
			Kind:        classify(ml.Key),
		}
		if t, err := time.Parse(time.RFC1123, ml.LastModified); err != nil {
			warnings = append(warnings, fmt.Sprintf("%s: unparseable last_modified %q: %v", ml.Key, ml.LastModified, err))
		} else {
			e.LastModified = t.UTC()
		}

		if e.Kind == KindPhoto {
			e.UUID, _ = decode(ml.Metadata["uuid"])
			var ok bool
			if e.EmailAddress, ok = decode(ml.Metadata["email-address"]); !ok {
				warnings = append(warnings, fmt.Sprintf("%s: undecodable email-address %q", ml.Key, ml.Metadata["email-address"]))
			}
			if e.OriginalFileName, ok = decode(ml.Metadata["original-file-name"]); !ok {
				warnings = append(warnings, fmt.Sprintf("%s: undecodable original-file-name %q", ml.Key, ml.Metadata["original-file-name"]))
			}
			if e.Title, ok = decode(ml.Metadata["title"]); !ok {
				warnings = append(warnings, fmt.Sprintf("%s: undecodable title %q", ml.Key, ml.Metadata["title"]))
			}
			// Report unexpected metadata shape without dropping the photo.
			for _, want := range []string{"uuid", "email-address", "original-file-name"} {
				if ml.Metadata[want] == "" {
					warnings = append(warnings, fmt.Sprintf("%s: photo missing %s metadata", ml.Key, want))
				}
			}
			// Validate the week-<n> segment; a malformed key would land the file
			// where list-for-week can't find it, so surface it rather than hide it.
			if _, werr := parseWeek(ml.Key); werr != nil {
				warnings = append(warnings, fmt.Sprintf("%s: %v", ml.Key, werr))
			}
		} else if len(ml.Metadata) > 0 {
			// external-articles are expected to carry empty metadata; flag any that don't.
			warnings = append(warnings, fmt.Sprintf("%s: non-photo carries %d metadata keys", ml.Key, len(ml.Metadata)))
		}

		entries = append(entries, e)
	}
	if err := sc.Err(); err != nil {
		return nil, warnings, fmt.Errorf("scan manifest: %w", err)
	}
	return entries, warnings, nil
}

// targetPath returns the on-disk destination for an entry, or ("", false) for an
// unknown kind. Photos preserve the full key under photosDir (so the on-disk
// path repeats `photos`, matching the server's layout). External articles drop
// the leading `external-articles/` segment (the target dir already names them),
// giving Caddy a clean static root to serve.
func targetPath(opts Options, e Entry) (string, bool) {
	switch e.Kind {
	case KindPhoto:
		return filepath.Join(opts.photosDir(), filepath.FromSlash(e.Key)), true
	case KindExternalArticle:
		rel := strings.TrimPrefix(e.Key, "external-articles/")
		return filepath.Join(opts.externalArticlesDir(), filepath.FromSlash(rel)), true
	default:
		return "", false
	}
}

// sourcePath returns the salvage file path backing an entry.
func sourcePath(opts Options, e Entry) string {
	return filepath.Join(opts.s3Dir(), filepath.FromSlash(e.Key))
}

// photoRecord builds the SQLite row for a photo entry. Path is the storage key
// (also the listing "key"); metadata is already decoded.
func photoRecord(e Entry) photos.Record {
	return photos.Record{
		UUID:             e.UUID,
		Path:             e.Key,
		EmailAddress:     e.EmailAddress,
		OriginalFileName: e.OriginalFileName,
		Title:            e.Title,
		ContentType:      e.ContentType,
		SizeInBytes:      e.Size,
		LastModified:     e.LastModified,
	}
}

// linkOutcome is the result of trying to hardlink one file.
type linkOutcome int

const (
	linkCreated  linkOutcome = iota // a new hardlink was made
	linkSkipped                     // target already links to source (idempotent)
	linkConflict                    // target exists but is a different file
	linkMissing                     // the source file is absent
)

// hardlink links source → target, creating parent dirs. It never copies: a
// cross-device link surfaces as an error so the "hardlinks cost ~zero bytes"
// invariant can't silently degrade into a 2.4 GB copy that overflows the volume.
// It is idempotent: if target already points at source (same inode), it reports
// linkSkipped; if target exists as a different file, linkConflict (untouched).
func hardlink(source, target string) (linkOutcome, error) {
	srcInfo, err := os.Stat(source)
	if err != nil {
		if os.IsNotExist(err) {
			return linkMissing, nil
		}
		return linkMissing, fmt.Errorf("stat source %q: %w", source, err)
	}

	if dstInfo, err := os.Lstat(target); err == nil {
		if os.SameFile(srcInfo, dstInfo) {
			return linkSkipped, nil
		}
		return linkConflict, nil
	} else if !os.IsNotExist(err) {
		return linkConflict, fmt.Errorf("stat target %q: %w", target, err)
	}

	if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
		return linkCreated, fmt.Errorf("mkdir for %q: %w", target, err)
	}
	if err := os.Link(source, target); err != nil {
		return linkCreated, fmt.Errorf("hardlink %q → %q: %w", source, target, err)
	}
	return linkCreated, nil
}

// Run executes (or, with Options.DryRun, plans) the migration: hardlink every
// photo and external-article file into the live layout and upsert one photos row
// per photo. It is safe to re-run.
func Run(ctx context.Context, opts Options) (Result, error) {
	f, err := os.Open(opts.manifestPath())
	if err != nil {
		return Result{}, fmt.Errorf("open manifest: %w", err)
	}
	defer f.Close()

	entries, warnings, err := ParseManifest(f)
	if err != nil {
		return Result{}, err
	}
	res := Result{Warnings: warnings}

	// Open the store only for a real run; a dry run writes nothing at all,
	// including not creating the database file or schema.
	var st *store.Store
	if !opts.DryRun {
		if err := os.MkdirAll(opts.photosDir(), 0o755); err != nil {
			return res, fmt.Errorf("create photos dir: %w", err)
		}
		st, err = store.Open(opts.dbPath(), nil)
		if err != nil {
			return res, fmt.Errorf("open store: %w", err)
		}
		defer st.Close()
	}

	for _, e := range entries {
		if e.Kind == KindUnknown {
			res.Unknown++
			res.Warnings = append(res.Warnings, fmt.Sprintf("%s: unknown key shape, skipped", e.Key))
			continue
		}
		target, _ := targetPath(opts, e)
		source := sourcePath(opts, e)

		outcome := linkSkipped
		if opts.DryRun {
			// Determine what a real run would do without touching disk.
			if _, serr := os.Stat(source); os.IsNotExist(serr) {
				outcome = linkMissing
			} else if _, terr := os.Lstat(target); terr == nil {
				outcome = linkSkipped
			} else {
				outcome = linkCreated
			}
		} else {
			outcome, err = hardlink(source, target)
			if err != nil {
				return res, err
			}
		}

		switch outcome {
		case linkMissing:
			res.MissingSource++
			res.Warnings = append(res.Warnings, fmt.Sprintf("%s: salvage file missing at %s", e.Key, source))
			// Without bytes on disk there is nothing to serve; skip the row too.
			continue
		case linkConflict:
			res.LinkConflicts++
			res.Warnings = append(res.Warnings, fmt.Sprintf("%s: target exists as a different file, left untouched: %s", e.Key, target))
		}

		switch e.Kind {
		case KindPhoto:
			if outcome == linkCreated {
				res.PhotosLinked++
			} else if outcome == linkSkipped {
				res.PhotosSkipped++
			}
			if !opts.DryRun {
				if err := st.InsertPhoto(ctx, photoRecord(e)); err != nil {
					return res, fmt.Errorf("insert photo row for %q: %w", e.Key, err)
				}
			}
			res.PhotoRows++
		case KindExternalArticle:
			if outcome == linkCreated {
				res.ExternalLinked++
			} else if outcome == linkSkipped {
				res.ExternalSkipped++
			}
		}
	}

	sort.Strings(res.Warnings)
	return res, nil
}

// VerifyResult reports post-run integrity checks.
type VerifyResult struct {
	PhotoFilesOnDisk    int
	ExternalFilesOnDisk int
	PhotoRowsInDB       int
	SamplesChecked      int
	SampleMismatches    []string // "key: got <md5> want <etag>"
	Problems            []string // higher-level count mismatches
}

// OK reports whether verification found no problems.
func (v VerifyResult) OK() bool {
	return len(v.SampleMismatches) == 0 && len(v.Problems) == 0
}

// Verify re-reads the manifest and checks the migration landed: it recounts
// files on disk against the manifest, counts photo rows in the database, and
// spot-checks up to samples random photo files' MD5 against their manifest ETag
// (ETag == content MD5 for every salvaged file, no multipart uploads). rng, when
// non-nil, makes sampling deterministic for tests.
func Verify(ctx context.Context, opts Options, samples int, rng *rand.Rand) (VerifyResult, error) {
	f, err := os.Open(opts.manifestPath())
	if err != nil {
		return VerifyResult{}, fmt.Errorf("open manifest: %w", err)
	}
	defer f.Close()
	entries, _, err := ParseManifest(f)
	if err != nil {
		return VerifyResult{}, err
	}

	var res VerifyResult
	var photoEntries, externalEntries []Entry
	for _, e := range entries {
		switch e.Kind {
		case KindPhoto:
			photoEntries = append(photoEntries, e)
		case KindExternalArticle:
			externalEntries = append(externalEntries, e)
		}
	}

	// Count files actually present on disk.
	for _, e := range photoEntries {
		target, _ := targetPath(opts, e)
		if _, err := os.Stat(target); err == nil {
			res.PhotoFilesOnDisk++
		}
	}
	for _, e := range externalEntries {
		target, _ := targetPath(opts, e)
		if _, err := os.Stat(target); err == nil {
			res.ExternalFilesOnDisk++
		}
	}
	if res.PhotoFilesOnDisk != len(photoEntries) {
		res.Problems = append(res.Problems, fmt.Sprintf("photo files on disk %d != manifest %d", res.PhotoFilesOnDisk, len(photoEntries)))
	}
	if res.ExternalFilesOnDisk != len(externalEntries) {
		res.Problems = append(res.Problems, fmt.Sprintf("external-article files on disk %d != manifest %d", res.ExternalFilesOnDisk, len(externalEntries)))
	}

	// Count photo rows in the database.
	res.PhotoRowsInDB, err = countPhotoRows(opts.dbPath())
	if err != nil {
		return res, err
	}
	if res.PhotoRowsInDB != len(photoEntries) {
		res.Problems = append(res.Problems, fmt.Sprintf("photo rows in db %d != manifest %d", res.PhotoRowsInDB, len(photoEntries)))
	}

	// Spot-check random photo files' content MD5 against the manifest ETag.
	idx := make([]int, len(photoEntries))
	for i := range idx {
		idx[i] = i
	}
	shuffle(idx, rng)
	if samples > len(idx) {
		samples = len(idx)
	}
	for _, i := range idx[:samples] {
		e := photoEntries[i]
		target, _ := targetPath(opts, e)
		sum, err := fileMD5(target)
		if err != nil {
			res.SampleMismatches = append(res.SampleMismatches, fmt.Sprintf("%s: %v", e.Key, err))
			continue
		}
		res.SamplesChecked++
		if !strings.EqualFold(sum, e.ETag) {
			res.SampleMismatches = append(res.SampleMismatches, fmt.Sprintf("%s: got %s want %s", e.Key, sum, e.ETag))
		}
	}

	sort.Strings(res.Problems)
	sort.Strings(res.SampleMismatches)
	return res, nil
}

// countPhotoRows opens the database and counts photo rows. A raw query is used
// (not a store method) because counting is verify-only tooling; the write path
// reuses the store package. The connection isn't forced read-only: a WAL
// database opened read-only can fail recovery if a -wal file lingers.
func countPhotoRows(dbPath string) (int, error) {
	db, err := sql.Open("sqlite", dbPath+"?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)")
	if err != nil {
		return 0, fmt.Errorf("open db for count: %w", err)
	}
	defer db.Close()
	var n int
	if err := db.QueryRow("SELECT COUNT(*) FROM photos").Scan(&n); err != nil {
		return 0, fmt.Errorf("count photos: %w", err)
	}
	return n, nil
}

// fileMD5 returns the lowercase hex MD5 of a file's contents.
func fileMD5(path string) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer f.Close()
	h := md5.New()
	if _, err := io.Copy(h, f); err != nil {
		return "", err
	}
	return hex.EncodeToString(h.Sum(nil)), nil
}

// shuffle randomizes idx in place. A nil rng uses a fresh time-seeded source.
func shuffle(idx []int, rng *rand.Rand) {
	if rng == nil {
		rng = rand.New(rand.NewSource(time.Now().UnixNano()))
	}
	rng.Shuffle(len(idx), func(i, j int) { idx[i], idx[j] = idx[j], idx[i] })
}

// parseWeek extracts the week index from a photo key's `week-<n>` segment,
// validating that a photo key has the shape list-for-week later selects by.
func parseWeek(key string) (int, error) {
	seg := strings.Split(key, "/")
	if len(seg) < 4 {
		return 0, fmt.Errorf("key %q has no week segment", key)
	}
	w := seg[3]
	if !strings.HasPrefix(w, "week-") {
		return 0, fmt.Errorf("key %q segment %q is not week-<n>", key, w)
	}
	n, err := strconv.Atoi(strings.TrimPrefix(w, "week-"))
	if err != nil {
		return 0, fmt.Errorf("key %q: bad week number: %w", key, err)
	}
	return n, nil
}
