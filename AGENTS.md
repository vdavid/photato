# Photato

Photato is the website for a Hungarian 12-week online photography course. Students upload one photo per week; the site lists and displays each week's submissions. Live at photato.eu.

This is a monorepo merging two formerly separate repos, with full git history and blame preserved (commits reach back to 2020-02).

## Repo layout

- `backend/`: legacy Node.js backend, ran on AWS Lambda + Lambda@Edge + API Gateway, S3 for photos, MongoDB for users. Being replaced by `backend-go/`. Kept for reference: it's the source of truth for the old API contract and signing scheme.
- `backend-go/`: the replacement Go backend (single binary, pure-Go SQLite). See the "backend-go" section below.
- `frontend/`: Svelte 5 SPA (runes), TypeScript strict, vanilla CSS, built with plain Vite. Magic-link auth against `backend-go/`, Umami analytics. See the "frontend" section below.
- `e2e/`: Playwright E2E + pixel-screenshot baseline suite (Phase 2). Lives at the repo root so it outlives the frontend implementation swaps. See the "e2e" section below.
- `docs/revival-plan.md`: the migration plan, phases, and load-bearing salvage facts. Read it before working on any backend/data/deploy phase.

## Target architecture

- Single Go binary (stdlib or chi), pure-Go SQLite via `modernc.org/sqlite`. No AWS, no Mongo.
- Photos live on a Hetzner volume: `/mnt/HC_Volume_105883537/photato/`.
- Runs on David's Hetzner box behind Caddy (config in the `~/projects-git/vdavid/infra` repo under `hetzner/services/caddy/`), deployed via Docker + GitHub Actions webhook autodeploy. Backend live at `https://api.photato.eu` (container `photato:9003` on `proxy-net`; deploy webhook on box port 9004); the Vite frontend is served at the canonical apex `https://photato.eu` (and `https://new.photato.eu` as an alias) from `/mnt/HC_Volume_105883537/photato-frontend`; `www` 301s to the apex. Deploy layout + runbook: `docs/revival-plan.md` "Phase 4 deploy" / "Phase 5" and `infra/deploy-webhook/README.md`. The apex DNS is flipped to the box; the `photato.eu` zone still lives on Netlify DNS until David completes the Cloudflare move (see the Phase 5 "Apex cutover" David-TODO).
- Backups: the DB, photos, and S3 salvage master ride the box's nightly NAS→offsite 3-2-1 flow (machinery in the `infra` repo, `hetzner/scripts/backup-to-nas/`). WAL DB dumped via `VACUUM INTO` to dated snapshots; photos + salvage rsynced hardlink-preserving. Coverage + restore: `docs/revival-plan.md` "Phase 6 (backups)" and `infra/hetzner/docs/disaster-recovery.md`.
- Auth is self-hosted passwordless email **magic links** (Auth0 is gone — the account was lost, nothing to preserve). A user requests a link, clicks it, and exchanges the signed token for an opaque session token that Bearer-authorizes every endpoint. Wire contract: `docs/auth-contract.md`. Backend: `backend-go/internal/{auth,magiclink,email}`; the Svelte frontend's login UI in `frontend/src/auth/`.
- SQLite tables: `users`, `sessions`, `used_login_nonces`, `login_attempts`, `photos`, `upload_signatures`.

## Conventions

- pnpm only, never npm. `pnpm-workspace.yaml` sets `minimumReleaseAge: 4320` (block npm packages younger than 3 days).
- Latest stable dependency versions only; check registries and respect the 3-day age rule.
- Non-standard high ports for dev services (10000–29999), never 3000/5173/8080.
- Commit style: lead with impact, verbose body ok, no AI attribution.

## backend-go

The replacement backend, a single Go binary using pure-Go SQLite (`modernc.org/sqlite`, no cgo). Go is managed by mise (`backend-go/.mise.toml` pins the toolchain); run Go via `mise exec -- go ...` inside `backend-go/`.

- Layout: `cmd/server/` (entrypoint + wiring) and `internal/{signing,photos,auth,messages,store,httpapi}`. Each `internal` package owns one slice of the old backend's behavior; the domain packages define the interfaces, `store` (SQLite) implements them, `httpapi` is the HTTP surface, `cmd/server` wires it all.
- Run tests: `cd backend-go && mise exec -- go test ./...` (add `-race` for the race detector). Vet/build: `mise exec -- go vet ./...` and `mise exec -- go build ./...`.
- Run the server: `cd backend-go && mise exec -- go run ./cmd/server` (config via env vars — see `backend-go/README.md`: `PORT` default `19003`, `DATA_DIR` default `./data`, `BASE_URL`, `ADMIN_EMAILS`, plus magic-link config `AUTH_LINK_SECRET`, `FRONTEND_BASE_URL`, `TEST_LOGIN_SECRET`, `SMTP_*`). Phase 4 deploy sets `PORT=9003` behind Caddy; secrets come from the box env file, never the repo.
- Phase status: 3a (TDD red) and 3b (impl) are done — the tests pass (`go test ./...` and `-race` green). Intentional differences from the legacy backend are in `docs/backend-go-divergences.md`; phase-3b storage-layout / photo-serving / config decisions are in `docs/revival-plan.md`.

## frontend

Svelte 5 SPA (runes), TypeScript strict, vanilla CSS, built with plain Vite (no SvelteKit). Replaced the React 17 app in the Svelte rewrite. It's a client-side SPA on purpose: runtime hostname→environment config, localStorage session, client-gated routes, and ~80 lazy-loaded content modules — nothing to prerender, so the build is static files Caddy serves with the existing `try_files → /index.html` fallback.

- Layout: `frontend/index.html` (Vite entry, loads `/src/main.ts`), `frontend/src/` (app code), `frontend/public/` (static assets served at `/`: emoji SVGs under `website/noto-emojis/`, favicons, fonts, logos, `styles.css`, `robots.txt`, `sitemap.xml`). Build output → `frontend/dist/` (gitignored). Folder structure mirrors the old React tree (`website/`, `i18n/`, `auth/`, `materials/`, `challenges/`, `upload/`, `admin/`, `about/`, `faq/`, `contact/`, `bug-report/`, `front-page/`).
- **`svelte-check` is the type gate** (Vite strips types without checking). Run `pnpm --filter ./frontend check`; CI runs it before the build (`.github/workflows/deploy.yml`). 0 errors is the bar; ~10 a11y WARNINGS are intentional — they mirror React DOM patterns kept for pixel parity (non-interactive click handlers, `<figcaption>` placement, empty `href`), so don't "fix" them.
- **Reactive singletons via runes in `.svelte.ts` modules** instead of React context: `i18n/i18n.svelte.ts` (`__`, `getActiveLocaleCode`, reactive once translations load; HU pinned), `auth/auth.svelte.ts` (session state + magic-link calls), `website/router.svelte.ts` (reactive `location` + `navigate` + `matchPath`). Course timing is a load-time snapshot in `challenges/courseData.ts`. Framework-agnostic logic (I18n, EmojiReplacer, CourseDateConverter, PhotoUploader, OrientationFixer, the admin repositories) stays plain `.ts`, ported near-verbatim from React.
- **Routing** is a hand-rolled history router (no dep). `App.svelte` holds a route table (first match wins, like the old `<Switch>`) and gates member/admin routes client-side by `auth.isAuthenticated` / `auth.isAdmin`; the backend still enforces. Internal links use `website/components/Link.svelte` (the old `NavLink`) and `NavLinkButton.svelte`; plain `<a href>` stays a full navigation. Content modules load via Vite dynamic-import globs (`import(\`../own-content/${lang}/${slug}.svelte\`)` etc.).
- **Content modules** (`materials/{own,third-party}-content/hu/*.svelte`, `challenges/content/hu/*.svelte`): a `<script module>` exports `getMetadata()`; the markup is the default component. MaterialsPage loads every article's metadata for the list, so all must compile.
- **Pixel-parity gotcha (load-bearing):** `styles.css` uses child combinators (`main > *`, `main > ul > li`, `main > img`), so page content must be a DIRECT child of `<main>` — any wrapper div breaks the width/indent rules. Emoji-to-image replacement is therefore a `use:twemoji` action on `<main>` itself (`website/twemoji.ts`), enabled per-route only for the pages the old app wrapped in `<Twemoji>` (about/contact/faq) — NOT materials, which shows a real `😞` on broken articles that must stay a system glyph. The Footer (outside `main`) carries its own `use:twemoji`. The 3 markup-bearing translations + FAQ answers render via `{@html}` (trusted strings).
- Run the dev server: `pnpm --filter ./frontend dev` (Vite on port **18730**, in `vite.config.ts` — non-standard high port). Build: `pnpm --filter ./frontend build`. Preview: `pnpm --filter ./frontend preview`.
- Config: `src/config.ts` picks the backend environment by hostname (`photato.eu*` → production, else development; backend is always `api.photato.eu`). `thirdPartyArticlesBaseUrl` is `https://api.photato.eu/external-articles/`.
- **Auth is magic-link** (`docs/auth-contract.md`), no Auth0. `auth/auth.svelte.ts` + `auth/components/{LoginPage,LoginVerifyPage}.svelte`: email → `/auth/request-link` → "check your inbox"; `/login/verify?token=` → `/auth/verify` → session token in localStorage → `Authorization: Bearer` on API calls; `/auth/me` re-hydrates on load. `isAdmin` is server truth.
- **Analytics is Umami** (`index.html`, `anal.veszelovszki.com/script.js`, website id `75f81a27-3f5a-49f9-bf84-fcec90ee3f5a`, `data-domains="photato.eu"`). Google Analytics, the Facebook Pixel, and its interop shim were all deleted with the React code.
- Deploy: served on the box at the apex `photato.eu` (and `new.photato.eu` alias) by Caddy from `/mnt/HC_Volume_105883537/photato-frontend`; `www` 301s to the apex. A push to `main` touching `frontend/**` runs the CI gate (`svelte-check` + `vite build`, no browsers), then the deploy webhook builds the bundle on the box (throwaway `node:24-alpine`) and rsyncs `dist/` to the served dir (`infra/deploy-webhook/deploy-photato.sh` — unchanged, build command + output path are the same as the old Vite build).

Playwright baseline suite in `e2e/` (a pnpm workspace package). Captures the live photato.eu so the rewrite is checked for regressions; assumes the live site is correct as-is.

- **Docker is required** for screenshots. Pixel baselines are Linux-only, generated inside the pinned Playwright image, never from macOS-native rendering (Playwright stamps the platform onto snapshot names, so a macOS run looks for `-darwin` baselines and fails by design).
- Run against the live target: `pnpm test:e2e:docker` (compare) / `:update` (regenerate) → `e2e/scripts/docker-test.sh`, image tag pinned to the `@playwright/test` version. Run against a **local build**: `e2e/scripts/docker-local-test.sh` builds + serves `vite preview` + runs Playwright, all on localhost in one container; `UPDATE=1` regenerates.
- **Baselines:** 20 public (10 pages × desktop+mobile) are the anonymous parity guard — the Svelte rewrite passes them byte-identical. 6 authenticated (`login`, `upload-member`, `admin-sitemap` × 2) were added for the rewrite.
- **Authenticated specs** drive login through the magic-link backdoor (`POST /auth/test-login`), gated on `TEST_LOGIN_SECRET` in `e2e/.env` (gitignored; value from the box `/etc/photato-deploy.env`) — they skip when it's unset. `support/config.ts` loads `.env` at its top so the secret populates before its `process.env` reads.
- Target-switchable via `BASE_URL` (default `https://photato.eu`). `LEGACY_BACKEND_DEAD` (default true) still blocks the dead AWS hosts, harmless against the current stack. The determinism layer also blocks `anal.veszelovszki.com` (Umami) so screenshots stay deterministic.
- Full details, determinism choices, and layout in `e2e/README.md`.
