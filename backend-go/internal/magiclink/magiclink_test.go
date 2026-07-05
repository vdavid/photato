package magiclink

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
	"testing"
	"time"
)

var secret = []byte("test-secret-do-not-use-in-prod")

func TestSignVerifyRoundTrip(t *testing.T) {
	token, nonce, err := Sign(secret, "user@example.com", 15*time.Minute)
	if err != nil {
		t.Fatalf("Sign: %v", err)
	}
	if nonce == "" {
		t.Fatal("Sign returned an empty nonce")
	}
	claims, err := Verify(secret, token)
	if err != nil {
		t.Fatalf("Verify: %v", err)
	}
	if claims.Email != "user@example.com" {
		t.Errorf("Email = %q, want user@example.com", claims.Email)
	}
	if claims.Nonce != nonce {
		t.Errorf("Nonce = %q, want %q (the nonce Sign returned)", claims.Nonce, nonce)
	}
	if time.Until(claims.ExpiresAt) <= 0 {
		t.Errorf("ExpiresAt = %v, want a future time", claims.ExpiresAt)
	}
}

// TestVerifyRejectsTamperedPayload: flipping the email in the payload must break
// the signature (the whole point of signing).
func TestVerifyRejectsTamperedPayload(t *testing.T) {
	token, _, err := Sign(secret, "user@example.com", 15*time.Minute)
	if err != nil {
		t.Fatalf("Sign: %v", err)
	}
	payloadSeg, sigSeg, _ := strings.Cut(token, ".")
	body, _ := base64.RawURLEncoding.DecodeString(payloadSeg)
	var p payload
	_ = json.Unmarshal(body, &p)
	p.Email = "attacker@evil.com"
	tampered, _ := json.Marshal(p)
	forged := base64.RawURLEncoding.EncodeToString(tampered) + "." + sigSeg

	_, err = Verify(secret, forged)
	if !errors.Is(err, ErrBadSignature) {
		t.Fatalf("Verify(tampered) error = %v, want ErrBadSignature", err)
	}
}

// TestVerifyRejectsWrongSecret: a token signed with one secret must not verify
// under another.
func TestVerifyRejectsWrongSecret(t *testing.T) {
	token, _, err := Sign(secret, "user@example.com", 15*time.Minute)
	if err != nil {
		t.Fatalf("Sign: %v", err)
	}
	_, err = Verify([]byte("a-different-secret"), token)
	if !errors.Is(err, ErrBadSignature) {
		t.Fatalf("Verify(wrong secret) error = %v, want ErrBadSignature", err)
	}
}

// TestVerifyRejectsEmptySecret: a misconfigured server (no secret) must never
// accept a token.
func TestVerifyRejectsEmptySecret(t *testing.T) {
	token, _, _ := Sign(secret, "user@example.com", 15*time.Minute)
	if _, err := Verify(nil, token); !errors.Is(err, ErrBadSignature) {
		t.Fatalf("Verify(nil secret) error = %v, want ErrBadSignature", err)
	}
}

// TestVerifyRejectsExpired: a token past its expiry is rejected with ErrExpired.
func TestVerifyRejectsExpired(t *testing.T) {
	token, _, err := Sign(secret, "user@example.com", -1*time.Minute) // already expired
	if err != nil {
		t.Fatalf("Sign: %v", err)
	}
	_, err = Verify(secret, token)
	if !errors.Is(err, ErrExpired) {
		t.Fatalf("Verify(expired) error = %v, want ErrExpired", err)
	}
}

func TestVerifyRejectsMalformed(t *testing.T) {
	cases := []string{"", "no-dot", ".", "a.", ".b", "!!!.###", "onlyonesegment"}
	for _, tok := range cases {
		if _, err := Verify(secret, tok); err == nil {
			t.Errorf("Verify(%q) = nil error, want a rejection", tok)
		}
	}
}

// TestNoncesAreUnique: each Sign call mints a fresh nonce (single-use relies on
// this to key the burn).
func TestNoncesAreUnique(t *testing.T) {
	seen := map[string]bool{}
	for i := 0; i < 100; i++ {
		_, nonce, err := Sign(secret, "user@example.com", time.Minute)
		if err != nil {
			t.Fatalf("Sign: %v", err)
		}
		if seen[nonce] {
			t.Fatalf("duplicate nonce %q", nonce)
		}
		seen[nonce] = true
	}
}
