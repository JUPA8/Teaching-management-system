import { test, expect } from '@playwright/test';

test.describe('Admin Booking Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/login');
    await page.fill('input[type="email"]', 'e2e-admin@test.com');
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/, { timeout: 15000 });
  });

  test('admin can navigate to create booking page', async ({ page }) => {
    await page.goto('/en/admin/bookings');
    await expect(page.locator('text=Bookings Management')).toBeVisible();
    await page.click('text=Create Booking');
    await expect(page).toHaveURL(/\/admin\/bookings\/create/);
  });

  test('admin bookings page shows table', async ({ page }) => {
    await page.goto('/en/admin/bookings');
    await expect(page.locator('table')).toBeVisible();
  });
});
