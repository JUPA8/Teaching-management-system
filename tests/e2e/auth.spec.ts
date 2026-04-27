import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('admin can log in and see dashboard', async ({ page }) => {
    await page.goto('/en/login');
    await page.fill('input[type="email"]', 'e2e-admin@test.com');
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/admin/);
  });

  test('student cannot access /admin — redirected to login', async ({ page }) => {
    // Log in as student
    await page.goto('/en/login');
    await page.fill('input[type="email"]', 'e2e-student@test.com');
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    // Wait for student dashboard
    await page.waitForTimeout(3000);
    // Try to access admin
    await page.goto('/en/admin');
    await page.waitForTimeout(2000);
    // Should be redirected away from admin
    expect(page.url()).not.toContain('/admin/bookings');
    expect(page.url()).toMatch(/login|\/en\/student|\/en\/?$/);
  });

  test('unauthenticated user redirected from /admin to login', async ({ page }) => {
    await page.goto('/en/admin');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('login');
  });
});
