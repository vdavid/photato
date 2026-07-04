# Photato

Photato is the website for a Hungarian 12-week online photography course. Students upload one photo per week; the site lists and displays each week's submissions. Live at photato.eu.

This is a monorepo merging two formerly separate repos, with full git history and blame preserved (commits reach back to 2020-02).

## Repo layout

- `backend/`: legacy Node.js backend, ran on AWS Lambda + Lambda@Edge + API Gateway, S3 for photos, MongoDB for users. Being replaced by `backend-go/`. Kept for reference: it's the source of truth for the old API contract and signing scheme.
- `backend-go/`: the replacement Go backend (single binary, pure-Go SQLite). See the "backend-go" section below.
- `frontend/`: React SPA, no build step originally (native ES modules, `.mjs` + `htm` instead of JSX). Being migrated Vite → TypeScript → eventually Svelte.
- `e2e/`: Playwright E2E + pixel-screenshot baseline suite (Phase 2). Lives at the repo root so it outlives the frontend implementation swaps. See the "e2e" section below.
- `docs/revival-plan.md`: the migration plan, phases, and load-bearing salvage facts. Read it before working on any backend/data/deploy phase.

## Target architecture

- Single Go binary (stdlib or chi), pure-Go SQLite via `modernc.org/sqlite`. No AWS, no Mongo.
- Photos live on a Hetzner volume: `/mnt/HC_Volume_105883537/photato/`.
- Runs on David's Hetzner box behind Caddy (repo `~/hetzner-server`), deployed via Docker + GitHub Actions webhook autodeploy, backend on port 9003.
- Auth0 stays for now (tenant `photato.eu.auth0.com` is alive). Replaced by magic-links + passkeys at a later redesign.
- SQLite tables: `users`, `sessions`, `photos`, `upload_signatures`.

## Conventions

- pnpm only, never npm. `pnpm-workspace.yaml` sets `minimumReleaseAge: 4320` (block npm packages younger than 3 days).
- Latest stable dependency versions only; check registries and respect the 3-day age rule.
- Non-standard high ports for dev services (10000–29999), never 3000/5173/8080.
- Commit style: lead with impact, verbose body ok, no AI attribution.

## backend-go

The replacement backend, a single Go binary using pure-Go SQLite (`modernc.org/sqlite`, no cgo). Go is managed by mise (`backend-go/.mise.toml` pins the toolchain); run Go via `mise exec -- go ...` inside `backend-go/`.

- Layout: `cmd/server/` (entrypoint + wiring) and `internal/{signing,photos,auth,messages,store,httpapi}`. Each `internal` package owns one slice of the old backend's behavior; the domain packages define the interfaces, `store` (SQLite) implements them, `httpapi` is the HTTP surface, `cmd/server` wires it all.
- Run tests: `cd backend-go && mise exec -- go test ./...`. Vet/build: `mise exec -- go vet ./...` and `mise exec -- go build ./...`.
- Run the server: `cd backend-go && mise exec -- go run ./cmd/server` (config via `PHOTATO_*` env vars; listens on `:9003` by default, matching the deploy port).
- Phase status: 3a (TDD red) is done — the tests port the legacy Jest suite + golden signing vectors and currently fail with `not implemented`. Phase 3b implements the packages until they go green. Intentional differences from the legacy backend are in `docs/backend-go-divergences.md` — read it before implementing.

Playwright baseline suite in `e2e/` (a pnpm workspace package). It captures the live photato.eu so the migration can be checked for regressions; assumes the live site is correct as-is.

- **Docker is required** for anything touching screenshots. Pixel baselines are Linux-only and must be generated inside the pinned Playwright image, never from macOS-native rendering. Playwright stamps the platform onto snapshot names, so a macOS run looks for `-darwin` baselines and fails loudly by design.
- Run: `pnpm test:e2e:docker` (compare) / `pnpm test:e2e:docker:update` (regenerate). Both run `e2e/scripts/docker-test.sh`, which mounts the repo into `mcr.microsoft.com/playwright:v<version>-noble` (tag pinned to the `@playwright/test` version — bump together).
- Setup: `cp e2e/.env.example e2e/.env` and fill `E2E_USER_PASSWORD` (gitignored). Unused today (the live Auth0 client is Google-social-only, so there's no password form to automate; the suite asserts the login redirect handshake instead of logging in). Kept for Phase 5.
- Target-switchable via `BASE_URL` (default `https://photato.eu`) and `LEGACY_BACKEND_DEAD` (default `true`, which blocks the dead 502 backend). Phase 5 sets `LEGACY_BACKEND_DEAD=false` and adds logged-in baselines (upload/course/admin), which need both a live backend and an automatable auth path.
- Full details, determinism choices, and layout in `e2e/README.md`.
