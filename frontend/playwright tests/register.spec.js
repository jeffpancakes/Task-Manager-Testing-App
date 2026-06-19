import { test, expect } from '@playwright/test';

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

test('Registrace - prázdný formulář', async ({ page }) => {
  await page.goto('http://localhost:5173/register');
  await expect(page.getByText('RegistraceVytvořte si nový úč')).toBeVisible();
  await page.getByRole('button', { name: 'Zaregistrovat se' }).click();
  await expect(page.getByText('Jméno musí mít alespoň 2')).toBeVisible();
  await expect(page.getByText('Email je povinný')).toBeVisible();
  await expect(page.getByText('Heslo musí mít alespoň 8 znaků')).toBeVisible();
});

test('Registrace - příliš dlouhé jméno', async ({ page }) => {
  await page.goto('http://localhost:5173/register');
  await expect(page.getByText('RegistraceVytvořte si nový úč')).toBeVisible();
  await page.getByRole('textbox', { name: 'Jan Novák' }).fill('This is a very long name that exceeds the maximum length of thirty characters');
  await page.getByRole('button', { name: 'Zaregistrovat se' }).click();
  await expect(page.getByText('Jméno nesmí být delší než 30 znaků')).toBeVisible();
});

test('Registrace - neplatný email', async ({ page }) => {
  await page.goto('http://localhost:5173/register');
  await expect(page.getByText('RegistraceVytvořte si nový úč')).toBeVisible();
  await page.getByRole('textbox', { name: 'jan@example.cz' }).fill('notanemail');
  await page.getByRole('button', { name: 'Zaregistrovat se' }).click();
  await expect(page.getByText('Email není ve správném formátu.')).toBeVisible();
});

test('Registrace - krátké heslo', async ({ page }) => {
  await page.goto('http://localhost:5173/register');
  await expect(page.getByText('RegistraceVytvořte si nový úč')).toBeVisible();
  await page.getByRole('textbox', { name: 'Vaše heslo' }).fill('short');
  await page.getByRole('button', { name: 'Zaregistrovat se' }).click();
  await expect(page.getByText('Heslo musí mít alespoň 8 znaků.')).toBeVisible();
});

test('Registrace - neshodující se hesla', async ({ page }) => {
  await page.goto('http://localhost:5173/register');
  await expect(page.getByText('RegistraceVytvořte si nový úč')).toBeVisible();
  await page.getByRole('textbox', { name: 'Vaše heslo' }).fill('firstpassword');
  await page.getByRole('textbox', { name: 'Potvrzení hesla' }).fill('differentpassword');
  await page.getByRole('button', { name: 'Zaregistrovat se' }).click();
  await expect(page.getByText('Hesla se neshodují.')).toBeVisible();
});