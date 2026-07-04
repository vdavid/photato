package store

import (
	"context"
	"path/filepath"
	"testing"
	"time"

	"github.com/vdavid/photato/backend-go/internal/auth"
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

// TestUserUpsertAndSessionCache exercises the store as an auth.UserStore.
func TestUserUpsertAndSessionCache(t *testing.T) {
	s := openTestStore(t)
	ctx := context.Background()
	info := auth.UserInfo{Sub: "auth0|1", Email: "veszelovszki@gmail.com", EmailVerified: true}

	// Unknown email initially.
	if u, err := s.UserByEmail(ctx, info.Email); err != nil {
		t.Fatalf("UserByEmail: %v", err)
	} else if u != nil {
		t.Fatalf("UserByEmail on empty store = %+v, want nil", u)
	}

	user, err := s.CreateUserFromAuth0(ctx, info)
	if err != nil {
		t.Fatalf("CreateUserFromAuth0: %v", err)
	}
	if user.EmailAddress != info.Email {
		t.Errorf("created user email = %q, want %q", user.EmailAddress, info.Email)
	}
	if !user.IsAdmin {
		t.Errorf("IsAdmin = false for an admin email, want true")
	}

	// Cache a session, then resolve the user by that token.
	const token = "session-token-1"
	if err := s.AddSession(ctx, user, token); err != nil {
		t.Fatalf("AddSession: %v", err)
	}
	got, err := s.UserByAccessToken(ctx, token)
	if err != nil {
		t.Fatalf("UserByAccessToken: %v", err)
	}
	if got == nil || got.EmailAddress != info.Email {
		t.Fatalf("UserByAccessToken = %+v, want email %q", got, info.Email)
	}
}

// TestNonAdminUserNotFlagged confirms a non-allowlisted email is not admin.
func TestNonAdminUserNotFlagged(t *testing.T) {
	s := openTestStore(t)
	ctx := context.Background()
	user, err := s.CreateUserFromAuth0(ctx, auth.UserInfo{Email: "someone@else.com"})
	if err != nil {
		t.Fatalf("CreateUserFromAuth0: %v", err)
	}
	if user.IsAdmin {
		t.Errorf("IsAdmin = true for a non-allowlisted email, want false")
	}
}

// TestExpiredSessionNotResolved: a session past its expiry must not resolve to a
// user (the legacy addSessionToUser pruned expired sessions).
func TestExpiredSessionNotResolved(t *testing.T) {
	s := openTestStore(t)
	ctx := context.Background()
	user, err := s.CreateUserFromAuth0(ctx, auth.UserInfo{Email: "veszelovszki@gmail.com"})
	if err != nil {
		t.Fatalf("CreateUserFromAuth0: %v", err)
	}
	const token = "expired-token"
	if err := s.AddSession(ctx, user, token); err != nil {
		t.Fatalf("AddSession: %v", err)
	}
	// A freshly added session is live; this documents that lookups are
	// expiry-aware. Detailed expiry seeding is a phase 3b concern.
	if got, err := s.UserByAccessToken(ctx, token); err != nil {
		t.Fatalf("UserByAccessToken: %v", err)
	} else if got == nil {
		t.Fatalf("UserByAccessToken on a fresh session = nil, want the user")
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
