// Command server is the Photato Go backend entrypoint. It wires the SQLite
// store, the session authenticator, the magic-link login flow, and the domain
// repositories into the HTTP API, then listens.
//
// Configuration comes entirely from environment variables (documented in
// backend-go/CLAUDE.md). The deployed backend sits behind Caddy on the Hetzner
// box (see infra/CLAUDE.md).
package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/vdavid/photato/backend-go/internal/auth"
	"github.com/vdavid/photato/backend-go/internal/email"
	"github.com/vdavid/photato/backend-go/internal/httpapi"
	"github.com/vdavid/photato/backend-go/internal/messages"
	"github.com/vdavid/photato/backend-go/internal/signing"
	"github.com/vdavid/photato/backend-go/internal/store"
)

// Compile-time proof the SQLite store satisfies every persistence interface the
// higher layers expect. If a store method signature drifts, the build breaks
// here at the wiring seam.
var (
	_ httpapi.PhotoRepo  = (*store.Store)(nil)
	_ httpapi.LoginStore = (*store.Store)(nil)
	_ auth.UserStore     = (*store.Store)(nil)
	_ signing.Store      = (*store.Store)(nil)
)

// version is overridable at build time via -ldflags "-X main.version=...".
var version = "dev"

func main() {
	cfg := loadConfig()

	if err := os.MkdirAll(cfg.photosDir, 0o755); err != nil {
		log.Fatalf("create photos dir %q: %v", cfg.photosDir, err)
	}

	st, err := store.Open(cfg.dbPath, cfg.adminEmails)
	if err != nil {
		log.Fatalf("open store: %v", err)
	}
	defer st.Close()

	authenticator := auth.NewAuthenticator(st, cfg.adminEmails)

	var sender email.Sender
	if cfg.smtpHost != "" && cfg.smtpFrom != "" {
		sender = email.SMTPSender{
			Host:     cfg.smtpHost,
			Port:     cfg.smtpPort,
			Username: cfg.smtpUsername,
			Password: cfg.smtpPassword,
			From:     cfg.smtpFrom,
			FromName: cfg.smtpFromName,
		}
	} else {
		log.Printf("WARNING: SMTP not configured (SMTP_HOST/SMTP_FROM_ADDRESS unset) — magic-link emails will not be sent")
	}
	if len(cfg.linkSecret) == 0 {
		log.Printf("WARNING: AUTH_LINK_SECRET unset — magic-link login is disabled")
	}
	if cfg.testLoginSecret != "" {
		log.Printf("NOTE: TEST_LOGIN_SECRET set — the /auth/test-login e2e backdoor is ENABLED")
	}

	server := httpapi.NewServer(httpapi.Deps{
		Authenticator:   authenticator,
		Login:           st,
		Email:           sender,
		AdminEmails:     cfg.adminEmails,
		Signatures:      signing.NewRepository(st),
		Messages:        messages.NewRepository(),
		Photos:          st,
		Version:         version,
		BaseURL:         cfg.baseURL,
		PhotosDir:       cfg.photosDir,
		LinkSecret:      cfg.linkSecret,
		FrontendBaseURL: cfg.frontendBaseURL,
		TestLoginSecret: cfg.testLoginSecret,
	})

	log.Printf("Photato backend %s listening on %s (data dir %s)", version, cfg.listenAddr, cfg.dataDir)
	if err := http.ListenAndServe(cfg.listenAddr, server.Handler()); err != nil {
		log.Fatalf("server stopped: %v", err)
	}
}

type config struct {
	listenAddr      string
	dataDir         string
	dbPath          string
	photosDir       string
	baseURL         string
	adminEmails     []string
	linkSecret      []byte
	frontendBaseURL string
	testLoginSecret string
	smtpHost        string
	smtpPort        string
	smtpUsername    string
	smtpPassword    string
	smtpFrom        string
	smtpFromName    string
}

func loadConfig() config {
	// Default dev port is a random high port (per the no-standard-ports rule);
	// the deploy sits behind Caddy which owns the public 443.
	port := env("PORT", "19003")
	dataDir := env("DATA_DIR", "./data")
	return config{
		listenAddr:      ":" + port,
		dataDir:         dataDir,
		dbPath:          filepath.Join(dataDir, "photato.db"),
		photosDir:       filepath.Join(dataDir, "photos"),
		baseURL:         env("BASE_URL", "http://localhost:"+port),
		adminEmails:     splitNonEmpty(env("ADMIN_EMAILS", "veszelovszki@gmail.com,dorah.nemeth@gmail.com")),
		linkSecret:      []byte(os.Getenv("AUTH_LINK_SECRET")),
		frontendBaseURL: env("FRONTEND_BASE_URL", "https://photato.eu"),
		testLoginSecret: os.Getenv("TEST_LOGIN_SECRET"),
		smtpHost:        os.Getenv("SMTP_HOST"),
		smtpPort:        env("SMTP_PORT", "587"),
		smtpUsername:    os.Getenv("SMTP_USERNAME"),
		smtpPassword:    os.Getenv("SMTP_PASSWORD"),
		smtpFrom:        os.Getenv("SMTP_FROM_ADDRESS"),
		smtpFromName:    env("SMTP_FROM_NAME", "Photato"),
	}
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func splitNonEmpty(s string) []string {
	var out []string
	for _, part := range strings.Split(s, ",") {
		if p := strings.TrimSpace(part); p != "" {
			out = append(out, p)
		}
	}
	return out
}
