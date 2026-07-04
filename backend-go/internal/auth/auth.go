// Package auth ports the legacy authentication flow (Auth0AndMongoAuthorizer,
// AuthMiddleware, User, UserRepository).
//
// The flow: an incoming Bearer access token is first matched against a local
// session cache (SQLite `sessions`). On a hit the user is returned without
// contacting Auth0. On a miss the token is validated against the Auth0
// /userinfo endpoint; a valid token upserts the user (create or update) and
// caches a new session, an invalid token yields no user. Admin status is
// derived from a configured allowlist of email addresses.
package auth

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
)

// UserInfo is the subset of the Auth0 /userinfo profile the backend uses. The
// full schema (given_name, picture, locale, …) is ported in phase 3b; email is
// the load-bearing field.
type UserInfo struct {
	Sub           string `json:"sub"`
	Name          string `json:"name"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
}

// User is an authenticated Photato user.
type User struct {
	EmailAddress  string
	IsAdmin       bool
	Auth0UserInfo UserInfo
}

// Auth0Client validates access tokens against Auth0's /userinfo endpoint.
type Auth0Client interface {
	// GetUserInfo returns the profile for a valid token, or (nil, nil) if Auth0
	// rejects the token. A non-nil error signals a transport/parse failure.
	GetUserInfo(ctx context.Context, accessToken string) (*UserInfo, error)
}

// UserStore is the persistence the authenticator needs. The SQLite store
// implements it; tests use a hand-rolled spy.
type UserStore interface {
	// UserByAccessToken returns the user with a live session for token, or nil.
	UserByAccessToken(ctx context.Context, token string) (*User, error)
	// UserByEmail returns the user with the given email, or nil.
	UserByEmail(ctx context.Context, email string) (*User, error)
	// CreateUserFromAuth0 persists a new user built from an Auth0 profile.
	CreateUserFromAuth0(ctx context.Context, info UserInfo) (*User, error)
	// UpdateAuth0UserInfo refreshes the stored Auth0 profile for user.
	UpdateAuth0UserInfo(ctx context.Context, user *User, info UserInfo) error
	// AddSession caches token as a session for user and prunes expired sessions.
	AddSession(ctx context.Context, user *User, token string) error
}

// Authenticator resolves access tokens to users.
type Authenticator struct {
	auth0       Auth0Client
	users       UserStore
	adminEmails []string
}

// NewAuthenticator wires an Authenticator.
func NewAuthenticator(auth0 Auth0Client, users UserStore, adminEmails []string) *Authenticator {
	return &Authenticator{auth0: auth0, users: users, adminEmails: adminEmails}
}

// AuthenticateByAccessToken resolves token to a user. It returns (nil, nil)
// when the token is not recognized by either the local cache or Auth0 (the Go
// equivalent of the legacy "undefined" return).
func (a *Authenticator) AuthenticateByAccessToken(ctx context.Context, token string) (*User, error) {
	// 1. Local session cache: a hit skips Auth0 entirely.
	if user, err := a.users.UserByAccessToken(ctx, token); err != nil {
		return nil, err
	} else if user != nil {
		user.IsAdmin = IsAdmin(user.EmailAddress, a.adminEmails)
		return user, nil
	}

	// 2. Validate the token against Auth0. A nil profile means Auth0 rejected
	//    it (invalid token): no user, no writes.
	info, err := a.auth0.GetUserInfo(ctx, token)
	if err != nil {
		return nil, err
	}
	if info == nil {
		return nil, nil
	}

	// 3. Upsert the user by email (update if known, create if new).
	user, err := a.users.UserByEmail(ctx, info.Email)
	if err != nil {
		return nil, err
	}
	if user != nil {
		if err := a.users.UpdateAuth0UserInfo(ctx, user, *info); err != nil {
			return nil, err
		}
	} else {
		user, err = a.users.CreateUserFromAuth0(ctx, *info)
		if err != nil {
			return nil, err
		}
	}

	// 4. Cache a session so subsequent requests skip Auth0.
	if err := a.users.AddSession(ctx, user, token); err != nil {
		return nil, err
	}

	user.IsAdmin = IsAdmin(user.EmailAddress, a.adminEmails)
	return user, nil
}

// IsAdmin reports whether email is in the admin allowlist (case-insensitive).
func IsAdmin(email string, adminEmails []string) bool {
	if email == "" {
		return false
	}
	for _, admin := range adminEmails {
		if strings.EqualFold(email, admin) {
			return true
		}
	}
	return false
}

// Auth0HTTPClient is the real Auth0Client, calling the tenant's /userinfo
// endpoint.
type Auth0HTTPClient struct {
	UserInfoEndpoint string
	HTTPClient       *http.Client
}

// NewAuth0HTTPClient builds a client for the given /userinfo endpoint.
func NewAuth0HTTPClient(userInfoEndpoint string) *Auth0HTTPClient {
	return &Auth0HTTPClient{UserInfoEndpoint: userInfoEndpoint, HTTPClient: http.DefaultClient}
}

// GetUserInfo calls Auth0's /userinfo with a Bearer token. A 200 yields the
// parsed profile; any other status yields (nil, nil) (invalid token, not an
// error), matching the legacy Auth0Authorizer.
func (c *Auth0HTTPClient) GetUserInfo(ctx context.Context, accessToken string) (*UserInfo, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.UserInfoEndpoint, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	client := c.HTTPClient
	if client == nil {
		client = http.DefaultClient
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Any non-200 means Auth0 rejected the token: (nil, nil), not an error,
	// matching the legacy Auth0Authorizer.
	if resp.StatusCode != http.StatusOK {
		return nil, nil
	}

	var info UserInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, err
	}
	return &info, nil
}
