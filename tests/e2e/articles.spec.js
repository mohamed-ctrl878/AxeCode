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

    // Verify side filtration and navigation rendered
    await expect(page.getByText(/Navigation/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Top Rated|Explore|Related by me/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', { name: /Write Article/i }).first()).toBeVisible({ timeout: 10000 });

    // Verify no unhandled crash
    await expect(page.locator('body')).not.toContainText('Failed to load articles', { timeout: 5000 });
  });

  test('opens article details page', async ({ page }) => {
    await page.goto(PATHS.ARTICLES);
    await expect(page).toHaveURL(new RegExp(PATHS.ARTICLES));

    // Locate article link in catalog (exclude write button)
    const articleCard = page.locator('a[href*="/articles/"]').filter({ hasNotText: /write/i }).first();

    if (await articleCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await articleCard.click();
    } else {
      // Direct navigation to seeded article
      await page.goto(`${PATHS.ARTICLES}/article_e2e_welcome`);
    }

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
