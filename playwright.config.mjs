import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
  fullyParallel: true,
  // GitHub's macOS runners have 3 vCPUs, so Playwright's default of 50% of the
  // cores rounds down to a single worker. Pin CI to 2 so the suite still
  // parallelises there.
  workers: process.env.CI ? 2 : undefined,
  outputDir: './build/playwright-artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: './build/playwright-report', open: 'never' }],
  ],
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