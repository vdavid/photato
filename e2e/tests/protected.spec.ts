import { test, expect } from '@playwright/test';
import { MEMBER_ROUTES, ADMIN_ROUTES } from '../support/config';
import { applyAnonymousDeterminism, waitForAppReady } from '../support/determinism';

/**
 * Protected routes while logged out. The app renders the "members only" Error403Page for every member
 * and admin route (it does NOT redirect to a login page). The functional assertion per route is the
 * valuable regression guard: it catches a route accidentally becoming public. All these routes share
 * one visual state, so we baseline it once (via /upload) rather than duplicating an identical
 * screenshot for each.
 */

test.beforeEach(async ({ page }) => {
  await applyAnonymousDeterminism(page);
});

const MEMBERS_ONLY_TEXT = 'Ezt az oldal csak regisztrált felhasználóknak szól. Jelentkezz be vagy regisztrálj itt:';

for (const path of [...MEMBER_ROUTES, ...ADMIN_ROUTES]) {
  test(`logged out: ${path} shows the members-only 403`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    await waitForAppReady(page);
    await expect(page).toHaveTitle('403-as hiba - Photato');
    await expect(page.getByRole('heading', { name: '403-as hiba' })).toBeVisible();
    await expect(page.getByText(MEMBERS_ONLY_TEXT)).toBeVisible();
  });
}

test('members-only 403 page baseline', async ({ page }) => {
  await page.goto('/upload', { waitUntil: 'networkidle' });
  await waitForAppReady(page);
  await expect(page.getByRole('heading', { name: '403-as hiba' })).toBeVisible();
  await expect(page).toHaveScreenshot('error-403-members.png', { fullPage: true });
});
