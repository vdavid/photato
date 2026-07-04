/**
 * Shared configuration for the baseline suite.
 *
 * Everything target-specific funnels through here so the same suite can run against the current
 * live legacy site and, later, the new Hetzner deployment (Phase 5) by changing env vars only.
 */

/** Target under test. Default is the live legacy site. Phase 5 repoints this. */
export const BASE_URL = process.env.BASE_URL ?? 'https://photato.eu';

/**
 * Is the legacy AWS/Mongo backend dead (502)?
 *
 * When true (current state), backend-dependent authenticated pages (upload, course, admin photos)
 * render error/garbage states, so we assert only the deterministic parts and skip baselining them.
 * Phase 5 sets LEGACY_BACKEND_DEAD=false once the Go backend is live, which is the flag Phase 5 flips
 * to turn on the upload/course functional baselines.
 */
export const LEGACY_BACKEND_DEAD = (process.env.LEGACY_BACKEND_DEAD ?? 'true') !== 'false';

/**
 * Frozen wall clock for anonymous/public pages.
 *
 * The site computes course dates and "current week" from the current date (config.mjs _calculateDates
 * + CourseDateConverter). The 2020 winter course ended in early 2021, so any date well past it puts the
 * site in its stable "course complete" state — all 12 weeks of materials shown, every countdown in the
 * past. That is exactly what a real visitor sees today, and pinning it to a fixed instant makes re-runs
 * (and future baseline regens) reproduce byte-for-byte.
 *
 * NOTE: the clock is frozen only for anonymous pages. The authenticated flow uses the real clock so the
 * live Auth0 token's iat/exp validate (a frozen past clock would make a freshly issued token look
 * future-dated and get rejected as clock skew).
 */
export const FROZEN_TIME = new Date('2026-07-01T12:00:00+02:00');

/**
 * Test user (real Auth0 account). Password lives only in the gitignored .env.
 *
 * NOTE: the live Auth0 client (classic Lock) exposes ONLY "Sign in with Google" — there is no
 * username/password form to drive, so an automated end-to-end login is not possible today. We assert
 * the login handshake instead (see tests/auth.spec.ts). These stay here for Phase 5, which revisits an
 * automatable auth path (the planned magic-link/passkey system, an Auth0 test DB connection, or token
 * injection) to enable logged-in baselines.
 */
export const USER_EMAIL = process.env.E2E_USER_EMAIL ?? 'test@photato.eu';
export const USER_PASSWORD = process.env.E2E_USER_PASSWORD ?? '';

/** Auth0 domain + production SPA client id (frontend/src/config.mjs). Used to verify the login wiring. */
export const AUTH0_DOMAIN = 'photato.eu.auth0.com';
export const AUTH0_PROD_CLIENT_ID = 'S31BLLD6U12BnIt92b5yq5xAQ1Dt37ey';

/**
 * Public routes, enumerated from the React router in frontend/src/website/components/App.mjs.
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
 * (it does NOT redirect). Enumerated from App.mjs _getMemberRoutes / _getAdminRoutes.
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
