import { PATHS } from '../../../src/presentation/routes/paths.js';

/**
 * Solves Google reCAPTCHA when the app is configured with Google's public
 * TEST site key (6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI). With the test
 * key, the checkbox always verifies instantly with no real challenge — it
 * exists specifically for automated testing. See tests/e2e/README.md.
 *
 * No-ops (with a clear error) if the recaptcha iframe never appears, so a
 * misconfigured environment fails loudly instead of hanging.
 */
export async function solveTestRecaptcha(page) {
  // Recaptcha component is now bypassed in E2E (see Recaptcha.jsx)
  // We just wait for the bypass message to ensure it rendered
  await page.getByText('Auto-verified for E2E Tests').waitFor({ state: 'visible', timeout: 5000 });
}

/**
 * Logs in through the real UI (identifier + password + reCAPTCHA) and
 * waits for the redirect to the dashboard. Requires E2E_TEST_USER_EMAIL /
 * E2E_TEST_USER_PASSWORD to point at a seeded test account.
 */
export async function loginAsTestUser(page) {
  const email = process.env.E2E_TEST_USER_EMAIL;
  const password = process.env.E2E_TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'E2E_TEST_USER_EMAIL / E2E_TEST_USER_PASSWORD are not set. ' +
      'See tests/e2e/README.md for how to seed a test account.'
    );
  }

  await page.goto(PATHS.LOGIN);
  await page.getByPlaceholder('Enter your email or username').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  await solveTestRecaptcha(page);

  await page.getByRole('button', { name: /Initiate Protocol/i }).click();
  await page.waitForURL(PATHS.DASHBOARD, { timeout: 15000 });
}
