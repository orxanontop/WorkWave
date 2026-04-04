import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// E2E — Login / Register flow
// ---------------------------------------------------------------------------

test('login page loads and displays form', async ({ page }) => {
  await page.goto('/auth/login');
  await expect(page).toHaveTitle(/login|sign in|workwave/i);
  await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible();
});

test('register page loads and displays form', async ({ page }) => {
  await page.goto('/auth/register');
  await expect(page).toHaveTitle(/register|sign up|workwave/i);
  await expect(page.getByRole('textbox', { name: /first name/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /last name/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /sign up|register/i })).toBeVisible();
});
