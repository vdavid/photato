// Package signing ports the legacy photo-upload signature scheme.
//
// A signature marks an upload path as authorized. The old backend stored two
// kinds of markers in S3 (`signatures/valid/<hash>` and
// `signatures/expired/<hash>`); the Go backend stores them as rows in the
// SQLite `upload_signatures` table instead, but the observable rule is
// identical: a path is valid when a "valid" marker exists AND an "expired"
// marker does not. Marking a path expired is how single-use uploads are
// enforced (the first successful PUT expires the signature).
//
// The hash is SHA256(path) hex-encoded, matching the legacy HashProvider so
// existing golden vectors stay stable.
package signing

import "errors"

// errNotImplemented is returned by every skeleton method during the TDD red
// phase. Phase 3b replaces these bodies with real logic.
var errNotImplemented = errors.New("signing: not implemented")

// Status is the kind of signature marker.
type Status string

const (
	StatusValid   Status = "valid"
	StatusExpired Status = "expired"
)

// Store persists signature markers. The SQLite store implements it; tests use
// a hand-rolled fake.
type Store interface {
	// PutSignature records that a marker of the given status exists for hash.
	PutSignature(hash string, status Status) error
	// HasSignature reports whether a marker of the given status exists for hash.
	HasSignature(hash string, status Status) (bool, error)
}

// Hash returns the hex-encoded SHA256 of path, matching the legacy signing
// scheme.
func Hash(path string) string {
	// Skeleton: real SHA256 hashing lands in phase 3b.
	return ""
}

// Repository implements the signature rules on top of a Store.
type Repository struct {
	store Store
}

// NewRepository builds a Repository backed by store.
func NewRepository(store Store) *Repository {
	return &Repository{store: store}
}

// CreateValidForPath records a valid signature for path.
func (r *Repository) CreateValidForPath(path string) error {
	return errNotImplemented
}

// IsValidForPath reports whether path currently has a valid, non-expired
// signature.
func (r *Repository) IsValidForPath(path string) (bool, error) {
	return false, errNotImplemented
}

// MarkExpiredForPath records an expired marker for path, invalidating it. This
// is what makes a signed upload single-use.
func (r *Repository) MarkExpiredForPath(path string) error {
	return errNotImplemented
}
