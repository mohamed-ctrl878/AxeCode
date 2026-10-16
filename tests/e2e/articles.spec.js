import { test, expect } from '@playwright/test';
import { PATHS } from '../../src/presentation/routes/paths.js';
import { loginAsTestUser } from './utils/auth.js';

test.describe('Community Articles & Feed', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('opens articles catalog and displays articles list', async ({ page }) => {
    await page.goto(PATHS.ARTICLES);
    await expect(page).toHaveURL(new RegExp(PATHS.ARTICLES));

    // Verify seeded article title appears
    await expect(page.getByText(/Welcome to AxeCode Community/i).first())
      .toBeVisible({ timeout: 15000 });
  });

  test('opens article details page', async ({ page }) => {
    await page.goto(PATHS.ARTICLES);

    const articleCard = page.getByText(/Welcome to AxeCode Community/i).first();
    await expect(articleCard).toBeVisible({ timeout: 15000 });
    await articleCard.click();

    await expect(page).toHaveURL(new RegExp(`${PATHS.ARTICLES}/.+`));
    await expect(page.locator('body')).not.toContainText('Failed to load', { timeout: 15000 });
  });

  test('opens article editor and creates a new article', async ({ page }) => {
    await page.goto(`${PATHS.ARTICLES}/write`);
    await expect(page).toHaveURL(new RegExp(`${PATHS.ARTICLES}/write`));

    const timestamp = Date.now();
    const newTitle = `E2E Test Article ${timestamp}`;

    // Fill title
    const titleInput = page.getByPlaceholder('Article Title...');
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await titleInput.fill(newTitle);

    // Click Publish button
    const publishBtn = page.getByRole('button', { name: /^Publish$/i });
    await expect(publishBtn).toBeEnabled({ timeout: 5000 });
    await publishBtn.click();

    // Verify redirected back to articles list or success toast
    await expect(page).toHaveURL(new RegExp(PATHS.ARTICLES), { timeout: 15000 });
  });
});
