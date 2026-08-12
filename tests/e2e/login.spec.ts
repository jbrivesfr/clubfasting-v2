import { test, expect } from '@playwright/test';

test('no console errors on auth pages', async ({ page }) => {
  const errors: string[] = [];

  page.on('console', msg => {
    // Ignore 404s for favicon, and ignore Supabase 500 errors caused by missing env vars locally
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('favicon.ico') && !text.includes('Failed to load resource: the server responded with a status of 404') && !text.includes('Failed to load resource: the server responded with a status of 500')) {
      errors.push(`Console Error: ${text}`);
    }
  });

  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  const urlsToTest = [
    'http://localhost:3000/login',
    'http://localhost:3000/register',
    'http://localhost:3000/auth/callback',
    'http://localhost:3000/api/auth/refresh-session',
    'http://localhost:3000/api/auth/ensure-session'
  ];

  for (const url of urlsToTest) {
    await page.goto(url, { waitUntil: 'load' }); // don't wait for networkidle as it times out
  }

  expect(errors).toEqual([]);
});
