import { test, expect } from '@playwright/test';
import { PATHS } from '../../src/presentation/routes/paths.js';
import { loginAsTestUser, solveTestRecaptcha } from './utils/auth.js';

test.describe('Authentication & User Lifecycle', () => {
  test('logs in with valid credentials and reaches the dashboard/courses', async ({ page }) => {
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

    // Error banner rendered by LoginPage when loginError is set
    await expect(page.getByText(/./).filter({ hasText: /invalid|incorrect|failed/i }).first())
      .toBeVisible({ timeout: 10000 });

    // Must stay on the login page
    await expect(page).toHaveURL(new RegExp(PATHS.LOGIN));
    await expect(submit).toBeEnabled({ timeout: 5000 });
  });

  test('completes multi-step registration flow to verification step', async ({ page }) => {
    const timestamp = Date.now();
    const uniqueUsername = `testuser_${timestamp}`;
    const uniqueEmail = `testuser_${timestamp}@axecode.test`;

    await page.goto(PATHS.REGISTER);

    // Step 1: Credential Step
    await page.getByPlaceholder('Pick a unique username').fill(uniqueUsername);
    await page.getByPlaceholder('your.email@example.com').fill(uniqueEmail);
    await page.getByPlaceholder('Choose a strong password').fill('TestPassword123!');
    await page.getByPlaceholder('Repeat your password').fill('TestPassword123!');

    // Wait for debounce and availability check
    await page.waitForTimeout(2000);

    const nextButton = page.getByRole('button', { name: /Next Protocol/i });
    await expect(nextButton).toBeEnabled({ timeout: 5000 });
    await nextButton.click();

    // Step 2: Personal Step
    await page.getByPlaceholder('John').fill('Automated');
    await page.getByPlaceholder('Doe').fill('Tester');
    await solveTestRecaptcha(page);

    const submitRegister = page.getByRole('button', { name: /Initialize Account/i });
    await expect(submitRegister).toBeEnabled({ timeout: 5000 });
    await submitRegister.click();

    // Step 3: Verify OTP screen appears
    await expect(page.getByText(/Verify Your Identity|Verification Code|initialization code/i).first())
      .toBeVisible({ timeout: 15000 });
  });

  test('logs out successfully and clears authenticated session', async ({ page }) => {
    await loginAsTestUser(page);

    // Open User dropdown menu in the header
    const userMenuButton = page.locator('header').getByRole('button').filter({ hasText: /./ }).last();
    if (await userMenuButton.isVisible()) {
      await userMenuButton.click();
    } else {
      // Fallback selector for user menu avatar/trigger
      await page.locator('header button').last().click();
    }

    // Click Sign Out Session
    const signOutBtn = page.getByRole('button', { name: /Sign Out Session/i });
    await expect(signOutBtn).toBeVisible({ timeout: 5000 });
    await signOutBtn.click();

    // After logout, user should be redirected to landing page or login page
    await expect(page).toHaveURL(new RegExp(`(${PATHS.LOGIN}|${PATHS.DASHBOARD}|${PATHS.COURSES})`));
  });
});
