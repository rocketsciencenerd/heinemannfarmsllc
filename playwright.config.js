const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:8788',
  },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-safari',  use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'python3 -m http.server 8788',
    url: 'http://localhost:8788',
    reuseExistingServer: !process.env.CI,
  },
});
