// Package httpapi is the HTTP surface of the Go backend: routing, auth gating,
// CORS, status codes, and JSON encoding. It replaces the legacy Lambda +
// API Gateway + Lambda@Edge stack with a single net/http server.
//
// Authentication is self-hosted passwordless magic links: a user requests a
// link by email, clicks it, and exchanges the signed token for an opaque
// session token that then authorizes every data endpoint as a Bearer token.
//
// Endpoints:
//   - POST /auth/request-link           always 200 (no enumeration); rate-limited
//   - POST /auth/verify                  exchange a magic-link token for a session
//   - POST /auth/test-login             e2e backdoor, only when TEST_LOGIN_SECRET is set
//   - GET  /auth/me                      Bearer; returns the current user
//   - POST /auth/logout                  Bearer; burns the session
//   - GET  /version                      valid session required
//   - GET  /messages/get-all-messages    admin only
//   - GET  /photos/list-for-week         admin only
//   - GET  /photos/{key...}              admin only; serves a stored photo file
//   - GET  /get-signed-url               valid session; email in params must match
//   - PUT  /upload/{key...}              single-use signed upload target (no Bearer;
//     the signature is the authorization, exactly as the legacy Lambda@Edge validator)
//
// CORS headers are applied to every response and OPTIONS preflight is answered
// with 200, because the frontend is cross-origin during the migration.
package httpapi

import (
	"context"
	"crypto/rand"
	"crypto/subtle"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"net/mail"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/vdavid/photato/backend-go/internal/auth"
	"github.com/vdavid/photato/backend-go/internal/email"
	"github.com/vdavid/photato/backend-go/internal/magiclink"
	"github.com/vdavid/photato/backend-go/internal/messages"
	"github.com/vdavid/photato/backend-go/internal/photos"
	"github.com/vdavid/photato/backend-go/internal/signing"
)

// Magic-link tunables.
const (
	// linkTTL is how long a magic link stays valid after it's requested.
	linkTTL = 15 * time.Minute
	// rate-limit window and caps for POST /auth/request-link.
	requestLinkWindow   = 15 * time.Minute
	requestLinkPerEmail = 3
	requestLinkPerIP    = 20
)

// Authenticator resolves a Bearer session token to a user.
type Authenticator interface {
	AuthenticateBySessionToken(ctx context.Context, token string) (*auth.User, error)
}

// LoginStore is the persistence the magic-link flow needs: opening sessions,
// enforcing single-use links, rate-limiting requests, and logout.
type LoginStore interface {
	// CreateSessionForEmail upserts the user and returns a fresh session token.
	CreateSessionForEmail(ctx context.Context, email string) (token string, user *auth.User, err error)
	// BurnNonce marks a link nonce used; true means this was the first (winning) burn.
	BurnNonce(ctx context.Context, nonce string) (bool, error)
	// AllowLoginRequest reports whether a request for bucket is within its limit,
	// recording it when allowed.
	AllowLoginRequest(ctx context.Context, bucket string, limit int, window time.Duration) (bool, error)
	// DeleteSession burns a session token (logout).
	DeleteSession(ctx context.Context, token string) error
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
	Login         LoginStore
	Email         email.Sender
	AdminEmails   []string
	Signatures    SignatureRepo
	Messages      MessageLister
	Photos        PhotoRepo
	Version       string // e.g. "7.1.0" or build info
	BaseURL       string // origin used to build returned upload URLs, no trailing slash
	PhotosDir     string // filesystem root under which photo files are stored (DATA_DIR/photos)

	// LinkSecret signs magic-link tokens (HMAC-SHA256). Empty disables login.
	LinkSecret []byte
	// FrontendBaseURL is the origin of the frontend verify page, no trailing
	// slash (e.g. https://photato.eu). The link points at FrontendBaseURL +
	// "/login/verify?token=...".
	FrontendBaseURL string
	// TestLoginSecret, when non-empty, enables POST /auth/test-login for e2e.
	TestLoginSecret string
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
	s.mux.HandleFunc("POST /auth/request-link", s.handleRequestLink)
	s.mux.HandleFunc("POST /auth/verify", s.handleVerify)
	s.mux.HandleFunc("POST /auth/test-login", s.handleTestLogin)
	s.mux.HandleFunc("GET /auth/me", s.handleMe)
	s.mux.HandleFunc("POST /auth/logout", s.handleLogout)
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
			h.Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
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
	return s.deps.Authenticator.AuthenticateBySessionToken(r.Context(), token)
}

// bearerToken returns the raw Bearer token on the request, or "" if absent.
func bearerToken(r *http.Request) string {
	const prefix = "Bearer "
	h := r.Header.Get("Authorization")
	if !strings.HasPrefix(h, prefix) {
		return ""
	}
	return strings.TrimSpace(h[len(prefix):])
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

// --- auth (magic-link login) handlers ---

// handleRequestLink handles POST /auth/request-link {email}. It always responds
// 200 with {ok:true} — whether the email is known, malformed, or rate-limited —
// so it never reveals who has an account (no user enumeration). When the request
// is well-formed and within the rate limit, it mints a single-use link and mails
// it. Sending happens in the background so the response time doesn't depend on
// mail-server latency (another enumeration side channel).
func (s *Server) handleRequestLink(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email string `json:"email"`
	}
	// A bad body is indistinguishable from a valid one to the caller.
	_ = readJSON(r, &body)
	writeJSON(w, map[string]bool{"ok": true})

	addr, err := mail.ParseAddress(strings.TrimSpace(body.Email))
	if err != nil {
		return
	}
	emailAddr := strings.ToLower(addr.Address)
	if len(s.deps.LinkSecret) == 0 || s.deps.Email == nil {
		log.Printf("auth: request-link received but login is not configured (LinkSecret/Email unset)")
		return
	}

	// Rate limit per email and per client IP; both must pass. A limited request
	// is silently dropped (still 200 above), throttling abuse without leaking.
	ctx := context.Background()
	if ok, err := s.deps.Login.AllowLoginRequest(ctx, "email:"+emailAddr, requestLinkPerEmail, requestLinkWindow); err != nil || !ok {
		if err != nil {
			log.Printf("auth: rate-limit check (email) failed: %v", err)
		}
		return
	}
	if ok, err := s.deps.Login.AllowLoginRequest(ctx, "ip:"+clientIP(r), requestLinkPerIP, requestLinkWindow); err != nil || !ok {
		if err != nil {
			log.Printf("auth: rate-limit check (ip) failed: %v", err)
		}
		return
	}

	token, _, err := magiclink.Sign(s.deps.LinkSecret, emailAddr, linkTTL)
	if err != nil {
		log.Printf("auth: sign magic link failed: %v", err)
		return
	}
	link := s.verifyLink(token)
	go func() {
		if err := s.deps.Email.Send(emailAddr, email.LoginLinkSubject, email.LoginLinkBody(link)); err != nil {
			log.Printf("auth: send magic link to %s failed: %v", emailAddr, err)
		}
	}()
}

// handleVerify handles POST /auth/verify {token}. It validates the token's
// signature and expiry, burns its nonce (single-use, race-safe), then opens a
// session and returns it. Any failure is a flat 401 with no detail, so a
// tampered, expired, or replayed token are indistinguishable.
func (s *Server) handleVerify(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Token string `json:"token"`
	}
	if err := readJSON(r, &body); err != nil {
		writeAuthError(w)
		return
	}
	claims, err := magiclink.Verify(s.deps.LinkSecret, body.Token)
	if err != nil {
		writeAuthError(w)
		return
	}
	// Single-use: only the first burn of this nonce may proceed.
	fresh, err := s.deps.Login.BurnNonce(r.Context(), claims.Nonce)
	if err != nil {
		http.Error(w, "login error", http.StatusInternalServerError)
		return
	}
	if !fresh {
		writeAuthError(w)
		return
	}
	s.issueSession(w, r, strings.ToLower(claims.Email))
}

// handleTestLogin handles POST /auth/test-login {email, secret}: an e2e backdoor
// that mints a session without email round-tripping. It is disabled (404) unless
// TEST_LOGIN_SECRET is set, and requires a constant-time secret match (403).
func (s *Server) handleTestLogin(w http.ResponseWriter, r *http.Request) {
	if s.deps.TestLoginSecret == "" {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	var body struct {
		Email  string `json:"email"`
		Secret string `json:"secret"`
	}
	if err := readJSON(r, &body); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	if subtle.ConstantTimeCompare([]byte(body.Secret), []byte(s.deps.TestLoginSecret)) != 1 {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}
	addr, err := mail.ParseAddress(strings.TrimSpace(body.Email))
	if err != nil {
		http.Error(w, "invalid email", http.StatusBadRequest)
		return
	}
	s.issueSession(w, r, strings.ToLower(addr.Address))
}

// handleMe handles GET /auth/me (Bearer): returns the current user, or 401.
func (s *Server) handleMe(w http.ResponseWriter, r *http.Request) {
	user, ok := s.requireUser(w, r)
	if !ok {
		return
	}
	writeJSON(w, userResponse(user))
}

// handleLogout handles POST /auth/logout (Bearer): burns the session token. It
// always returns 200 (logging out an unknown/expired token is a no-op success).
func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	if token := bearerToken(r); token != "" {
		if err := s.deps.Login.DeleteSession(r.Context(), token); err != nil {
			http.Error(w, "logout error", http.StatusInternalServerError)
			return
		}
	}
	writeJSON(w, map[string]bool{"ok": true})
}

// issueSession opens a session for email and writes the {sessionToken, user}
// response shared by /auth/verify and /auth/test-login.
func (s *Server) issueSession(w http.ResponseWriter, r *http.Request, emailAddr string) {
	token, user, err := s.deps.Login.CreateSessionForEmail(r.Context(), emailAddr)
	if err != nil {
		http.Error(w, "login error", http.StatusInternalServerError)
		return
	}
	writeJSON(w, map[string]any{
		"sessionToken": token,
		"user":         userResponse(user),
	})
}

// userResponse is the JSON shape for a user across the auth endpoints.
func userResponse(u *auth.User) map[string]any {
	return map[string]any{"emailAddress": u.EmailAddress, "isAdmin": u.IsAdmin}
}

// writeAuthError writes the flat 401 used for every login-token failure.
func writeAuthError(w http.ResponseWriter) {
	http.Error(w, "invalid or expired link", http.StatusUnauthorized)
}

// verifyLink builds the frontend verify-page URL carrying the magic-link token.
func (s *Server) verifyLink(token string) string {
	base := strings.TrimRight(s.deps.FrontendBaseURL, "/")
	return base + "/login/verify?token=" + url.QueryEscape(token)
}

// trustedProxyHops is how many reverse proxies sit in front of this server and
// append to X-Forwarded-For. Exactly one Caddy fronts the container in
// production (see infra/CLAUDE.md), and it appends the real client's address as
// the last XFF entry. Everything to the left of that is client-supplied and must
// not be trusted.
const trustedProxyHops = 1

// clientIP returns the rate-limit bucket key: the client IP as seen by the
// trusted proxy layer. With one trusted proxy in front, that's the entry it
// appended — the rightmost X-Forwarded-For hop. Taking the leftmost entry
// instead would let an attacker rotate a spoofed header to get a fresh bucket
// per request, defeating the per-IP cap. Falls back to the connection's
// RemoteAddr when the header is absent (or has fewer entries than expected).
func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		parts := strings.Split(xff, ",")
		// Index in from the right by the number of trusted hops: the trusted
		// proxy's own appended entry, not any client-supplied ones to its left.
		if idx := len(parts) - trustedProxyHops; idx >= 0 {
			if ip := strings.TrimSpace(parts[idx]); ip != "" {
				return ip
			}
		}
	}
	if h, _, err := net.SplitHostPort(r.RemoteAddr); err == nil {
		return h
	}
	return r.RemoteAddr
}

// readJSON decodes a small JSON request body (capped to guard against abuse).
func readJSON(r *http.Request, dst any) error {
	dec := json.NewDecoder(io.LimitReader(r.Body, 1<<16))
	return dec.Decode(dst)
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
		"environment":      q.Get("environment"),
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

	storagePath := photos.BuildUploadPath(meta)
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
