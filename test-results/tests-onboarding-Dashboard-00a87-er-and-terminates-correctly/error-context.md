# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/onboarding.spec.ts >> Dashboard Onboarding Tooltip >> first visit shows all 3 steps in order and terminates correctly
- Location: tests/onboarding.spec.ts:26:7

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
  3  | test.describe('Dashboard Onboarding Tooltip', () => {
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
  19 |   test.beforeEach(async ({ page }) => {
  20 |     // Clear localStorage to ensure the tooltip appears
  21 |     await page.addInitScript(() => {
  22 |       window.localStorage.removeItem('onboarding_dashboard_done');
  23 |     });
  24 |   });
  25 |
  26 |   test('first visit shows all 3 steps in order and terminates correctly', async ({ page }) => {
> 27 |     await page.goto('/dashboard');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  28 |
  29 |     // Check if the overlay exists
  30 |     const tooltip = page.locator('text=Étape 1 sur 3');
  31 |     await expect(tooltip).toBeVisible();
  32 |
  33 |     // Step 1 title
  34 |     await expect(page.locator('text=Suivez votre jeûne quotidien')).toBeVisible();
  35 |
  36 |     // Click Suivant
  37 |     await page.evaluate(() => { const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent === "Suivant"); if(btn) btn.click(); });
  38 |
  39 |     // Step 2
  40 |     await expect(page.locator('text=Étape 2 sur 3')).toBeVisible();
  41 |     await expect(page.locator('text=Atteignez vos macros')).toBeVisible();
  42 |
  43 |     // Click Suivant
  44 |     await page.evaluate(() => { const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent === "Suivant"); if(btn) btn.click(); });
  45 |
  46 |     // Step 3
  47 |     await expect(page.locator('text=Étape 3 sur 3')).toBeVisible();
  48 |     await expect(page.locator('text=Partagez avec la communauté')).toBeVisible();
  49 |
  50 |     // Click Terminer
  51 |     await page.evaluate(() => { const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent === "Terminer"); if(btn) btn.click(); });
  52 |
  53 |     // Ensure tooltip is hidden
  54 |     await expect(page.locator('text=Étape 3 sur 3')).not.toBeVisible();
  55 |
  56 |     // Check localStorage
  57 |     const isDone = await page.evaluate(() => window.localStorage.getItem('onboarding_dashboard_done'));
  58 |     expect(isDone).toBe('true');
  59 |   });
  60 |
  61 |   test('clicking Passer dismisses immediately and sets flag', async ({ page }) => {
  62 |     await page.goto('/dashboard');
  63 |
  64 |     // Step 1 shows
  65 |     const tooltip = page.locator('text=Étape 1 sur 3');
  66 |     await expect(tooltip).toBeVisible();
  67 |
  68 |     // Click Passer
  69 |     await page.evaluate(() => { const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent === "Passer"); if(btn) btn.click(); });
  70 |
  71 |     // Ensure tooltip is hidden
  72 |     await expect(tooltip).not.toBeVisible();
  73 |
  74 |     // Check localStorage
  75 |     const isDone = await page.evaluate(() => window.localStorage.getItem('onboarding_dashboard_done'));
  76 |     expect(isDone).toBe('true');
  77 |   });
  78 |
  79 |   test('second visit does NOT show overlay', async ({ page }) => {
  80 |     // Inject localStorage before goto
  81 |     await page.addInitScript(() => {
  82 |       window.localStorage.setItem('onboarding_dashboard_done', 'true');
  83 |     });
  84 |
  85 |     await page.goto('/dashboard');
  86 |
  87 |     // Tooltip should not be visible
  88 |     const overlay = page.locator('.fixed.inset-0.z-50');
  89 |     await expect(overlay).not.toBeVisible();
  90 |   });
  91 | });
  92 |
```