# Photato

Photato is the website for a Hungarian 12-week online photography course. Students upload one photo per week; the site lists and displays each week's submissions. Live at photato.eu.

This is a monorepo merging two formerly separate repos, with full git history and blame preserved (commits reach back to 2020-02).

## Repo layout

- `backend/`: legacy Node.js backend, ran on AWS Lambda + Lambda@Edge + API Gateway, S3 for photos, MongoDB for users. Being replaced by a Go backend (a `backend-go/` dir arrives in a later phase). Kept for reference: it's the source of truth for the old API contract and signing scheme.
- `frontend/`: React SPA, no build step originally (native ES modules, `.mjs` + `htm` instead of JSX). Being migrated Vite → TypeScript → eventually Svelte.
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
