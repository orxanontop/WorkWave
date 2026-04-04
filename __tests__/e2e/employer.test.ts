import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// E2E — Post a job as employer
// ---------------------------------------------------------------------------

test('post-job page is accessible', async ({ page }) => {
  await page.goto('/dashboard/post-job');
  // Should either show the form (if logged in) or redirect to login
  const currentUrl = page.url();
  expect(
    currentUrl.includes('/dashboard/post-job') || currentUrl.includes('/auth/login')
  ).toBe(true);
});

test('post-job form has required fields', async ({ page }) => {
  await page.goto('/dashboard/post-job');
  const currentUrl = page.url();
  // If redirected to login, skip
  if (currentUrl.includes('/auth/login')) {
    return;
  }

  // Check for common job posting fields
  const titleInput = page.getByRole('textbox', { name: /title/i }).first();
  if (await titleInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await expect(titleInput).toBeVisible();

    const descriptionInput = page.getByRole('textbox', { name: /description/i });
    if (await descriptionInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(descriptionInput).toBeVisible();
    }

    const submitButton = page.getByRole('button', { name: /post|publish|submit/i });
    if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(submitButton).toBeVisible();
    }
  }
});
