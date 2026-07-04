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

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
)

// errNotImplemented is retained because a red-phase test (TestNotImplementedSentinel)
// references it; real logic no longer returns it.
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
// scheme (HashProvider.getSHA256Hash).
func Hash(path string) string {
	sum := sha256.Sum256([]byte(path))
	return hex.EncodeToString(sum[:])
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
	return r.store.PutSignature(Hash(path), StatusValid)
}

// IsValidForPath reports whether path currently has a valid, non-expired
// signature: a valid marker exists AND an expired marker does not.
func (r *Repository) IsValidForPath(path string) (bool, error) {
	hash := Hash(path)
	valid, err := r.store.HasSignature(hash, StatusValid)
	if err != nil {
		return false, err
	}
	if !valid {
		return false, nil
	}
	expired, err := r.store.HasSignature(hash, StatusExpired)
	if err != nil {
		return false, err
	}
	return !expired, nil
}

// MarkExpiredForPath records an expired marker for path, invalidating it. This
// is what makes a signed upload single-use.
func (r *Repository) MarkExpiredForPath(path string) error {
	return r.store.PutSignature(Hash(path), StatusExpired)
}
