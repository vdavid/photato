/**
 * Shared configuration for the baseline suite.
 *
 * Everything target-specific funnels through here so the same suite can run against the live site
 * (`https://photato.eu`) or a local `vite preview` build by changing env vars only.
 */
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load e2e/.env here, at the top of the module every other file imports, so `.env`-only values (e.g.
// TEST_LOGIN_SECRET) are populated before the `process.env` reads below run. (playwright.config.ts
// imports this module before its own dotenv call, so relying on that alone would read too early.)
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

/** Target under test. Default is the live site. */
export const BASE_URL = process.env.BASE_URL ?? 'https://photato.eu';

/**
 * Block the dead legacy AWS/Mongo backend hosts (they still resolve but 502). Defaults on and is
 * harmless against the current stack — the Svelte app never calls those hosts — but it keeps pages
 * from ever hanging on them if a stale reference resurfaces.
 */
export const LEGACY_BACKEND_DEAD = (process.env.LEGACY_BACKEND_DEAD ?? 'true') !== 'false';

/**
 * Frozen wall clock for anonymous/public pages.
 *
 * The site computes course dates and "current week" from the current date (config.ts _calculateDates
 * + CourseDateConverter). The 2020 winter course ended in early 2021, so any date well past it puts the
 * site in its stable "course complete" state — all 12 weeks of materials shown, every countdown in the
 * past. That is exactly what a real visitor sees today, and pinning it to a fixed instant makes re-runs
 * (and future baseline regens) reproduce byte-for-byte.
 *
 * Used for BOTH anonymous and authenticated specs: magic-link session tokens are validated server-side
 * (opaque tokens, DB-checked expiry) and carry no client-clock-sensitive iat/exp, so freezing the page
 * clock is safe and keeps course-derived text (e.g. the upload page's week number) deterministic.
 */
export const FROZEN_TIME = new Date('2026-07-01T12:00:00+02:00');

/**
 * Magic-link e2e backdoor. `POST /auth/test-login {email, secret}` mints a session token without the
 * email round-trip (see docs/auth-contract.md). The authenticated specs use it to drive logged-in
 * pages. The secret lives only in the gitignored `.env`; when unset, those specs skip.
 */
export const API_BASE_URL = process.env.API_BASE_URL ?? 'https://api.photato.eu';
export const TEST_LOGIN_SECRET = process.env.TEST_LOGIN_SECRET ?? '';

/** An admin email — must be in the backend's `ADMIN_EMAILS`, so a backdoor session for it is admin. */
export const ADMIN_EMAIL = 'veszelovszki@gmail.com';
/** A non-admin member email (any address not in `ADMIN_EMAILS`). */
export const MEMBER_EMAIL = 'e2e-member@photato.eu';

/**
 * Public routes, enumerated from the route table in frontend/src/website/components/App.svelte.
 * The site forces locale hu-HU (i18nHelper.getDefaultLocaleCodeByNavigatorPreferences), so all copy
 * is Hungarian regardless of the browser Accept-Language.
 */
export const PUBLIC_ROUTES = {
  front: '/',
  about: '/about',
  faq: '/faq',
  contact: '/contact',
  materials: '/materials',
  bugReport: '/bug-report',
  // Real cached third-party article (slug from sitemap.xml). Note the /hu/ language prefix the
  // router requires for article routes (`/:languageCode/external-article/:slug`).
  externalArticle: '/hu/external-article/sg-makrofotozas-1',
  // Real own article (slug from frontend/src/materials/own-content/hu/).
  ownArticle: '/hu/article/focus',
} as const;

/**
 * Protected routes. Logged out, the app renders the "members only" Error403Page for every one of these
 * (it does NOT redirect). Enumerated from the member/admin route entries in App.svelte.
 */
export const MEMBER_ROUTES = ['/upload', '/course', '/challenges/1'] as const;
export const ADMIN_ROUTES = [
  '/admin',
  '/admin/messages',
  '/admin/message/example',
  '/admin/photos',
  '/admin/sitemap-generator',
] as const;

/** A path that matches no route → Error404Page. */
export const NOT_FOUND_ROUTE = '/this-route-does-not-exist';
