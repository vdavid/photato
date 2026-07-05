package store

import (
	"context"
	"path/filepath"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/vdavid/photato/backend-go/internal/photos"
	"github.com/vdavid/photato/backend-go/internal/signing"
)

var adminEmails = []string{"veszelovszki@gmail.com", "dorah.nemeth@gmail.com"}

// openTestStore opens a fresh SQLite store on a temp file (a file, not
// ":memory:", so the connection pool shares one database).
func openTestStore(t *testing.T) *Store {
	t.Helper()
	dsn := filepath.Join(t.TempDir(), "photato-test.db")
	s, err := Open(dsn, adminEmails)
	if err != nil {
		t.Fatalf("Open: %v", err)
	}
	t.Cleanup(func() { _ = s.Close() })
	return s
}

// TestSignatureRoundTrip exercises the store as a signing.Store.
func TestSignatureRoundTrip(t *testing.T) {
	s := openTestStore(t)
	const hash = "deadbeef"

	has, err := s.HasSignature(hash, signing.StatusValid)
	if err != nil {
		t.Fatalf("HasSignature: %v", err)
	}
	if has {
		t.Fatalf("HasSignature on empty store = true, want false")
	}

	if err := s.PutSignature(hash, signing.StatusValid); err != nil {
		t.Fatalf("PutSignature: %v", err)
	}
	has, err = s.HasSignature(hash, signing.StatusValid)
	if err != nil {
		t.Fatalf("HasSignature: %v", err)
	}
	if !has {
		t.Errorf("HasSignature after PutSignature = false, want true")
	}
	// The expired marker is independent of the valid one.
	has, err = s.HasSignature(hash, signing.StatusExpired)
	if err != nil {
		t.Fatalf("HasSignature(expired): %v", err)
	}
	if has {
		t.Errorf("HasSignature(expired) = true, want false")
	}
}

// TestCreateSessionAndLookup: opening a session for an admin email upserts the
// user and the returned token resolves back to that admin user.
func TestCreateSessionAndLookup(t *testing.T) {
	s := openTestStore(t)
	ctx := context.Background()

	token, user, err := s.CreateSessionForEmail(ctx, "veszelovszki@gmail.com")
	if err != nil {
		t.Fatalf("CreateSessionForEmail: %v", err)
	}
	if token == "" {
		t.Fatal("CreateSessionForEmail returned an empty token")
	}
	if !user.IsAdmin {
		t.Errorf("IsAdmin = false for an admin email, want true")
	}

	got, err := s.UserBySessionToken(ctx, token)
	if err != nil {
		t.Fatalf("UserBySessionToken: %v", err)
	}
	if got == nil || got.EmailAddress != "veszelovszki@gmail.com" {
		t.Fatalf("UserBySessionToken = %+v, want the admin user", got)
	}
	if !got.IsAdmin {
		t.Errorf("resolved IsAdmin = false, want true")
	}
}

// TestCreateSessionIsIdempotentPerEmail: two logins for the same email don't
// error on the unique-email constraint (upsert) and both tokens resolve.
func TestCreateSessionIsIdempotentPerEmail(t *testing.T) {
	s := openTestStore(t)
	ctx := context.Background()
	t1, _, err := s.CreateSessionForEmail(ctx, "student@example.com")
	if err != nil {
		t.Fatalf("first CreateSessionForEmail: %v", err)
	}
	t2, _, err := s.CreateSessionForEmail(ctx, "student@example.com")
	if err != nil {
		t.Fatalf("second CreateSessionForEmail: %v", err)
	}
	if t1 == t2 {
		t.Fatal("two logins produced the same token, want distinct tokens")
	}
	for _, tok := range []string{t1, t2} {
		if u, err := s.UserBySessionToken(ctx, tok); err != nil || u == nil {
			t.Errorf("token %q did not resolve (err=%v)", tok, err)
		}
	}
}

// TestNonAdminSession confirms a non-allowlisted email is not admin.
func TestNonAdminSession(t *testing.T) {
	s := openTestStore(t)
	_, user, err := s.CreateSessionForEmail(context.Background(), "someone@else.com")
	if err != nil {
		t.Fatalf("CreateSessionForEmail: %v", err)
	}
	if user.IsAdmin {
		t.Errorf("IsAdmin = true for a non-allowlisted email, want false")
	}
}

// TestExpiredSessionNotResolved: a session past its expiry must not resolve.
func TestExpiredSessionNotResolved(t *testing.T) {
	s := openTestStore(t)
	ctx := context.Background()
	token, _, err := s.CreateSessionForEmail(ctx, "student@example.com")
	if err != nil {
		t.Fatalf("CreateSessionForEmail: %v", err)
	}
	// Force the session into the past directly in the DB.
	if _, err := s.db.ExecContext(ctx, `UPDATE sessions SET expires_at = ? WHERE token = ?`,
		time.Now().Add(-time.Hour).Unix(), token); err != nil {
		t.Fatalf("expire session: %v", err)
	}
	got, err := s.UserBySessionToken(ctx, token)
	if err != nil {
		t.Fatalf("UserBySessionToken: %v", err)
	}
	if got != nil {
		t.Errorf("UserBySessionToken on an expired session = %+v, want nil", got)
	}
}

// TestDeleteSession: logout burns the token so it stops resolving.
func TestDeleteSession(t *testing.T) {
	s := openTestStore(t)
	ctx := context.Background()
	token, _, err := s.CreateSessionForEmail(ctx, "student@example.com")
	if err != nil {
		t.Fatalf("CreateSessionForEmail: %v", err)
	}
	if err := s.DeleteSession(ctx, token); err != nil {
		t.Fatalf("DeleteSession: %v", err)
	}
	if got, err := s.UserBySessionToken(ctx, token); err != nil {
		t.Fatalf("UserBySessionToken: %v", err)
	} else if got != nil {
		t.Errorf("token still resolves after logout: %+v", got)
	}
	// Deleting an unknown token is a no-op success.
	if err := s.DeleteSession(ctx, "never-existed"); err != nil {
		t.Errorf("DeleteSession(unknown) = %v, want nil", err)
	}
}

// TestBurnNonceSingleUse: the first burn wins, the second reports already-used.
func TestBurnNonceSingleUse(t *testing.T) {
	s := openTestStore(t)
	ctx := context.Background()
	fresh, err := s.BurnNonce(ctx, "nonce-1")
	if err != nil {
		t.Fatalf("BurnNonce: %v", err)
	}
	if !fresh {
		t.Fatal("first BurnNonce = false, want true (first use wins)")
	}
	fresh, err = s.BurnNonce(ctx, "nonce-1")
	if err != nil {
		t.Fatalf("BurnNonce (again): %v", err)
	}
	if fresh {
		t.Fatal("second BurnNonce = true, want false (already used)")
	}
}

// TestBurnNonceRace: many goroutines burn the same nonce concurrently; exactly
// one must win. This is the load-bearing single-use guarantee for magic links.
func TestBurnNonceRace(t *testing.T) {
	s := openTestStore(t)
	ctx := context.Background()
	const n = 32
	var wins int64
	var wg sync.WaitGroup
	start := make(chan struct{})
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			<-start
			fresh, err := s.BurnNonce(ctx, "hot-nonce")
			if err != nil {
				t.Errorf("BurnNonce: %v", err)
				return
			}
			if fresh {
				atomic.AddInt64(&wins, 1)
			}
		}()
	}
	close(start)
	wg.Wait()
	if wins != 1 {
		t.Fatalf("concurrent burns won %d times, want exactly 1", wins)
	}
}

// TestRateLimit: allows up to the limit within the window, then rejects.
func TestRateLimit(t *testing.T) {
	s := openTestStore(t)
	ctx := context.Background()
	const bucket = "email:student@example.com"
	for i := 0; i < 3; i++ {
		ok, err := s.AllowLoginRequest(ctx, bucket, 3, 15*time.Minute)
		if err != nil {
			t.Fatalf("AllowLoginRequest: %v", err)
		}
		if !ok {
			t.Fatalf("request %d rejected, want allowed (under the limit of 3)", i+1)
		}
	}
	ok, err := s.AllowLoginRequest(ctx, bucket, 3, 15*time.Minute)
	if err != nil {
		t.Fatalf("AllowLoginRequest: %v", err)
	}
	if ok {
		t.Fatal("4th request allowed, want rejected (over the limit)")
	}
	// A different bucket is independent.
	if ok, err := s.AllowLoginRequest(ctx, "email:other@example.com", 3, 15*time.Minute); err != nil || !ok {
		t.Errorf("independent bucket rejected (ok=%v err=%v)", ok, err)
	}
}

// TestPhotoInsertAndList exercises photo persistence + listing with the exact
// response fields.
func TestPhotoInsertAndList(t *testing.T) {
	s := openTestStore(t)
	ctx := context.Background()
	row := photos.Record{
		UUID:             "11111111-1111-1111-1111-111111111111",
		Path:             "production/photos/hu-4/week-2/user@example.com.jpg",
		EmailAddress:     "user@example.com",
		OriginalFileName: "Lyány.jpg",
		Title:            "Lyány", // decoded UTF-8, not percent-encoded
		ContentType:      "image/jpeg",
		SizeInBytes:      1024,
		LastModified:     time.Date(2021, 3, 1, 12, 0, 0, 0, time.UTC),
	}
	if err := s.InsertPhoto(ctx, row); err != nil {
		t.Fatalf("InsertPhoto: %v", err)
	}

	list, err := s.ListPhotosForWeek(ctx, photos.ListParams{
		Environment: "production",
		CourseName:  "hu-4",
		WeekIndex:   2,
		GetDetails:  true,
	})
	if err != nil {
		t.Fatalf("ListPhotosForWeek: %v", err)
	}
	if len(list) != 1 {
		t.Fatalf("ListPhotosForWeek returned %d photos, want 1", len(list))
	}
	got := list[0]
	if got.Key != row.Path {
		t.Errorf("Key = %q, want %q", got.Key, row.Path)
	}
	if got.EmailAddress != row.EmailAddress {
		t.Errorf("EmailAddress = %q, want %q", got.EmailAddress, row.EmailAddress)
	}
	if got.Title != "Lyány" {
		t.Errorf("Title = %q, want decoded %q", got.Title, "Lyány")
	}
	if got.ContentType != "image/jpeg" {
		t.Errorf("ContentType = %q, want image/jpeg", got.ContentType)
	}
	if got.SizeInBytes != 1024 {
		t.Errorf("SizeInBytes = %d, want 1024", got.SizeInBytes)
	}
}
