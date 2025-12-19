// playwright.config.js
module.exports = {
  testDir: './tests/ui',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...require('playwright').devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...require('playwright').devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...require('playwright').devices['Desktop Safari'],
      },
    },
  ],
  webServer: {
    command: 'cd backend && npm start',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
};
