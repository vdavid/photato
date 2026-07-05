// Package auth resolves an opaque session token (a Bearer token minted by the
// magic-link login flow) to a Photato user.
//
// The flow is a pure local lookup: the token is matched against the SQLite
// `sessions` table; a live (non-expired) session yields its user, anything else
// yields no user (401 upstream). There is no external identity provider — login
// happens over email magic links (see internal/magiclink and the /auth/* HTTP
// handlers), which create the sessions this package reads. Admin status is
// derived from a configured allowlist of email addresses, authoritative at
// lookup time.
package auth

import (
	"context"
	"strings"
)

// User is an authenticated Photato user.
type User struct {
	EmailAddress string
	IsAdmin      bool
}

// UserStore is the session lookup the authenticator needs. The SQLite store
// implements it; tests use a hand-rolled spy.
type UserStore interface {
	// UserBySessionToken returns the user with a live session for token, or nil.
	UserBySessionToken(ctx context.Context, token string) (*User, error)
}

// Authenticator resolves session tokens to users.
type Authenticator struct {
	users       UserStore
	adminEmails []string
}

// NewAuthenticator wires an Authenticator.
func NewAuthenticator(users UserStore, adminEmails []string) *Authenticator {
	return &Authenticator{users: users, adminEmails: adminEmails}
}

// AuthenticateBySessionToken resolves token to a user, or (nil, nil) when the
// token has no live session. Admin status is recomputed from the allowlist so
// it stays authoritative.
func (a *Authenticator) AuthenticateBySessionToken(ctx context.Context, token string) (*User, error) {
	user, err := a.users.UserBySessionToken(ctx, token)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, nil
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
