# Photato revival plan

Migrating Photato off its dead AWS/Mongo stack onto a single Go + SQLite binary on David's Hetzner box, then modernizing the frontend. This doc holds the phase plan plus the hard-won facts later phases depend on. Read the relevant section before starting a phase.

## Phases

- Phase 0 — salvage (DONE): pulled all S3 objects + metadata down to the Hetzner volume, MD5-verified.
- Phase 1 — monorepo (DONE): merged the two legacy repos into this one with full history, pushed to GitHub.
- Phase 2 — Playwright baseline (DONE): E2E flows + Linux pixel screenshots against live photato.eu, so the rewrite has a behavioral reference. Suite in `e2e/` (Docker-run, target-switchable via `BASE_URL` / `LEGACY_BACKEND_DEAD`). See `e2e/README.md`.
- Phase 3a — Go tests (TDD red) (DONE): ported the old Jest suite to Go tests + golden vectors in `backend-go/`; they fail with `not implemented` (red). Intentional divergences captured in `docs/backend-go-divergences.md`.
- Phase 3b — Go backend impl (DONE): implemented the backend (SQLite store, auth, signing, photos, messages, HTTP API) — `go test ./...` and `go test -race ./...` are green. See `backend-go/README.md` for run/config and the "New backend decisions" section below for the storage-layout and photo-serving choices.
- Phase 3c — data-migration tool (DONE): `backend-go/cmd/migrate` transforms the salvaged S3 layout into the app's photo layout + SQLite rows. Hardlinks (never copies) each file so it costs ~zero bytes and keeps the salvage pristine; idempotent; `--dry-run` and `--verify` (recount + sample MD5) modes. See `backend-go/README.md` "Data migration (phase 3c)" for the exact box command. Photos → `DATA_DIR/photos/<key>` + one `photos` row each; external-articles → `DATA_DIR/external-articles/` (static, outside the admin-gated photos tree — Phase 4 serves it via Caddy, Phase 5 repoints `thirdPartyArticlesBaseUrl` there).
- Phase 4 — deploy (DONE): backend live at `https://api.photato.eu` on the Hetzner box — Docker (image built on the box) + Caddy + GitHub Actions webhook autodeploy. See the "Phase 4 deploy" section below for the layout, ports, and runbook. The live FE at photato.eu (Netlify) is untouched; cutover is Phase 5.
- Phase 5 — frontend on Vite: build with Vite, repoint API to api.photato.eu, serve via Caddy, cut over DNS.
- Phase 5b — frontend TypeScript migration.
- Phase 6 — backups: SQLite `VACUUM INTO` snapshot + photos dir into the NAS (naspolya) flow.

## Salvage facts (Phase 0 output)

All salvaged data lives at `/mnt/HC_Volume_105883537/photato/` on the Hetzner box:

- `s3/{production,external-articles,development,staging}/`: 1392 files, 2,944,600,648 bytes total, all MD5-verified against their S3 ETags.
- `metadata.json`: JSON-lines, UTF-8. One line per object with: `key`, `size`, `etag`, `last_modified`, `content_type`, `metadata` (the S3 custom-metadata object).
- `inventory-raw.json`: raw S3 inventory.
- `SALVAGE-REPORT.md`, `README.md`: describe the salvage.

**CRITICAL metadata gotcha:** every S3 custom-metadata VALUE (`title`, `original-file-name`, `email-address`) is percent-encoded UTF-8. The migration tool MUST urldecode them. Example: stored `title` `Ly%C3%A1ny` decodes to `Lyány`.

- Only the 642 photo objects carry the 4 custom keys: `uuid`, `original-file-name`, `email-address`, `title` (`title` is sometimes empty). `external-articles` files have empty metadata by design.
- `etag` equals the plain MD5 for every file (no multipart uploads), so ETag == content MD5 is a safe integrity check.

## Old API contract (from `frontend/src/config.mjs`)

Endpoints (all reads Bearer-authed via Auth0):

- `GET /version`
- `GET /messages/get-all-messages`
- `GET /photos/list-for-week` — query: `environment`, `courseName`, `weekIndex`, `getDetails`. Returns `S3PhotoMetadata[]`, each: `key`, `fileName`, `url`, `emailAddress`, `title`, `contentType`, `sizeInBytes`, `lastModifiedDate`.
- `GET /get-signed-url` — query params + Bearer. Returns a URL the frontend then PUTs the file to.

Upload constraints: `image/jpeg` only, 50 KB – 25 MB.

Signing scheme: a `SHA256(path)` marker, with a valid + not-expired check. See `backend/photos/SignatureRepository.js` and `backend/photos/HashProvider.js` for the exact old logic to replicate/replace.

## New backend decisions

- Go, stdlib only (no chi — `net/http` 1.22 method+path routing suffices). Pure-Go SQLite via `modernc.org/sqlite`. `modernc.org/sqlite` is the only non-stdlib dep.
- SQLite tables: `users`, `sessions`, `photos`, `upload_signatures`. Schema created on startup (idempotent `CREATE TABLE IF NOT EXISTS`, versioned via `PRAGMA user_version`). Opened WAL + `busy_timeout=5000` + `foreign_keys=on`, with `SetMaxOpenConns(1)` (SQLite serializes writes; one connection avoids "database is locked" under `-race` and concurrent uploads).
- Auth0 kept through the migration: tenant `photato.eu.auth0.com` is alive, test user `test@photato.eu` exists. Replaced by magic-links + passkeys at the later redesign.
- Latest stable deps only (check registries, respect the 3-day age rule).

### Phase 3b decisions (storage layout, photo serving, config)

- **Photo storage layout (load-bearing for 3c and listing):** files live under `DATA_DIR/photos/` keyed by the preserved legacy S3 key shape `{environment}/photos/{courseName}/week-{weekIndex}/{email}.jpg`. Because the key itself starts with `{environment}/photos/…`, the on-disk path repeats `photos`, e.g. `DATA_DIR/photos/production/photos/hu-4/week-2/user@example.com.jpg`. `list-for-week` reads SQLite (not the directory) and selects rows by this path prefix.
- **Photo serving:** added `GET /photos/{key...}`, admin-gated exactly like `list-for-week` (the whole listing surface is admin-only, so serving matches). The `url` field in the listing points at this route (`BASE_URL` + `/photos/` + key). Files stream from disk via `http.ServeFile`; `..` in the key is rejected.
- **Single-use uploads:** the `signing.Store` interface stays check-marker + put-marker (no atomic delete), so single-use is enforced at the HTTP layer: the check-and-expire "claim" runs under an in-process mutex (fine for the single binary). A valid signature hashes the canonical storage path (not the query string), so it's stable regardless of URL encoding. Consequence, same as legacy S3 markers: once a path's signature is expired, re-uploading to that exact path is blocked (the expired marker persists).
- **Admin source of truth:** admin status is derived from `ADMIN_EMAILS` at auth time (authoritative). The stored `users.is_admin` column is informational — editing it directly does not grant admin.
- **Config is env-var only** (documented in `backend-go/README.md`): `PORT` (default `19003`), `DATA_DIR` (default `./data`), `BASE_URL`, `AUTH0_USERINFO_URL`, `ADMIN_EMAILS`. No `AUTH0_ISSUER`/`AUTH0_AUDIENCE` (tokens are validated via `/userinfo`, not local JWT verification) and no `ENVIRONMENT` (environment is a per-request parameter). Deploy note: phase 4 sets `PORT=9003` behind Caddy.

## Dead infrastructure (do not try to reach)

- The old MongoDB cluster is DELETED. The `users` table starts empty — nothing to migrate there.
- The AWS account dies after migration.
- Leaked AWS creds in `backend/config.js` history are dead. Do NOT scrub history to remove them; it would rewrite all commits and break blame for no security benefit.

## Phase 4 deploy (live layout)

The backend runs at `https://api.photato.eu`, alongside the still-live Netlify FE at `photato.eu`.

- **Repo on the box:** `/home/david/photato` (public repo, https clone — no deploy key). The deploy webhook builds from here.
- **Container:** service `photato` (`infra/docker-compose.yml`), image built ON the box (multi-stage `backend-go/Dockerfile`, static CGO-free binary on distroless), on `proxy-net`, `restart: unless-stopped`, runs as uid 1000. `PORT=9003` (container-internal; Caddy reaches `photato:9003`, not host-published). `DATA_DIR=/data` bind-mounts `/mnt/HC_Volume_105883537/photato-data`. Env also sets `BASE_URL`, `AUTH0_USERINFO_URL`, `ADMIN_EMAILS`. (No `ENVIRONMENT` var — the backend takes environment per-request, not server-wide.)
- **Data:** the migration output at `/mnt/HC_Volume_105883537/photato-data` (`photato.db` + `photos/` + `external-articles/`), hardlinked from the salvage tree (same volume, ~zero extra bytes; salvage stays pristine).
- **Caddy** (`hetzner-server` repo): `api.photato.eu` site block reverse-proxies to `photato:9003`, serves `/external-articles/*` as public static from the mounted `photato-data/external-articles`, and routes `/hooks/*` to the webhook listener. External-articles public base URL (for Phase 5's `thirdPartyArticlesBaseUrl`): `https://api.photato.eu/external-articles/`.
- **Autodeploy:** `.github/workflows/deploy-backend.yml` (gofmt + vet + test, then a signed webhook POST) → adnanh/webhook systemd unit `deploy-photato-webhook.service` on **port 9004** (9003 was already taken by lang/pimsleur — the older "use 9003" note was stale) → `infra/deploy-webhook/deploy-photato.sh` builds + rolls the container. Runbook: `infra/deploy-webhook/README.md`.

## Hetzner box facts

- ssh alias `hetzner`, user `david` (in the `docker` group — docker can do root-equivalent file ops when needed).
- Caddy config in the `~/hetzner-server` repo: `Caddyfile`, `proxy-net` docker network. Restart (not reload) Caddy when new certs are needed.
- Deploy webhooks follow a pattern; ports 9000–9002 are already taken, so Photato backend uses 9003.
- The volume is 9.8G, 78% used. Root disk is 83% full — don't stage large data on root.
- ssh sessions can drop — use `nohup` for long-running jobs.
