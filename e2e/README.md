# Photato E2E + pixel-baseline suite

Playwright end-to-end tests and pixel-screenshot baselines for **photato.eu**. This suite is the
behavioral safety net for the migration (Phase 2 of `docs/revival-plan.md`): it captures the current
live site so later phases — swapping the backend to Go on Hetzner, then moving the frontend to Vite,
TypeScript, and eventually Svelte — can be checked for regressions. It assumes the current live site is
correct as-is.

It lives at the repo root (not under `frontend/`) on purpose: it must outlive every frontend
implementation swap.

## Requirements

- **Docker** — pixel baselines are **Linux-only**. They must be generated inside the pinned Playwright
  image, never from macOS-native rendering, or fonts and anti-aliasing differ. Playwright stamps the
  platform onto snapshot filenames (`…-linux.png`), so running on macOS looks for `-darwin` snapshots,
  finds none, and fails loudly. That is the intended guard.
- **pnpm** (the repo is pnpm-only).

## Setup

```bash
cp e2e/.env.example e2e/.env   # then fill in E2E_USER_PASSWORD (see the team password store)
```

`.env` is gitignored and holds the real Auth0 test-user password. Never commit it. It is not used by
the current suite (see "Auth" below) but is kept ready for Phase 5.

## Auth

The live Auth0 client (classic Lock) exposes **only "Sign in with Google"** — there is no
username/password form to drive, and automating Google's OAuth headlessly is infeasible and
inappropriate. So the suite does **not** log in. Instead `tests/auth.spec.ts` asserts the deterministic,
in-our-control part of the flow: clicking "Sign in" hands off to Auth0's `/authorize` with the correct
`client_id` and the `/login-callback` redirect URI (the wiring every frontend rewrite must preserve),
and that the Auth0 hosted page responds.

Logged-in baselines (authenticated front page, upload, course, admin) are **deferred to Phase 5**, when
the new backend is live and there is an automatable auth path (the planned magic-link/passkey system,
an Auth0 test database connection, or direct token injection).

## Running

Always run through Docker for anything that compares or writes screenshots:

```bash
pnpm test:e2e:docker            # run the suite against the committed baselines
pnpm test:e2e:docker:update     # (re)generate the baselines (do this on Linux/Docker only)
pnpm test:e2e:report            # open the last HTML report
```

Pass extra `playwright test` args through the Docker runner:

```bash
bash e2e/scripts/docker-test.sh --grep "front page"
bash e2e/scripts/docker-test.sh --project desktop
```

The image tag in `scripts/docker-test.sh` is pinned to the `@playwright/test` version in
`package.json`. Bump them together.

Non-Docker scripts (`pnpm --filter e2e test:e2e`) exist for writing/debugging test logic on the host,
but they will **not** match the committed Linux baselines — use `--update-snapshots` locally only to
iterate on structure, and regenerate the real baselines in Docker before committing.

## Determinism

Everything that could make two renders differ is pinned:

- **Clock** — anonymous pages freeze the clock to `2026-07-01T12:00:00+02:00`. The 2020 winter course
  is long over, so any date past it puts the site in its stable "course complete" state (all 12 weeks
  of materials, every countdown in the past) — the same thing a real visitor sees today. The
  authenticated flow uses the **real** clock, because the live Auth0 token's validity is checked
  against wall-clock time and a frozen past clock would reject a freshly issued token as skew.
- **Locale / timezone** — `hu-HU`, `Europe/Budapest`. (The app hard-forces `hu-HU` anyway.)
- **Viewports** — desktop `1280×720` and mobile `390×844`, both at `deviceScaleFactor: 1`.
- **Trackers blocked** — Facebook pixel, Google Analytics, LogRocket, DoubleClick are aborted via route
  interception. Auth0 and Google Fonts are allowed (the app blocks first render on both).
- **Dead legacy backend blocked** — the AWS API Gateway + CloudFront hosts (502) are aborted so pages
  fail fast instead of hanging. Gated on `LEGACY_BACKEND_DEAD`.
- **Third-party article images blocked** — the S3 content bucket loads slowly/inconsistently and shifts
  full-page height; blocking it keeps article pages image-free and stable (structure + text is what the
  baseline guards).
- **Animations/transitions disabled**, carets hidden, remote/account-specific images masked.
- **Screenshot threshold** — `maxDiffPixelRatio: 0.01` (1%): tight enough to catch layout/content/color
  regressions, loose enough to absorb sub-pixel font anti-aliasing jitter.

## Layout

- `playwright.config.ts` — projects, viewports, determinism defaults.
- `support/config.ts` — route inventory, `BASE_URL`, `LEGACY_BACKEND_DEAD`, frozen clock, test user.
- `support/determinism.ts` — clock freeze, tracker/backend blocking, app-ready wait.
- `support/screenshot.css` — injected at screenshot time to kill animations.
- `tests/public.spec.ts` — anonymous public pages (front, about, faq, contact, materials, bug-report,
  cached external article, own article) with baselines.
- `tests/protected.spec.ts` — member + admin routes logged out (all render the members-only 403).
- `tests/navigation.spec.ts` — 404 page and client-side nav (opens the mobile hamburger when needed).
- `tests/auth.spec.ts` — login handshake (redirect to Auth0 `/authorize` with the right client/callback).
- `tests/__screenshots__/` — the committed Linux baselines (`…-linux.png`).

## Running against the new stack (Phase 5)

The suite is target-switchable by env:

- `BASE_URL` — defaults to `https://photato.eu`; point it at the Hetzner deployment to run the same
  suite there.
- `LEGACY_BACKEND_DEAD` — defaults to `true`. While true, backend-dependent authenticated pages
  (upload, course, admin photos) are asserted only at the handshake level and their baselines are
  skipped, because the dead backend renders error garbage. **Phase 5 sets `LEGACY_BACKEND_DEAD=false`**
  once the Go backend is live, which enables the wired-but-skipped upload/course baselines in
  `authenticated.spec.ts`.
