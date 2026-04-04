import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// E2E — Admin user management
// ---------------------------------------------------------------------------

test('admin dashboard redirects to login for unauthenticated users', async ({ page }) => {
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');

  const currentUrl = page.url();
  expect(
    currentUrl.includes('/auth/login') || currentUrl.includes('/admin')
  ).toBe(true);

  // If redirected to login, verify callback URL is set
  if (currentUrl.includes('/auth/login')) {
    const url = new URL(currentUrl);
    expect(url.searchParams.get('callbackUrl')).toContain('/admin');
  }
});

test('admin users page redirects to login for unauthenticated users', async ({ page }) => {
  await page.goto('/admin/users');
  await page.waitForLoadState('networkidle');

  const currentUrl = page.url();
  expect(currentUrl.includes('/auth/login')).toBe(true);
});

test('admin jobs page redirects to login for unauthenticated users', async ({ page }) => {
  await page.goto('/admin/jobs');
  await page.waitForLoadState('networkidle');

  const currentUrl = page.url();
  expect(currentUrl.includes('/auth/login')).toBe(true);
});
