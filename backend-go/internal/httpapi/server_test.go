package httpapi

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
	"time"

	"github.com/vdavid/photato/backend-go/internal/auth"
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

// --- fakes (hand-rolled, in the style of the legacy jest suite) ---

type fakeAuth struct{}

func (fakeAuth) AuthenticateByAccessToken(ctx context.Context, token string) (*auth.User, error) {
	switch token {
	case adminToken:
		return &auth.User{EmailAddress: adminEmail, IsAdmin: true}, nil
	case userToken:
		return &auth.User{EmailAddress: userEmail, IsAdmin: false}, nil
	default:
		return nil, nil
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
// signing.Repository logic once phase 3b implements it.
type memSigStore struct{ m map[string]bool }

func newMemSigStore() *memSigStore { return &memSigStore{m: map[string]bool{}} }

func (s *memSigStore) PutSignature(hash string, status signing.Status) error {
	s.m[string(status)+"/"+hash] = true
	return nil
}

func (s *memSigStore) HasSignature(hash string, status signing.Status) (bool, error) {
	return s.m[string(status)+"/"+hash], nil
}

// testServer spins up the API over httptest and returns the server plus the
// photo fake for assertions.
func testServer(t *testing.T) (*httptest.Server, *fakePhotos) {
	t.Helper()
	photoFake := &fakePhotos{
		seeded: []photos.PhotoInfo{
			{Key: "production/photos/hu-4/week-2/user@example.com.jpg", FileName: "user@example.com.jpg", URL: "https://api.photato.eu/x", EmailAddress: "user@example.com", Title: "One", ContentType: "image/jpeg", SizeInBytes: 1024, LastModifiedDate: time.Now()},
			{Key: "production/photos/hu-4/week-2/other@example.com.jpg", FileName: "other@example.com.jpg", URL: "https://api.photato.eu/y", EmailAddress: "other@example.com", Title: "Two", ContentType: "image/jpeg", SizeInBytes: 2048, LastModifiedDate: time.Now()},
		},
	}
	deps := Deps{
		Authenticator: fakeAuth{},
		AdminEmails:   []string{adminEmail, "dorah.nemeth@gmail.com"},
		Signatures:    signing.NewRepository(newMemSigStore()),
		Messages:      fakeMessages{},
		Photos:        photoFake,
		Version:       "7.1.0",
	}
	srv := NewServer(deps)
	ts := httptest.NewServer(srv.Handler())
	deps.BaseURL = ts.URL // used by handlers to build upload URLs
	// Rewire with the now-known base URL.
	ts.Config.Handler = NewServer(deps).Handler()
	t.Cleanup(ts.Close)
	return ts, photoFake
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
	v := url.Values{}
	v.Set("environment", "production")
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
		t.Fatalf("get-signed-url status = %d, want 200 (red until phase 3b)", resp.StatusCode)
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
		t.Fatalf("get-signed-url status = %d, want 200 (red until phase 3b)", resp.StatusCode)
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

// --- routing ---

func TestUnknownRouteReturns404(t *testing.T) {
	ts, _ := testServer(t)
	resp := do(t, ts, "GET", "/no-such-endpoint", userToken, nil)
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusNotFound {
		t.Errorf("unknown route status = %d, want 404", resp.StatusCode)
	}
}
