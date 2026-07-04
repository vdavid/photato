# Photato revival plan

Migrating Photato off its dead AWS/Mongo stack onto a single Go + SQLite binary on David's Hetzner box, then modernizing the frontend. This doc holds the phase plan plus the hard-won facts later phases depend on. Read the relevant section before starting a phase.

## Phases

- Phase 0 — salvage (DONE): pulled all S3 objects + metadata down to the Hetzner volume, MD5-verified.
- Phase 1 — monorepo (DONE): merged the two legacy repos into this one with full history, pushed to GitHub.
- Phase 2 — Playwright baseline: capture E2E flows + screenshots against the live photato.eu, so the rewrite has a behavioral reference.
- Phase 3a — Go tests (TDD red): port the old Jest suite to Go tests + golden vectors; see them fail first.
- Phase 3b — Go backend impl: implement the backend (SQLite, all endpoints) until 3a goes green.
- Phase 3c — data-migration tool: transform the salvaged S3 layout into the app's photo layout + SQLite rows.
- Phase 4 — deploy: Docker + Caddy + GitHub Actions webhook autodeploy, backend on port 9003 (per hetzner-server conventions).
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

- Go, stdlib or chi. Pure-Go SQLite via `modernc.org/sqlite`.
- SQLite tables: `users`, `sessions`, `photos`, `upload_signatures`.
- Auth0 kept through the migration: tenant `photato.eu.auth0.com` is alive, test user `test@photato.eu` exists. Replaced by magic-links + passkeys at the later redesign.
- Latest stable deps only (check registries, respect the 3-day age rule).

## Dead infrastructure (do not try to reach)

- The old MongoDB cluster is DELETED. The `users` table starts empty — nothing to migrate there.
- The AWS account dies after migration.
- Leaked AWS creds in `backend/config.js` history are dead. Do NOT scrub history to remove them; it would rewrite all commits and break blame for no security benefit.

## Hetzner box facts

- ssh alias `hetzner`, user `david` (in the `docker` group — docker can do root-equivalent file ops when needed).
- Caddy config in the `~/hetzner-server` repo: `Caddyfile`, `proxy-net` docker network. Restart (not reload) Caddy when new certs are needed.
- Deploy webhooks follow a pattern; ports 9000–9002 are already taken, so Photato backend uses 9003.
- The volume is 9.8G, 78% used. Root disk is 83% full — don't stage large data on root.
- ssh sessions can drop — use `nohup` for long-running jobs.
