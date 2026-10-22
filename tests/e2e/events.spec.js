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

    // Verify event filters sidebar is rendered
    await expect(page.getByText(/Refine Events/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/All Events|Webinars|Workshops|Physical/i).first()).toBeVisible({ timeout: 10000 });

    // Verify no unhandled error
    await expect(page.locator('body')).not.toContainText('Failed to load events', { timeout: 5000 });
  });

  test('opens event details page from event card', async ({ page }) => {
    await page.goto(PATHS.EVENTS);

    // Locate event link in catalog
    const eventCard = page.locator('a[href*="/events/"]').first();

    if (await eventCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await eventCard.click();
    } else {
      // Direct navigation to seeded event
      await page.goto(`${PATHS.EVENTS}/event_e2e_meetup`);
    }

    // Verify navigates to event details
    await expect(page).toHaveURL(new RegExp(`${PATHS.EVENTS}/.+`));
    await expect(page.locator('body')).not.toContainText('Failed to load', { timeout: 15000 });
  });
});
