// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'off',
    screenshot: 'on',
    video: 'on',
    headless: false,
    slowMo: 300,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});