# Photato

Photato is the website for a Hungarian 12-week online photography course. Students upload one photo per week; the site lists and displays each week's submissions. Live at [photato.eu](https://photato.eu).

This is a monorepo merging two formerly separate repos, with full git history and blame preserved (commits reach back to 2020-02). It was revived off a dead AWS/Mongo/Auth0 stack onto a single Go + SQLite binary on David's Hetzner box, with a Svelte frontend. The migration is complete; the log lives in `docs/history/revival-plan.md`.

## Repo layout

Each area has a colocated `CLAUDE.md` with its own detail. This file is the map.

- `backend/`: legacy Node.js backend (AWS Lambda + Lambda@Edge + API Gateway, S3 photos, MongoDB users). **Frozen reference, not deployed** — it's the source of truth for the old API contract and photo-signing scheme. Don't try to run or reach it; the AWS/Mongo infra is dead.
- `backend-go/`: the live Go backend (single binary, pure-Go SQLite). See `backend-go/CLAUDE.md`.
- `frontend/`: Svelte 5 SPA (runes), TypeScript strict, vanilla CSS, plain Vite. See `frontend/CLAUDE.md`.
- `e2e/`: Playwright E2E + pixel-baseline suite. Its own pnpm workspace package at the repo root so it outlives frontend implementation swaps. See `e2e/CLAUDE.md`.
- `infra/`: deploy (Docker Compose + webhook autodeploy), and pointers to the box, Caddy, and backups. See `infra/CLAUDE.md`.
- `docs/`:
  - `auth-contract.md`: the magic-link wire contract (frontend ↔ backend). Load-bearing; read before touching auth.
  - `backend-go-divergences.md`: intentional behavioral differences from the legacy backend.
  - `history/revival-plan.md`: the migration log. **Historical** — all phases done. Read it only for archaeology; current state lives in the docs above.

## Architecture (current)

- **Backend:** one Go binary (stdlib `net/http`, no framework), pure-Go SQLite via `modernc.org/sqlite` (no cgo), WAL mode. Lives at `https://api.photato.eu` (container `photato:9003` on `proxy-net`, behind Caddy). See `backend-go/CLAUDE.md`.
- **Frontend:** static Svelte SPA build served by Caddy at the apex `https://photato.eu` (`new.photato.eu` is an alias; `www` 301s to the apex). Client-side routing with a `try_files → /index.html` fallback.
- **Auth:** self-hosted passwordless email **magic links** (no Auth0 — the account was lost, nothing to preserve). Signed single-use 15-min token → opaque 3-day session token that Bearer-authorizes every endpoint. Contract in `docs/auth-contract.md`. Mail sent via mailcow submission (`mail.veszelovszki.com`) as `photato@photato.eu`, which mailcow relays outbound through the SMTP2GO smarthost (the box blocks port 25); photato.eu also receives via mailcow (`hello@`/`info@` aliases).
- **Analytics:** self-hosted Umami (`anal.veszelovszki.com`), cookieless. No Google Analytics / Facebook Pixel (deleted with the React code).
- **Data on the box** (Hetzner volume, ext4):
  - `/mnt/HC_Volume_105883537/photato-data` → the backend's `DATA_DIR` (`/data` in the container): `photato.db` (+ `-wal`/`-shm`), `photos/`, `external-articles/`.
  - `/mnt/HC_Volume_105883537/photato` → **the pristine S3 salvage master. SACRED — never write to it.** It's the only surviving copy of the original S3 objects (incl. `metadata.json`, whose custom-metadata values are percent-encoded UTF-8). The live `photos/` tree is hardlinked from it, so it costs ~zero extra bytes; keep it that way.
- **SQLite tables:** `users`, `sessions`, `used_login_nonces`, `login_attempts`, `photos`, `upload_signatures`.

## Build and test

- Backend (Go, via mise): `cd backend-go && mise exec -- go test ./...` (`-race` for the detector); `go vet ./...`; `gofmt -l .`. Details in `backend-go/CLAUDE.md`.
- Frontend: `pnpm --filter ./frontend check` (**`svelte-check` is the type gate** — Vite strips types without checking), then `pnpm --filter ./frontend build`. Dev: `pnpm --filter ./frontend dev` (port 18730). Details in `frontend/CLAUDE.md`.
- e2e: Docker-only (pixel baselines are Linux-only). `pnpm test:e2e:docker`. Details in `e2e/CLAUDE.md`.
- CI (`.github/workflows/deploy.yml`) runs the lean subset on push to `main`: Go gofmt/vet/test, then `svelte-check` + `vite build`. No `-race`, no Docker build, no browsers. If any check fails the deploy webhook never fires.

## Deploy

Push to `main` (touching `backend-go/**`, `frontend/**`, `infra/**`, or the workflow) → CI gate → signed HMAC webhook (box port 9004) → the box `git reset`s, builds the backend image, builds the frontend bundle in a throwaway `node:24-alpine`, and rsyncs `dist/` to the Caddy-served dir. Full flow, ports, and the box runbook in `infra/CLAUDE.md`.

- **Gotcha:** a change to `deploy-photato.sh` only takes effect on the **next** webhook trigger. The webhook runs the on-disk script, which does `git reset --hard` as its first step — so the currently-running deploy uses the *previous* checkout's script. Land a deploy-script change, then trigger a second (no-op) deploy to actually run it.

## Cross-cutting gotchas

- **Pixel baselines are Linux/Docker-only.** Playwright stamps the platform onto snapshot names, so a macOS run looks for `-darwin` baselines and fails by design. Never regenerate baselines to make a failure pass. See `e2e/CLAUDE.md`.
- **`main > *` child-combinator CSS** in the frontend means page content must be a direct child of `<main>` — no wrapper divs. See `frontend/CLAUDE.md`.
- **Salvage master is read-only** (see Architecture). Migrations hardlink into it, never copy; `EXDEV` (cross-device link) is a hard error, not a silent copy.

## Pending owner actions (David-TODOs)

These need David (registrar/account access or a decision); agents can't do them.

- **Retire the old Netlify hosting.** The Cloudflare DNS move is done: photato.eu's nameservers point at Cloudflare, the zone is active, and its records are the source of truth in the infra repo's Terraform (`cloudflare/photato.eu.tf`). Remaining David-only step: delete the Netlify **site** (hosting) and the now-redundant Netlify **DNS zone**.
- **Wipe the AWS account.** Salvage lives on the box + NAS; ideally do it after the next restic offsite drive-connect confirms the offsite copy.
- **Close the Mongo Atlas subscription** (the cluster is already deleted; `users` started empty).
- **Obsolete local dir:** `~/projects-git/vdavid/photato-website` is the pre-monorepo checkout, now dead. Listed for awareness — David removes it himself; don't delete.

## Roadmap (next milestone ideas)

- A visual redesign (David wants one).
- Passkeys layered on top of the magic-link auth.
- New course content / config for a future cohort.

## Where instructions go

Project-specific knowledge → this file (repo-wide) or a colocated `CLAUDE.md` (module-specific). Imperatives → `rules/` if the project grows any; otherwise a colocated note. Cross-project preferences already live at user level (`~/.claude/`) and are not restated here.
