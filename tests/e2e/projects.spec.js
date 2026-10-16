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

    // Verify seeded project card is rendered
    await expect(page.getByText(/AxeCode Community Portal/i).first())
      .toBeVisible({ timeout: 15000 });
  });

  test('opens project details page from project card', async ({ page }) => {
    await page.goto(PATHS.PROJECTS);

    const projectCard = page.getByText(/AxeCode Community Portal/i).first();
    await expect(projectCard).toBeVisible({ timeout: 15000 });
    await projectCard.click();

    // Verify navigation to project dashboard
    await expect(page).toHaveURL(new RegExp(`${PATHS.PROJECTS}/.+`));
  });
});
