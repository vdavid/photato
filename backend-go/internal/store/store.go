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
	"errors"

	_ "modernc.org/sqlite"

	"github.com/vdavid/photato/backend-go/internal/auth"
	"github.com/vdavid/photato/backend-go/internal/photos"
	"github.com/vdavid/photato/backend-go/internal/signing"
)

var errNotImplemented = errors.New("store: not implemented")

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
	// Skeleton: open + migrate lands in phase 3b.
	return nil, errNotImplemented
}

// Close closes the underlying database.
func (s *Store) Close() error {
	if s == nil || s.db == nil {
		return nil
	}
	return s.db.Close()
}

// --- signing.Store ---

// PutSignature records a signature marker of the given status for hash.
func (s *Store) PutSignature(hash string, status signing.Status) error {
	return errNotImplemented
}

// HasSignature reports whether a marker of the given status exists for hash.
func (s *Store) HasSignature(hash string, status signing.Status) (bool, error) {
	return false, errNotImplemented
}

// --- auth.UserStore ---

// UserByAccessToken returns the user with a live (non-expired) session for
// token, or nil if none.
func (s *Store) UserByAccessToken(ctx context.Context, token string) (*auth.User, error) {
	return nil, errNotImplemented
}

// UserByEmail returns the user with the given email, or nil.
func (s *Store) UserByEmail(ctx context.Context, email string) (*auth.User, error) {
	return nil, errNotImplemented
}

// CreateUserFromAuth0 persists a new user from an Auth0 profile, setting isAdmin
// from the configured allowlist.
func (s *Store) CreateUserFromAuth0(ctx context.Context, info auth.UserInfo) (*auth.User, error) {
	return nil, errNotImplemented
}

// UpdateAuth0UserInfo refreshes the stored Auth0 profile for user.
func (s *Store) UpdateAuth0UserInfo(ctx context.Context, user *auth.User, info auth.UserInfo) error {
	return errNotImplemented
}

// AddSession caches token as a session for user and prunes expired sessions.
func (s *Store) AddSession(ctx context.Context, user *auth.User, token string) error {
	return errNotImplemented
}

// --- photos ---

// InsertPhoto persists a photo record.
func (s *Store) InsertPhoto(ctx context.Context, p photos.Record) error {
	return errNotImplemented
}

// ListPhotosForWeek returns the photos for a course week. When params.GetDetails
// is false, per-photo detail fields (title, contentType) may be empty, matching
// the legacy fast-listing path.
func (s *Store) ListPhotosForWeek(ctx context.Context, params photos.ListParams) ([]photos.PhotoInfo, error) {
	return nil, errNotImplemented
}
