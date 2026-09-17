import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration for AxeCode frontend.
 *
 * Prerequisites (see tests/e2e/README.md for full details):
 *  - A running backend the app can talk to (local docker-compose, or a
 *    staging deployment) reachable at E2E_BASE_URL / VITE_API_BASE_URL.
 *  - The backend and frontend must both be configured with Google's
 *    public reCAPTCHA TEST key pair (documented in tests/e2e/README.md)
 *    so the login/register forms can be automated without solving a
 *    real challenge. Never use the test key pair in production.
 *  - Seeded test user credentials via E2E_TEST_USER_EMAIL / E2E_TEST_USER_PASSWORD.
 */
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Only auto-start the dev server locally. In CI we assume the frontend
  // (and the backend it talks to) are already running against a staging
  // environment — see the "Full-Stack E2E" section of the QA plan.
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
});
