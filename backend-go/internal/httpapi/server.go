// Package httpapi is the HTTP surface of the Go backend: routing, auth gating,
// CORS, status codes, and JSON encoding. It replaces the legacy Lambda +
// API Gateway + Lambda@Edge stack with a single net/http server.
//
// Endpoints (all data endpoints are Bearer-authed via Auth0):
//   - GET  /version                     valid user required
//   - GET  /messages/get-all-messages   admin only
//   - GET  /photos/list-for-week        admin only
//   - GET  /get-signed-url              valid user; email in params must match
//   - PUT  /upload/...                  single-use signed upload target
//
// Handler bodies are skeletons returning 501 during the TDD red phase; phase 3b
// implements them against the injected collaborators.
package httpapi

import (
	"context"
	"net/http"

	"github.com/vdavid/photato/backend-go/internal/auth"
	"github.com/vdavid/photato/backend-go/internal/messages"
	"github.com/vdavid/photato/backend-go/internal/photos"
	"github.com/vdavid/photato/backend-go/internal/signing"
)

// Authenticator resolves a Bearer access token to a user.
type Authenticator interface {
	AuthenticateByAccessToken(ctx context.Context, token string) (*auth.User, error)
}

// SignatureRepo manages single-use upload signatures.
type SignatureRepo interface {
	CreateValidForPath(path string) error
	IsValidForPath(path string) (bool, error)
	MarkExpiredForPath(path string) error
}

// MessageLister serves the course-message catalog.
type MessageLister interface {
	GetAll() ([]messages.Message, error)
}

// PhotoRepo lists and persists photos.
type PhotoRepo interface {
	ListPhotosForWeek(ctx context.Context, params photos.ListParams) ([]photos.PhotoInfo, error)
	InsertPhoto(ctx context.Context, record photos.Record) error
}

// Compile-time proof the concrete domain types satisfy the server's interfaces.
var (
	_ Authenticator = (*auth.Authenticator)(nil)
	_ SignatureRepo = (*signing.Repository)(nil)
	_ MessageLister = (*messages.Repository)(nil)
)

// Deps are the collaborators the server needs.
type Deps struct {
	Authenticator Authenticator
	AdminEmails   []string
	Signatures    SignatureRepo
	Messages      MessageLister
	Photos        PhotoRepo
	Version       string // e.g. "7.1.0" or build info
	BaseURL       string // origin used to build returned upload URLs, no trailing slash
}

// Server is the HTTP API.
type Server struct {
	deps Deps
	mux  *http.ServeMux
}

// NewServer wires routes and returns a ready Server.
func NewServer(deps Deps) *Server {
	s := &Server{deps: deps, mux: http.NewServeMux()}
	s.routes()
	return s
}

// Handler returns the root http.Handler.
func (s *Server) Handler() http.Handler {
	return s.mux
}

func (s *Server) routes() {
	// Method+path patterns (net/http, Go 1.22+).
	s.mux.HandleFunc("GET /version", s.handleVersion)
	s.mux.HandleFunc("OPTIONS /version", s.handlePreflight)

	s.mux.HandleFunc("GET /messages/get-all-messages", s.handleGetAllMessages)
	s.mux.HandleFunc("OPTIONS /messages/get-all-messages", s.handlePreflight)

	s.mux.HandleFunc("GET /photos/list-for-week", s.handleListPhotosForWeek)
	s.mux.HandleFunc("OPTIONS /photos/list-for-week", s.handlePreflight)

	s.mux.HandleFunc("GET /get-signed-url", s.handleGetSignedURL)
	s.mux.HandleFunc("OPTIONS /get-signed-url", s.handlePreflight)

	s.mux.HandleFunc("PUT /upload/", s.handleUpload)
	s.mux.HandleFunc("OPTIONS /upload/", s.handlePreflight)
}

// handleVersion returns the backend version. Requires a valid user (401
// otherwise), matching the legacy behavior where /version sat behind auth.
func (s *Server) handleVersion(w http.ResponseWriter, r *http.Request) {
	notImplemented(w)
}

// handleGetAllMessages returns the full message catalog as JSON. Admin only:
// 401 without a valid user, 403 for a non-admin.
func (s *Server) handleGetAllMessages(w http.ResponseWriter, r *http.Request) {
	notImplemented(w)
}

// handleListPhotosForWeek returns every photo for a course week as JSON. Admin
// only (401/403). There is no per-user filtering: an admin sees all of the
// week's photos, matching the legacy listPhotosForWeek route.
func (s *Server) handleListPhotosForWeek(w http.ResponseWriter, r *http.Request) {
	notImplemented(w)
}

// handleGetSignedURL validates the upload metadata and returns a single-use
// upload URL. Requires a valid user (401); the email in the params must match
// the authenticated user (403); non-JPEG or out-of-range metadata is rejected
// (400).
func (s *Server) handleGetSignedURL(w http.ResponseWriter, r *http.Request) {
	notImplemented(w)
}

// handleUpload receives the actual file PUT to a signed URL. It rejects an
// invalid or already-used signature (403), enforces the size bounds (413/400),
// persists the file and a decoded metadata row, then expires the signature so
// the URL is single-use.
func (s *Server) handleUpload(w http.ResponseWriter, r *http.Request) {
	notImplemented(w)
}

// handlePreflight answers CORS preflight requests. The real handler sets the
// Access-Control-* headers and returns 200; the skeleton does not, so preflight
// tests stay red until phase 3b.
func (s *Server) handlePreflight(w http.ResponseWriter, r *http.Request) {
	notImplemented(w)
}

// notImplemented is the uniform red-phase response.
func notImplemented(w http.ResponseWriter) {
	http.Error(w, "not implemented", http.StatusNotImplemented)
}
