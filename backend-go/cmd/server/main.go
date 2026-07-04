// Command server is the Photato Go backend entrypoint. It wires the SQLite
// store, the Auth0 authenticator, and the domain repositories into the HTTP
// API, then listens.
//
// Configuration comes entirely from environment variables (documented in
// backend-go/README.md). The deployed backend sits behind Caddy on the Hetzner
// box (see docs/revival-plan.md).
package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/vdavid/photato/backend-go/internal/auth"
	"github.com/vdavid/photato/backend-go/internal/httpapi"
	"github.com/vdavid/photato/backend-go/internal/messages"
	"github.com/vdavid/photato/backend-go/internal/signing"
	"github.com/vdavid/photato/backend-go/internal/store"
)

// Compile-time proof the SQLite store satisfies every persistence interface the
// higher layers expect. If a store method signature drifts, the build breaks
// here at the wiring seam.
var (
	_ httpapi.PhotoRepo = (*store.Store)(nil)
	_ auth.UserStore    = (*store.Store)(nil)
	_ signing.Store     = (*store.Store)(nil)
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

	authenticator := auth.NewAuthenticator(
		auth.NewAuth0HTTPClient(cfg.auth0UserInfoURL),
		st,
		cfg.adminEmails,
	)

	server := httpapi.NewServer(httpapi.Deps{
		Authenticator: authenticator,
		AdminEmails:   cfg.adminEmails,
		Signatures:    signing.NewRepository(st),
		Messages:      messages.NewRepository(),
		Photos:        st,
		Version:       version,
		BaseURL:       cfg.baseURL,
		PhotosDir:     cfg.photosDir,
	})

	log.Printf("Photato backend %s listening on %s (data dir %s)", version, cfg.listenAddr, cfg.dataDir)
	if err := http.ListenAndServe(cfg.listenAddr, server.Handler()); err != nil {
		log.Fatalf("server stopped: %v", err)
	}
}

type config struct {
	listenAddr       string
	dataDir          string
	dbPath           string
	photosDir        string
	baseURL          string
	auth0UserInfoURL string
	adminEmails      []string
}

func loadConfig() config {
	// Default dev port is a random high port (per the no-standard-ports rule);
	// the deploy sits behind Caddy which owns the public 443.
	port := env("PORT", "19003")
	dataDir := env("DATA_DIR", "./data")
	return config{
		listenAddr:       ":" + port,
		dataDir:          dataDir,
		dbPath:           filepath.Join(dataDir, "photato.db"),
		photosDir:        filepath.Join(dataDir, "photos"),
		baseURL:          env("BASE_URL", "http://localhost:"+port),
		auth0UserInfoURL: env("AUTH0_USERINFO_URL", "https://photato.eu.auth0.com/userinfo"),
		adminEmails:      splitNonEmpty(env("ADMIN_EMAILS", "veszelovszki@gmail.com,dorah.nemeth@gmail.com")),
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
