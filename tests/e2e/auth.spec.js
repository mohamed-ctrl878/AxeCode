import { test, expect } from '@playwright/test';
import { PATHS } from '../../src/presentation/routes/paths.js';
import { loginAsTestUser, solveTestRecaptcha } from './utils/auth.js';

test.describe('Authentication', () => {
  test('logs in with valid credentials and reaches the dashboard', async ({ page }) => {
    await loginAsTestUser(page);
    await expect(page).toHaveURL(new RegExp(`(${PATHS.COURSES}|${PATHS.DASHBOARD})$`));
  });

  test('shows an error and re-enables the form on invalid credentials', async ({ page }) => {
    await page.goto(PATHS.LOGIN);

    await page.getByPlaceholder('Enter your email or username').fill('nonexistent-user@example.com');
    await page.getByPlaceholder('••••••••').fill('definitely-wrong-password');
    await solveTestRecaptcha(page);

    const submit = page.getByRole('button', { name: /Initiate Protocol/i });
    await submit.click();

    // Error banner rendered by LoginPage when loginError is set.
    await expect(page.getByText(/./).filter({ hasText: /invalid|incorrect|failed/i }).first())
      .toBeVisible({ timeout: 10000 });

    // Must stay on the login page — a false-positive redirect here would be
    // a serious auth bug, not just a UX issue.
    await expect(page).toHaveURL(new RegExp(PATHS.LOGIN));

    // reCAPTCHA is reset on failure (see LoginPage.handleLogin's catch
    // block). In E2E bypass mode (test site key) the reCAPTCHA component
    // auto-verifies immediately, so the button re-enables right away.
    // The meaningful assertion is that the form is ready for retry:
    await expect(submit).toBeEnabled({ timeout: 5000 });
  });
});
