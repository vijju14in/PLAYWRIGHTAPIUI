import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './config/environment.config';

/**
 * Production-ready Playwright Configuration
 * Supports multiple environments (dev, staging, prod)
 * Supports multiple regions (us, eu, asia)
 * Configured for both API and UI testing
 */
export default defineConfig({
  testDir: './tests',

  // Maximum time one test can run
  timeout: envConfig.timeout,

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],

  // Shared settings for all projects
  use: {
    baseURL: envConfig.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: envConfig.headless,

    // API testing settings
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },

  // Test projects configuration
  projects: [
    // App 1: UI Testing Only
    {
      name: 'app1-ui',
      testDir: './tests/app1-ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: envConfig.baseUrl,
        viewport: { width: 1920, height: 1080 },
      },
    },

    // App 2: API Testing Only
    {
      name: 'app2-api',
      testDir: './tests/app2-api',
      use: {
        baseURL: envConfig.baseUrl,
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },

    // App 3: Combined API and UI Testing
    {
      name: 'app3-combined',
      testDir: './tests/app3-combined',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: envConfig.baseUrl,
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Additional browser configurations (optional)
  //   {
  //     name: 'app1-ui-firefox',
  //     testDir: './tests/app1-ui',
  //     use: {
  //       ...devices['Desktop Firefox'],
  //       baseURL: envConfig.baseUrl,
  //     },
  //   },

  //   {
  //     name: 'app1-ui-webkit',
  //     testDir: './tests/app1-ui',
  //     use: {
  //       ...devices['Desktop Safari'],
  //       baseURL: envConfig.baseUrl,
  //     },
  //   },

  //   // Mobile configurations
  //   {
  //     name: 'app1-ui-mobile',
  //     testDir: './tests/app1-ui',
  //     use: {
  //       ...devices['iPhone 13'],
  //       baseURL: envConfig.baseUrl,
  //     },
  //   },
   ],

  // Web server configuration (auto-start mock server for local testing)
  webServer: {
    command: 'npm run start:mock',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
