import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import dotenv from 'dotenv'
import { BASE_URL } from './support/config'

const dir = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(dir, '.env') })

/**
 * Baseline suite for photato.eu. Pixel baselines are Linux-only: they must be generated inside the
 * official Playwright Docker image (`pnpm test:e2e:docker`), never from macOS-native rendering, so CI
 * and future runs reproduce them. Playwright stamps the platform onto snapshot filenames, so a
 * macOS run looks for `-darwin` snapshots, finds none, and fails loudly — which is the intended guard.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // One retry survives a transient network blip against the live site without masking real diffs
  // (a genuine screenshot mismatch fails identically on retry).
  retries: 1,
  workers: process.env.CI ? 2 : 4,
  reporter: [['html', { open: 'never' }], ['list']],

  // Group committed baselines under one tree, keyed by project (desktop/mobile) so the two viewports
  // never collide. The trailing platform suffix (`-linux`) is added by Playwright.
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{-platform}{ext}',

  use: {
    baseURL: BASE_URL,
    locale: 'hu-HU',
    timezoneId: 'Europe/Budapest',
    // Force the mobile-layout media queries via width alone and keep pixels 1:1 for stable diffs.
    deviceScaleFactor: 1,
    colorScheme: 'light',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  expect: {
    toHaveScreenshot: {
      // 1% of pixels may differ. Tight enough to catch layout/content/color regressions, loose enough
      // to absorb sub-pixel font anti-aliasing jitter that even a pinned Linux renderer produces.
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      stylePath: path.join(dir, 'support', 'screenshot.css'),
    },
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 },
    },
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 },
    },
  ],
})
