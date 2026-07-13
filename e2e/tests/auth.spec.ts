import { test, expect } from '@playwright/test'
import { applyAnonymousDeterminism, waitForAppReady } from '../support/determinism'

/**
 * Magic-link login UI (replaces the old Auth0 handshake specs). Auth is now self-hosted passwordless
 * email links — see docs/auth-contract.md. There's no third-party redirect to assert anymore; instead
 * we cover the in-our-control login page: it renders, and requesting a link flips to the
 * "check your inbox" state. The request-link POST is stubbed 200 so the test never sends a real email
 * and stays offline-deterministic (the backend always returns 200 anyway, to avoid account
 * enumeration).
 */

test.beforeEach(async ({ page }) => {
  await applyAnonymousDeterminism(page)
})

test('login page renders the email form', async ({ page }) => {
  await page.goto('/login', { waitUntil: 'networkidle' })
  await waitForAppReady(page)
  await expect(page.getByRole('heading', { name: 'Bejelentkezés a Photatóra' })).toBeVisible()
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Küldjétek a bejelentkező linket' })).toBeVisible()
  await expect(page).toHaveScreenshot('login.png', { fullPage: true })
})

test('requesting a link shows the check-your-inbox state', async ({ page }) => {
  await page.route('**/auth/request-link', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
  )

  await page.goto('/login', { waitUntil: 'networkidle' })
  await waitForAppReady(page)

  await page.locator('input[type="email"]').fill('someone@example.com')
  await page.getByRole('button', { name: 'Küldjétek a bejelentkező linket' }).click()

  await expect(
    page.getByText('Elküldtük a bejelentkező linket! Nézd meg a postaládád, és kattints a linkre a belépéshez.'),
  ).toBeVisible()
  // The form is gone once submitted.
  await expect(page.locator('input[type="email"]')).toHaveCount(0)
})

test('the members-only 403 "Sign in" button leads to the login page', async ({ page }) => {
  // The 403 page has an always-visible "Bejelentkezés" button (not tucked in the mobile hamburger),
  // so this holds on both viewports. It routes client-side to /login (no external redirect).
  await page.goto('/upload', { waitUntil: 'networkidle' })
  await waitForAppReady(page)

  await page.getByRole('button', { name: 'Bejelentkezés' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Bejelentkezés a Photatóra' })).toBeVisible()
})
