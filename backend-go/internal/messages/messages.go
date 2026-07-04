// Package messages ports the static course-message catalog served by
// /messages/get-all-messages (admin-only).
//
// This package defines the Message type and the repository surface. The actual
// catalog data (the ~68 entries in the legacy photato-messages.js) is ported
// separately in phase 3b; NewRepository returns an unimplemented repository
// until then.
package messages

import "errors"

var errNotImplemented = errors.New("messages: not implemented")

// Message is one entry in the course-message catalog. JSON field names mirror
// the legacy photato-messages.js objects, which the admin frontend consumes
// verbatim.
type Message struct {
	Slug          string `json:"slug"`
	Title         string `json:"title"`
	CourseDayIndex int   `json:"courseDayIndex"`
	Channel       string `json:"channel"`
	Audience      string `json:"audience"`
	Locale        string `json:"locale"`
	Subject       string `json:"subject,omitempty"`
	ContentType   string `json:"contentType"`
	Content       string `json:"content"`
}

// Repository serves the message catalog.
type Repository struct{}

// NewRepository builds the catalog repository.
func NewRepository() *Repository {
	return &Repository{}
}

// GetAll returns the full message catalog.
func (r *Repository) GetAll() ([]Message, error) {
	// Skeleton: the ported catalog data lands in phase 3b.
	return nil, errNotImplemented
}
