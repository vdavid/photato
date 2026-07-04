// Package photos ports the legacy photo metadata rules: upload-field
// validation (PhotoMetadataBuilder), storage-path construction
// (PhotoRepository._buildPathFromMetadata), and the listing response shape
// (S3PhotoMetadata).
//
// Storage note: the legacy backend put photos in S3 under
// `<environment>/photos/<courseName>/week-<weekIndex>/<email>.jpg` and stored
// the custom metadata (title, original-file-name, email-address)
// percent-encoded. The Go backend keeps the same relative path layout on the
// Hetzner volume but stores metadata DECODED (UTF-8) in SQLite.
package photos

import (
	"errors"
	"time"
)

// Sentinel errors let callers (and tests) distinguish failure kinds via
// errors.Is without matching on message text.
var (
	// ErrInvalidMetadata means one or more upload fields failed validation.
	ErrInvalidMetadata = errors.New("photos: invalid metadata")
	// ErrBadMimeType means the upload was not image/jpeg.
	ErrBadMimeType = errors.New("photos: bad mime type")
	// ErrUploadSize means the upload size fell outside the allowed range.
	ErrUploadSize = errors.New("photos: upload size out of range")
)

// errNotImplemented backs skeleton functions during the TDD red phase.
var errNotImplemented = errors.New("photos: not implemented")

// Upload size bounds, ported from the frontend config (imageUpload). The legacy
// backend never enforced these server-side (S3 presigned PUTs can't), so the Go
// backend, which receives the PUT itself, enforces them for the first time. See
// docs/backend-go-divergences.md.
const (
	MinUploadBytes int64 = 50 * 1024
	MaxUploadBytes int64 = 25 * 1024 * 1024
)

// MimeTypeJPEG is the only accepted upload content type.
const MimeTypeJPEG = "image/jpeg"

// Metadata is a validated set of upload fields (the Go port of PhotoMetadata).
type Metadata struct {
	EmailAddress     string
	CourseName       string // e.g. "hu-4", pattern ^[a-z][a-z]-[0-9]$
	WeekIndex        int    // 0..12
	OriginalFileName string
	Title            string // optional, <= 150 chars
	MimeType         string // must be image/jpeg
}

// PhotoInfo is the per-photo listing entry returned by /photos/list-for-week.
// The JSON field names must stay byte-for-byte identical to the legacy
// S3PhotoMetadata shape because the React frontend consumes them.
type PhotoInfo struct {
	Key              string    `json:"key"`
	FileName         string    `json:"fileName"`
	URL              string    `json:"url"`
	EmailAddress     string    `json:"emailAddress"`
	Title            string    `json:"title"`
	ContentType      string    `json:"contentType"`
	SizeInBytes      int64     `json:"sizeInBytes"`
	LastModifiedDate time.Time `json:"lastModifiedDate"`
}

// ListParams selects a week's photos.
type ListParams struct {
	Environment string
	CourseName  string
	WeekIndex   int
	GetDetails  bool
}

// Record is a photo to persist, with metadata already DECODED (UTF-8). It is
// the neutral type shared between the HTTP layer (which builds it from an
// upload) and the store (which writes it).
type Record struct {
	UUID             string
	Path             string // relative storage path; also the listing "key"
	EmailAddress     string
	OriginalFileName string
	Title            string
	ContentType      string
	SizeInBytes      int64
	LastModified     time.Time
}

// ParseAndValidate builds validated Metadata from raw request fields, returning
// ErrInvalidMetadata if any field is invalid. Ports PhotoMetadataBuilder.
func ParseAndValidate(fields map[string]string) (Metadata, error) {
	// Skeleton: validation logic lands in phase 3b.
	return Metadata{}, errNotImplemented
}

// BuildUploadPath returns the relative storage path for a photo, matching the
// legacy layout: "<environment>/photos/<courseName>/week-<weekIndex>/<email>.jpg".
func BuildUploadPath(environment string, m Metadata) string {
	// Skeleton: real path construction lands in phase 3b.
	return ""
}

// ValidateUploadSize checks that sizeInBytes is within [MinUploadBytes,
// MaxUploadBytes], returning ErrUploadSize otherwise.
func ValidateUploadSize(sizeInBytes int64) error {
	// Skeleton: bounds check lands in phase 3b.
	return errNotImplemented
}
