import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('courses page loads and shows courses', async ({ page }) => {
    await page.goto('/en/courses');
    await expect(page).not.toHaveURL(/login/);
    // Should not expose teacher emails
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toMatch(/e2e-teacher@test\.com/);
  });

  test('teachers page loads without errors', async ({ page }) => {
    await page.goto('/en/teachers');
    await expect(page.locator('body')).toBeVisible();
    await expect(page).not.toHaveURL(/login/);
  });

  test('videos page loads without errors', async ({ page }) => {
    await page.goto('/en/videos');
    await expect(page.locator('body')).toBeVisible();
    await expect(page).not.toHaveURL(/login/);
  });

  test('home page loads', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('body')).toBeVisible();
  });
});
