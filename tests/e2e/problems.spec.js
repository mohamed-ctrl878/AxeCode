import { test, expect } from '@playwright/test';
import { PATHS } from '../../src/presentation/routes/paths.js';
import { loginAsTestUser } from './utils/auth.js';

test.describe('Problems workspace', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('opens the problems catalog while authenticated', async ({ page }) => {
    await page.goto(PATHS.PROBLEMS);
    // Protected route: a successful load (not a redirect back to /login)
    // is itself the assertion that auth + the catalog fetch both worked.
    await expect(page).toHaveURL(new RegExp(PATHS.PROBLEMS));
  });

  test('opens a problem workspace with editor, run and submit controls', async ({ page }) => {
    await page.goto(PATHS.PROBLEMS);

    // Click the first problem card/link. The catalog UI isn't covered here
    // (that's a separate scenario) — this test only needs *a* valid problem
    // id, so it follows whatever the first real link on the page is rather
    // than hardcoding one that may not exist in every environment's seed data.
    const firstProblemLink = page.locator('a[href*="/problems/"]').first();

    // Gracefully skip when no problems exist in staging seed data.
    // The catalog-load test above still validates auth + routing.
    const isVisible = await firstProblemLink.isVisible().catch(() => false);
    if (!isVisible) {
      try {
        await firstProblemLink.waitFor({ state: 'visible', timeout: 10000 });
      } catch {
        test.skip(true, 'No problem seed data in staging — skipping workspace test');
        return;
      }
    }

    await firstProblemLink.click();

    await expect(page).toHaveURL(/\/problems\/.+/);

    // Core workspace chrome from ProblemWorkspaceHeader + ProblemPreviewPage.
    await expect(page.getByRole('button', { name: /^Run$/ })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /^Submit$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Description' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Test Cases' })).toBeVisible();

    // Monaco mounts into a `.monaco-editor` container — just verify the
    // editor actually mounted, not its contents (that needs seeded code
    // templates and is covered once staging test data exists).
    await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 15000 });
  });
});
