# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/dashboard-skip-link.spec.ts >> Dashboard Accessibility >> Skip link appears on Tab and focuses main content on Enter
- Location: tests/dashboard-skip-link.spec.ts:19:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/dashboard", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Dashboard Accessibility', () => {
  4  |   // Use a mocked user state with cookies to access the dashboard
  5  |   test.use({
  6  |     storageState: {
  7  |       cookies: [
  8  |         {
  9  |           name: 'logemail',
  10 |           value: 'test@example.com',
  11 |           domain: 'localhost',
  12 |           path: '/',
  13 |         }
  14 |       ],
  15 |       origins: []
  16 |     }
  17 |   });
  18 |
  19 |   test('Skip link appears on Tab and focuses main content on Enter', async ({ page }) => {
  20 |     // Go to the dashboard
> 21 |     await page.goto('/dashboard');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  22 |
  23 |     // Wait for the main element to be ready
  24 |     await page.waitForSelector('main#main-content');
  25 |
  26 |     // Press Tab to focus the first focusable element, which should be the skip link
  27 |     await page.keyboard.press('Tab');
  28 |
  29 |     const skipLink = page.locator('.skip-link');
  30 |
  31 |     // Check if the skip link is focused
  32 |     await expect(skipLink).toBeFocused();
  33 |
  34 |     // Check if it is visually visible (translate-y-0 should be applied on focus)
  35 |     // We check that it has the text
  36 |     await expect(skipLink).toHaveText('Aller au contenu principal');
  37 |
  38 |     // Press Enter to activate the skip link
  39 |     await page.keyboard.press('Enter');
  40 |
  41 |     // Check if focus has moved to the main content
  42 |     const mainContent = page.locator('main#main-content');
  43 |     await expect(mainContent).toBeFocused();
  44 |
  45 |     // Verify the hash in the URL
  46 |     expect(page.url()).toContain('#main-content');
  47 |   });
  48 | });
  49 |
```