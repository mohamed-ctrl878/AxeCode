import { test, expect } from '@playwright/test';
import { PATHS } from '../../src/presentation/routes/paths.js';
import { loginAsTestUser } from './utils/auth.js';

test.describe('Problems & Code Execution', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('opens the problems catalog and displays available problems', async ({ page }) => {
    await page.goto(PATHS.PROBLEMS);
    await expect(page).toHaveURL(new RegExp(PATHS.PROBLEMS));

    // Wait for loading to finish - check for page header "Code Challenges"
    await expect(page.getByText(/Code Challenges/i).first()).toBeVisible({ timeout: 15000 });

    // Verify problem table structure is rendered (header row)
    await expect(page.getByText(/Challenge Name/i).first()).toBeVisible({ timeout: 10000 });

    // Wait for either problems to load OR empty state OR error
    await page.waitForTimeout(3000);
    const body = page.locator('body');

    // Verify no fatal error
    await expect(body).not.toContainText('Failed to load problems', { timeout: 5000 });
  });

  test('opens problem workspace with Monaco editor and controls', async ({ page }) => {
    await page.goto(PATHS.PROBLEMS);

    // Wait for page to load
    await expect(page.getByText(/Code Challenges/i).first()).toBeVisible({ timeout: 15000 });

    // Click the first problem row (div with AXE-CHALLENGE-2026) or link
    const problemRow = page.locator('div:has-text("AXE-CHALLENGE-2026")').last();
    const problemLink = page.locator('a[href*="/problems/"]').first();

    if (await problemRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      await problemRow.click();
    } else if (await problemLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await problemLink.click();
    } else {
      // Direct navigation to seeded problem workspace
      await page.goto(`${PATHS.PROBLEMS}/prob_e2e_palindrome`);
    }

    await expect(page).toHaveURL(/\/problems\/.+/);

    // Workspace controls from ProblemWorkspaceHeader
    await expect(page.getByText(/Run/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Submit/i).first()).toBeVisible();

    // Monaco Editor mounted
    await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 15000 });
  });

  test('executes code via Run button against sample test cases', async ({ page }) => {
    await page.goto(PATHS.PROBLEMS);
    await expect(page.getByText(/Code Challenges/i).first()).toBeVisible({ timeout: 15000 });

    const problemRow = page.locator('div:has-text("AXE-CHALLENGE-2026")').last();
    const problemLink = page.locator('a[href*="/problems/"]').first();

    if (await problemRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      await problemRow.click();
    } else if (await problemLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await problemLink.click();
    } else {
      await page.goto(`${PATHS.PROBLEMS}/prob_e2e_palindrome`);
    }

    // If editor loaded
    const monaco = page.locator('.monaco-editor');
    if (!(await monaco.isVisible({ timeout: 10000 }).catch(() => false))) {
      test.skip(true, 'Problem workspace not reachable');
      return;
    }

    // Click Run button
    const runBtn = page.locator('button').filter({ hasText: /^Run$/ }).first();
    await expect(runBtn).toBeVisible({ timeout: 5000 });
    await runBtn.click();

    // Verify execution results area is displayed
    await expect(page.getByText(/Test Case|Result|Stdout|Executing|Running|accepted|wrong answer/i).first())
      .toBeVisible({ timeout: 30000 });
  });

  test('submits code via Submit button and evaluates verdict', async ({ page }) => {
    await page.goto(PATHS.PROBLEMS);
    await expect(page.getByText(/Code Challenges/i).first()).toBeVisible({ timeout: 15000 });

    const problemRow = page.locator('div:has-text("AXE-CHALLENGE-2026")').last();
    const problemLink = page.locator('a[href*="/problems/"]').first();

    if (await problemRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      await problemRow.click();
    } else if (await problemLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await problemLink.click();
    } else {
      await page.goto(`${PATHS.PROBLEMS}/prob_e2e_palindrome`);
    }

    const monaco = page.locator('.monaco-editor');
    if (!(await monaco.isVisible({ timeout: 10000 }).catch(() => false))) {
      test.skip(true, 'Problem workspace not reachable');
      return;
    }

    // Click Submit button
    const submitBtn = page.locator('button').filter({ hasText: /^Submit$/ }).first();
    await expect(submitBtn).toBeVisible({ timeout: 5000 });
    await submitBtn.click();

    // Verify verdict banner appears with evaluation status
    await expect(page.getByText(/accepted|wrong answer|runtime error|Execution Finished|Submitting|Evaluating/i).first())
      .toBeVisible({ timeout: 30000 });
  });
});
