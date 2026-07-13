package httpapi

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/vdavid/photato/backend-go/internal/auth"
	"github.com/vdavid/photato/backend-go/internal/magiclink"
	"github.com/vdavid/photato/backend-go/internal/messages"
	"github.com/vdavid/photato/backend-go/internal/photos"
	"github.com/vdavid/photato/backend-go/internal/signing"
)

const (
	adminEmail = "veszelovszki@gmail.com"
	userEmail  = "test@user.com"
	adminToken = "admin-token"
	userToken  = "user-token"
)

var linkSecret = []byte("test-link-secret")

// --- fakes (hand-rolled, in the style of the legacy jest suite) ---

type fakeAuth struct{}

func (fakeAuth) AuthenticateBySessionToken(ctx context.Context, token string) (*auth.User, error) {
	switch token {
	case adminToken:
		return &auth.User{EmailAddress: adminEmail, IsAdmin: true}, nil
	case userToken:
		return &auth.User{EmailAddress: userEmail, IsAdmin: false}, nil
	default:
		return nil, nil
	}
}

// fakeLogin is an in-memory LoginStore: real single-use nonce burning and
// session bookkeeping, a toggleable rate-limit verdict.
type fakeLogin struct {
	mu        sync.Mutex
	burned    map[string]bool
	sessions  map[string]string // token -> email
	created   []string          // emails a session was opened for, in order
	rateAllow bool
	seq       int
}

func newFakeLogin() *fakeLogin {
	return &fakeLogin{burned: map[string]bool{}, sessions: map[string]string{}, rateAllow: true}
}

func (f *fakeLogin) CreateSessionForEmail(ctx context.Context, email string) (string, *auth.User, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.seq++
	token := "sess-" + email + "-" + string(rune('a'+f.seq))
	f.sessions[token] = email
	f.created = append(f.created, email)
	return token, &auth.User{EmailAddress: email, IsAdmin: auth.IsAdmin(email, []string{adminEmail})}, nil
}

func (f *fakeLogin) BurnNonce(ctx context.Context, nonce string) (bool, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	if f.burned[nonce] {
		return false, nil
	}
	f.burned[nonce] = true
	return true, nil
}

func (f *fakeLogin) AllowLoginRequest(ctx context.Context, bucket string, limit int, window time.Duration) (bool, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	return f.rateAllow, nil
}

func (f *fakeLogin) DeleteSession(ctx context.Context, token string) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	delete(f.sessions, token)
	return nil
}

// fakeEmail records sent mail on a channel so async sends can be awaited.
type sentEmail struct{ to, subject, body string }

type fakeEmail struct{ sent chan sentEmail }

func newFakeEmail() *fakeEmail { return &fakeEmail{sent: make(chan sentEmail, 8)} }

func (f *fakeEmail) Send(to, subject, body string) error {
	f.sent <- sentEmail{to, subject, body}
	return nil
}

// waitForEmail returns the next sent email, or fails if none arrives in time.
func (f *fakeEmail) waitForEmail(t *testing.T) sentEmail {
	t.Helper()
	select {
	case e := <-f.sent:
		return e
	case <-time.After(2 * time.Second):
		t.Fatal("expected an email to be sent, none arrived")
		return sentEmail{}
	}
}

// expectNoEmail asserts nothing is sent within a short window.
func (f *fakeEmail) expectNoEmail(t *testing.T) {
	t.Helper()
	select {
	case e := <-f.sent:
		t.Fatalf("expected no email, but one was sent to %s", e.to)
	case <-time.After(300 * time.Millisecond):
	}
}

type fakeMessages struct{}

func (fakeMessages) GetAll() ([]messages.Message, error) {
	return []messages.Message{{Slug: "a", Title: "A"}, {Slug: "b", Title: "B"}}, nil
}

type fakePhotos struct {
	seeded   []photos.PhotoInfo
	inserted []photos.Record
}

func (f *fakePhotos) ListPhotosForWeek(ctx context.Context, params photos.ListParams) ([]photos.PhotoInfo, error) {
	return f.seeded, nil
}

func (f *fakePhotos) InsertPhoto(ctx context.Context, record photos.Record) error {
	f.inserted = append(f.inserted, record)
	return nil
}

// memSigStore is an in-memory signing.Store, so the tests drive the real
// signing.Repository logic.
type memSigStore struct{ m map[string]bool }

func newMemSigStore() *memSigStore { return &memSigStore{m: map[string]bool{}} }

func (s *memSigStore) PutSignature(hash string, status signing.Status) error {
	s.m[string(status)+"/"+hash] = true
	return nil
}

func (s *memSigStore) HasSignature(hash string, status signing.Status) (bool, error) {
	return s.m[string(status)+"/"+hash], nil
}

// harness bundles a running server with its fakes for assertions.
type harness struct {
	ts     *httptest.Server
	photos *fakePhotos
	login  *fakeLogin
	email  *fakeEmail
}

// startServer builds a server from deps, wires the httptest URL back into
// BaseURL (handlers build upload URLs from it), and returns it.
func startServer(t *testing.T, deps Deps) *httptest.Server {
	t.Helper()
	srv := NewServer(deps)
	ts := httptest.NewServer(srv.Handler())
	deps.BaseURL = ts.URL
	ts.Config.Handler = NewServer(deps).Handler()
	t.Cleanup(ts.Close)
	return ts
}

// newHarness starts a server with default auth wiring; tweak mutates Deps first.
func newHarness(t *testing.T, tweak func(*Deps)) *harness {
	t.Helper()
	photoFake := &fakePhotos{
		seeded: []photos.PhotoInfo{
			{Key: "production/photos/hu-4/week-2/user@example.com.jpg", FileName: "user@example.com.jpg", URL: "https://api.photato.eu/x", EmailAddress: "user@example.com", Title: "One", ContentType: "image/jpeg", SizeInBytes: 1024, LastModifiedDate: time.Now()},
			{Key: "production/photos/hu-4/week-2/other@example.com.jpg", FileName: "other@example.com.jpg", URL: "https://api.photato.eu/y", EmailAddress: "other@example.com", Title: "Two", ContentType: "image/jpeg", SizeInBytes: 2048, LastModifiedDate: time.Now()},
		},
	}
	login := newFakeLogin()
	emailFake := newFakeEmail()
	deps := Deps{
		Authenticator:   fakeAuth{},
		Login:           login,
		Email:           emailFake,
		AdminEmails:     []string{adminEmail, "dorah.nemeth@gmail.com"},
		Signatures:      signing.NewRepository(newMemSigStore()),
		Messages:        fakeMessages{},
		Photos:          photoFake,
		Version:         "7.1.0",
		LinkSecret:      linkSecret,
		FrontendBaseURL: "https://photato.eu",
	}
	if tweak != nil {
		tweak(&deps)
	}
	ts := startServer(t, deps)
	return &harness{ts: ts, photos: photoFake, login: login, email: emailFake}
}

// testServer keeps the original signature the photo/version/message tests use.
func testServer(t *testing.T) (*httptest.Server, *fakePhotos) {
	h := newHarness(t, nil)
	return h.ts, h.photos
}

func do(t *testing.T, ts *httptest.Server, method, path, token string, body io.Reader) *http.Response {
	t.Helper()
	req, err := http.NewRequest(method, ts.URL+path, body)
	if err != nil {
		t.Fatalf("new request: %v", err)
	}
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	resp, err := ts.Client().Do(req)
	if err != nil {
		t.Fatalf("do request: %v", err)
	}
	return resp
}

func postJSON(t *testing.T, ts *httptest.Server, path, token string, payload any) *http.Response {
	t.Helper()
	b, _ := json.Marshal(payload)
	return do(t, ts, "POST", path, token, bytes.NewReader(b))
}

// --- /auth/request-link ---

// TestRequestLinkAlwaysOKAndSends: a well-formed request returns 200 and mails a
// link that points at the frontend verify page with the 15-minute note.
func TestRequestLinkAlwaysOKAndSends(t *testing.T) {
	h := newHarness(t, nil)
	resp := postJSON(t, h.ts, "/auth/request-link", "", map[string]string{"email": "Student@Example.com"})
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want 200", resp.StatusCode)
	}
	e := h.email.waitForEmail(t)
	if e.to != "student@example.com" {
		t.Errorf("email to = %q, want normalized lowercase student@example.com", e.to)
	}
	if !strings.Contains(e.body, "/login/verify?token=") {
		t.Errorf("email body missing the verify link, got:\n%s", e.body)
	}
	if !strings.Contains(e.body, "15") {
		t.Errorf("email body missing the 15-minute validity note")
	}
}

// TestRequestLinkNoEnumeration: an unknown email gets the exact same 200 as a
// known one (nothing distinguishes them to the caller).
func TestRequestLinkNoEnumeration(t *testing.T) {
	h := newHarness(t, nil)
	resp := postJSON(t, h.ts, "/auth/request-link", "", map[string]string{"email": "who-knows@nowhere.test"})
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want 200 for an unknown email", resp.StatusCode)
	}
	// A link is still minted+sent — the account is created on verify, so request
	// time can't reveal existence.
	e := h.email.waitForEmail(t)
	if e.to != "who-knows@nowhere.test" {
		t.Errorf("email to = %q", e.to)
	}
}

// TestRequestLinkMalformedEmailStillOK: a garbage email is a 200 with no send.
func TestRequestLinkMalformedEmailStillOK(t *testing.T) {
	h := newHarness(t, nil)
	resp := postJSON(t, h.ts, "/auth/request-link", "", map[string]string{"email": "not-an-email"})
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want 200", resp.StatusCode)
	}
	h.email.expectNoEmail(t)
}

// TestRequestLinkRateLimited: when the store denies the request, still 200 but
// no email is sent.
func TestRequestLinkRateLimited(t *testing.T) {
	h := newHarness(t, func(d *Deps) {})
	h.login.rateAllow = false
	resp := postJSON(t, h.ts, "/auth/request-link", "", map[string]string{"email": "student@example.com"})
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want 200 even when rate-limited", resp.StatusCode)
	}
	h.email.expectNoEmail(t)
}

// --- /auth/verify ---

func TestVerifyExchangesTokenForSession(t *testing.T) {
	h := newHarness(t, nil)
	token, _, _ := magiclink.Sign(linkSecret, "student@example.com", 15*time.Minute)
	resp := postJSON(t, h.ts, "/auth/verify", "", map[string]string{"token": token})
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want 200", resp.StatusCode)
	}
	var got struct {
		SessionToken string `json:"sessionToken"`
		User         struct {
			EmailAddress string `json:"emailAddress"`
			IsAdmin      bool   `json:"isAdmin"`
		} `json:"user"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&got); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if got.SessionToken == "" {
		t.Error("empty sessionToken")
	}
	if got.User.EmailAddress != "student@example.com" || got.User.IsAdmin {
		t.Errorf("user = %+v, want student@example.com non-admin", got.User)
	}
}

func TestVerifyAdminGetsAdminFlag(t *testing.T) {
	h := newHarness(t, nil)
	token, _, _ := magiclink.Sign(linkSecret, adminEmail, 15*time.Minute)
	resp := postJSON(t, h.ts, "/auth/verify", "", map[string]string{"token": token})
	defer resp.Body.Close()
	var got struct {
		User struct {
			IsAdmin bool `json:"isAdmin"`
		} `json:"user"`
	}
	_ = json.NewDecoder(resp.Body).Decode(&got)
	if !got.User.IsAdmin {
		t.Errorf("admin email did not get isAdmin=true")
	}
}

func TestVerifyRejectsTamperedToken(t *testing.T) {
	h := newHarness(t, nil)
	token, _, _ := magiclink.Sign(linkSecret, "student@example.com", 15*time.Minute)
	resp := postJSON(t, h.ts, "/auth/verify", "", map[string]string{"token": token + "x"})
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("tampered token status = %d, want 401", resp.StatusCode)
	}
}

func TestVerifyRejectsExpiredToken(t *testing.T) {
	h := newHarness(t, nil)
	token, _, _ := magiclink.Sign(linkSecret, "student@example.com", -time.Minute)
	resp := postJSON(t, h.ts, "/auth/verify", "", map[string]string{"token": token})
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expired token status = %d, want 401", resp.StatusCode)
	}
}

// TestVerifyIsSingleUse: a token works once, then is burned.
func TestVerifyIsSingleUse(t *testing.T) {
	h := newHarness(t, nil)
	token, _, _ := magiclink.Sign(linkSecret, "student@example.com", 15*time.Minute)

	first := postJSON(t, h.ts, "/auth/verify", "", map[string]string{"token": token})
	first.Body.Close()
	if first.StatusCode != http.StatusOK {
		t.Fatalf("first verify status = %d, want 200", first.StatusCode)
	}
	second := postJSON(t, h.ts, "/auth/verify", "", map[string]string{"token": token})
	second.Body.Close()
	if second.StatusCode != http.StatusUnauthorized {
		t.Fatalf("second verify status = %d, want 401 (single-use)", second.StatusCode)
	}
}

// --- /auth/test-login ---

func TestTestLoginDisabledByDefault(t *testing.T) {
	h := newHarness(t, nil) // TestLoginSecret unset
	resp := postJSON(t, h.ts, "/auth/test-login", "", map[string]string{"email": userEmail, "secret": "anything"})
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusNotFound {
		t.Fatalf("status = %d, want 404 when the backdoor is off", resp.StatusCode)
	}
}

func TestTestLoginRejectsWrongSecret(t *testing.T) {
	h := newHarness(t, func(d *Deps) { d.TestLoginSecret = "s3cr3t" })
	resp := postJSON(t, h.ts, "/auth/test-login", "", map[string]string{"email": userEmail, "secret": "wrong"})
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusForbidden {
		t.Fatalf("status = %d, want 403 for a wrong secret", resp.StatusCode)
	}
}

func TestTestLoginAcceptsRightSecret(t *testing.T) {
	h := newHarness(t, func(d *Deps) { d.TestLoginSecret = "s3cr3t" })
	resp := postJSON(t, h.ts, "/auth/test-login", "", map[string]string{"email": adminEmail, "secret": "s3cr3t"})
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want 200", resp.StatusCode)
	}
	var got struct {
		SessionToken string `json:"sessionToken"`
		User         struct {
			EmailAddress string `json:"emailAddress"`
			IsAdmin      bool   `json:"isAdmin"`
		} `json:"user"`
	}
	_ = json.NewDecoder(resp.Body).Decode(&got)
	if got.SessionToken == "" || got.User.EmailAddress != adminEmail || !got.User.IsAdmin {
		t.Errorf("unexpected response: %+v", got)
	}
}

// --- /auth/me + /auth/logout ---

func TestMeRequiresAuth(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/auth/me", "", nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("status = %d, want 401", resp.StatusCode)
	}
}

func TestMeReturnsUser(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/auth/me", userToken, nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want 200", resp.StatusCode)
	}
	var got struct {
		EmailAddress string `json:"emailAddress"`
		IsAdmin      bool   `json:"isAdmin"`
	}
	_ = json.NewDecoder(resp.Body).Decode(&got)
	if got.EmailAddress != userEmail || got.IsAdmin {
		t.Errorf("me = %+v, want %s non-admin", got, userEmail)
	}
}

func TestLogoutBurnsSession(t *testing.T) {
	h := newHarness(t, nil)
	resp := do(t, h.ts, "POST", "/auth/logout", userToken, nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want 200", resp.StatusCode)
	}
	// Logout with no token is still a 200 no-op.
	resp2 := do(t, h.ts, "POST", "/auth/logout", "", nil)
	defer resp2.Body.Close()
	if resp2.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want 200 for tokenless logout", resp2.StatusCode)
	}
}

// --- /version ---

func TestVersionRequiresAuth(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/version", "", nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("GET /version without token: status = %d, want 401", resp.StatusCode)
	}
}

func TestVersionReturnsVersion(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/version", userToken, nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("GET /version: status = %d, want 200", resp.StatusCode)
	}
	body, _ := io.ReadAll(resp.Body)
	if len(body) == 0 {
		t.Errorf("GET /version returned empty body, want a version string")
	}
}

// --- /messages/get-all-messages (admin only) ---

func TestGetAllMessagesRequiresAuth(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/messages/get-all-messages", "", nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("status = %d, want 401", resp.StatusCode)
	}
}

func TestGetAllMessagesForbidsNonAdmin(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/messages/get-all-messages", userToken, nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusForbidden {
		t.Fatalf("non-admin status = %d, want 403", resp.StatusCode)
	}
}

func TestGetAllMessagesAllowsAdmin(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/messages/get-all-messages", adminToken, nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("admin status = %d, want 200", resp.StatusCode)
	}
	var got []messages.Message
	if err := json.NewDecoder(resp.Body).Decode(&got); err != nil {
		t.Fatalf("decode messages: %v", err)
	}
	if len(got) != 2 {
		t.Errorf("messages len = %d, want 2", len(got))
	}
}

// --- /photos/list-for-week (admin only) ---

func TestListForWeekForbidsNonAdmin(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/photos/list-for-week?environment=production&courseName=hu-4&weekIndex=2", userToken, nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusForbidden {
		t.Fatalf("non-admin status = %d, want 403", resp.StatusCode)
	}
}

// TestListForWeekReturnsAllWeekPhotos: an admin sees every photo for the week,
// from all users (no per-user filtering), with the exact JSON field names.
func TestListForWeekReturnsAllWeekPhotos(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/photos/list-for-week?environment=production&courseName=hu-4&weekIndex=2&getDetails=true", adminToken, nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("admin status = %d, want 200", resp.StatusCode)
	}
	var got []map[string]json.RawMessage
	if err := json.NewDecoder(resp.Body).Decode(&got); err != nil {
		t.Fatalf("decode photos: %v", err)
	}
	if len(got) != 2 {
		t.Fatalf("photos len = %d, want 2 (all week photos, unfiltered)", len(got))
	}
	for _, field := range []string{"key", "fileName", "url", "emailAddress", "title", "contentType", "sizeInBytes", "lastModifiedDate"} {
		if _, ok := got[0][field]; !ok {
			t.Errorf("photo JSON missing field %q", field)
		}
	}
}

// --- /get-signed-url ---

func signedURLQuery(email, mimeType string) string {
	return signedURLQueryEnv("production", email, mimeType)
}

func signedURLQueryEnv(environment, email, mimeType string) string {
	v := url.Values{}
	v.Set("environment", environment)
	v.Set("emailAddress", email)
	v.Set("courseName", "hu-4")
	v.Set("weekIndex", "2")
	v.Set("originalFileName", "photo.jpg")
	v.Set("title", "My photo")
	v.Set("mimeType", mimeType)
	return "?" + v.Encode()
}

func TestGetSignedURLRequiresAuth(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/get-signed-url"+signedURLQuery(userEmail, "image/jpeg"), "", nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("status = %d, want 401", resp.StatusCode)
	}
}

func TestGetSignedURLRejectsEmailMismatch(t *testing.T) {
	ts, _ := testServer(t)
	// Authenticated as userEmail, but requesting an upload for another email.
	resp := do(t, ts, "GET", "/get-signed-url"+signedURLQuery("someone@else.com", "image/jpeg"), userToken, nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusForbidden {
		t.Fatalf("status = %d, want 403 for email mismatch", resp.StatusCode)
	}
}

func TestGetSignedURLRejectsNonJPEG(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/get-signed-url"+signedURLQuery(userEmail, "text/plain"), userToken, nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("status = %d, want 400 for non-jpeg", resp.StatusCode)
	}
}

// TestGetSignedURLRejectsBadEnvironment: an unknown environment is rejected with
// 400 before any signature is minted, closing the authenticated disk-fill vector
// (varying environment to mint unbounded distinct storage paths).
func TestGetSignedURLRejectsBadEnvironment(t *testing.T) {
	ts, _ := testServer(t)
	for _, env := range []string{"bogus", "../../etc", ""} {
		resp := do(t, ts, "GET", "/get-signed-url"+signedURLQueryEnv(env, userEmail, "image/jpeg"), userToken, nil)
		resp.Body.Close()
		if resp.StatusCode != http.StatusBadRequest {
			t.Errorf("environment=%q: status = %d, want 400", env, resp.StatusCode)
		}
	}
}

func TestGetSignedURLReturnsURL(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/get-signed-url"+signedURLQuery(userEmail, "image/jpeg"), userToken, nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want 200", resp.StatusCode)
	}
	body, _ := io.ReadAll(resp.Body)
	if !bytes.Contains(body, []byte("/upload/")) {
		t.Errorf("returned URL %q does not contain the upload path", body)
	}
}

// --- single-use upload flow ---

// TestSignedUploadIsSingleUse walks the full flow: get a signed URL, PUT the
// file once (accepted, persisted), then PUT again (rejected, single-use).
func TestSignedUploadIsSingleUse(t *testing.T) {
	ts, photoFake := testServer(t)

	resp := do(t, ts, "GET", "/get-signed-url"+signedURLQuery(userEmail, "image/jpeg"), userToken, nil)
	if resp.StatusCode != http.StatusOK {
		resp.Body.Close()
		t.Fatalf("get-signed-url status = %d, want 200", resp.StatusCode)
	}
	uploadURL, _ := io.ReadAll(resp.Body)
	resp.Body.Close()

	goodBody := bytes.Repeat([]byte{0xFF}, int(photos.MinUploadBytes)+1)

	put := func() *http.Response {
		req, err := http.NewRequest("PUT", string(uploadURL), bytes.NewReader(goodBody))
		if err != nil {
			t.Fatalf("new PUT: %v", err)
		}
		req.Header.Set("Content-Type", "image/jpeg")
		r, err := ts.Client().Do(req)
		if err != nil {
			t.Fatalf("PUT: %v", err)
		}
		return r
	}

	first := put()
	if first.StatusCode != http.StatusOK {
		first.Body.Close()
		t.Fatalf("first PUT status = %d, want 200", first.StatusCode)
	}
	first.Body.Close()
	if len(photoFake.inserted) != 1 {
		t.Errorf("inserted photos = %d, want 1 after a successful upload", len(photoFake.inserted))
	}

	second := put()
	defer second.Body.Close()
	if second.StatusCode != http.StatusForbidden {
		t.Errorf("second PUT status = %d, want 403 (single-use)", second.StatusCode)
	}
}

func TestSignedUploadRejectsTooSmall(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/get-signed-url"+signedURLQuery(userEmail, "image/jpeg"), userToken, nil)
	if resp.StatusCode != http.StatusOK {
		resp.Body.Close()
		t.Fatalf("get-signed-url status = %d, want 200", resp.StatusCode)
	}
	uploadURL, _ := io.ReadAll(resp.Body)
	resp.Body.Close()

	tiny := bytes.Repeat([]byte{0xFF}, 10)
	req, _ := http.NewRequest("PUT", string(uploadURL), bytes.NewReader(tiny))
	req.Header.Set("Content-Type", "image/jpeg")
	put, err := ts.Client().Do(req)
	if err != nil {
		t.Fatalf("PUT: %v", err)
	}
	defer put.Body.Close()
	if put.StatusCode != http.StatusBadRequest {
		t.Errorf("PUT tiny body status = %d, want 400 (below %d bytes)", put.StatusCode, photos.MinUploadBytes)
	}
}

// --- CORS ---

func TestCORSHeaderOnResponses(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/version", userToken, nil)
	defer resp.Body.Close()
	if got := resp.Header.Get("Access-Control-Allow-Origin"); got == "" {
		t.Errorf("missing Access-Control-Allow-Origin header on GET response")
	}
}

func TestCORSPreflight(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "OPTIONS", "/photos/list-for-week", "", nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("OPTIONS status = %d, want 200", resp.StatusCode)
	}
	if got := resp.Header.Get("Access-Control-Allow-Origin"); got == "" {
		t.Errorf("preflight missing Access-Control-Allow-Origin")
	}
	if got := resp.Header.Get("Access-Control-Allow-Methods"); got == "" {
		t.Errorf("preflight missing Access-Control-Allow-Methods")
	}
}

// --- clientIP (rate-limit bucket key) ---

// TestClientIPUsesRightmostTrustedHop: with a single trusted proxy (Caddy)
// appending the real client as the rightmost X-Forwarded-For entry, a spoofed
// leftmost entry must be ignored and the rightmost (trusted) value returned.
func TestClientIPUsesRightmostTrustedHop(t *testing.T) {
	req := httptest.NewRequest("POST", "/auth/request-link", nil)
	req.Header.Set("X-Forwarded-For", "1.2.3.4, 9.9.9.9")
	if got := clientIP(req); got != "9.9.9.9" {
		t.Fatalf("clientIP = %q, want 9.9.9.9 (rightmost trusted hop)", got)
	}
}

// TestClientIPIgnoresSpoofedLeftmost: rotating the leftmost XFF entry must not
// change the derived IP, so an attacker can't mint a fresh rate-limit bucket per
// request by varying a client-controlled header.
func TestClientIPIgnoresSpoofedLeftmost(t *testing.T) {
	derive := func(xff string) string {
		req := httptest.NewRequest("POST", "/auth/request-link", nil)
		req.Header.Set("X-Forwarded-For", xff)
		return clientIP(req)
	}
	a := derive("1.1.1.1, 9.9.9.9")
	b := derive("2.2.2.2, 9.9.9.9")
	if a != b {
		t.Fatalf("spoofed leftmost changed the derived IP: %q vs %q", a, b)
	}
	if a != "9.9.9.9" {
		t.Fatalf("derived IP = %q, want 9.9.9.9", a)
	}
}

// TestClientIPFallsBackToRemoteAddr: no XFF header → the connection's RemoteAddr
// host (port stripped).
func TestClientIPFallsBackToRemoteAddr(t *testing.T) {
	req := httptest.NewRequest("POST", "/auth/request-link", nil)
	req.RemoteAddr = "203.0.113.5:54321"
	if got := clientIP(req); got != "203.0.113.5" {
		t.Fatalf("clientIP = %q, want 203.0.113.5", got)
	}
}

// --- routing ---

func TestUnknownRouteReturns404(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/no-such-endpoint", userToken, nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusNotFound {
		t.Errorf("unknown route status = %d, want 404", resp.StatusCode)
	}
}
