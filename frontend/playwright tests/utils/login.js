import { expect } from '@playwright/test';

export async function login(page) {
    await page.goto('http://localhost:5173/login');
    await expect(page.getByText('PřihlášeníPřihlaste se do své')).toBeVisible();
    await page.getByRole('textbox', { name: 'Váš e-mail' }).click();
    await page.getByRole('textbox', { name: 'Váš e-mail' }).fill('test@test.cz');
    await page.getByRole('textbox', { name: 'Vaše heslo' }).click();
    await page.getByRole('textbox', { name: 'Vaše heslo' }).fill('test12345');
    await page.getByRole('button', { name: 'Přihlásit se' }).click();
    await expect(page.getByRole('main')).toBeVisible();
}