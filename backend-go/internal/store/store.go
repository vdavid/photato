// Package store is the SQLite persistence layer, replacing the legacy MongoDB
// (users/sessions) and S3 (photos, signatures) storage.
//
// It backs the interfaces the domain packages define: signing.Store,
// auth.UserStore, plus photo persistence. Tables: users, sessions, photos,
// upload_signatures. Metadata is stored DECODED (UTF-8), unlike the legacy
// percent-encoded S3 custom metadata.
//
// The pure-Go modernc.org/sqlite driver is used (no cgo), registered under the
// "sqlite" driver name.
package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"path"
	"time"

	_ "modernc.org/sqlite"

	"github.com/vdavid/photato/backend-go/internal/auth"
	"github.com/vdavid/photato/backend-go/internal/photos"
	"github.com/vdavid/photato/backend-go/internal/signing"
)

// sessionValidity is how long a cached session stays live (the legacy backend
// kept Auth0 sessions for three days before re-validating against /userinfo).
const sessionValidity = 3 * 24 * time.Hour

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
// and returns a ready Store. adminEmails seeds the isAdmin flag on user
// creation.
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

// migrate creates the schema on a fresh database. It is idempotent (CREATE
// TABLE IF NOT EXISTS) and stamps the schema version via PRAGMA user_version.
func (s *Store) migrate(ctx context.Context) error {
	const schemaVersion = 1
	const ddl = `
CREATE TABLE IF NOT EXISTS users (
	id               INTEGER PRIMARY KEY AUTOINCREMENT,
	email            TEXT NOT NULL UNIQUE,
	is_admin         INTEGER NOT NULL DEFAULT 0,
	auth0_user_info  TEXT NOT NULL DEFAULT '{}',
	created_at       INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
	id            INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	access_token  TEXT NOT NULL UNIQUE,
	expires_at    INTEGER NOT NULL,
	created_at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(access_token);
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

// --- auth.UserStore ---

// UserByAccessToken returns the user with a live (non-expired) session for
// token, or nil if none.
func (s *Store) UserByAccessToken(ctx context.Context, token string) (*auth.User, error) {
	row := s.db.QueryRowContext(ctx, `
		SELECT u.email, u.is_admin, u.auth0_user_info
		FROM sessions s JOIN users u ON u.id = s.user_id
		WHERE s.access_token = ? AND s.expires_at > ?`,
		token, time.Now().Unix(),
	)
	return scanUser(row)
}

// UserByEmail returns the user with the given email, or nil.
func (s *Store) UserByEmail(ctx context.Context, email string) (*auth.User, error) {
	row := s.db.QueryRowContext(ctx,
		`SELECT email, is_admin, auth0_user_info FROM users WHERE email = ?`, email)
	return scanUser(row)
}

// CreateUserFromAuth0 persists a new user from an Auth0 profile, setting isAdmin
// from the configured allowlist.
func (s *Store) CreateUserFromAuth0(ctx context.Context, info auth.UserInfo) (*auth.User, error) {
	isAdmin := auth.IsAdmin(info.Email, s.adminEmails)
	infoJSON, err := json.Marshal(info)
	if err != nil {
		return nil, err
	}
	_, err = s.db.ExecContext(ctx,
		`INSERT INTO users (email, is_admin, auth0_user_info, created_at) VALUES (?, ?, ?, ?)`,
		info.Email, boolToInt(isAdmin), string(infoJSON), time.Now().Unix())
	if err != nil {
		return nil, err
	}
	return &auth.User{EmailAddress: info.Email, IsAdmin: isAdmin, Auth0UserInfo: info}, nil
}

// UpdateAuth0UserInfo refreshes the stored Auth0 profile for user.
func (s *Store) UpdateAuth0UserInfo(ctx context.Context, user *auth.User, info auth.UserInfo) error {
	infoJSON, err := json.Marshal(info)
	if err != nil {
		return err
	}
	_, err = s.db.ExecContext(ctx,
		`UPDATE users SET auth0_user_info = ? WHERE email = ?`, string(infoJSON), user.EmailAddress)
	if err == nil {
		user.Auth0UserInfo = info
	}
	return err
}

// AddSession caches token as a session for user and prunes expired sessions.
func (s *Store) AddSession(ctx context.Context, user *auth.User, token string) error {
	now := time.Now()
	if _, err := s.db.ExecContext(ctx,
		`DELETE FROM sessions WHERE expires_at <= ?`, now.Unix()); err != nil {
		return err
	}
	var userID int64
	if err := s.db.QueryRowContext(ctx,
		`SELECT id FROM users WHERE email = ?`, user.EmailAddress).Scan(&userID); err != nil {
		return fmt.Errorf("resolve user id for session: %w", err)
	}
	_, err := s.db.ExecContext(ctx,
		`INSERT OR REPLACE INTO sessions (user_id, access_token, expires_at, created_at) VALUES (?, ?, ?, ?)`,
		userID, token, now.Add(sessionValidity).Unix(), now.Unix())
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

// scanUser reads a users row into an auth.User, returning (nil, nil) when the
// row is absent.
func scanUser(row *sql.Row) (*auth.User, error) {
	var (
		email    string
		isAdmin  int
		infoJSON string
	)
	if err := row.Scan(&email, &isAdmin, &infoJSON); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	user := &auth.User{EmailAddress: email, IsAdmin: isAdmin != 0}
	_ = json.Unmarshal([]byte(infoJSON), &user.Auth0UserInfo)
	return user, nil
}

func boolToInt(b bool) int {
	if b {
		return 1
	}
	return 0
}
