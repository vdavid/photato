import type { Page } from '@playwright/test';
import { FROZEN_TIME, LEGACY_BACKEND_DEAD } from './config';

/**
 * Third-party tracker / analytics hosts. These are non-deterministic, slow, and irrelevant to the
 * baseline, so we abort every request to them. Auth0 (photato.eu.auth0.com) and Google Fonts
 * (fonts.gstatic.com / fonts.googleapis.com) are deliberately NOT here — the app blocks first render
 * on `document.fonts.ready` and on the Auth0 client, so both must be allowed through.
 */
const TRACKER_HOST_FRAGMENTS = [
  'connect.facebook.net',
  'facebook.com/tr',
  'www.facebook.com/tr',
  'google-analytics.com',
  'www.google-analytics.com',
  'analytics.google.com',
  'googletagmanager.com',
  'stats.g.doubleclick.net',
  'doubleclick.net',
  'logrocket.com',
  'logrocket.io',
  'lr-ingest',
  'lr-in-prod',
  'cdn.lr-',
  // Umami (self-hosted analytics) replaced the old GA/Facebook trackers in the Svelte rewrite. Its
  // `data-domains="photato.eu"` already stops it sending events off production, but block the script
  // host too so tests never wait on it and screenshots stay deterministic.
  'anal.veszelovszki.com',
];

/**
 * The dead legacy backend (AWS API Gateway + CloudFront). Blocked so pages fail fast and
 * deterministically instead of hanging on 502s. Sourced from frontend/src/config.jsx.
 */
const DEAD_BACKEND_HOST_FRAGMENTS = [
  '971tlzc7le.execute-api.us-east-1.amazonaws.com',
  'dglg96wn4of1.cloudfront.net',
];

/**
 * Third-party article images (config.jsx thirdPartyArticlesBaseUrl). They load slowly and
 * inconsistently, which shifts full-page layout height between runs, so we always block them and let
 * article pages render a stable, image-free layout — the baseline tests page structure and text, not
 * inherently non-deterministic external image content.
 *
 * Two hosts because the baselines were captured against the legacy site (images from the S3 bucket)
 * and Phase 5 repoints the base URL to the Go backend's `/external-articles/` path. Blocking both keeps
 * the image-free layout identical on either target. `/external-articles` is specific enough not to
 * touch the backend's other `api.photato.eu` routes.
 */
const NONDETERMINISTIC_ASSET_HOST_FRAGMENTS = [
  'photato-photos-bucket.s3',
  'api.photato.eu/external-articles',
];

async function abortHosts(page: Page, fragments: string[]): Promise<void> {
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (fragments.some((f) => url.includes(f))) {
      return route.abort();
    }
    return route.fallback();
  });
}

/** Block trackers on any test (public or authenticated). */
export async function blockTrackers(page: Page): Promise<void> {
  await abortHosts(page, TRACKER_HOST_FRAGMENTS);
}

/** Block the dead legacy backend. Called only while LEGACY_BACKEND_DEAD is true. */
export async function blockDeadBackend(page: Page): Promise<void> {
  await abortHosts(page, DEAD_BACKEND_HOST_FRAGMENTS);
}

/** Block remote assets that shift layout non-deterministically (third-party S3 article images). */
export async function blockNonDeterministicAssets(page: Page): Promise<void> {
  await abortHosts(page, NONDETERMINISTIC_ASSET_HOST_FRAGMENTS);
}

/**
 * Apply everything an anonymous, reproducible screenshot needs: a frozen clock (installed before any
 * navigation so app bootstrap sees the fixed date) plus tracker / non-deterministic-asset blocking, and
 * — while the legacy backend is dead — backend blocking so pages fail fast instead of hanging on 502s.
 * Call before goto().
 */
export async function applyAnonymousDeterminism(page: Page): Promise<void> {
  // Freeze time before the app's modules load and instantiate CourseDateConverter.
  await page.clock.install({ time: FROZEN_TIME });
  await blockTrackers(page);
  await blockNonDeterministicAssets(page);
  if (LEGACY_BACKEND_DEAD) {
    await blockDeadBackend(page);
  }
}

/**
 * The app renders a full-page loading indicator until translations + fonts + Auth0 are ready, then
 * swaps in the real page. Wait for that swap by waiting for the navigation bar to appear.
 */
export async function waitForAppReady(page: Page): Promise<void> {
  await page.locator('header[role="navigation"]').waitFor({ state: 'visible' });
}
