import { test, expect } from '@playwright/test';
import { AUTH0_DOMAIN, AUTH0_PROD_CLIENT_ID, BASE_URL } from '../support/config';
import { applyAnonymousDeterminism, waitForAppReady } from '../support/determinism';

/**
 * Login handshake.
 *
 * The live Auth0 client (classic Lock) exposes only "Sign in with Google" — there is no
 * username/password form to automate, and driving Google's OAuth headlessly is infeasible and
 * inappropriate. So instead of a full logged-in session, we assert the deterministic, in-our-control
 * part of the flow: the frontend hands off to Auth0's /authorize with the right client_id and the
 * /login-callback redirect_uri. This is exactly the wiring the Vite / TypeScript / Svelte rewrites must
 * preserve. Logged-in baselines (upload, course, admin, authenticated front page) are deferred to
 * Phase 5, which introduces an automatable auth path.
 */

test.beforeEach(async ({ page }) => {
  await applyAnonymousDeterminism(page);
});

test('sign-in hands off to Auth0 with the right client and callback', async ({ page }) => {
  // The members-only 403 page has a "Sign in" button that is always visible (not tucked in the mobile
  // hamburger menu), so this works on both viewports.
  await page.goto('/upload', { waitUntil: 'networkidle' });
  await waitForAppReady(page);

  const [authorizeRequest] = await Promise.all([
    page.waitForRequest((r) => r.url().includes(`${AUTH0_DOMAIN}/authorize`), { timeout: 30_000 }),
    page.getByRole('button', { name: 'Bejelentkezés' }).click(),
  ]);

  const url = authorizeRequest.url();
  expect(url).toContain('client_id=');
  expect(decodeURIComponent(url)).toContain('/login-callback');
  // The saved-redirect handler stashes where to return; app wiring, not Auth0's.
  expect(url).toContain('response_type=');

  // Against the default production target, pin the exact client id from config.mjs.
  if (BASE_URL === 'https://photato.eu') {
    expect(url).toContain(`client_id=${AUTH0_PROD_CLIENT_ID}`);
  }
});

test('Auth0 hosted login page loads', async ({ page }) => {
  // Auth0 only renders its hosted login widget for whitelisted origins (Allowed Callback URLs / Web
  // Origins on the SPA client). Production photato.eu is whitelisted; the Phase-5 preview host
  // new.photato.eu (and any localhost preview) is not, so Auth0 returns a "callback mismatch" error
  // page instead of the Lock card. That is an Auth0-dashboard config gap, not an app regression, so we
  // skip the render assertion off production.
  // TODO(David): add https://new.photato.eu to the Auth0 SPA client's Allowed Callback URLs, Web
  // Origins, and Logout URLs (keep photato.eu), then this passes on the preview host too.
  test.skip(
    BASE_URL !== 'https://photato.eu',
    `Auth0 origin not whitelisted for ${BASE_URL}; see TODO to add it in the Auth0 dashboard.`,
  );
  await page.goto('/upload', { waitUntil: 'networkidle' });
  await waitForAppReady(page);

  await Promise.all([
    page.waitForURL(new RegExp(AUTH0_DOMAIN.replace('.', '\\.')), { timeout: 30_000 }),
    page.getByRole('button', { name: 'Bejelentkezés' }).click(),
  ]);

  // We landed on the Auth0 tenant. Confirm the hosted widget rendered (the app title on the Lock card).
  // Not baselined: it is an external page Auth0 can restyle at will.
  await expect(page.getByRole('heading', { name: 'Photato' })).toBeVisible({ timeout: 20_000 });
});
