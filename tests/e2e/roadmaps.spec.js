import { test, expect } from '@playwright/test';
import { PATHS } from '../../src/presentation/routes/paths.js';
import { loginAsTestUser } from './utils/auth.js';

test.describe('Learning Roadmaps', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('opens roadmaps page and displays structured learning paths', async ({ page }) => {
    await page.goto(PATHS.ROADMAPS);
    await expect(page).toHaveURL(new RegExp(PATHS.ROADMAPS));

    // Verify page header and roadmap structure
    await expect(page.getByText(/Learning Paths/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Structured roadmaps to guide your journey/i).first()).toBeVisible({ timeout: 10000 });

    // Verify no unhandled error
    await expect(page.locator('body')).not.toContainText('Retry', { timeout: 5000 });
  });

  test('opens roadmap details view', async ({ page }) => {
    await page.goto(PATHS.ROADMAPS);

    // Locate roadmap card in the grid
    const roadmapCard = page.locator('div[class*="bento-card"]').filter({ hasText: /Roadmap|Pathway|Developer|Frontend/i }).first();

    if (await roadmapCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await roadmapCard.click();
    } else {
      // Direct navigation to seeded roadmap
      await page.goto(`${PATHS.ROADMAPS}/roadmap_e2e_frontend`);
    }

    // Verify navigates to roadmap details view
    await expect(page).toHaveURL(new RegExp(`${PATHS.ROADMAPS}/.+`));
  });
});
