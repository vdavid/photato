import { test, expect, type Page, type APIRequestContext } from '@playwright/test'
import { API_BASE_URL, TEST_LOGIN_SECRET, ADMIN_EMAIL, MEMBER_EMAIL } from '../support/config'
import { applyAnonymousDeterminism, waitForAppReady } from '../support/determinism'

/**
 * Logged-in coverage, driven through the magic-link e2e backdoor (`POST /auth/test-login`, see
 * docs/auth-contract.md). We mint a real session token server-side, seed it into localStorage, and let
 * the app re-hydrate via `/auth/me` — exactly the runtime path, minus the email round-trip.
 *
 * Baselines: the upload page (a deterministic "course is over" state) and the admin sitemap generator
 * (fully static, computed client-side). The admin messages/photos pages pull live backend data, so we
 * assert only that they render (not 403) without a screenshot. The frozen clock keeps course-derived
 * text (the upload week number, the sitemap's `<lastmod>`) stable — safe here because session tokens
 * are opaque and validated server-side, with no client-clock-sensitive claims.
 *
 * Skips entirely when TEST_LOGIN_SECRET is unset (e.g. CI, or a contributor without the box secret).
 */

test.describe('authenticated pages', () => {
  test.skip(!TEST_LOGIN_SECRET, 'Set TEST_LOGIN_SECRET in e2e/.env to run the authenticated specs.')

  async function backdoorLogin(page: Page, request: APIRequestContext, email: string): Promise<void> {
    const response = await request.post(`${API_BASE_URL}/auth/test-login`, {
      data: { email, secret: TEST_LOGIN_SECRET },
      headers: { 'Content-Type': 'application/json' },
    })
    expect(response.ok(), `test-login failed with ${String(response.status())}`).toBeTruthy()
    const { sessionToken } = (await response.json()) as { sessionToken: string }
    await page.addInitScript((token) => {
      window.localStorage.setItem('sessionToken', token)
    }, sessionToken)
  }

  test.beforeEach(async ({ page }) => {
    await applyAnonymousDeterminism(page)
  })

  test('member: the upload page renders', async ({ page, request }) => {
    await backdoorLogin(page, request, MEMBER_EMAIL)
    await page.goto('/upload', { waitUntil: 'networkidle' })
    await waitForAppReady(page)
    await expect(page).toHaveTitle('Fotó feltöltés - Photato')
    await expect(page.getByRole('heading', { name: 'Fotó feltöltés' })).toBeVisible()
    await expect(page).toHaveScreenshot('upload-member.png', { fullPage: true })
  })

  test('admin: the sitemap generator renders', async ({ page, request }) => {
    await backdoorLogin(page, request, ADMIN_EMAIL)
    await page.goto('/admin/sitemap-generator', { waitUntil: 'networkidle' })
    await waitForAppReady(page)
    await expect(page.getByRole('heading', { name: 'Sitemap generátor' })).toBeVisible()
    await expect(page).toHaveScreenshot('admin-sitemap.png', { fullPage: true })
  })

  test('admin: home, messages, and photos render (admin gate passes)', async ({ page, request }) => {
    await backdoorLogin(page, request, ADMIN_EMAIL)

    await page.goto('/admin', { waitUntil: 'networkidle' })
    await waitForAppReady(page)
    await expect(page.getByRole('link', { name: 'Fotók' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Üzenetek' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sitemap generátor' })).toBeVisible()

    // Live-data pages: assert they render past the admin gate; data varies so no screenshot.
    await page.goto('/admin/messages', { waitUntil: 'networkidle' })
    await waitForAppReady(page)
    await expect(page.getByRole('heading', { name: 'Üzenetek' })).toBeVisible()

    await page.goto('/admin/photos', { waitUntil: 'networkidle' })
    await waitForAppReady(page)
    await expect(page.getByRole('heading', { name: /Photos for week/ })).toBeVisible()
  })

  test('a non-admin member gets a 403 on an admin route', async ({ page, request }) => {
    await backdoorLogin(page, request, MEMBER_EMAIL)
    await page.goto('/admin', { waitUntil: 'networkidle' })
    await waitForAppReady(page)
    await expect(page.getByRole('heading', { name: '403-as hiba' })).toBeVisible()
  })
})
