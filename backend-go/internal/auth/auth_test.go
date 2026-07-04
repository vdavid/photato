package auth

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
)

const (
	user1Email            = "veszelovszki@gmail.com"
	user2Email            = "otheruser@gmail.com"
	user1LocalAccessToken = "user1-local"
	user1Auth0AccessToken = "user1-auth0"
	user2Auth0AccessToken = "user2-auth0"
)

// spyAuth0 records how many times GetUserInfo was called and answers for the
// two known Auth0 tokens (mirrors the jest.fn in the legacy suite).
type spyAuth0 struct {
	calls int
}

func (s *spyAuth0) GetUserInfo(ctx context.Context, token string) (*UserInfo, error) {
	s.calls++
	switch token {
	case user1Auth0AccessToken:
		return &UserInfo{Email: user1Email}, nil
	case user2Auth0AccessToken:
		return &UserInfo{Email: user2Email}, nil
	default:
		return nil, nil // Auth0 rejects the token.
	}
}

// spyUserStore records call counts per method, matching the legacy
// userRepository jest mock.
type spyUserStore struct {
	byToken, byEmail, create, update, addSession int
}

func (s *spyUserStore) UserByAccessToken(ctx context.Context, token string) (*User, error) {
	s.byToken++
	if token == user1LocalAccessToken {
		return &User{EmailAddress: user1Email}, nil
	}
	return nil, nil
}

func (s *spyUserStore) UserByEmail(ctx context.Context, email string) (*User, error) {
	s.byEmail++
	if email == user1Email {
		return &User{EmailAddress: user1Email}, nil
	}
	return nil, nil
}

func (s *spyUserStore) CreateUserFromAuth0(ctx context.Context, info UserInfo) (*User, error) {
	s.create++
	return &User{EmailAddress: info.Email}, nil
}

func (s *spyUserStore) UpdateAuth0UserInfo(ctx context.Context, user *User, info UserInfo) error {
	s.update++
	return nil
}

func (s *spyUserStore) AddSession(ctx context.Context, user *User, token string) error {
	s.addSession++
	return nil
}

func newAuthenticator() (*spyAuth0, *spyUserStore, *Authenticator) {
	a0 := &spyAuth0{}
	us := &spyUserStore{}
	return a0, us, NewAuthenticator(a0, us, []string{user1Email})
}

// TestAcceptsLocalSessionToken: a cached session skips Auth0 entirely.
func TestAcceptsLocalSessionToken(t *testing.T) {
	a0, _, auth := newAuthenticator()
	user, err := auth.AuthenticateByAccessToken(context.Background(), user1LocalAccessToken)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if user == nil || user.EmailAddress != user1Email {
		t.Fatalf("user = %+v, want email %s", user, user1Email)
	}
	if a0.calls != 0 {
		t.Errorf("Auth0 called %d times for a cached session, want 0", a0.calls)
	}
}

// TestAcceptsAuth0TokenAndUpdatesExistingUser: unknown session, known email.
func TestAcceptsAuth0TokenAndUpdatesExistingUser(t *testing.T) {
	a0, us, auth := newAuthenticator()
	user, err := auth.AuthenticateByAccessToken(context.Background(), user1Auth0AccessToken)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if user == nil || user.EmailAddress != user1Email {
		t.Fatalf("user = %+v, want email %s", user, user1Email)
	}
	if a0.calls != 1 {
		t.Errorf("Auth0 calls = %d, want 1", a0.calls)
	}
	if us.byEmail != 1 {
		t.Errorf("UserByEmail calls = %d, want 1", us.byEmail)
	}
	if us.update != 1 {
		t.Errorf("UpdateAuth0UserInfo calls = %d, want 1", us.update)
	}
	if us.create != 0 {
		t.Errorf("CreateUserFromAuth0 calls = %d, want 0", us.create)
	}
	if us.addSession != 1 {
		t.Errorf("AddSession calls = %d, want 1", us.addSession)
	}
}

// TestAcceptsAuth0TokenAndCreatesNewUser: unknown session, unknown email.
func TestAcceptsAuth0TokenAndCreatesNewUser(t *testing.T) {
	a0, us, auth := newAuthenticator()
	user, err := auth.AuthenticateByAccessToken(context.Background(), user2Auth0AccessToken)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if user == nil || user.EmailAddress != user2Email {
		t.Fatalf("user = %+v, want email %s", user, user2Email)
	}
	if a0.calls != 1 {
		t.Errorf("Auth0 calls = %d, want 1", a0.calls)
	}
	if us.byEmail != 1 {
		t.Errorf("UserByEmail calls = %d, want 1", us.byEmail)
	}
	if us.update != 0 {
		t.Errorf("UpdateAuth0UserInfo calls = %d, want 0", us.update)
	}
	if us.create != 1 {
		t.Errorf("CreateUserFromAuth0 calls = %d, want 1", us.create)
	}
	if us.addSession != 1 {
		t.Errorf("AddSession calls = %d, want 1", us.addSession)
	}
}

// TestRejectsInvalidToken: Auth0 rejects, so no user and no writes.
func TestRejectsInvalidToken(t *testing.T) {
	a0, us, auth := newAuthenticator()
	user, err := auth.AuthenticateByAccessToken(context.Background(), "9876")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if user != nil {
		t.Fatalf("user = %+v, want nil for an invalid token", user)
	}
	if a0.calls != 1 {
		t.Errorf("Auth0 calls = %d, want 1", a0.calls)
	}
	if us.byEmail != 0 || us.update != 0 || us.create != 0 || us.addSession != 0 {
		t.Errorf("no user writes expected for invalid token, got byEmail=%d update=%d create=%d addSession=%d",
			us.byEmail, us.update, us.create, us.addSession)
	}
}

func TestIsAdmin(t *testing.T) {
	admins := []string{"veszelovszki@gmail.com", "dorah.nemeth@gmail.com"}
	cases := []struct {
		email string
		want  bool
	}{
		{"veszelovszki@gmail.com", true},
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

// TestAuth0HTTPClientParsesUserInfo drives the real client against a mocked
// /userinfo endpoint: a 200 returns the parsed profile and the request must
// carry the Bearer token.
func TestAuth0HTTPClientParsesUserInfo(t *testing.T) {
	const token = "good-token"
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if got := r.Header.Get("Authorization"); got != "Bearer "+token {
			t.Errorf("Authorization header = %q, want %q", got, "Bearer "+token)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"sub":"auth0|1","email":"jane@example.com","email_verified":true}`))
	}))
	defer srv.Close()

	client := NewAuth0HTTPClient(srv.URL)
	info, err := client.GetUserInfo(context.Background(), token)
	if err != nil {
		t.Fatalf("GetUserInfo: unexpected error: %v", err)
	}
	if info == nil || info.Email != "jane@example.com" {
		t.Fatalf("info = %+v, want email jane@example.com", info)
	}
}

// TestAuth0HTTPClientRejectsBadToken: a non-200 means invalid token, surfaced
// as (nil, nil) rather than an error.
func TestAuth0HTTPClientRejectsBadToken(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusUnauthorized)
	}))
	defer srv.Close()

	client := NewAuth0HTTPClient(srv.URL)
	info, err := client.GetUserInfo(context.Background(), "bad-token")
	if err != nil {
		t.Fatalf("GetUserInfo: unexpected error: %v", err)
	}
	if info != nil {
		t.Fatalf("info = %+v, want nil for a rejected token", info)
	}
}
