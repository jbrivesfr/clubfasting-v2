import { test, expect } from '@playwright/test';

test.describe('Dashboard Accessibility', () => {
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

  test('Skip link appears on Tab and focuses main content on Enter', async ({ page }) => {
    // Go to the dashboard
    await page.goto('/dashboard');

    // Wait for the main element to be ready
    await page.waitForSelector('main#main-content');

    // Press Tab to focus the first focusable element, which should be the skip link
    await page.keyboard.press('Tab');

    const skipLink = page.locator('.skip-link');

    // Check if the skip link is focused
    await expect(skipLink).toBeFocused();

    // Check if it is visually visible (translate-y-0 should be applied on focus)
    // We check that it has the text
    await expect(skipLink).toHaveText('Aller au contenu principal');

    // Press Enter to activate the skip link
    await page.keyboard.press('Enter');

    // Check if focus has moved to the main content
    const mainContent = page.locator('main#main-content');
    await expect(mainContent).toBeFocused();

    // Verify the hash in the URL
    expect(page.url()).toContain('#main-content');
  });
});
