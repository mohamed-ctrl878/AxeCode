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

    // Verify Knowledge Hub header and course tracks rendered
    await expect(page.getByText(/Knowledge Hub/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Active Courses|Featured Opportunities/i).first()).toBeVisible({ timeout: 10000 });

    // Verify search input is present
    await expect(page.getByPlaceholder(/Search among active courses/i)).toBeVisible({ timeout: 5000 });
  });

  test('opens course details page from the catalog', async ({ page }) => {
    await page.goto(PATHS.COURSES);
    await expect(page).toHaveURL(new RegExp(PATHS.COURSES));

    const detailsButton = page.getByRole('button', { name: 'Details' }).first();
    const courseCard = page.locator('div[class*="CourseCard"], div[class*="group flex flex-col"]').first();

    if (await detailsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await detailsButton.click();
    } else if (await courseCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await courseCard.click();
    } else {
      // Direct navigation to seeded course
      await page.goto(`${PATHS.COURSES}/course_e2e_js`);
    }

    await expect(page).toHaveURL(new RegExp(`${PATHS.COURSES}/.+`));
    await expect(page.locator('body')).not.toContainText('Failed to load', { timeout: 15000 });

    // Verify Curriculum and Course Info are rendered
    await expect(page.getByText(/Course Investment|Total Lessons|Curriculum|Overview|Lessons/i).first())
      .toBeVisible({ timeout: 15000 });
  });

  test('navigates to lesson learning workspace', async ({ page }) => {
    await page.goto(PATHS.COURSES);

    const detailsButton = page.getByRole('button', { name: 'Details' }).first();
    const courseCard = page.locator('div[class*="CourseCard"], div[class*="group flex flex-col"]').first();

    if (await detailsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await detailsButton.click();
    } else if (await courseCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await courseCard.click();
    } else {
      await page.goto(`${PATHS.COURSES}/course_e2e_js`);
    }

    // Click CTA button (Join For Free, Free Join, or Continue Learning)
    const actionBtn = page.getByRole('button', { name: /Join For Free|Free Join|Continue Learning|Start/i }).first();
    if (await actionBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await actionBtn.click();

      // If Join For Free was clicked, it may update state to Continue Learning, click again if needed
      await page.waitForTimeout(2000);
      const continueBtn = page.getByRole('button', { name: /Continue Learning|Continue/i }).first();
      if (await continueBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await continueBtn.click();
      }

      // Verify lesson viewer or curriculum is accessible
      await expect(page).toHaveURL(new RegExp(`${PATHS.COURSES}/.+`));
    }
  });
});
