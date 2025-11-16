import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './config/environment.config';

/**
 * BrowserStack Configuration for Playwright
 * Run tests on BrowserStack cloud infrastructure
 *
 * Prerequisites:
 * 1. Set BROWSERSTACK_USERNAME environment variable
 * 2. Set BROWSERSTACK_ACCESS_KEY environment variable
 * 3. Install @browserstack/playwright-browserstack: npm install -D @browserstack/playwright-browserstack
 *
 * Usage:
 * BROWSERSTACK_USERNAME=your_username BROWSERSTACK_ACCESS_KEY=your_key npx playwright test --config=browserstack.config.ts
 */

const browserStackOptions = {
  'browserstack.username': process.env.BROWSERSTACK_USERNAME,
  'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
  'project': 'Playwright Automation Framework',
  'build': `Build ${new Date().toISOString()}`,
  'name': 'Playwright Test Run',
  'browserstack.debug': true,
  'browserstack.console': 'verbose',
  'browserstack.networkLogs': true,
};

export default defineConfig({
  testDir: './tests',
  timeout: envConfig.timeout,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 5 : 5, // BrowserStack concurrent sessions

  reporter: [
    ['html', { outputFolder: 'browserstack-report', open: 'never' }],
    ['json', { outputFile: 'test-results/browserstack-results.json' }],
    ['junit', { outputFile: 'test-results/browserstack-junit.xml' }],
    ['list']
  ],

  use: {
    baseURL: envConfig.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // BrowserStack specific settings
    connectOptions: {
      wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(browserStackOptions))}`,
    },
  },

  // BrowserStack Projects
  projects: [
    // Desktop Chrome - Windows
    {
      name: 'chrome-win-app1-ui',
      testDir: './tests/app1-ui',
      use: {
        ...devices['Desktop Chrome'],
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            ...browserStackOptions,
            'browser': 'chrome',
            'browser_version': 'latest',
            'os': 'Windows',
            'os_version': '11',
            'name': 'App1 UI - Chrome Windows',
          }))}`,
        },
      },
    },

    // Desktop Edge - Windows
    {
      name: 'edge-win-app1-ui',
      testDir: './tests/app1-ui',
      use: {
        ...devices['Desktop Edge'],
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            ...browserStackOptions,
            'browser': 'edge',
            'browser_version': 'latest',
            'os': 'Windows',
            'os_version': '11',
            'name': 'App1 UI - Edge Windows',
          }))}`,
        },
      },
    },

    // Desktop Safari - macOS
    {
      name: 'safari-mac-app1-ui',
      testDir: './tests/app1-ui',
      use: {
        ...devices['Desktop Safari'],
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            ...browserStackOptions,
            'browser': 'webkit',
            'browser_version': 'latest',
            'os': 'OS X',
            'os_version': 'Ventura',
            'name': 'App1 UI - Safari macOS',
          }))}`,
        },
      },
    },

    // Mobile Chrome - Android
    {
      name: 'chrome-android-app1-ui',
      testDir: './tests/app1-ui',
      use: {
        ...devices['Pixel 5'],
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            ...browserStackOptions,
            'browser': 'chrome',
            'device': 'Google Pixel 7',
            'os_version': '13.0',
            'real_mobile': 'true',
            'name': 'App1 UI - Chrome Android',
          }))}`,
        },
      },
    },

    // Mobile Safari - iOS
    {
      name: 'safari-ios-app1-ui',
      testDir: './tests/app1-ui',
      use: {
        ...devices['iPhone 13'],
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            ...browserStackOptions,
            'browser': 'webkit',
            'device': 'iPhone 14',
            'os_version': '16',
            'real_mobile': 'true',
            'name': 'App1 UI - Safari iOS',
          }))}`,
        },
      },
    },

    // API Testing Project (BrowserStack for monitoring)
    {
      name: 'app2-api-browserstack',
      testDir: './tests/app2-api',
      use: {
        baseURL: envConfig.baseUrl,
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            ...browserStackOptions,
            'browser': 'chrome',
            'browser_version': 'latest',
            'os': 'Windows',
            'os_version': '11',
            'name': 'App2 API Tests',
          }))}`,
        },
      },
    },

    // Combined Testing
    {
      name: 'app3-combined-browserstack',
      testDir: './tests/app3-combined',
      use: {
        ...devices['Desktop Chrome'],
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            ...browserStackOptions,
            'browser': 'chrome',
            'browser_version': 'latest',
            'os': 'Windows',
            'os_version': '11',
            'name': 'App3 Combined Tests',
          }))}`,
        },
      },
    },
  ],
});
