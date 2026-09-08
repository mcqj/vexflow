import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
  outputDir: './build/playwright-artifacts',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    ...devices['Desktop Chrome'],
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: 'npm run dev -- --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
});