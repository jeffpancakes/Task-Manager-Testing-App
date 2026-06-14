import { test, expect } from '@playwright/test';
import { login } from './utils/login.js';

test('Registrace', async ({ page }) => {
  await page.goto('http://localhost:5173/register');
  await expect(page.getByText('RegistraceVytvořte si nový úč')).toBeVisible();
  await page.getByRole('textbox', { name: 'Jan Novák' }).click();
  await page.getByRole('textbox', { name: 'Jan Novák' }).fill('Test User');
  await page.getByRole('textbox', { name: 'jan@example.cz' }).click();
  await page.getByRole('textbox', { name: 'jan@example.cz' }).fill('test@test.cz');
  await page.getByRole('textbox', { name: 'Vaše heslo' }).click();
  await page.getByRole('textbox', { name: 'Vaše heslo' }).fill('test12345');
  await page.getByRole('textbox', { name: 'Potvrzení hesla' }).click();
  await page.getByRole('textbox', { name: 'Potvrzení hesla' }).fill('test12345');
  await page.getByRole('button', { name: 'Zaregistrovat se' }).click();
  await expect(page.getByRole('main')).toBeVisible();
});

test('Přihlášení', async ({ page }) => {
  await login(page);
});