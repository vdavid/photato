// Package httpapi is the HTTP surface of the Go backend: routing, auth gating,
// CORS, status codes, and JSON encoding. It replaces the legacy Lambda +
// API Gateway + Lambda@Edge stack with a single net/http server.
//
// Endpoints (data endpoints are Bearer-authed via Auth0):
//   - GET  /version                     valid user required
//   - GET  /messages/get-all-messages   admin only
//   - GET  /photos/list-for-week        admin only
//   - GET  /photos/{key...}             admin only; serves a stored photo file
//   - GET  /get-signed-url              valid user; email in params must match
//   - PUT  /upload/{key...}             single-use signed upload target (no Bearer;
//     the signature is the authorization, exactly as the legacy Lambda@Edge validator)
//
// CORS headers are applied to every response and OPTIONS preflight is answered
// with 200, because the frontend is cross-origin during the migration.
package httpapi

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

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
	PhotosDir     string // filesystem root under which photo files are stored (DATA_DIR/photos)
}

// Server is the HTTP API.
type Server struct {
	deps Deps
	mux  *http.ServeMux
	// uploadMu serializes the check-and-expire "claim" of an upload signature so
	// two concurrent PUTs to the same signed URL can't both succeed (single-use).
	uploadMu sync.Mutex
}

// NewServer wires routes and returns a ready Server.
func NewServer(deps Deps) *Server {
	s := &Server{deps: deps, mux: http.NewServeMux()}
	s.routes()
	return s
}

// Handler returns the root http.Handler, wrapped with CORS handling.
func (s *Server) Handler() http.Handler {
	return s.withCORS(s.mux)
}

func (s *Server) routes() {
	// Method+path patterns (net/http, Go 1.22+): unknown path → 404, known path
	// with the wrong method → 405, both handled by ServeMux.
	s.mux.HandleFunc("GET /version", s.handleVersion)
	s.mux.HandleFunc("GET /messages/get-all-messages", s.handleGetAllMessages)
	s.mux.HandleFunc("GET /photos/list-for-week", s.handleListPhotosForWeek)
	s.mux.HandleFunc("GET /photos/", s.handleServePhoto)
	s.mux.HandleFunc("GET /get-signed-url", s.handleGetSignedURL)
	s.mux.HandleFunc("PUT /upload/", s.handleUpload)
}

// --- middleware ---

// withCORS sets permissive CORS headers on every response and answers OPTIONS
// preflight requests with 200. The frontend is served from another origin
// during the migration, so these headers are load-bearing.
func (s *Server) withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := w.Header()
		h.Set("Access-Control-Allow-Origin", "*")
		h.Set("Access-Control-Allow-Headers", "*")
		if r.Method == http.MethodOptions {
			h.Set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// --- auth helpers ---

// authenticate resolves the request's Bearer token to a user, or nil if the
// token is missing or unrecognized.
func (s *Server) authenticate(r *http.Request) (*auth.User, error) {
	const prefix = "Bearer "
	h := r.Header.Get("Authorization")
	if !strings.HasPrefix(h, prefix) {
		return nil, nil
	}
	token := strings.TrimSpace(h[len(prefix):])
	if token == "" {
		return nil, nil
	}
	return s.deps.Authenticator.AuthenticateByAccessToken(r.Context(), token)
}

// requireUser resolves a valid user or writes 401/500. ok is false when the
// caller should stop (a response was already written).
func (s *Server) requireUser(w http.ResponseWriter, r *http.Request) (*auth.User, bool) {
	user, err := s.authenticate(r)
	if err != nil {
		http.Error(w, "authentication error", http.StatusInternalServerError)
		return nil, false
	}
	if user == nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return nil, false
	}
	return user, true
}

// requireAdmin resolves a valid admin user or writes 401/403/500.
func (s *Server) requireAdmin(w http.ResponseWriter, r *http.Request) (*auth.User, bool) {
	user, ok := s.requireUser(w, r)
	if !ok {
		return nil, false
	}
	if !user.IsAdmin {
		http.Error(w, "forbidden", http.StatusForbidden)
		return nil, false
	}
	return user, true
}

// --- handlers ---

// handleVersion returns the backend version. Requires a valid user (401
// otherwise) but not admin, per docs/backend-go-divergences.md.
func (s *Server) handleVersion(w http.ResponseWriter, r *http.Request) {
	if _, ok := s.requireUser(w, r); !ok {
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	_, _ = io.WriteString(w, s.deps.Version)
}

// handleGetAllMessages returns the full message catalog as JSON. Admin only:
// 401 without a valid user, 403 for a non-admin.
func (s *Server) handleGetAllMessages(w http.ResponseWriter, r *http.Request) {
	if _, ok := s.requireAdmin(w, r); !ok {
		return
	}
	msgs, err := s.deps.Messages.GetAll()
	if err != nil {
		http.Error(w, "failed to load messages", http.StatusInternalServerError)
		return
	}
	writeJSON(w, msgs)
}

// handleListPhotosForWeek returns every photo for a course week as JSON. Admin
// only (401/403). There is no per-user filtering: an admin sees all of the
// week's photos.
func (s *Server) handleListPhotosForWeek(w http.ResponseWriter, r *http.Request) {
	if _, ok := s.requireAdmin(w, r); !ok {
		return
	}
	q := r.URL.Query()
	weekIndex, err := strconv.Atoi(q.Get("weekIndex"))
	if err != nil {
		http.Error(w, "invalid weekIndex", http.StatusBadRequest)
		return
	}
	getDetails, _ := strconv.ParseBool(q.Get("getDetails"))

	list, err := s.deps.Photos.ListPhotosForWeek(r.Context(), photos.ListParams{
		Environment: q.Get("environment"),
		CourseName:  q.Get("courseName"),
		WeekIndex:   weekIndex,
		GetDetails:  getDetails,
	})
	if err != nil {
		http.Error(w, "failed to list photos", http.StatusInternalServerError)
		return
	}
	// The public URL of each photo points at this server's own serving route.
	for i := range list {
		list[i].URL = s.photoURL(r, list[i].Key)
	}
	if list == nil {
		list = []photos.PhotoInfo{}
	}
	writeJSON(w, list)
}

// handleServePhoto serves a stored photo file. Same admin gating as the listing
// (401/403); the file is read from PhotosDir. Path traversal is rejected.
func (s *Server) handleServePhoto(w http.ResponseWriter, r *http.Request) {
	if _, ok := s.requireAdmin(w, r); !ok {
		return
	}
	rel := strings.TrimPrefix(r.URL.Path, "/photos/")
	if rel == "" || strings.Contains(rel, "..") {
		http.Error(w, "bad photo path", http.StatusBadRequest)
		return
	}
	clean := path.Clean("/" + rel)
	full := filepath.Join(s.photosRoot(), filepath.FromSlash(clean))
	http.ServeFile(w, r, full)
}

// handleGetSignedURL validates the upload metadata and returns a single-use
// upload URL. Requires a valid user (401); the email in the params must match
// the authenticated user (403); non-JPEG or out-of-range metadata is rejected
// (400).
func (s *Server) handleGetSignedURL(w http.ResponseWriter, r *http.Request) {
	user, ok := s.requireUser(w, r)
	if !ok {
		return
	}
	q := r.URL.Query()
	meta, err := photos.ParseAndValidate(map[string]string{
		"emailAddress":     q.Get("emailAddress"),
		"courseName":       q.Get("courseName"),
		"weekIndex":        q.Get("weekIndex"),
		"originalFileName": q.Get("originalFileName"),
		"title":            q.Get("title"),
		"mimeType":         q.Get("mimeType"),
	})
	if err != nil {
		http.Error(w, "invalid upload metadata", http.StatusBadRequest)
		return
	}
	if user.EmailAddress != meta.EmailAddress {
		http.Error(w, "Mismatching email address.", http.StatusForbidden)
		return
	}

	storagePath := photos.BuildUploadPath(q.Get("environment"), meta)
	if err := s.deps.Signatures.CreateValidForPath(storagePath); err != nil {
		http.Error(w, "failed to sign upload", http.StatusInternalServerError)
		return
	}

	uploadURL := s.uploadURL(r, storagePath, meta)
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	_, _ = io.WriteString(w, uploadURL)
}

// handleUpload receives the file PUT to a signed URL. It streams the body to
// disk (capping RAM/disk use), enforces the size bounds (400), persists a
// decoded metadata row, then expires the signature so the URL is single-use
// (403 on reuse). No Bearer is required: a valid signature is the authorization.
func (s *Server) handleUpload(w http.ResponseWriter, r *http.Request) {
	storagePath := strings.TrimPrefix(r.URL.Path, "/upload/")
	if storagePath == "" || strings.Contains(storagePath, "..") {
		http.Error(w, "bad upload path", http.StatusBadRequest)
		return
	}

	// Cheap early reject for a clearly-invalid or already-used signature, so we
	// don't stream a body for nothing.
	if valid, err := s.deps.Signatures.IsValidForPath(storagePath); err != nil {
		http.Error(w, "signature check failed", http.StatusInternalServerError)
		return
	} else if !valid {
		http.Error(w, "Invalid signature.", http.StatusForbidden)
		return
	}

	dir := filepath.Dir(filepath.Join(s.photosRoot(), filepath.FromSlash(storagePath)))
	if err := os.MkdirAll(dir, 0o755); err != nil {
		http.Error(w, "storage error", http.StatusInternalServerError)
		return
	}
	tmp, err := os.CreateTemp(dir, ".upload-*")
	if err != nil {
		http.Error(w, "storage error", http.StatusInternalServerError)
		return
	}
	tmpName := tmp.Name()
	defer os.Remove(tmpName) // no-op after a successful rename

	// Cap the copy at Max+1 bytes so an oversized body is detected without
	// buffering the whole thing.
	n, err := io.Copy(tmp, io.LimitReader(r.Body, photos.MaxUploadBytes+1))
	if cerr := tmp.Close(); cerr != nil && err == nil {
		err = cerr
	}
	if err != nil {
		http.Error(w, "upload read error", http.StatusInternalServerError)
		return
	}
	if err := photos.ValidateUploadSize(n); err != nil {
		http.Error(w, "upload size out of range", http.StatusBadRequest)
		return
	}

	// Claim the signature atomically: re-check under the lock, then expire it.
	s.uploadMu.Lock()
	valid, err := s.deps.Signatures.IsValidForPath(storagePath)
	if err == nil && valid {
		err = s.deps.Signatures.MarkExpiredForPath(storagePath)
	}
	s.uploadMu.Unlock()
	if err != nil {
		http.Error(w, "signature error", http.StatusInternalServerError)
		return
	}
	if !valid {
		http.Error(w, "Invalid signature.", http.StatusForbidden)
		return
	}

	finalPath := filepath.Join(s.photosRoot(), filepath.FromSlash(storagePath))
	if err := os.Rename(tmpName, finalPath); err != nil {
		http.Error(w, "storage error", http.StatusInternalServerError)
		return
	}

	q := r.URL.Query()
	contentType := q.Get("mimeType")
	if contentType == "" {
		contentType = photos.MimeTypeJPEG
	}
	record := photos.Record{
		UUID:             newUUID(),
		Path:             storagePath,
		EmailAddress:     q.Get("emailAddress"),
		OriginalFileName: q.Get("originalFileName"),
		Title:            q.Get("title"),
		ContentType:      contentType,
		SizeInBytes:      n,
		LastModified:     time.Now().UTC(),
	}
	if err := s.deps.Photos.InsertPhoto(r.Context(), record); err != nil {
		http.Error(w, "failed to record photo", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

// --- URL + path helpers ---

// baseURL returns the configured public base URL, falling back to the request's
// own scheme+host when unset (development convenience).
func (s *Server) baseURL(r *http.Request) string {
	if s.deps.BaseURL != "" {
		return strings.TrimRight(s.deps.BaseURL, "/")
	}
	scheme := "http"
	if r.TLS != nil {
		scheme = "https"
	}
	return scheme + "://" + r.Host
}

// uploadURL builds the single-use upload target for a storage path, carrying the
// decoded metadata the PUT handler needs to persist the photo row.
func (s *Server) uploadURL(r *http.Request, storagePath string, m photos.Metadata) string {
	q := url.Values{}
	q.Set("emailAddress", m.EmailAddress)
	q.Set("originalFileName", m.OriginalFileName)
	q.Set("title", m.Title)
	q.Set("mimeType", m.MimeType)
	return s.baseURL(r) + "/upload/" + storagePath + "?" + q.Encode()
}

// photoURL builds the public serving URL for a stored photo key.
func (s *Server) photoURL(r *http.Request, key string) string {
	return s.baseURL(r) + "/photos/" + key
}

// photosRoot is the filesystem root for photo files, defaulting to a temp dir
// when unconfigured (so tests that don't set PhotosDir still round-trip).
func (s *Server) photosRoot() string {
	if s.deps.PhotosDir != "" {
		return s.deps.PhotosDir
	}
	return filepath.Join(os.TempDir(), "photato-photos")
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if err := json.NewEncoder(w).Encode(v); err != nil {
		http.Error(w, "encoding error", http.StatusInternalServerError)
	}
}

// newUUID returns a random RFC-4122 v4 UUID string, avoiding a third-party dep.
func newUUID() string {
	var b [16]byte
	_, _ = rand.Read(b[:])
	b[6] = (b[6] & 0x0f) | 0x40 // version 4
	b[8] = (b[8] & 0x3f) | 0x80 // variant 10
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
}
