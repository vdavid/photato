// Package store is the SQLite persistence layer, replacing the legacy MongoDB
// (users/sessions) and S3 (photos, signatures) storage.
//
// It backs the interfaces the domain packages define: signing.Store,
// auth.UserStore (session lookup), the httpapi login store (session creation,
// nonce burning, login rate limiting), plus photo persistence. Tables: users,
// sessions, used_login_nonces, login_attempts, photos, upload_signatures.
// Photo metadata is stored DECODED (UTF-8), unlike the legacy percent-encoded
// S3 custom metadata.
//
// The pure-Go modernc.org/sqlite driver is used (no cgo), registered under the
// "sqlite" driver name.
package store

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"path"
	"time"

	_ "modernc.org/sqlite"

	"github.com/vdavid/photato/backend-go/internal/auth"
	"github.com/vdavid/photato/backend-go/internal/photos"
	"github.com/vdavid/photato/backend-go/internal/signing"
)

// sessionValidity is how long a login session stays live before the user must
// request a fresh magic link (kept at the legacy three days).
const sessionValidity = 3 * 24 * time.Hour

// nonceRetention is how long a burned magic-link nonce is remembered. It only
// needs to outlive the link TTL (15 min); an hour is a safe margin, after which
// the token itself is long expired and can't be replayed anyway.
const nonceRetention = time.Hour

// attemptRetention is how long a login-request attempt is kept for rate-limiting.
// It must exceed any rate-limit window in use (currently 15 min).
const attemptRetention = time.Hour

// Compile-time proof the store satisfies the domain persistence interfaces.
// If a method signature drifts, the build breaks here rather than at wiring.
var (
	_ signing.Store  = (*Store)(nil)
	_ auth.UserStore = (*Store)(nil)
)

// Store is a SQLite-backed persistence handle.
type Store struct {
	db          *sql.DB
	adminEmails []string
}

// Open opens (creating if needed) the SQLite database at dsn, runs migrations,
// and returns a ready Store. adminEmails is the authoritative admin allowlist
// applied at session creation and lookup.
func Open(dsn string, adminEmails []string) (*Store, error) {
	// WAL + a busy timeout keep the single-file database well-behaved under
	// concurrent readers; foreign keys enforce the sessions→users link.
	db, err := sql.Open("sqlite", dsn+"?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)&_pragma=foreign_keys(ON)")
	if err != nil {
		return nil, fmt.Errorf("open sqlite: %w", err)
	}
	// SQLite serializes writes; a single connection avoids "database is locked"
	// under the -race test runner and concurrent uploads.
	db.SetMaxOpenConns(1)

	s := &Store{db: db, adminEmails: adminEmails}
	if err := s.migrate(context.Background()); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("migrate: %w", err)
	}
	return s, nil
}

// Close closes the underlying database.
func (s *Store) Close() error {
	if s == nil || s.db == nil {
		return nil
	}
	return s.db.Close()
}

// migrate brings the schema to the current version. It is idempotent.
//
// Schema v2 replaced the Auth0-era auth tables with self-hosted magic-link auth:
// sessions now hold our own opaque tokens (not cached Auth0 access tokens) and
// users no longer carry an Auth0 profile blob. Because the v1 users/sessions
// tables only ever held Auth0-derived cache data (no durable user records —
// the legacy Mongo user store was deleted, so production started empty), the v1→v2
// step drops and recreates them. Photos and upload_signatures are untouched.
func (s *Store) migrate(ctx context.Context) error {
	const schemaVersion = 2

	var current int
	if err := s.db.QueryRowContext(ctx, "PRAGMA user_version").Scan(&current); err != nil {
		return err
	}

	// v1→v2: drop the obsolete Auth0-era auth tables so they get the new shape.
	if current < 2 {
		if _, err := s.db.ExecContext(ctx, `DROP TABLE IF EXISTS sessions; DROP TABLE IF EXISTS users;`); err != nil {
			return err
		}
	}

	const ddl = `
CREATE TABLE IF NOT EXISTS users (
	id          INTEGER PRIMARY KEY AUTOINCREMENT,
	email       TEXT NOT NULL UNIQUE,
	is_admin    INTEGER NOT NULL DEFAULT 0,
	created_at  INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
	id          INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	token       TEXT NOT NULL UNIQUE,
	expires_at  INTEGER NOT NULL,
	created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE TABLE IF NOT EXISTS used_login_nonces (
	nonce    TEXT PRIMARY KEY,
	used_at  INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS login_attempts (
	id          INTEGER PRIMARY KEY AUTOINCREMENT,
	bucket      TEXT NOT NULL,
	created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_login_attempts_bucket ON login_attempts(bucket, created_at);
CREATE TABLE IF NOT EXISTS photos (
	id                 INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid               TEXT NOT NULL,
	path               TEXT NOT NULL UNIQUE,
	email_address      TEXT NOT NULL,
	original_file_name TEXT NOT NULL,
	title              TEXT NOT NULL DEFAULT '',
	content_type       TEXT NOT NULL,
	size_in_bytes      INTEGER NOT NULL,
	last_modified      INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_photos_path ON photos(path);
CREATE TABLE IF NOT EXISTS upload_signatures (
	hash        TEXT NOT NULL,
	status      TEXT NOT NULL,
	created_at  INTEGER NOT NULL,
	PRIMARY KEY (hash, status)
);
`
	if _, err := s.db.ExecContext(ctx, ddl); err != nil {
		return err
	}
	if _, err := s.db.ExecContext(ctx, fmt.Sprintf("PRAGMA user_version = %d", schemaVersion)); err != nil {
		return err
	}
	return nil
}

// --- signing.Store ---

// PutSignature records a signature marker of the given status for hash. It is
// idempotent: a repeated marker is a no-op.
func (s *Store) PutSignature(hash string, status signing.Status) error {
	_, err := s.db.Exec(
		`INSERT OR IGNORE INTO upload_signatures (hash, status, created_at) VALUES (?, ?, ?)`,
		hash, string(status), time.Now().Unix(),
	)
	return err
}

// HasSignature reports whether a marker of the given status exists for hash.
func (s *Store) HasSignature(hash string, status signing.Status) (bool, error) {
	var one int
	err := s.db.QueryRow(
		`SELECT 1 FROM upload_signatures WHERE hash = ? AND status = ? LIMIT 1`,
		hash, string(status),
	).Scan(&one)
	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

// --- auth.UserStore (session lookup) ---

// UserBySessionToken returns the user with a live (non-expired) session for
// token, or nil if none. IsAdmin is recomputed from the configured allowlist so
// it stays authoritative even if the stored flag drifts.
func (s *Store) UserBySessionToken(ctx context.Context, token string) (*auth.User, error) {
	if token == "" {
		return nil, nil
	}
	var email string
	err := s.db.QueryRowContext(ctx, `
		SELECT u.email
		FROM sessions s JOIN users u ON u.id = s.user_id
		WHERE s.token = ? AND s.expires_at > ?`,
		token, time.Now().Unix(),
	).Scan(&email)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &auth.User{EmailAddress: email, IsAdmin: auth.IsAdmin(email, s.adminEmails)}, nil
}

// --- login store (session creation, nonce burning, rate limiting, logout) ---

// CreateSessionForEmail upserts the user for email and opens a fresh session,
// returning the new opaque session token (256-bit random) and the user. Expired
// sessions are pruned in the same call. Admin status comes from the configured
// allowlist (authoritative), so it's refreshed on every login.
func (s *Store) CreateSessionForEmail(ctx context.Context, email string) (string, *auth.User, error) {
	isAdmin := auth.IsAdmin(email, s.adminEmails)
	now := time.Now()

	if _, err := s.db.ExecContext(ctx, `
		INSERT INTO users (email, is_admin, created_at) VALUES (?, ?, ?)
		ON CONFLICT(email) DO UPDATE SET is_admin = excluded.is_admin`,
		email, boolToInt(isAdmin), now.Unix()); err != nil {
		return "", nil, fmt.Errorf("upsert user: %w", err)
	}
	var userID int64
	if err := s.db.QueryRowContext(ctx, `SELECT id FROM users WHERE email = ?`, email).Scan(&userID); err != nil {
		return "", nil, fmt.Errorf("resolve user id: %w", err)
	}

	if _, err := s.db.ExecContext(ctx, `DELETE FROM sessions WHERE expires_at <= ?`, now.Unix()); err != nil {
		return "", nil, err
	}

	token, err := randomToken()
	if err != nil {
		return "", nil, err
	}
	if _, err := s.db.ExecContext(ctx,
		`INSERT INTO sessions (user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?)`,
		userID, token, now.Add(sessionValidity).Unix(), now.Unix()); err != nil {
		return "", nil, err
	}
	return token, &auth.User{EmailAddress: email, IsAdmin: isAdmin}, nil
}

// BurnNonce marks a magic-link nonce as used. It returns true if this call was
// the first to burn it (the token is valid to consume) and false if the nonce
// was already used (a replay). The used-nonce table's primary key plus the
// store's single write connection make this race-safe: of any number of
// concurrent verifies for the same token, exactly one INSERT affects a row.
func (s *Store) BurnNonce(ctx context.Context, nonce string) (bool, error) {
	now := time.Now().Unix()
	// Opportunistically drop nonces older than the retention window.
	if _, err := s.db.ExecContext(ctx,
		`DELETE FROM used_login_nonces WHERE used_at < ?`, now-int64(nonceRetention.Seconds())); err != nil {
		return false, err
	}
	res, err := s.db.ExecContext(ctx,
		`INSERT OR IGNORE INTO used_login_nonces (nonce, used_at) VALUES (?, ?)`, nonce, now)
	if err != nil {
		return false, err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return false, err
	}
	return n == 1, nil
}

// AllowLoginRequest reports whether a login-link request for bucket is within
// its rate limit, recording the attempt when it is allowed. bucket is an opaque
// key (e.g. "email:foo@bar" or "ip:1.2.3.4"); limit is the max attempts within
// window. A rejected request is not recorded, so a client at the limit can't
// keep the window sliding by hammering it.
func (s *Store) AllowLoginRequest(ctx context.Context, bucket string, limit int, window time.Duration) (bool, error) {
	now := time.Now().Unix()
	if _, err := s.db.ExecContext(ctx,
		`DELETE FROM login_attempts WHERE created_at < ?`, now-int64(attemptRetention.Seconds())); err != nil {
		return false, err
	}
	cutoff := now - int64(window.Seconds())
	var count int
	if err := s.db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM login_attempts WHERE bucket = ? AND created_at > ?`, bucket, cutoff).Scan(&count); err != nil {
		return false, err
	}
	if count >= limit {
		return false, nil
	}
	if _, err := s.db.ExecContext(ctx,
		`INSERT INTO login_attempts (bucket, created_at) VALUES (?, ?)`, bucket, now); err != nil {
		return false, err
	}
	return true, nil
}

// DeleteSession burns a session token (logout). Deleting an unknown token is a
// no-op success.
func (s *Store) DeleteSession(ctx context.Context, token string) error {
	_, err := s.db.ExecContext(ctx, `DELETE FROM sessions WHERE token = ?`, token)
	return err
}

// --- photos ---

// InsertPhoto persists a photo record. A re-upload to the same path replaces
// the previous row (the path is unique and deterministic per user/week).
func (s *Store) InsertPhoto(ctx context.Context, p photos.Record) error {
	_, err := s.db.ExecContext(ctx, `
		INSERT INTO photos (uuid, path, email_address, original_file_name, title, content_type, size_in_bytes, last_modified)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(path) DO UPDATE SET
			uuid = excluded.uuid,
			email_address = excluded.email_address,
			original_file_name = excluded.original_file_name,
			title = excluded.title,
			content_type = excluded.content_type,
			size_in_bytes = excluded.size_in_bytes,
			last_modified = excluded.last_modified`,
		p.UUID, p.Path, p.EmailAddress, p.OriginalFileName, p.Title, p.ContentType, p.SizeInBytes, p.LastModified.Unix())
	return err
}

// ListPhotosForWeek returns the photos for a course week. When params.GetDetails
// is false, per-photo detail fields (title, contentType) are omitted, matching
// the legacy fast-listing path.
//
// Rows are selected by the storage-path prefix
// (<environment>/photos/<courseName>/week-<weekIndex>/), which is exactly the
// layout BuildUploadPath produces. The listing carries no per-user filter: an
// admin sees every photo for the week.
func (s *Store) ListPhotosForWeek(ctx context.Context, params photos.ListParams) ([]photos.PhotoInfo, error) {
	prefix := fmt.Sprintf("%s/photos/%s/week-%d/", params.Environment, params.CourseName, params.WeekIndex)
	rows, err := s.db.QueryContext(ctx, `
		SELECT path, email_address, title, content_type, size_in_bytes, last_modified
		FROM photos WHERE path LIKE ? || '%' ORDER BY path`, prefix)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []photos.PhotoInfo
	for rows.Next() {
		var (
			p       photos.PhotoInfo
			lastMod int64
			title   string
			ctype   string
		)
		if err := rows.Scan(&p.Key, &p.EmailAddress, &title, &ctype, &p.SizeInBytes, &lastMod); err != nil {
			return nil, err
		}
		p.FileName = path.Base(p.Key)
		p.LastModifiedDate = time.Unix(lastMod, 0).UTC()
		if params.GetDetails {
			p.Title = title
			p.ContentType = ctype
		}
		// URL is filled by the HTTP layer, which knows the public base URL.
		out = append(out, p)
	}
	return out, rows.Err()
}

// randomToken returns a 256-bit hex-encoded random string for use as an opaque
// session token.
func randomToken() (string, error) {
	var b [32]byte
	if _, err := rand.Read(b[:]); err != nil {
		return "", fmt.Errorf("read random token: %w", err)
	}
	return hex.EncodeToString(b[:]), nil
}

func boolToInt(b bool) int {
	if b {
		return 1
	}
	return 0
}
