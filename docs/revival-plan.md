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
- Phase 5 — frontend on Vite (DONE): built with Vite, repointed the API to api.photato.eu, deployed on the box (Caddy static + webhook autodeploy). The apex `photato.eu` DNS is flipped — the live apex now serves the new build off the box (all 42 baselines pass against `https://photato.eu`, 0 skips); `new.photato.eu` stays as an alias. The `photato.eu` zone still lives on Netlify DNS; moving it to Cloudflare + the ICDSoft nameserver switch are the remaining David-TODOs (both David-gated). See the "Phase 5" section below.
- Phase 5b — frontend TypeScript migration (DONE): the React frontend is now TypeScript strict — all `.jsx`→`.tsx` (pure-logic modules `.ts`), props/state/context/hooks typed, the Go-backend JSON contract typed as wire + revived-domain types, `@types/react@17`/`@types/react-router-dom@5` (runtime libs unchanged), `htm` dropped (was unused). `tsc --noEmit` is a CI gate (`.github/workflows/deploy.yml`). No behavior change: `tsc` clean, `vite build` green, all 42 Playwright baselines pass against a local `vite preview` (40 pass + 2 skip, no baseline regeneration). See the "Phase 5b" section below. The **Svelte rewrite is the next FE milestone and now starts from typed code.**
- Phase 6 — backups (DONE): Photato's SQLite + photos + S3 salvage master are folded into the box's existing nightly NAS backup (`infra` repo, `hetzner/scripts/backup-to-nas/`). WAL DB dumped via `VACUUM INTO` to dated snapshots with grandfather-father-son retention; photos + salvage rsynced with hardlinks preserved. See the "Phase 6 (backups)" section below.
- Phase 7 — magic-link auth (DONE): ripped Auth0 out of the backend (the account was lost) and replaced it with self-hosted passwordless email magic links. Signed single-use 15-min token → opaque 3-day session token that Bearer-authorizes every endpoint. Mail sent via SMTP2GO from `photato@veszelovszki.com`. Wire contract in `docs/auth-contract.md`; see the "Phase 7 (magic-link auth)" section below. The React frontend's leftover Auth0 code is dead — the Svelte rewrite deletes it.

## Salvage facts (Phase 0 output)

All salvaged data lives at `/mnt/HC_Volume_105883537/photato/` on the Hetzner box:

- `s3/{production,external-articles,development,staging}/`: 1392 files, 2,944,600,648 bytes total, all MD5-verified against their S3 ETags.
- `metadata.json`: JSON-lines, UTF-8. One line per object with: `key`, `size`, `etag`, `last_modified`, `content_type`, `metadata` (the S3 custom-metadata object).
- `inventory-raw.json`: raw S3 inventory.
- `SALVAGE-REPORT.md`, `README.md`: describe the salvage.

**CRITICAL metadata gotcha:** every S3 custom-metadata VALUE (`title`, `original-file-name`, `email-address`) is percent-encoded UTF-8. The migration tool MUST urldecode them. Example: stored `title` `Ly%C3%A1ny` decodes to `Lyány`.

- Only the 642 photo objects carry the 4 custom keys: `uuid`, `original-file-name`, `email-address`, `title` (`title` is sometimes empty). `external-articles` files have empty metadata by design.
- `etag` equals the plain MD5 for every file (no multipart uploads), so ETag == content MD5 is a safe integrity check.

## Old API contract (from `frontend/src/config.jsx`)

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
- Auth is self-hosted passwordless email magic links (Phase 7 below) — Auth0 is gone. No third-party identity provider; sessions are our own opaque tokens.
- Latest stable deps only (check registries, respect the 3-day age rule).

### Phase 3b decisions (storage layout, photo serving, config)

- **Photo storage layout (load-bearing for 3c and listing):** files live under `DATA_DIR/photos/` keyed by the preserved legacy S3 key shape `{environment}/photos/{courseName}/week-{weekIndex}/{email}.jpg`. Because the key itself starts with `{environment}/photos/…`, the on-disk path repeats `photos`, e.g. `DATA_DIR/photos/production/photos/hu-4/week-2/user@example.com.jpg`. `list-for-week` reads SQLite (not the directory) and selects rows by this path prefix.
- **Photo serving:** added `GET /photos/{key...}`, admin-gated exactly like `list-for-week` (the whole listing surface is admin-only, so serving matches). The `url` field in the listing points at this route (`BASE_URL` + `/photos/` + key). Files stream from disk via `http.ServeFile`; `..` in the key is rejected.
- **Single-use uploads:** the `signing.Store` interface stays check-marker + put-marker (no atomic delete), so single-use is enforced at the HTTP layer: the check-and-expire "claim" runs under an in-process mutex (fine for the single binary). A valid signature hashes the canonical storage path (not the query string), so it's stable regardless of URL encoding. Consequence, same as legacy S3 markers: once a path's signature is expired, re-uploading to that exact path is blocked (the expired marker persists).
- **Admin source of truth:** admin status is derived from `ADMIN_EMAILS` at auth time (authoritative). The stored `users.is_admin` column is informational — editing it directly does not grant admin.
- **Config is env-var only** (documented in `backend-go/README.md`): `PORT` (default `19003`), `DATA_DIR` (default `./data`), `BASE_URL`, `ADMIN_EMAILS`, plus the Phase-7 magic-link vars (`AUTH_LINK_SECRET`, `FRONTEND_BASE_URL`, `TEST_LOGIN_SECRET`, `SMTP_*`). No `ENVIRONMENT` (environment is a per-request parameter). Deploy note: phase 4 sets `PORT=9003` behind Caddy; secrets come from the box env file `/etc/photato-deploy.env`, never the repo.

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

## Phase 5 (frontend on Vite + new.photato.eu)

The React frontend moved off its dead Snowpack/Babel toolchain onto Vite and now serves the live apex `https://photato.eu` (and `https://new.photato.eu`) on the box. The apex cutover is done — see "Apex cutover" below for the completed state and the remaining Cloudflare/NS David-TODO.

- **What changed in the app (no behavior change):** toolchain only. Vendored `src/web_modules/*` (Snowpack bundles) and the vendored auth0 `<script>` were replaced with npm packages (`@auth0/auth0-spa-js@^1`, `react-facebook-pixel`, `react-ga`; frozen React 17 / React Router 5). JSX source files were renamed `.mjs`→`.jsx` (Vite's Oxc keys JSX off the extension) with the classic runtime pinned. The translation loader switched to a relative dynamic import so Vite can bundle it. `config.jsx` now points both backend consts at `https://api.photato.eu` and `thirdPartyArticlesBaseUrl` at `https://api.photato.eu/external-articles/`. See the frontend section in `AGENTS.md`.
- **Serving:** Caddy `new.photato.eu` block (in the `~/projects-git/vdavid/infra` repo, `hetzner/services/caddy/Caddyfile`) does `root * /srv/photato-frontend` + `try_files {path} /index.html` (SPA fallback for deep links) + `file_server`. The dir is bind-mounted read-only into the Caddy container from `/mnt/HC_Volume_105883537/photato-frontend` (see the caddy compose file). A new domain needs a fresh cert, so **restart** (not reload) Caddy after adding the block.
- **Build + autodeploy:** the existing deploy webhook (port 9004) now also builds the frontend. `infra/deploy-webhook/deploy-photato.sh` runs the Vite build in a throwaway `node:24-alpine` container (`pnpm --filter ./frontend build`, pnpm store cached in the `photato-fe-pnpm-store` volume) and rsyncs `frontend/dist/` to `/mnt/HC_Volume_105883537/photato-frontend`. `.github/workflows/deploy.yml` triggers on `frontend/**` too and gates the deploy on a lean `vite build` (no browsers in CI).
- **DNS:** apex `photato.eu`, `www.photato.eu`, `api.photato.eu`, and `new.photato.eu` are all A records → `37.27.245.171` (the box) in the Netlify-managed `photato.eu` zone. `www` 301-redirects to the apex (Caddy). `staging.photato.eu` was dropped (dead Netlify target). MX (mailgun) + the apex TXT verifications are untouched. The zone still lives on Netlify DNS until David completes the Cloudflare move (see "Apex cutover" below).
- **Verification:** all 42 Playwright baselines pass against the Vite build (local `vite preview`, `https://new.photato.eu`, and the live `https://photato.eu`), no baseline regeneration. Against `https://photato.eu` all 42 pass with **0 skips** — the two "Auth0 hosted login page loads" specs only skip *off* production, and the apex is the production origin (its Auth0 client allow-lists `photato.eu`).

### David-TODOs for Phase 5

- **Auth0 allowed origins:** in the Auth0 dashboard (tenant `photato.eu.auth0.com`), add `https://new.photato.eu` to the SPA client's **Allowed Callback URLs**, **Allowed Web Origins**, and **Allowed Logout URLs** (keep `https://photato.eu`). Until then, the login handshake on new.photato.eu hands off correctly but Auth0 rejects the redirect, so the two skipped e2e specs stay skipped there. (new.photato.eu resolves to the **development** Auth0 client per the hostname rule, so add the origin to that client — or leave it; it's a preview host.)
- **Apex cutover (photato.eu → the box) — DONE.** In the Netlify `photato.eu` zone the apex + `www` records were flipped from Netlify's load balancer to A → `37.27.245.171`; the box Caddyfile serves `photato.eu` (+ `new.photato.eu`) from the same static build and 301-redirects `www` → apex; Caddy issued the apex/www certs (HTTP-01). The app auto-detects `photato.eu` → production config (production Auth0 client, already allow-listed), so all 42 baselines pass with 0 skips. `staging.photato.eu` (dead Netlify target) was dropped in the same pass. `new.photato.eu` stays live as an alias for now.
  - **Netlify API quirk (cost an hour once):** create records with a **relative** hostname (`www`, or `""` for the apex), never the FQDN — FQDN-created records land in the zone but never sync to the NS1 nameservers. Verify any change against the authoritative servers (`dig @dns1.p01.nsone.net photato.eu A`), not just the zone view.
- **Cloudflare DNS move — David-TODO (registrar + zone-create are David-gated).** The plan is to move the `photato.eu` zone to Cloudflare (parity with the other zones, managed as code in `infra/cloudflare/`), keeping every record **DNS-only / grey-cloud** so Caddy keeps doing its own TLS (the apex/www/api certs are direct HTTP-01, not behind Cloudflare's proxy). Blocked on two things only David can do:
  1. **Create the zone:** the shared `CLOUDFLARE_API_TOKEN` lacks `zone.create` at the account level (it can only manage records inside existing zones). David adds `photato.eu` in the Cloudflare dashboard (Free plan) — or grants the token `Zone:Create` — which assigns the two `*.ns.cloudflare.com` nameservers.
  2. **Switch nameservers at ICDSoft:** the registrar is ICDSoft ([admin](https://accounts.icdsoft.com/domains/details/photato.eu)) and no API/login creds exist in the sops store or Keychain, so the NS change from `dns[1-4].p01.nsone.net` to the two Cloudflare nameservers is a manual dashboard step.
  - Once the zone exists, mirror the post-flip record set (below) into `infra/cloudflare/` the repo's way (`cf-terraforming generate` → `photato.eu.tf` → import), so `tofu plan` stays clean. Records to replicate, all grey-cloud: A `photato.eu` / `www.photato.eu` / `api.photato.eu` / `new.photato.eu` → `37.27.245.171`; MX `photato.eu` → `mxa.eu.mailgun.org` + `mxb.eu.mailgun.org` (prio 10); TXT `photato.eu` google-site-verification + facebook-domain-verification. **Dropped on purpose:** `staging.photato.eu` (dead) and its facebook-domain-verification TXT — re-add the TXT only if Business Manager still needs the staging subdomain verified.
  - After the NS move lands and `photato.eu` serves from Cloudflare→box cleanly, `new.photato.eu` can be dropped and the Netlify site + zone retired (David decommissions those himself; do not delete). Also remove the leftover `frontend/netlify.toml` history reference if any tooling still points at it.

## Phase 5b (frontend TypeScript)

The React frontend is TypeScript strict now. Toolchain unchanged (Vite/Oxc, classic JSX runtime); this phase only added types. `tsconfig.json`: `strict`, `moduleResolution: bundler`, `jsx: react`, `noEmit`. Load-bearing facts:

- **Extensionless relative imports + the sibling-`.js` trap:** all relative imports were made extensionless (e.g. `from './config'`) so pure-logic files could move `.tsx`→`.ts` without touching import sites. Bundler resolution prefers `.js` over `.ts`/`.tsx`, so a stray sibling `.js` next to a `.ts` silently shadows the typed module. This bit us once: a dead CommonJS Jest shim `CourseDateConverter.js` (plus `CourseDateConverter.u.test.js`) shadowed the real `CourseDateConverter.ts` and crashed boot (missing methods). Both dead files were **removed** (no Jest is configured; the file's own comment said it was deletable). Don't reintroduce a `.js`/`.jsx` sibling next to a `.ts`/`.tsx`.
- **Dynamic-import globs keep `.tsx`:** the four dynamic `import()` sites (translations, own/third-party articles, weekly challenges) use an explicit `.tsx` suffix so Vite's glob discovery still enumerates the chunks. `index.html` loads `/src/main.tsx`.
- **Backend JSON contract typing:** `list-for-week` returns `S3PhotoMetadataWire` (`lastModifiedDate: string`); the repository revives it (via `.map`, not the old in-place mutation) to `S3PhotoMetadata` (`lastModifiedDate: Date`). See `frontend/src/admin/photos/PhotoRemoteRepository.ts`.
- **Behavior held exactly; pre-existing bugs preserved, not fixed** (flagged for later): several content files pass `alt`/omit props that the component silently drops (kept the props optional/ignored so the dropped-render behavior is unchanged); `Auth0Provider.handleRedirectCallback` has a latent bug in dead (never-consumed) code, marked with a lone `@ts-expect-error`; `ChallengePage` stores a `ReactElement` where a component type is expected in an untranslated-fallback path (preserved via a cast). `Error403Page` changed `return !isAuthLoading && (...)` (a `false | Element` that TS rejects as a component) to `return isAuthLoading ? null : (...)` — both render nothing while loading.
- **No `any`** anywhere (verified); every unavoidable assertion carries a `// justification:` comment.
- **Verification:** `tsc --noEmit` clean, `vite build` green, full Playwright suite 40 pass + 2 skip against a local `vite preview` (the two Auth0-hosted-login specs skip off production), no baseline regeneration.

## Phase 6 (backups)

Photato rides David's existing box→NAS→offsite 3-2-1 flow rather than a parallel system. All the machinery lives in the **`infra` repo** (`hetzner/scripts/backup-to-nas/`), not here, because that's where the box's backup runs from (`/home/david/infra`, `git pull`-deployed; the nightly cron at 03:08 runs `backup.sh`).

- **What's backed up:** `/mnt/HC_Volume_105883537/photato-data/` (app layout: `photos/`, `external-articles/`, dated DB dumps under `backups/`) and `/mnt/HC_Volume_105883537/photato/` (the pristine S3 salvage master — critical, since AWS is being wiped). Both land on the NAS at `hetzner-server/photato/`, which the NAS's monthly `restic` job then copies offsite.
- **DB (WAL-mode) — never plain-copied:** `photato-db-backup.sh` runs `sqlite3 ... 'VACUUM INTO'` on a read-only handle to write a fully-checkpointed, self-contained snapshot to `photato-data/backups/photato-YYYY-MM-DD.db`, then `PRAGMA integrity_check`s it. Retention: 14 daily + 6 monthly reps (tested in `test-photato-retention.sh`). The live `photato.db`/`-wal`/`-shm` are **excluded** from the rsync — the dated dumps carry the DB. Needs host `sqlite3` (the backend image is distroless; the Ansible `backup` role installs it).
- **Photos + salvage — hardlinks preserved:** `photato-data/photos/` are hardlinks into `photato/s3/` (Phase 3c). backup.sh rsyncs both trees in ONE `rsync -aH` so the shared photo bytes are stored once on the NAS (~2.8 GB), not doubled.
- **Restore runbook:** `infra` repo `hetzner/docs/disaster-recovery.md` → "Restore data" → Photato (DB dump + `rsync -aH` photos/salvage back).
- **David-TODO:** none on the NAS side — the push destination `/share/naspi/saves/hetzner-server/` is already inside the NAS's restic source, so the monthly offsite picks up `photato/` automatically.

## Phase 7 (magic-link auth)

Auth0 is gone (the tenant/account was lost — nothing to preserve). Login is now
self-hosted passwordless email magic links. Wire contract for the frontend:
`docs/auth-contract.md`. Backend: `backend-go/internal/{auth,magiclink,email}` +
the `/auth/*` handlers in `internal/httpapi`.

- **Flow:** `POST /auth/request-link {email}` (always 200, no enumeration,
  rate-limited) mails a link `https://photato.eu/login/verify?token=…`. The token
  is an HMAC-SHA256-signed payload (email + 15-min expiry + random nonce), keyed by
  `AUTH_LINK_SECRET`. `POST /auth/verify {token}` checks the signature+expiry,
  burns the nonce (single-use, race-safe), upserts the user, and returns
  `{sessionToken, user}`. The session token is a 256-bit random opaque string,
  3-day validity; it Bearer-authorizes every existing endpoint. `GET /auth/me`,
  `POST /auth/logout` round out the surface.
- **Single-use is DB-enforced, race-safe:** the nonce is burned by an
  `INSERT OR IGNORE` into `used_login_nonces`; with the store's single write
  connection + the primary key, exactly one of N concurrent verifies wins
  (tested with 32 parallel burns). Rate limiting is SQLite-backed
  (`login_attempts`): 3/email/15min + 20/IP/15min; over-limit still returns 200
  but sends nothing (no enumeration).
- **Schema (v2):** `users` dropped its Auth0 profile blob; `sessions` holds our
  opaque tokens (column `token`, not `access_token`); added `used_login_nonces`
  and `login_attempts`. The v1→v2 migration drops+recreates the empty
  Auth0-era `users`/`sessions` (they only held Auth0 cache — production started
  empty); `photos`/`upload_signatures` are untouched.
- **Email delivery:** generic `net/smtp` + STARTTLS pointed at **SMTP2GO**
  (`mail.smtp2go.com:2525`), from `Photato <photato@veszelovszki.com>`. SMTP2GO
  is the box's existing outbound relay and `veszelovszki.com` is a DKIM +
  return-path-verified sender there, so mail lands in the Gmail inbox (verified
  end-to-end). Plain-text, bilingual (HU + EN). **mailcow's own submission cert
  (`mail.veszelovszki.com:587`) is expired (Jan 2026) — a separate infra issue
  for David; not on Photato's path since we relay via SMTP2GO directly.** A
  `photato@veszelovszki.com` mailbox was created in mailcow (quota 0, uncounted)
  for receiving/bounces.
- **Secrets & deploy:** `AUTH_LINK_SECRET`, `TEST_LOGIN_SECRET`, and `SMTP_*`
  live in `/etc/photato-deploy.env` (root-owned 600, loaded by the webhook
  systemd unit). `deploy-photato.sh` materializes a david-readable 600 copy
  (`infra/photato-secrets.env`, git-ignored) via a throwaway root container —
  david is in the docker group but has no passwordless sudo, so that's how a
  david-run `docker compose` reads a root:600 master. `DEPLOY_WEBHOOK_SECRET` is
  filtered out of the container copy. Non-secret config (`BASE_URL`,
  `FRONTEND_BASE_URL`, `ADMIN_EMAILS`, `PORT`) stays inline in the compose file.
- **e2e backdoor:** `POST /auth/test-login {email, secret}` mints a session
  without email, gated by a constant-time compare against `TEST_LOGIN_SECRET`
  (404 when the env var is unset). The Svelte agent's e2e suite drives login
  through it — put `TEST_LOGIN_SECRET` in `e2e/.env` (git-ignored), value from
  the box env file.

## Hetzner box facts

- ssh alias `hetzner`, user `david` (in the `docker` group — docker can do root-equivalent file ops when needed).
- Caddy config in the `~/hetzner-server` repo: `Caddyfile`, `proxy-net` docker network. Restart (not reload) Caddy when new certs are needed.
- Deploy webhooks follow a pattern; ports 9000–9002 are already taken, so Photato backend uses 9003.
- The volume is 9.8G, 78% used. Root disk is 83% full — don't stage large data on root.
- ssh sessions can drop — use `nohup` for long-running jobs.
