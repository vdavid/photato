// Command server is the Photato Go backend entrypoint. It wires the SQLite
// store, the Auth0 authenticator, and the domain repositories into the HTTP
// API, then listens.
//
// Configuration comes from the environment (with development-friendly
// defaults). The deployed backend listens on :9003 behind Caddy (see
// docs/revival-plan.md).
package main

import (
	"log"
	"net/http"
	"os"
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

	st, err := store.Open(cfg.dbPath, cfg.adminEmails)
	if err != nil {
		log.Fatalf("open store: %v", err)
	}
	defer st.Close()

	authenticator := auth.NewAuthenticator(
		auth.NewAuth0HTTPClient(cfg.auth0UserInfoEndpoint),
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
	})

	log.Printf("Photato backend %s listening on %s", version, cfg.listenAddr)
	if err := http.ListenAndServe(cfg.listenAddr, server.Handler()); err != nil {
		log.Fatalf("server stopped: %v", err)
	}
}

type config struct {
	listenAddr            string
	dbPath                string
	baseURL               string
	auth0UserInfoEndpoint string
	adminEmails           []string
}

func loadConfig() config {
	return config{
		listenAddr:            env("PHOTATO_LISTEN_ADDR", ":9003"),
		dbPath:                env("PHOTATO_DB_PATH", "photato.db"),
		baseURL:               env("PHOTATO_BASE_URL", "http://localhost:9003"),
		auth0UserInfoEndpoint: env("PHOTATO_AUTH0_USERINFO", "https://photato.eu.auth0.com/userinfo"),
		adminEmails:           splitNonEmpty(env("PHOTATO_ADMIN_EMAILS", "veszelovszki@gmail.com,dorah.nemeth@gmail.com")),
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
