# Photato

Photato is the website for a Hungarian 12-week online photography course. Students upload one photo per week; the site lists and displays each week's submissions. Live at photato.eu.

This is a monorepo merging two formerly separate repos, with full git history and blame preserved (commits reach back to 2020-02).

## Repo layout

- `backend/`: legacy Node.js backend, ran on AWS Lambda + Lambda@Edge + API Gateway, S3 for photos, MongoDB for users. Being replaced by a Go backend (a `backend-go/` dir arrives in a later phase). Kept for reference: it's the source of truth for the old API contract and signing scheme.
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

## e2e

Playwright baseline suite in `e2e/` (a pnpm workspace package). It captures the live photato.eu so the migration can be checked for regressions; assumes the live site is correct as-is.

- **Docker is required** for anything touching screenshots. Pixel baselines are Linux-only and must be generated inside the pinned Playwright image, never from macOS-native rendering. Playwright stamps the platform onto snapshot names, so a macOS run looks for `-darwin` baselines and fails loudly by design.
- Run: `pnpm test:e2e:docker` (compare) / `pnpm test:e2e:docker:update` (regenerate). Both run `e2e/scripts/docker-test.sh`, which mounts the repo into `mcr.microsoft.com/playwright:v<version>-noble` (tag pinned to the `@playwright/test` version — bump together).
- Setup: `cp e2e/.env.example e2e/.env` and fill `E2E_USER_PASSWORD` (gitignored). Unused today (the live Auth0 client is Google-social-only, so there's no password form to automate; the suite asserts the login redirect handshake instead of logging in). Kept for Phase 5.
- Target-switchable via `BASE_URL` (default `https://photato.eu`) and `LEGACY_BACKEND_DEAD` (default `true`, which blocks the dead 502 backend). Phase 5 sets `LEGACY_BACKEND_DEAD=false` and adds logged-in baselines (upload/course/admin), which need both a live backend and an automatable auth path.
- Full details, determinism choices, and layout in `e2e/README.md`.
