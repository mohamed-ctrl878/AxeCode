import { test, expect } from '@playwright/test';
import { PATHS } from '../../src/presentation/routes/paths.js';
import { loginAsTestUser } from './utils/auth.js';

test.describe('Wallet & Financials', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('opens wallet page and displays account balances and currency', async ({ page }) => {
    await page.goto(PATHS.WALLET);
    await expect(page).toHaveURL(new RegExp(PATHS.WALLET));

    // Verify wallet balance cards or headers are rendered
    await expect(page.getByText(/Wallet|Balance|EGP/i).first())
      .toBeVisible({ timeout: 15000 });
  });
});
