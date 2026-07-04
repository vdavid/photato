import { test, expect, type Page } from '@playwright/test';
import { PUBLIC_ROUTES } from '../support/config';
import { applyAnonymousDeterminism, waitForAppReady } from '../support/determinism';

/**
 * Anonymous public pages: pixel baseline + functional assertions (title, key Hungarian copy, nav
 * present). Clock frozen, trackers + dead backend blocked. Runs on both desktop and mobile projects.
 */

test.beforeEach(async ({ page }) => {
  await applyAnonymousDeterminism(page);
});

async function open(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'networkidle' });
  await waitForAppReady(page);
}

/**
 * Shared nav sanity that holds on both viewports: the header renders with the Photato logo link home.
 * (The text menu items collapse into a hamburger on mobile, so asserting them here would be
 * viewport-specific and would also risk opening the menu before a screenshot — see navigation.spec.ts
 * for the interactive menu coverage.)
 */
async function expectNav(page: Page): Promise<void> {
  const header = page.locator('header[role="navigation"]');
  await expect(header).toBeVisible();
  await expect(header.locator('a.logoContainer')).toBeVisible();
}

test('front page', async ({ page }) => {
  await open(page, PUBLIC_ROUTES.front);
  await expect(page).toHaveTitle(/Photato/);
  await expect(page.getByRole('heading', { name: 'Tanulj meg fotózni!' })).toBeVisible();
  await expectNav(page);
  await expect(page).toHaveScreenshot('front.png', { fullPage: true });
});

test('about page', async ({ page }) => {
  await open(page, PUBLIC_ROUTES.about);
  await expect(page).toHaveTitle('Rólunk - Photato');
  await expectNav(page);
  await expect(page).toHaveScreenshot('about.png', { fullPage: true });
});

test('FAQ page', async ({ page }) => {
  await open(page, PUBLIC_ROUTES.faq);
  await expect(page).toHaveTitle('Gyakran ismételt kérdések - Photato');
  await expect(page.getByRole('heading', { name: 'Gyakran ismételt kérdések' })).toBeVisible();
  await expect(page).toHaveScreenshot('faq.png', { fullPage: true });
});

test('contact page', async ({ page }) => {
  await open(page, PUBLIC_ROUTES.contact);
  await expect(page).toHaveTitle('Kapcsolat - Photato');
  await expect(page).toHaveScreenshot('contact.png', { fullPage: true });
});

test('materials list', async ({ page }) => {
  await open(page, PUBLIC_ROUTES.materials);
  await expect(page).toHaveTitle('Cikkek fotózás témában - Photato');
  await expect(page.getByRole('heading', { name: 'Cikkek fotózás témában' })).toBeVisible();
  // Articles load async; wait for the list to settle (loading placeholder gone).
  await expect(page.getByText('Töltjük a cikkeket...')).toHaveCount(0);
  await expect(page).toHaveScreenshot('materials.png', { fullPage: true });
});

test('bug report page', async ({ page }) => {
  await open(page, PUBLIC_ROUTES.bugReport);
  await expect(page).toHaveTitle('Hibajelentés - Photato');
  await expect(page).toHaveScreenshot('bug-report.png', { fullPage: true });
});

test('cached external article', async ({ page }) => {
  await open(page, PUBLIC_ROUTES.externalArticle);
  await expect(page.locator('article h1')).toBeVisible();
  // Article body images may come from S3 (still-live bucket) and are not our concern here; mask them.
  await expect(page).toHaveScreenshot('external-article.png', {
    fullPage: true,
    mask: [page.locator('article img')],
  });
});

test('own article', async ({ page }) => {
  await open(page, PUBLIC_ROUTES.ownArticle);
  await expect(page.locator('article h1')).toBeVisible();
  await expect(page).toHaveScreenshot('own-article.png', {
    fullPage: true,
    mask: [page.locator('article img')],
  });
});
