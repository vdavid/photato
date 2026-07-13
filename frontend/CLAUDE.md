# Frontend (Svelte 5 SPA)

The Photato web app: Svelte 5 (runes), TypeScript strict, vanilla CSS, built with plain Vite (no SvelteKit). It's a client-side SPA on purpose — runtime hostname→environment config, localStorage session, client-gated routes, and ~80 lazy-loaded content modules mean there's nothing to prerender, so the build is static files Caddy serves with a `try_files → /index.html` fallback.

## Stack and commands

- Dev server: `pnpm --filter ./frontend dev` (Vite on port **18730**, `strictPort`, set in `vite.config.ts` — a non-standard high port). Build: `pnpm --filter ./frontend build` → `dist/` (gitignored). Preview: `pnpm --filter ./frontend preview`.
- **`svelte-check` is the type gate** — Vite strips types without checking, so a type error would otherwise ship. Run `pnpm --filter ./frontend check`. 0 errors is the bar; ~10 a11y **warnings** are intentional (DOM patterns kept for pixel parity — non-interactive click handlers, `<figcaption>` placement, empty `href`). Don't "fix" them.

## Lint and format

- **Lint:** `pnpm --filter ./frontend lint` (`lint:fix` to autofix). ESLint flat config (`eslint.config.js` here): `typescript-eslint` **strictTypeChecked** + `eslint-plugin-svelte`. `no-console` is warn-level; **0 errors is the bar**, warnings don't gate.
- **Format:** `pnpm --filter ./frontend format` (`format:check` to verify). **oxfmt** owns `.ts`/`.js`/`.json`/`index.html` (root `.oxfmtrc.json`, 2-space); **prettier + prettier-plugin-svelte** owns `.svelte` (root `.prettierrc`, 4-space markup — oxfmt doesn't parse Svelte).
- Inline disables each carry a `-- reason` (trusted `{@html}` renders, `{@render}` void false-positive, route-table `Component<any>`). Legacy accepted-but-unused props (`alt`, `baseUrl`) destructure to `_`-prefixed locals.
- **Gotcha:** prettier-plugin-svelte normalizes attribute quotes to double, corrupting values with embedded double quotes. `.prettierignore` (here) excludes `materials/third-party-content/hu/origo-fotozas-az-allatkertben.svelte` for that; keep such values as single-quoted attributes or `{'…'}` expressions.

## Layout

- `index.html` — Vite entry, loads `/src/main.ts`.
- `src/` — app code by feature: `website/`, `i18n/`, `auth/`, `materials/`, `challenges/`, `upload/`, `admin/`, `about/`, `faq/`, `contact/`, `bug-report/`, `front-page/`; plus `config.ts` and `main.ts`.
- `public/` — static assets served at `/`: emoji SVGs under `website/noto-emojis/`, favicons, fonts, logos, `styles.css`, `robots.txt`, `sitemap.xml`.

## Patterns

- **Reactive singletons via runes in `.svelte.ts` modules**: `i18n/i18n.svelte.ts` (`__`, `getActiveLocaleCode`; reactive once translations load; HU pinned), `auth/auth.svelte.ts` (session state + magic-link calls), `website/router.svelte.ts` (reactive `location` + `navigate` + `matchPath`). Course timing is a load-time snapshot in `challenges/courseData.ts`.
- **Framework-agnostic logic stays plain `.ts`**: I18n, EmojiReplacer, CourseDateConverter, PhotoUploader, OrientationFixer, the admin repositories.
- **Routing** is a hand-rolled history router (no dep). `App.svelte` holds a first-match-wins route table and gates member/admin routes client-side by `auth.isAuthenticated` / `auth.isAdmin` — **the backend still enforces**; the gate is only UX. Internal links use `website/components/Link.svelte` and `NavLinkButton.svelte`; a plain `<a href>` stays a full navigation.
- **Content modules** (`materials/{own,third-party}-content/hu/*.svelte`, `challenges/content/hu/*.svelte`): a `<script module>` exports `getMetadata()`; the markup is the default component. They load via Vite dynamic-import globs. MaterialsPage loads every article's metadata for the list, so **all content modules must compile**.

## Pixel-parity gotcha (load-bearing)

`public/styles.css` uses child combinators (`main > *`, `main > ul > li`, `main > img`), so page content **must be a direct child of `<main>`** — any wrapper div breaks the width/indent rules. Consequences:

- Emoji-to-image replacement is a `use:twemoji` action on `<main>` itself (`website/twemoji.ts`), enabled **per-route only** for the pages the old app wrapped in `<Twemoji>`: about, contact, faq. **NOT materials** — that page shows a real `😞` on broken articles that must stay a system glyph. The Footer (outside `<main>`) carries its own `use:twemoji`.
- The 3 markup-bearing translations + FAQ answers render via `{@html}` (trusted strings).

## Config, auth, analytics

- **Config** (`src/config.ts`): picks the backend environment by hostname (`photato.eu*` → production, else development). The backend is always `api.photato.eu`. `thirdPartyArticlesBaseUrl` is `https://api.photato.eu/external-articles/`.
- **Auth is magic-link** (`docs/auth-contract.md`), no Auth0. `auth/auth.svelte.ts` + `auth/components/{LoginPage,LoginVerifyPage}.svelte`: email → `POST /auth/request-link` → "check your inbox"; `/login/verify?token=` → `POST /auth/verify` → session token in localStorage → `Authorization: Bearer` on API calls; `GET /auth/me` re-hydrates on load. `isAdmin` is server truth.
- **Analytics is Umami, loaded first-party** (`index.html`: `src="/mami.js"`, website id `75f81a27-3f5a-49f9-bf84-fcec90ee3f5a`, `data-domains="photato.eu"`). Caddy proxies `/mami.js` → the umami container's `/script.js` and `/api/send` → umami on the photato.eu origin (see the photato.eu block in the infra repo's Caddyfile), so adblockers only see same-origin requests. Don't point the tag at the analytics host directly and don't add explanatory HTML comments to `index.html` — Vite ships them to production verbatim, and naming the analytics host in served HTML defeats the evasion. Cookieless, so no consent banner. If you add analytics, preserve the cookieless property.

## Deploy

The build is served on the box at the apex `photato.eu` (and `new.photato.eu` alias) by Caddy from `/mnt/HC_Volume_105883537/photato-frontend`. A push to `main` touching `frontend/**` runs the CI gate (`./scripts/check.sh --ci`, no browsers), then the deploy webhook builds the bundle on the box (throwaway `node:24-alpine`) and rsyncs `dist/` to the served dir. See `infra/CLAUDE.md`.
