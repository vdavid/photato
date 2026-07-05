package auth

import (
	"context"
	"errors"
	"testing"
)

const (
	adminEmail = "veszelovszki@gmail.com"
	userEmail  = "student@example.com"
)

// spyUserStore answers session lookups for two known tokens and can be made to
// fail, mirroring the hand-rolled fakes elsewhere in the suite.
type spyUserStore struct {
	calls   int
	failErr error
}

func (s *spyUserStore) UserBySessionToken(ctx context.Context, token string) (*User, error) {
	s.calls++
	if s.failErr != nil {
		return nil, s.failErr
	}
	switch token {
	case "admin-session":
		return &User{EmailAddress: adminEmail}, nil
	case "user-session":
		return &User{EmailAddress: userEmail}, nil
	default:
		return nil, nil // no live session
	}
}

func newAuthenticator() (*spyUserStore, *Authenticator) {
	us := &spyUserStore{}
	return us, NewAuthenticator(us, []string{adminEmail})
}

// TestResolvesAdminSession: a live session for an allowlisted email resolves to
// an admin user.
func TestResolvesAdminSession(t *testing.T) {
	us, auth := newAuthenticator()
	user, err := auth.AuthenticateBySessionToken(context.Background(), "admin-session")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if user == nil || user.EmailAddress != adminEmail {
		t.Fatalf("user = %+v, want email %s", user, adminEmail)
	}
	if !user.IsAdmin {
		t.Errorf("IsAdmin = false for an allowlisted email, want true")
	}
	if us.calls != 1 {
		t.Errorf("store lookups = %d, want 1", us.calls)
	}
}

// TestResolvesNonAdminSession: a live session for a non-allowlisted email is a
// valid non-admin user.
func TestResolvesNonAdminSession(t *testing.T) {
	_, auth := newAuthenticator()
	user, err := auth.AuthenticateBySessionToken(context.Background(), "user-session")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if user == nil || user.EmailAddress != userEmail {
		t.Fatalf("user = %+v, want email %s", user, userEmail)
	}
	if user.IsAdmin {
		t.Errorf("IsAdmin = true for a non-allowlisted email, want false")
	}
}

// TestRejectsUnknownToken: no live session yields no user (401 upstream).
func TestRejectsUnknownToken(t *testing.T) {
	_, auth := newAuthenticator()
	user, err := auth.AuthenticateBySessionToken(context.Background(), "nope")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if user != nil {
		t.Fatalf("user = %+v, want nil for an unknown token", user)
	}
}

// TestPropagatesStoreError: a store failure surfaces (mapped to 500 upstream),
// not swallowed as "no user".
func TestPropagatesStoreError(t *testing.T) {
	us, auth := newAuthenticator()
	us.failErr = errors.New("db down")
	_, err := auth.AuthenticateBySessionToken(context.Background(), "admin-session")
	if err == nil {
		t.Fatal("expected the store error to propagate, got nil")
	}
}

func TestIsAdmin(t *testing.T) {
	admins := []string{"veszelovszki@gmail.com", "dorah.nemeth@gmail.com"}
	cases := []struct {
		email string
		want  bool
	}{
		{"veszelovszki@gmail.com", true},
		{"VESZELOVSZKI@gmail.com", true}, // case-insensitive
		{"dorah.nemeth@gmail.com", true},
		{"test@user.com", false},
		{"", false},
	}
	for _, c := range cases {
		if got := IsAdmin(c.email, admins); got != c.want {
			t.Errorf("IsAdmin(%q) = %v, want %v", c.email, got, c.want)
		}
	}
}
