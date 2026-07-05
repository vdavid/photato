// Package magiclink mints and verifies the single-use, HMAC-signed tokens that
// back passwordless email login. A token carries an email address, an expiry,
// and a random nonce, signed with a server secret (AUTH_LINK_SECRET). It is
// self-contained: verification needs only the secret, no server-side lookup of
// the token itself. Single-use is enforced separately by burning the nonce in
// the database at verify time (see the store), so this package stays pure and
// dependency-free.
package magiclink

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"
)

// Token errors. Callers map all of them to a 401 without leaking which failed,
// so a tampered, malformed, or expired token is indistinguishable to a client.
var (
	// ErrMalformed means the token is not well-formed (bad structure or base64).
	ErrMalformed = errors.New("magiclink: malformed token")
	// ErrBadSignature means the HMAC signature does not match the payload.
	ErrBadSignature = errors.New("magiclink: bad signature")
	// ErrExpired means the token's expiry is in the past.
	ErrExpired = errors.New("magiclink: token expired")
)

// payload is the JSON body carried inside a token (before signing).
type payload struct {
	Email     string `json:"email"`
	ExpiresAt int64  `json:"exp"` // Unix seconds
	Nonce     string `json:"nonce"`
}

// Claims is the verified content of a token.
type Claims struct {
	Email     string
	ExpiresAt time.Time
	Nonce     string
}

// Sign mints a token for email that expires ttl from now, returning the token
// string and the nonce embedded in it (the caller records the nonce to enforce
// single-use). The token format is base64url(payload) + "." + base64url(hmac),
// where the HMAC is computed over the payload segment.
func Sign(secret []byte, email string, ttl time.Duration) (token string, nonce string, err error) {
	nonce, err = randomNonce()
	if err != nil {
		return "", "", err
	}
	body, err := json.Marshal(payload{
		Email:     email,
		ExpiresAt: time.Now().Add(ttl).Unix(),
		Nonce:     nonce,
	})
	if err != nil {
		return "", "", err
	}
	payloadSeg := base64.RawURLEncoding.EncodeToString(body)
	sigSeg := base64.RawURLEncoding.EncodeToString(sign(secret, payloadSeg))
	return payloadSeg + "." + sigSeg, nonce, nil
}

// Verify checks a token's structure, signature, and expiry against secret and
// returns its claims. It does NOT enforce single-use — the caller burns the
// nonce. A nil/empty secret always fails (ErrBadSignature), so a misconfigured
// server never accepts tokens.
func Verify(secret []byte, token string) (Claims, error) {
	if len(secret) == 0 {
		return Claims{}, ErrBadSignature
	}
	payloadSeg, sigSeg, ok := strings.Cut(token, ".")
	if !ok || payloadSeg == "" || sigSeg == "" {
		return Claims{}, ErrMalformed
	}
	gotSig, err := base64.RawURLEncoding.DecodeString(sigSeg)
	if err != nil {
		return Claims{}, ErrMalformed
	}
	// Constant-time signature comparison over the payload segment.
	if !hmac.Equal(gotSig, sign(secret, payloadSeg)) {
		return Claims{}, ErrBadSignature
	}
	body, err := base64.RawURLEncoding.DecodeString(payloadSeg)
	if err != nil {
		return Claims{}, ErrMalformed
	}
	var p payload
	if err := json.Unmarshal(body, &p); err != nil {
		return Claims{}, ErrMalformed
	}
	if p.Email == "" || p.Nonce == "" {
		return Claims{}, ErrMalformed
	}
	exp := time.Unix(p.ExpiresAt, 0)
	if time.Now().After(exp) {
		return Claims{}, ErrExpired
	}
	return Claims{Email: p.Email, ExpiresAt: exp, Nonce: p.Nonce}, nil
}

// sign returns the raw HMAC-SHA256 of msg under secret.
func sign(secret []byte, msg string) []byte {
	mac := hmac.New(sha256.New, secret)
	mac.Write([]byte(msg))
	return mac.Sum(nil)
}

// randomNonce returns a 128-bit hex-encoded random string.
func randomNonce() (string, error) {
	var b [16]byte
	if _, err := rand.Read(b[:]); err != nil {
		return "", fmt.Errorf("magiclink: read random: %w", err)
	}
	return hex.EncodeToString(b[:]), nil
}
