import { test, expect, type Page } from '@playwright/test'
import { NOT_FOUND_ROUTE } from '../support/config'
import { applyAnonymousDeterminism, waitForAppReady } from '../support/determinism'

/**
 * Click a header menu link by its Hungarian label. On mobile the menu collapses behind a hamburger, so
 * open it first if the link is hidden. Works on both viewports.
 */
async function clickMenuLink(page: Page, name: string): Promise<void> {
  const link = page.locator('header[role="navigation"]').getByRole('link', { name })
  if (!(await link.isVisible())) {
    await page.locator('.hamburgerMenu').click()
    await expect(link).toBeVisible()
  }
  await link.click()
}

/** 404 handling and basic client-side navigation. */

test.beforeEach(async ({ page }) => {
  await applyAnonymousDeterminism(page)
})

test('unknown route shows 404', async ({ page }) => {
  await page.goto(NOT_FOUND_ROUTE, { waitUntil: 'networkidle' })
  await waitForAppReady(page)
  await expect(page).toHaveTitle('404-es hiba - Photato')
  await expect(page.getByRole('heading', { name: '404-es hiba' })).toBeVisible()
  await expect(page.getByText('Ez az oldal nem létezik.')).toBeVisible()
  await expect(page).toHaveScreenshot('error-404.png', { fullPage: true })
})

test('nav links route client-side without a full reload', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await waitForAppReady(page)

  await clickMenuLink(page, 'GYIK')
  await expect(page).toHaveURL(/\/faq$/)
  await expect(page.getByRole('heading', { name: 'Gyakran ismételt kérdések' })).toBeVisible()

  await clickMenuLink(page, 'Rólunk')
  await expect(page).toHaveURL(/\/about$/)

  await clickMenuLink(page, 'Főoldal')
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'Tanulj meg fotózni!' })).toBeVisible()
})
