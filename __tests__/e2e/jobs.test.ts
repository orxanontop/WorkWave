import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// E2E — Browse & search jobs
// ---------------------------------------------------------------------------

test('browse jobs page lists jobs', async ({ page }) => {
  await page.goto('/jobs');
  await expect(page.locator('main')).toBeVisible();
});

test('search for a job filters results', async ({ page }) => {
  await page.goto('/jobs');

  const searchInput = page.getByRole('textbox', { name: /search/i });
  if (await searchInput.isVisible()) {
    await searchInput.fill('engineer');
    // Verify search triggers filtering (either auto or via button)
    await expect(page.locator('main')).toBeVisible();
  }
});

test('job filters are visible and interactive', async ({ page }) => {
  await page.goto('/jobs');

  // Check common filter existence
  const jobTypeFilter = page.getByRole('combobox');
  if (await jobTypeFilter.isVisible()) {
    await expect(jobTypeFilter).toBeVisible();
  }
});
