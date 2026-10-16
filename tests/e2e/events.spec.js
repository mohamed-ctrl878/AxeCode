import { test, expect } from '@playwright/test';
import { PATHS } from '../../src/presentation/routes/paths.js';
import { loginAsTestUser } from './utils/auth.js';

test.describe('Events & Workshops', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('opens events page and displays upcoming events', async ({ page }) => {
    await page.goto(PATHS.EVENTS);
    await expect(page).toHaveURL(new RegExp(PATHS.EVENTS));

    // Verify seeded event appears in the list
    await expect(page.getByText(/AxeCode Code-a-thon 2026/i).first())
      .toBeVisible({ timeout: 15000 });
  });

  test('opens event details page from event card', async ({ page }) => {
    await page.goto(PATHS.EVENTS);

    const eventCard = page.getByText(/AxeCode Code-a-thon 2026/i).first();
    await expect(eventCard).toBeVisible({ timeout: 15000 });
    await eventCard.click();

    // Verify navigates to event details
    await expect(page).toHaveURL(new RegExp(`${PATHS.EVENTS}/.+`));
    await expect(page.locator('body')).not.toContainText('Failed to load', { timeout: 15000 });
  });
});
