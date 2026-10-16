import { test, expect } from '@playwright/test';
import { PATHS } from '../../src/presentation/routes/paths.js';
import { loginAsTestUser } from './utils/auth.js';

test.describe('Content Management System (CMS) & Access Control', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('blocks non-publisher students from accessing CMS admin panel', async ({ page }) => {
    // Attempt to access CMS directly
    await page.goto(PATHS.CONTENT_MANAGEMENT);

    // ProtectedRoute with allowedRoles=[PUBLISHER] must redirect non-publishers to courses/home or 403
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    const isDenied = !currentUrl.includes('/cms/courses') && !currentUrl.includes('/cms/problems');
    expect(isDenied).toBeTruthy();
  });
});
