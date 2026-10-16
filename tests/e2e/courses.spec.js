import { test, expect } from '@playwright/test';
import { PATHS } from '../../src/presentation/routes/paths.js';
import { loginAsTestUser } from './utils/auth.js';

test.describe('Courses & Learning Journey', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('opens the courses catalog and displays available courses', async ({ page }) => {
    await page.goto(PATHS.COURSES);
    await expect(page).toHaveURL(new RegExp(PATHS.COURSES));

    // Verify course catalog displays the seeded course
    await expect(page.getByText(/JavaScript Fundamentals/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('opens course details page from the catalog', async ({ page }) => {
    await page.goto(PATHS.COURSES);

    const detailsButton = page.getByRole('button', { name: 'Details' }).first();
    await expect(detailsButton).toBeVisible({ timeout: 15000 });
    await detailsButton.click();

    await expect(page).toHaveURL(new RegExp(`${PATHS.COURSES}/.+`));
    await expect(page.locator('body')).not.toContainText('Failed to load', { timeout: 15000 });

    // Verify Curriculum and Course Info are rendered
    await expect(page.getByText(/Course Investment|Total Lessons|Curriculum/i).first())
      .toBeVisible({ timeout: 15000 });
  });

  test('navigates to lesson learning workspace', async ({ page }) => {
    await page.goto(PATHS.COURSES);

    const detailsButton = page.getByRole('button', { name: 'Details' }).first();
    await expect(detailsButton).toBeVisible({ timeout: 15000 });
    await detailsButton.click();

    // Click CTA button (Join For Free or Continue Learning)
    const actionBtn = page.getByRole('button', { name: /Join For Free|Continue Learning/i });
    if (await actionBtn.isVisible()) {
      await actionBtn.click();

      // If Join For Free was clicked, it may update state to Continue Learning, click again if needed
      await page.waitForTimeout(2000);
      const continueBtn = page.getByRole('button', { name: /Continue Learning/i });
      if (await continueBtn.isVisible()) {
        await continueBtn.click();
      }

      // Verify lesson viewer or curriculum is accessible
      await expect(page).toHaveURL(new RegExp(`${PATHS.COURSES}/.+`));
    }
  });
});
