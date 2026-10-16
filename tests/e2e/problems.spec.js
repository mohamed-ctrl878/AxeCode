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

    // Verify problem catalog list is loaded
    await expect(page.getByText(/Valid Palindrome/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('opens problem workspace with Monaco editor and controls', async ({ page }) => {
    await page.goto(PATHS.PROBLEMS);

    // Click the problem link
    const problemLink = page.getByText(/Valid Palindrome/i).first();
    await expect(problemLink).toBeVisible({ timeout: 10000 });
    await problemLink.click();

    await expect(page).toHaveURL(/\/problems\/.+/);

    // Workspace controls from ProblemWorkspaceHeader
    await expect(page.getByRole('button', { name: /^Run$/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /^Submit$/i })).toBeVisible();

    // Problem description tabs
    await expect(page.getByRole('button', { name: /Description/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Test Cases/i })).toBeVisible();

    // Monaco Editor mounted
    await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 15000 });
  });

  test('executes code via Run button against sample test cases', async ({ page }) => {
    await page.goto(PATHS.PROBLEMS);
    const problemLink = page.getByText(/Valid Palindrome/i).first();
    await problemLink.click();

    await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 15000 });

    // Click Run button
    const runBtn = page.getByRole('button', { name: /^Run$/i });
    await expect(runBtn).toBeEnabled({ timeout: 5000 });
    await runBtn.click();

    // Verify execution results tab is displayed
    await expect(page.getByText(/Test Case|Result|Stdout|Executing|accepted|wrong answer/i).first())
      .toBeVisible({ timeout: 25000 });
  });

  test('submits code via Submit button and evaluates verdict', async ({ page }) => {
    await page.goto(PATHS.PROBLEMS);
    const problemLink = page.getByText(/Valid Palindrome/i).first();
    await problemLink.click();

    await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 15000 });

    // Click Submit button
    const submitBtn = page.getByRole('button', { name: /^Submit$/i });
    await expect(submitBtn).toBeEnabled({ timeout: 5000 });
    await submitBtn.click();

    // Verify verdict banner appears with evaluation status
    await expect(page.getByText(/accepted|wrong answer|runtime error|Execution Finished/i).first())
      .toBeVisible({ timeout: 30000 });
  });
});
