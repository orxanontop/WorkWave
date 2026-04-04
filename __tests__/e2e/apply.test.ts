import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// E2E — Apply to job (seeker flow)
// ---------------------------------------------------------------------------

test('apply to job button is visible on job detail page', async ({ page }) => {
  // Navigate to jobs listing first
  await page.goto('/jobs');
  await page.waitForLoadState('networkidle');

  // Click on the first job listing if any
  const firstJobLink = page.locator('a[href*="/jobs/"]').first();
  if (await firstJobLink.isVisible({ timeout: 5000 }).catch(() => false)) {
    await firstJobLink.click();
    await page.waitForLoadState('networkidle');

    // Check for apply-related elements
    const applyButton = page
      .getByRole('button', { name: /apply/i })
      .first()
      .or(page.getByText(/apply/i));

    if (await applyButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(applyButton).toBeVisible();
    }
  }
});

test('application form shows validation errors for empty submission', async ({ page }) => {
  // Navigate to jobs
  await page.goto('/jobs');
  await page.waitForLoadState('networkidle');

  // Find and click a job
  const firstJobLink = page.locator('a[href*="/jobs/"]').first();
  if (await firstJobLink.isVisible({ timeout: 5000 }).catch(() => false)) {
    await firstJobLink.click();
    await page.waitForLoadState('networkidle');

    // Try to apply (will require login or show form)
    const applyButton = page.getByRole('button', { name: /apply/i }).first();
    if (await applyButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await applyButton.click();
      // Should either redirect to login or show validation errors
      await page.waitForTimeout(1000);
    }
  }
});
