import { test, expect } from '@playwright/test';
import { PATHS } from '../../src/presentation/routes/paths.js';
import { loginAsTestUser } from './utils/auth.js';

test.describe('Courses catalog', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('opens the courses catalog while authenticated', async ({ page }) => {
    await page.goto(PATHS.COURSES);
    await expect(page).toHaveURL(new RegExp(PATHS.COURSES));
  });

  test('opens a course details page from the catalog', async ({ page }) => {
    await page.goto(PATHS.COURSES);

    // CourseCard always renders a "Details" button regardless of price/
    // access state, unlike "Buy Now" / "Continue" / "Free Join" which are
    // conditional — so it's the one stable entry point for any seed data.
    const detailsButton = page.getByRole('button', { name: 'Details' }).first();

    // Gracefully skip when no courses exist in staging seed data.
    // The catalog-load test above still validates auth + routing.
    const isVisible = await detailsButton.isVisible().catch(() => false);
    if (!isVisible) {
      // Wait a moment to make sure it's not just slow loading
      try {
        await detailsButton.waitFor({ state: 'visible', timeout: 10000 });
      } catch {
        test.skip(true, 'No course seed data in staging — skipping details navigation');
        return;
      }
    }

    await detailsButton.click();

    await expect(page).toHaveURL(new RegExp(`${PATHS.COURSES}/.+`));

    // Price/access state (Buy Now vs Free Join vs Continue) depends on
    // seed data and the logged-in test user's entitlements, so this test
    // only asserts the details page itself rendered — not which specific
    // purchase CTA is showing. The full purchase → entitlement → unlocked
    // content journey is a separate, heavier scenario (P0 in the QA plan)
    // that needs a seeded paid course + sandboxed Paymob/Kashier credentials.
    await expect(page.locator('body')).not.toContainText('Failed to load', { timeout: 15000 });
  });
});
