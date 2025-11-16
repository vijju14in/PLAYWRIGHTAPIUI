import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/pages/login.page';
import { HomePage } from '../../page-objects/pages/home.page';
import { TestDataLoader } from '../../utils/test-data-loader';

/**
 * App1 - UI Tests Only
 * Login functionality tests
 */
test.describe('App1 - Login UI Tests', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let testData: any;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);

    // Load test data for current region
    testData = TestDataLoader.load('app1-ui', 'login.json');

    await loginPage.navigate();
  });

  test('should display login page correctly', async () => {
    // Verify page title
    const pageTitle = await loginPage.getPageTitle();
    expect(pageTitle).toBe(testData.pageElements.title);

    // Verify login form is visible
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should login successfully with valid credentials', async () => {
    const validUser = testData.testUsers[0];

    // Perform login
    await loginPage.login(validUser.username, validUser.password);

    // Verify success message
    await loginPage.verifyLoginSuccess(validUser.expectedMessage);
  });

  test('should show error message with invalid credentials', async () => {
    const invalidUser = testData.testUsers[1];

    // Attempt login with invalid credentials
    await loginPage.login(invalidUser.username, invalidUser.password);

    // Verify error message
    await loginPage.verifyLoginFailure(invalidUser.expectedMessage);
  });

  test('should have correct page title in browser', async ({ page }) => {
    await expect(page).toHaveTitle(/Login/);
  });

  test('should navigate back to home page', async ({ page }) => {
    // Click back to home link
    await page.click('a[href="/"]');

    // Verify we're on home page
    await homePage.verifyPageTitle('Welcome to E-Commerce App');
  });

  test('should validate form fields are required', async () => {
    // Try to submit without filling fields
    await loginPage.loginButton.click();

    // HTML5 validation should prevent submission
    const usernameValidity = await loginPage.usernameInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(usernameValidity).toBe(false);
  });
});

/**
 * Cross-region login tests
 * Verify login works across all regions
 */
test.describe('App1 - Cross-Region Login Tests', () => {
  const regions = ['us', 'eu', 'asia'];

  for (const region of regions) {
    test(`should login successfully in ${region.toUpperCase()} region`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const testData = TestDataLoader.load('app1-ui', 'login.json', region);
      const validUser = testData.testUsers[0];

      await loginPage.navigate();
      await loginPage.login(validUser.username, validUser.password);
      await loginPage.verifyLoginSuccess(validUser.expectedMessage);
    });
  }
});
