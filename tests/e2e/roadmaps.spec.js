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

    // Verify seeded roadmap card is rendered
    await expect(page.getByText(/Frontend Developer Pathway/i).first())
      .toBeVisible({ timeout: 15000 });
  });

  test('opens roadmap details view', async ({ page }) => {
    await page.goto(PATHS.ROADMAPS);

    const roadmapCard = page.getByText(/Frontend Developer Pathway/i).first();
    await expect(roadmapCard).toBeVisible({ timeout: 15000 });
    await roadmapCard.click();

    // Verify navigates to roadmap details view
    await expect(page).toHaveURL(new RegExp(`${PATHS.ROADMAPS}/.+`));
  });
});
