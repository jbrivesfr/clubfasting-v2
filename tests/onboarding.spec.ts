import { test, expect } from '@playwright/test';

test.describe('Dashboard Onboarding Tooltip', () => {
  // Use a mocked user state with cookies to access the dashboard
  test.use({
    storageState: {
      cookies: [
        {
          name: 'logemail',
          value: 'test@example.com',
          domain: 'localhost',
          path: '/',
          expires: -1,
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        }
      ],
      origins: []
    }
  });

  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure the tooltip appears
    await page.addInitScript(() => {
      window.localStorage.removeItem('onboarding_dashboard_done');
    });
  });

  test('first visit shows all 3 steps in order and terminates correctly', async ({ page }) => {
    await page.goto('/dashboard');

    // Check if the overlay exists
    const tooltip = page.locator('text=Étape 1 sur 3');
    await expect(tooltip).toBeVisible();

    // Step 1 title
    await expect(page.locator('text=Suivez votre jeûne quotidien')).toBeVisible();

    // Click Suivant
    await page.evaluate(() => { const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent === "Suivant"); if(btn) btn.click(); });

    // Step 2
    await expect(page.locator('text=Étape 2 sur 3')).toBeVisible();
    await expect(page.locator('text=Atteignez vos macros')).toBeVisible();

    // Click Suivant
    await page.evaluate(() => { const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent === "Suivant"); if(btn) btn.click(); });

    // Step 3
    await expect(page.locator('text=Étape 3 sur 3')).toBeVisible();
    await expect(page.locator('text=Partagez avec la communauté')).toBeVisible();

    // Click Terminer
    await page.evaluate(() => { const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent === "Terminer"); if(btn) btn.click(); });

    // Ensure tooltip is hidden
    await expect(page.locator('text=Étape 3 sur 3')).not.toBeVisible();

    // Check localStorage
    const isDone = await page.evaluate(() => window.localStorage.getItem('onboarding_dashboard_done'));
    expect(isDone).toBe('true');
  });

  test('clicking Passer dismisses immediately and sets flag', async ({ page }) => {
    await page.goto('/dashboard');

    // Step 1 shows
    const tooltip = page.locator('text=Étape 1 sur 3');
    await expect(tooltip).toBeVisible();

    // Click Passer
    await page.evaluate(() => { const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent === "Passer"); if(btn) btn.click(); });

    // Ensure tooltip is hidden
    await expect(tooltip).not.toBeVisible();

    // Check localStorage
    const isDone = await page.evaluate(() => window.localStorage.getItem('onboarding_dashboard_done'));
    expect(isDone).toBe('true');
  });

  test('second visit does NOT show overlay', async ({ page }) => {
    // Inject localStorage before goto
    await page.addInitScript(() => {
      window.localStorage.setItem('onboarding_dashboard_done', 'true');
    });

    await page.goto('/dashboard');

    // Tooltip should not be visible
    const overlay = page.locator('.fixed.inset-0.z-50');
    await expect(overlay).not.toBeVisible();
  });
});
