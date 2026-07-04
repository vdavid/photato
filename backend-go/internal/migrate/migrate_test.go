package migrate

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"strings"
	"syscall"
	"testing"
	"time"
)

// realManifestLines are verbatim lines from the actual Phase-0 salvage manifest
// (metadata.json on the Hetzner volume). They exercise the decode and
// classification paths on real data: percent-encoded Hungarian metadata, an
// empty title, an encoded filename with spaces, and an external-articles line
// whose metadata is empty by design.
const realManifestLines = `{"key": "production/photos/hu-3/week-6/veszelovszki@gmail.com.jpg", "size": 70306, "etag": "cd6b30cfc5556750677b3095ef613c73", "last_modified": "Sun, 26 Apr 2020 17:44:14 GMT", "content_type": "image/jpeg", "metadata": {"uuid": "bc8131f5-dbf4-427b-9ca0-48404efc6e28", "original-file-name": "Fotolia_16631424_XS.jpg", "email-address": "veszelovszki%40gmail.com", "title": "Ly%C3%A1ny"}}
{"key": "development/photos/hu-3/week-12/veszelovszki@gmail.com.jpg", "size": 116374, "etag": "5ad7a5e11a7aacf502ee195f108761bf", "last_modified": "Fri, 05 Jun 2020 19:01:18 GMT", "content_type": "image/jpeg", "metadata": {"uuid": "fd60e846-8ac2-4e29-b144-e0a7465ec68f", "original-file-name": "header-cover.jpg", "email-address": "veszelovszki%40gmail.com", "title": ""}}
{"key": "development/photos/hu-3/week-5/veszelovszki@gmail.com.jpg", "size": 3791132, "etag": "6435287f83a0709ae5dd35a39ec9c7fd", "last_modified": "Sun, 19 Apr 2020 13:52:54 GMT", "content_type": "image/jpeg", "metadata": {"uuid": "6adbaee2-2dbb-4c75-b5a7-e0193fb4577f", "original-file-name": "20181029_212639%20-%20weboldal%20frontend%20terv%20by%20Gyuri.jpg", "email-address": "veszelovszki%40gmail.com", "title": "gfdfgdfg"}}
{"key": "staging/photos/hu-3/week-6/jurikov@gmail.com.jpg", "size": 1287169, "etag": "6469dc8723b30d3d26cb2a00ce3e2f8f", "last_modified": "Fri, 24 Apr 2020 06:25:08 GMT", "content_type": "image/jpeg", "metadata": {"uuid": "034fb3c2-886e-467e-8763-8d1fe375c854", "original-file-name": "05c62d84067271.5d515808b853c.jpg", "email-address": "jurikov%40gmail.com", "title": "343r34r3r"}}
{"key": "external-articles/hu/bykyny-kozelfenykepezes-makrofotozas/350d_10-18_10_160.jpg", "size": 176285, "etag": "06f9597921dd87ea5bd6cfbf8d1e6a44", "last_modified": "Sat, 25 Apr 2020 19:05:54 GMT", "content_type": "image/jpeg", "metadata": {}}`

func TestParseManifest_DecodesRealLines(t *testing.T) {
	entries, warnings, err := ParseManifest(strings.NewReader(realManifestLines))
	if err != nil {
		t.Fatalf("ParseManifest: %v", err)
	}
	if len(entries) != 5 {
		t.Fatalf("got %d entries, want 5", len(entries))
	}

	// Percent-encoded Hungarian title decodes to real UTF-8.
	if got := entries[0].Title; got != "Lyány" {
		t.Errorf("title: got %q, want %q", got, "Lyány")
	}
	if got := entries[0].EmailAddress; got != "veszelovszki@gmail.com" {
		t.Errorf("email: got %q, want %q", got, "veszelovszki@gmail.com")
	}
	if entries[0].Kind != KindPhoto {
		t.Errorf("entry 0 kind: got %v, want KindPhoto", entries[0].Kind)
	}
	// last_modified parses to the right UTC instant.
	wantTime := time.Date(2020, 4, 26, 17, 44, 14, 0, time.UTC)
	if !entries[0].LastModified.Equal(wantTime) {
		t.Errorf("lastModified: got %v, want %v", entries[0].LastModified, wantTime)
	}

	// Empty title stays empty (not an error).
	if got := entries[1].Title; got != "" {
		t.Errorf("empty title: got %q, want empty", got)
	}

	// Encoded spaces in a filename decode.
	wantName := "20181029_212639 - weboldal frontend terv by Gyuri.jpg"
	if got := entries[2].OriginalFileName; got != wantName {
		t.Errorf("filename: got %q, want %q", got, wantName)
	}

	// External-articles line: classified as static, empty metadata, no photo warnings.
	if entries[4].Kind != KindExternalArticle {
		t.Errorf("entry 4 kind: got %v, want KindExternalArticle", entries[4].Kind)
	}
	for _, w := range warnings {
		if strings.Contains(w, "external-articles") {
			t.Errorf("unexpected warning for external-articles line: %s", w)
		}
	}
}

// fixtureEntry describes one synthetic salvage file plus its manifest metadata.
type fixtureEntry struct {
	key          string
	contentType  string
	lastModified string
	metadata     map[string]string
	content      []byte
}

// writeFixture builds a synthetic salvage tree (s3/ + metadata.json) under root.
// Each manifest line's etag/size are computed from the file content, so the
// verify MD5 check is meaningful. Returns the salvage root.
func writeFixture(t *testing.T, root string, entries []fixtureEntry) {
	t.Helper()
	var manifest strings.Builder
	for _, e := range entries {
		full := filepath.Join(root, "s3", filepath.FromSlash(e.key))
		if err := os.MkdirAll(filepath.Dir(full), 0o755); err != nil {
			t.Fatalf("mkdir: %v", err)
		}
		if err := os.WriteFile(full, e.content, 0o644); err != nil {
			t.Fatalf("write fixture file: %v", err)
		}
		sum := md5.Sum(e.content)
		etag := hex.EncodeToString(sum[:])
		metaJSON := "{}"
		if len(e.metadata) > 0 {
			var parts []string
			// Deterministic order for reproducibility.
			for _, k := range []string{"uuid", "original-file-name", "email-address", "title"} {
				if v, ok := e.metadata[k]; ok {
					parts = append(parts, fmt.Sprintf("%q: %q", k, v))
				}
			}
			metaJSON = "{" + strings.Join(parts, ", ") + "}"
		}
		fmt.Fprintf(&manifest, `{"key": %q, "size": %d, "etag": %q, "last_modified": %q, "content_type": %q, "metadata": %s}`+"\n",
			e.key, len(e.content), etag, e.lastModified, e.contentType, metaJSON)
	}
	if err := os.WriteFile(filepath.Join(root, "metadata.json"), []byte(manifest.String()), 0o644); err != nil {
		t.Fatalf("write manifest: %v", err)
	}
}

// standardFixture returns three photos (production/development/staging) and one
// external article, with real percent-encoded metadata values.
func standardFixture() []fixtureEntry {
	return []fixtureEntry{
		{
			key:          "production/photos/hu-3/week-6/veszelovszki@gmail.com.jpg",
			contentType:  "image/jpeg",
			lastModified: "Sun, 26 Apr 2020 17:44:14 GMT",
			metadata: map[string]string{
				"uuid":               "bc8131f5-dbf4-427b-9ca0-48404efc6e28",
				"original-file-name": "Fotolia_16631424_XS.jpg",
				"email-address":      "veszelovszki%40gmail.com",
				"title":              "Ly%C3%A1ny",
			},
			content: []byte("production-photo-bytes-lyany"),
		},
		{
			key:          "development/photos/hu-3/week-12/veszelovszki@gmail.com.jpg",
			contentType:  "image/jpeg",
			lastModified: "Fri, 05 Jun 2020 19:01:18 GMT",
			metadata: map[string]string{
				"uuid":               "fd60e846-8ac2-4e29-b144-e0a7465ec68f",
				"original-file-name": "header-cover.jpg",
				"email-address":      "veszelovszki%40gmail.com",
				"title":              "", // empty title case
			},
			content: []byte("development-photo-bytes-empty-title"),
		},
		{
			key:          "staging/photos/hu-3/week-6/jurikov@gmail.com.jpg",
			contentType:  "image/jpeg",
			lastModified: "Fri, 24 Apr 2020 06:25:08 GMT",
			metadata: map[string]string{
				"uuid":               "034fb3c2-886e-467e-8763-8d1fe375c854",
				"original-file-name": "05c62d84067271.5d515808b853c.jpg",
				"email-address":      "jurikov%40gmail.com",
				"title":              "343r34r3r",
			},
			content: []byte("staging-photo-bytes"),
		},
		{
			key:          "external-articles/hu/bykyny-kozelfenykepezes-makrofotozas/350d_10-18_10_160.jpg",
			contentType:  "image/jpeg",
			lastModified: "Sat, 25 Apr 2020 19:05:54 GMT",
			metadata:     nil, // empty metadata by design
			content:      []byte("external-article-bytes"),
		},
	}
}

func newOptions(t *testing.T) (source, data string, opts Options) {
	t.Helper()
	source = t.TempDir()
	data = t.TempDir()
	writeFixture(t, source, standardFixture())
	return source, data, Options{SourceDir: source, DataDir: data}
}

func TestRun_HardlinksNotCopies(t *testing.T) {
	source, data, opts := newOptions(t)

	res, err := Run(context.Background(), opts)
	if err != nil {
		t.Fatalf("Run: %v", err)
	}
	if res.PhotosLinked != 3 || res.ExternalLinked != 1 {
		t.Fatalf("linked counts: photos=%d external=%d, want 3 and 1", res.PhotosLinked, res.ExternalLinked)
	}
	if res.PhotoRows != 3 {
		t.Fatalf("photo rows: got %d, want 3", res.PhotoRows)
	}

	// A photo target must be the SAME inode as its salvage source (a hardlink),
	// and the source's link count must be 2 — proof it was linked, not copied.
	key := "production/photos/hu-3/week-6/veszelovszki@gmail.com.jpg"
	src := filepath.Join(source, "s3", filepath.FromSlash(key))
	dst := filepath.Join(data, "photos", filepath.FromSlash(key))

	srcInfo, err := os.Stat(src)
	if err != nil {
		t.Fatalf("stat src: %v", err)
	}
	dstInfo, err := os.Stat(dst)
	if err != nil {
		t.Fatalf("stat dst: %v", err)
	}
	if !os.SameFile(srcInfo, dstInfo) {
		t.Error("target is not the same inode as source — it was copied, not hardlinked")
	}
	if n := nlink(t, dst); n != 2 {
		t.Errorf("link count: got %d, want 2", n)
	}

	// External articles land under external-articles/, with the leading segment dropped.
	ext := filepath.Join(data, "external-articles", "hu", "bykyny-kozelfenykepezes-makrofotozas", "350d_10-18_10_160.jpg")
	if _, err := os.Stat(ext); err != nil {
		t.Errorf("external article not linked at expected path: %v", err)
	}
	// External articles must NOT leak into the admin-gated photos tree.
	leak := filepath.Join(data, "photos", "external-articles")
	if _, err := os.Stat(leak); !os.IsNotExist(err) {
		t.Errorf("external article leaked into photos tree at %s", leak)
	}
}

func TestRun_Idempotent(t *testing.T) {
	source, data, opts := newOptions(t)
	_, _ = source, data

	first, err := Run(context.Background(), opts)
	if err != nil {
		t.Fatalf("first Run: %v", err)
	}
	if first.PhotosLinked != 3 {
		t.Fatalf("first run linked %d photos, want 3", first.PhotosLinked)
	}

	second, err := Run(context.Background(), opts)
	if err != nil {
		t.Fatalf("second Run: %v", err)
	}
	if second.PhotosLinked != 0 || second.ExternalLinked != 0 {
		t.Errorf("second run linked new files (photos=%d external=%d), want 0", second.PhotosLinked, second.ExternalLinked)
	}
	if second.PhotosSkipped != 3 || second.ExternalSkipped != 1 {
		t.Errorf("second run skips: photos=%d external=%d, want 3 and 1", second.PhotosSkipped, second.ExternalSkipped)
	}

	// No duplicate rows: the path is unique, so a re-run upserts.
	n, err := countPhotoRows(opts.dbPath())
	if err != nil {
		t.Fatalf("count rows: %v", err)
	}
	if n != 3 {
		t.Errorf("photo rows after two runs: got %d, want 3 (no duplication)", n)
	}
}

func TestRun_DryRunWritesNothing(t *testing.T) {
	source, data, opts := newOptions(t)
	_ = source
	opts.DryRun = true

	res, err := Run(context.Background(), opts)
	if err != nil {
		t.Fatalf("Run dry: %v", err)
	}
	// The plan still counts what it WOULD link.
	if res.PhotosLinked != 3 || res.ExternalLinked != 1 {
		t.Errorf("dry-run plan counts: photos=%d external=%d, want 3 and 1", res.PhotosLinked, res.ExternalLinked)
	}

	// Nothing was written under DATA_DIR: no photos dir, no external dir, no db.
	for _, p := range []string{
		filepath.Join(data, "photos"),
		filepath.Join(data, "external-articles"),
		filepath.Join(data, "photato.db"),
	} {
		if _, err := os.Stat(p); !os.IsNotExist(err) {
			t.Errorf("dry-run created %s (err=%v), want nothing written", p, err)
		}
	}
}

func TestVerify_OK(t *testing.T) {
	source, _, opts := newOptions(t)
	_ = source

	if _, err := Run(context.Background(), opts); err != nil {
		t.Fatalf("Run: %v", err)
	}

	rng := rand.New(rand.NewSource(1))
	v, err := Verify(context.Background(), opts, 10, rng)
	if err != nil {
		t.Fatalf("Verify: %v", err)
	}
	if !v.OK() {
		t.Fatalf("verify not OK: problems=%v mismatches=%v", v.Problems, v.SampleMismatches)
	}
	if v.PhotoFilesOnDisk != 3 || v.ExternalFilesOnDisk != 1 || v.PhotoRowsInDB != 3 {
		t.Errorf("verify counts: photos=%d external=%d rows=%d, want 3/1/3", v.PhotoFilesOnDisk, v.ExternalFilesOnDisk, v.PhotoRowsInDB)
	}
	if v.SamplesChecked != 3 {
		t.Errorf("samples checked: got %d, want 3 (all photos)", v.SamplesChecked)
	}
}

func TestVerify_CatchesCorruptedFile(t *testing.T) {
	source, data, opts := newOptions(t)
	_ = source

	if _, err := Run(context.Background(), opts); err != nil {
		t.Fatalf("Run: %v", err)
	}

	// Corrupt one target WITHOUT touching the salvage source: break the hardlink
	// (remove, then write different bytes). Overwriting in place would mutate the
	// shared inode and corrupt the pristine salvage too.
	key := "staging/photos/hu-3/week-6/jurikov@gmail.com.jpg"
	target := filepath.Join(data, "photos", filepath.FromSlash(key))
	if err := os.Remove(target); err != nil {
		t.Fatalf("remove target: %v", err)
	}
	if err := os.WriteFile(target, []byte("corrupted-different-bytes"), 0o644); err != nil {
		t.Fatalf("write corrupt: %v", err)
	}

	// Check every photo so the corrupted one is always sampled.
	v, err := Verify(context.Background(), opts, 100, rand.New(rand.NewSource(1)))
	if err != nil {
		t.Fatalf("Verify: %v", err)
	}
	if v.OK() {
		t.Fatal("verify reported OK despite a corrupted file")
	}
	found := false
	for _, m := range v.SampleMismatches {
		if strings.Contains(m, key) {
			found = true
		}
	}
	if !found {
		t.Errorf("mismatch for corrupted file not reported; got %v", v.SampleMismatches)
	}
}

func TestRun_UnknownAndMissing(t *testing.T) {
	source := t.TempDir()
	data := t.TempDir()

	// A photo whose salvage file we deliberately don't create (missing source),
	// plus an entry with an unknown key shape.
	entries := standardFixture()
	writeFixture(t, source, entries)

	// Append manifest lines by hand: one unknown-shape key and one missing-source photo.
	manifestPath := filepath.Join(source, "metadata.json")
	extra := `{"key": "weird-top-level-object.txt", "size": 3, "etag": "00", "last_modified": "Sat, 25 Apr 2020 19:05:54 GMT", "content_type": "text/plain", "metadata": {}}` + "\n" +
		`{"key": "production/photos/hu-9/week-1/ghost@example.com.jpg", "size": 5, "etag": "11", "last_modified": "Sat, 25 Apr 2020 19:05:54 GMT", "content_type": "image/jpeg", "metadata": {"uuid": "x", "original-file-name": "g.jpg", "email-address": "ghost%40example.com", "title": "g"}}` + "\n"
	appendFile(t, manifestPath, extra)

	res, err := Run(context.Background(), Options{SourceDir: source, DataDir: data})
	if err != nil {
		t.Fatalf("Run: %v", err)
	}
	if res.Unknown != 1 {
		t.Errorf("unknown: got %d, want 1", res.Unknown)
	}
	if res.MissingSource != 1 {
		t.Errorf("missing source: got %d, want 1", res.MissingSource)
	}
	// The ghost photo has no bytes, so no row was written for it.
	if res.PhotoRows != 3 {
		t.Errorf("photo rows: got %d, want 3 (ghost skipped)", res.PhotoRows)
	}
}

func TestTargetPath(t *testing.T) {
	opts := Options{DataDir: "/data"}
	photo := Entry{Key: "production/photos/hu-4/week-2/a@b.com.jpg", Kind: KindPhoto}
	got, ok := targetPath(opts, photo)
	want := filepath.FromSlash("/data/photos/production/photos/hu-4/week-2/a@b.com.jpg")
	if !ok || got != want {
		t.Errorf("photo target: got %q (%v), want %q", got, ok, want)
	}

	ext := Entry{Key: "external-articles/hu/foo/bar.jpg", Kind: KindExternalArticle}
	got, ok = targetPath(opts, ext)
	want = filepath.FromSlash("/data/external-articles/hu/foo/bar.jpg")
	if !ok || got != want {
		t.Errorf("external target: got %q (%v), want %q", got, ok, want)
	}
}

func appendFile(t *testing.T, path, content string) {
	t.Helper()
	f, err := os.OpenFile(path, os.O_APPEND|os.O_WRONLY, 0o644)
	if err != nil {
		t.Fatalf("open for append: %v", err)
	}
	defer f.Close()
	if _, err := f.WriteString(content); err != nil {
		t.Fatalf("append: %v", err)
	}
}

// nlink returns the hardlink count of a file, proving link-not-copy.
func nlink(t *testing.T, path string) uint64 {
	t.Helper()
	info, err := os.Stat(path)
	if err != nil {
		t.Fatalf("stat for nlink: %v", err)
	}
	st, ok := info.Sys().(*syscall.Stat_t)
	if !ok {
		t.Skip("Stat_t unavailable on this platform")
	}
	return uint64(st.Nlink)
}
