# Photato E2E + pixel-baseline suite

Playwright end-to-end tests and pixel-screenshot baselines for **photato.eu**. It has two jobs:

- **Parity guard.** The 20 public baselines were captured against the pre-rewrite live site and the
  Svelte rewrite passes them byte-identical, so any anonymous-page regression shows up as a pixel diff.
- **Authenticated coverage.** Six more baselines and a set of behavioral checks exercise the new
  self-hosted magic-link auth and the logged-in member/admin pages.

It lives at the repo root as its own pnpm workspace package (not under `frontend/`) on purpose: it must
outlive any future frontend implementation swap.

## Requirements

- **Docker** — pixel baselines are **Linux-only**. They must be generated inside the pinned Playwright
  image, never from macOS-native rendering, or fonts and anti-aliasing differ. Playwright stamps the
  platform onto snapshot filenames (`…-linux.png`), so running on macOS looks for `-darwin` snapshots,
  finds none, and fails loudly. That is the intended guard.
- **pnpm** (the repo is pnpm-only).

## Setup

```bash
cp e2e/.env.example e2e/.env   # then fill in TEST_LOGIN_SECRET
```

`.env` is gitignored — never commit it. `TEST_LOGIN_SECRET` enables the magic-link e2e backdoor that
the authenticated specs use (see "Auth" below). Get it from the box:

```bash
ssh hetzner "docker run --rm -v /etc/photato-deploy.env:/f:ro alpine grep TEST_LOGIN_SECRET /f"
```

When it's unset, the authenticated specs **skip** — the anonymous public suite still runs, so you can
work on parity without the secret.

## Auth

Auth is self-hosted passwordless email magic links (no Auth0, no Google social login, no password).
There's no third-party login redirect to assert anymore, so the suite covers auth two ways:

- **`tests/auth.spec.ts`** drives the in-our-control login UI: the `/login` page renders its email form,
  requesting a link flips to the "check your inbox" state (the request-link POST is stubbed 200 so tests
  never send real email and stay offline-deterministic — the backend returns 200 regardless anyway, to
  avoid account enumeration), and the members-only 403 page's "Bejelentkezés" button routes client-side
  to `/login`.
- **`tests/authenticated.spec.ts`** drives logged-in pages through the e2e backdoor: `POST
  /auth/test-login {email, secret}` mints a real session token server-side, the test seeds it into
  `localStorage`, and the app re-hydrates via `/auth/me` — exactly the runtime path, minus the email
  round-trip. See `docs/auth-contract.md`.

## Running

Always run through Docker for anything that compares or writes screenshots.

Against the **live target** (`docker-test.sh`):

```bash
pnpm test:e2e:docker            # run the suite against the committed baselines
pnpm test:e2e:docker:update     # (re)generate the baselines (Linux/Docker only)
pnpm test:e2e:report            # open the last HTML report
```

Against a **local build** before deploying (`docker-local-test.sh` — builds the frontend, serves it with
`vite preview`, and runs Playwright, all on `localhost` inside one container):

```bash
bash e2e/scripts/docker-local-test.sh                  # run against the local build
bash e2e/scripts/docker-local-test.sh --grep upload    # pass extra `playwright test` args through
UPDATE=1 bash e2e/scripts/docker-local-test.sh         # (re)generate baselines against the local build
```

Pass extra `playwright test` args through the live runner too:

```bash
bash e2e/scripts/docker-test.sh --grep "front page"
bash e2e/scripts/docker-test.sh --project desktop
```

The image tag in both scripts is pinned to the `@playwright/test` version in `package.json`. Bump them
together.

Non-Docker scripts (`pnpm --filter e2e test:e2e`) exist for writing/debugging test logic on the host,
but they will **not** match the committed Linux baselines — use `--update-snapshots` locally only to
iterate on structure, and regenerate the real baselines in Docker before committing.

## Determinism

Everything that could make two renders differ is pinned:

- **Clock** — frozen to `2026-07-01T12:00:00+02:00` for **all** specs, anonymous and authenticated. The
  2020 winter course is long over, so any date past it puts the site in its stable "course complete"
  state (all 12 weeks of materials, every countdown in the past) — the same thing a real visitor sees
  today — and pinning it makes re-runs reproduce byte-for-byte. Freezing is safe on the authenticated
  specs too: magic-link session tokens are opaque and validated server-side, with no
  client-clock-sensitive claims, so a frozen page clock never rejects a freshly minted token.
- **Locale / timezone** — `hu-HU`, `Europe/Budapest`. (The app hard-forces `hu-HU` anyway.)
- **Viewports** — desktop `1280×720` and mobile `390×844`, both at `deviceScaleFactor: 1`.
- **Trackers blocked** — Facebook pixel, Google Analytics, LogRocket, DoubleClick, and the self-hosted
  Umami script (`anal.veszelovszki.com`) are aborted via route interception. Google Fonts
  (`fonts.gstatic.com` / `fonts.googleapis.com`) are allowed through: the app blocks first render on
  `document.fonts.ready`.
- **Dead legacy backend blocked** — the AWS API Gateway + CloudFront hosts (502) are aborted so pages
  fail fast instead of hanging. Gated on `LEGACY_BACKEND_DEAD` (default on; harmless against the current
  stack, which never calls those hosts).
- **Third-party article images blocked** — the legacy S3 content bucket and `api.photato.eu/external-articles`
  load slowly/inconsistently and shift full-page height; blocking both keeps article pages image-free and
  stable (structure + text is what the baseline guards).
- **Animations/transitions disabled**, carets hidden, remote/account-specific images masked.
- **Screenshot threshold** — `maxDiffPixelRatio: 0.01` (1%): tight enough to catch layout/content/color
  regressions, loose enough to absorb sub-pixel font anti-aliasing jitter.

## Baselines

26 committed Linux baselines (`…-linux.png`), each captured on desktop and mobile:

- **20 public** (10 pages × 2 viewports, anonymous) — the parity guard, byte-identical to the
  pre-rewrite site: front, about, faq, contact, materials, bug-report, a cached external article, an own
  article, the members-only 403, and the 404 page.
- **6 authenticated** (3 × 2 viewports) — `login`, `upload-member`, and `admin-sitemap`. The admin
  messages/photos pages pull live backend data, so those specs assert only that they render (past the
  admin gate), without a screenshot.

## Layout

- `playwright.config.ts` — projects, viewports, determinism defaults.
- `support/config.ts` — loads `.env`; route inventory, `BASE_URL`, `API_BASE_URL`, `LEGACY_BACKEND_DEAD`,
  frozen clock, `TEST_LOGIN_SECRET`, admin/member test emails.
- `support/determinism.ts` — clock freeze, tracker/backend/asset blocking, app-ready wait.
- `support/screenshot.css` — injected at screenshot time to kill animations.
- `tests/public.spec.ts` — anonymous public pages (front, about, faq, contact, materials, bug-report,
  cached external article, own article) with baselines.
- `tests/protected.spec.ts` — member + admin routes logged out (all render the members-only 403).
- `tests/navigation.spec.ts` — 404 page and client-side nav (opens the mobile hamburger when needed).
- `tests/auth.spec.ts` — magic-link login UI (page renders, "check your inbox" state, 403 "Sign in"
  button → `/login`).
- `tests/authenticated.spec.ts` — logged-in member/admin pages via the `POST /auth/test-login` backdoor
  (skips when `TEST_LOGIN_SECRET` is unset).
- `tests/__screenshots__/` — the committed Linux baselines (`…-linux.png`), split by viewport.

## Running against a different target

The suite is target-switchable by env:

- `BASE_URL` — defaults to `https://photato.eu`; point it at another deployment to run the same suite
  there, e.g. `BASE_URL=https://new.photato.eu pnpm test:e2e:docker`. `docker-local-test.sh` sets it to
  the containerized `vite preview` URL automatically.
- `API_BASE_URL` — defaults to `https://api.photato.eu`; the backend the test-login backdoor hits.
- `LEGACY_BACKEND_DEAD` — defaults to `true` (blocks the dead AWS/CloudFront hosts). The current stack
  never hits those hosts, so the flag makes no difference on the pages this suite baselines; leave it at
  the default.
