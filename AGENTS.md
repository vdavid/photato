# Photato

Photato is the website for a Hungarian 12-week online photography course. Students upload one photo per week; the site lists and displays each week's submissions. Live at photato.eu.

This is a monorepo merging two formerly separate repos, with full git history and blame preserved (commits reach back to 2020-02).

## Repo layout

- `backend/`: legacy Node.js backend, ran on AWS Lambda + Lambda@Edge + API Gateway, S3 for photos, MongoDB for users. Being replaced by `backend-go/`. Kept for reference: it's the source of truth for the old API contract and signing scheme.
- `backend-go/`: the replacement Go backend (single binary, pure-Go SQLite). See the "backend-go" section below.
- `frontend/`: React 17 SPA, built with Vite, written in TypeScript strict (Phase 5b). Next FE milestone is the Svelte rewrite, now starting from typed code. See the "frontend" section below.
- `e2e/`: Playwright E2E + pixel-screenshot baseline suite (Phase 2). Lives at the repo root so it outlives the frontend implementation swaps. See the "e2e" section below.
- `docs/revival-plan.md`: the migration plan, phases, and load-bearing salvage facts. Read it before working on any backend/data/deploy phase.

## Target architecture

- Single Go binary (stdlib or chi), pure-Go SQLite via `modernc.org/sqlite`. No AWS, no Mongo.
- Photos live on a Hetzner volume: `/mnt/HC_Volume_105883537/photato/`.
- Runs on David's Hetzner box behind Caddy (config in the `~/projects-git/vdavid/infra` repo under `hetzner/services/caddy/`), deployed via Docker + GitHub Actions webhook autodeploy. Backend live at `https://api.photato.eu` (container `photato:9003` on `proxy-net`; deploy webhook on box port 9004); the Vite frontend is served at the canonical apex `https://photato.eu` (and `https://new.photato.eu` as an alias) from `/mnt/HC_Volume_105883537/photato-frontend`; `www` 301s to the apex. Deploy layout + runbook: `docs/revival-plan.md` "Phase 4 deploy" / "Phase 5" and `infra/deploy-webhook/README.md`. The apex DNS is flipped to the box; the `photato.eu` zone still lives on Netlify DNS until David completes the Cloudflare move (see the Phase 5 "Apex cutover" David-TODO).
- Backups: the DB, photos, and S3 salvage master ride the box's nightly NAS→offsite 3-2-1 flow (machinery in the `infra` repo, `hetzner/scripts/backup-to-nas/`). WAL DB dumped via `VACUUM INTO` to dated snapshots; photos + salvage rsynced hardlink-preserving. Coverage + restore: `docs/revival-plan.md` "Phase 6 (backups)" and `infra/hetzner/docs/disaster-recovery.md`.
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
- Run tests: `cd backend-go && mise exec -- go test ./...` (add `-race` for the race detector). Vet/build: `mise exec -- go vet ./...` and `mise exec -- go build ./...`.
- Run the server: `cd backend-go && mise exec -- go run ./cmd/server` (config via env vars — see `backend-go/README.md`: `PORT` default `19003`, `DATA_DIR` default `./data`, `BASE_URL`, `AUTH0_USERINFO_URL`, `ADMIN_EMAILS`). Phase 4 deploy sets `PORT=9003` behind Caddy.
- Phase status: 3a (TDD red) and 3b (impl) are done — the tests pass (`go test ./...` and `-race` green). Intentional differences from the legacy backend are in `docs/backend-go-divergences.md`; phase-3b storage-layout / photo-serving / config decisions are in `docs/revival-plan.md`.

## frontend

React 17 SPA built with Vite, TypeScript strict (Phase 5b, migrated off the dead Snowpack/Babel toolchain in Phase 5 then typed in 5b). App deps stay frozen (React 17, React Router 5) until the Svelte rewrite; the toolchain swap, API repoint, and preview host landed in Phase 5, TypeScript in 5b — no behavior change in either.

- Layout: `frontend/index.html` (Vite entry, loads `/src/main.tsx`), `frontend/src/` (app code), `frontend/public/` (static assets served at `/`: emoji SVGs under `website/noto-emojis/`, favicons, fonts, logos, `styles.css`, `robots.txt`, `sitemap.xml`). Build output goes to `frontend/dist/` (gitignored).
- **TypeScript strict.** JSX files are `.tsx`, pure-logic modules `.ts` (Vite's Oxc transformer keys JSX parsing off the extension; `tsconfig.json` sets `"jsx": "react"`). `vite.config.ts` pins the classic JSX runtime (`React.createElement`), matching that setting — every component imports React. No `@vitejs/plugin-react` needed. **Relative imports are extensionless** (e.g. `from './config'`); dynamic-import globs keep the `.tsx` extension so Vite can discover them. Do NOT add a sibling `.js`/`.jsx` next to a `.ts`/`.tsx` — extensionless resolution prefers `.js` and would silently shadow the typed module.
- **`tsc --noEmit` is the type gate** (the Oxc bundler strips types without checking them). Run it: `pnpm --filter ./frontend typecheck`. CI runs it before the build (`.github/workflows/deploy.yml`); keep it green. No `any` without a written justification; a lone `@ts-expect-error` guards one pre-existing bug in dead code (`Auth0Provider.tsx`).
- Types conventions: matching `@types/react@17` / `@types/react-dom@17` / `@types/react-router-dom@5` majors (do NOT bump the runtime libs). Context values are typed interfaces exported next to their provider (`I18nContextValue`, `Auth0ContextValue`, `CourseDataContextValue`, `MaterialContextValue`); the `useX()` hooks return the non-optional value type. The backend JSON contract is typed as a wire type + a revived domain type where a field is transformed (`S3PhotoMetadataWire` has `lastModifiedDate: string`; `S3PhotoMetadata` revives it to `Date` — see `admin/photos/PhotoRemoteRepository.ts`). The `__` translate helper is typed `=> string` (a few entries resolve to JSX, only ever rendered).
- Run the dev server: `pnpm --filter ./frontend dev` (Vite on port **18730**, set in `vite.config.ts` — non-standard high port, never 3000/5173). Build: `pnpm --filter ./frontend build`. Preview a build: `pnpm --filter ./frontend preview`.
- Config lives in `src/config.ts` (typed `Config`): `apiGatewayBackEndUrl` and `cloudFrontBackEndUrl` both point at the single Go backend `https://api.photato.eu`; `thirdPartyArticlesBaseUrl` is `https://api.photato.eu/external-articles/`. Environment is chosen at runtime by hostname: `photato.eu*` → production, `staging.photato.eu*` → staging, anything else (incl. `new.photato.eu` and localhost) → development (dev Auth0 client, but `backendApi.environment` is still `production`).
- Auth0 uses the npm `@auth0/auth0-spa-js` (v1, matching the old vendored 1.2.4), imported in `src/auth/components/Auth0Provider.tsx` — no more global `<script>` tag. Note: auth0-spa-js requires a **secure origin** (HTTPS or `localhost`); it throws on plain-HTTP non-localhost hosts, which only matters for local containerized testing (see `e2e/README.md`), never for the HTTPS deploy.
- `react-facebook-pixel` interop: it ships only a webpack UMD (no ESM entry), and Rolldown's build interop nests the API oddly, so `src/website/reactPixel.ts` normalizes it. Don't revert the pixel imports to `from 'react-facebook-pixel'` directly — it crashes the app on boot.
- Deploy: served on the Hetzner box at the apex `photato.eu` (and `new.photato.eu` alias) by Caddy from `/mnt/HC_Volume_105883537/photato-frontend`; `www` 301s to the apex. A push to `main` touching `frontend/**` runs the CI build gate (`.github/workflows/deploy.yml`), then the same webhook that deploys the backend also builds the Vite bundle on the box (throwaway `node:24-alpine` container) and rsyncs `dist/` to the served dir (`infra/deploy-webhook/deploy-photato.sh`). The apex DNS is flipped to the box; moving the `photato.eu` zone to Cloudflare + the ICDSoft nameserver switch remain David-gated TODOs — see `docs/revival-plan.md` "Phase 5" "Apex cutover".

Playwright baseline suite in `e2e/` (a pnpm workspace package). It captures the live photato.eu so the migration can be checked for regressions; assumes the live site is correct as-is.

- **Docker is required** for anything touching screenshots. Pixel baselines are Linux-only and must be generated inside the pinned Playwright image, never from macOS-native rendering. Playwright stamps the platform onto snapshot names, so a macOS run looks for `-darwin` baselines and fails loudly by design.
- Run: `pnpm test:e2e:docker` (compare) / `pnpm test:e2e:docker:update` (regenerate). Both run `e2e/scripts/docker-test.sh`, which mounts the repo into `mcr.microsoft.com/playwright:v<version>-noble` (tag pinned to the `@playwright/test` version — bump together).
- Setup: `cp e2e/.env.example e2e/.env` and fill `E2E_USER_PASSWORD` (gitignored). Unused today (the live Auth0 client is Google-social-only, so there's no password form to automate; the suite asserts the login redirect handshake instead of logging in). Kept for Phase 5.
- Target-switchable via `BASE_URL` (default `https://photato.eu`) and `LEGACY_BACKEND_DEAD` (default `true`, which blocks the dead 502 backend). The Phase-5 Vite build passes all 42 baselines against `BASE_URL=https://new.photato.eu` (and against a local `vite preview`); the two "Auth0 hosted login page loads" specs `test.skip` off production because `new.photato.eu` isn't yet in the Auth0 allowed origins (David-TODO). Logged-in baselines (upload/course/admin) still wait for an automatable auth path (the live Auth0 client is Google-social-only) and are deferred. Note: for a **local** Docker run, serve the build and run Playwright both on `localhost` inside one container — auth0-spa-js throws on a non-`localhost` plain-HTTP origin like `host.docker.internal`. See `e2e/README.md`.
- Full details, determinism choices, and layout in `e2e/README.md`.
