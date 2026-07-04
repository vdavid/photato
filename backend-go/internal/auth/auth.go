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
	"errors"
	"net/http"
)

var errNotImplemented = errors.New("auth: not implemented")

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
	// Skeleton: the cache-then-Auth0 upsert flow lands in phase 3b.
	return nil, errNotImplemented
}

// IsAdmin reports whether email is in the admin allowlist.
func IsAdmin(email string, adminEmails []string) bool {
	// Skeleton: allowlist check lands in phase 3b.
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
	// Skeleton: real HTTP call + JSON parse lands in phase 3b.
	return nil, errNotImplemented
}
