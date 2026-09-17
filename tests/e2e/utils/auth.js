import { PATHS } from './paths.js';

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
  const frame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
  const checkbox = frame.locator('#recaptcha-anchor');
  await checkbox.waitFor({ state: 'visible', timeout: 15000 });
  await checkbox.click();
  // The test key auto-verifies almost instantly; wait for the checked state
  // rather than a fixed timeout.
  await frame.locator('#recaptcha-anchor[aria-checked="true"]').waitFor({ timeout: 10000 });
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
