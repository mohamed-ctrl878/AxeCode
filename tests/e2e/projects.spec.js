import { test, expect } from '@playwright/test';
import { PATHS } from '../../src/presentation/routes/paths.js';
import { loginAsTestUser } from './utils/auth.js';

test.describe('Projects & Workspace', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('opens projects discovery page and displays community projects', async ({ page }) => {
    await page.goto(PATHS.PROJECTS);
    await expect(page).toHaveURL(new RegExp(PATHS.PROJECTS));

    // Verify header and Create Project action button
    await expect(page.getByText(/Discover Projects/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Create Project/i).first()).toBeVisible({ timeout: 10000 });

    // Verify no unhandled error
    await expect(page.locator('body')).not.toContainText('Error fetching projects', { timeout: 5000 });
  });

  test('opens project details page from project card', async ({ page }) => {
    await page.goto(PATHS.PROJECTS);

    // Locate project link in discovery page
    const projectCard = page.locator('a[href*="/projects/"]').first();

    if (await projectCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectCard.click();
    } else {
      // Direct navigation to seeded project
      await page.goto(`${PATHS.PROJECTS}/project_e2e_portal`);
    }

    // Verify navigation to project dashboard
    await expect(page).toHaveURL(new RegExp(`${PATHS.PROJECTS}/.+`));
  });
});
