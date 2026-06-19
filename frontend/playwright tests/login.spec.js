import { test, expect } from '@playwright/test';
import { login } from './utils/login.js';

test('Přihlášení', async ({ page }) => {
  await login(page);
});

test('Špatné přihlášení', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await expect(page.getByText('PřihlášeníPřihlaste se do své')).toBeVisible();
  await page.getByRole('textbox', { name: 'Váš e-mail' }).click();
  await page.getByRole('textbox', { name: 'Váš e-mail' }).fill('notexisting@gmail.com');
  await page.getByRole('textbox', { name: 'Vaše heslo' }).click();
  await page.getByRole('textbox', { name: 'Vaše heslo' }).fill('password123');
  await page.getByRole('button', { name: 'Přihlásit se' }).click();
  await expect(page.getByText('Neplatný email nebo heslo.')).toBeVisible();
});