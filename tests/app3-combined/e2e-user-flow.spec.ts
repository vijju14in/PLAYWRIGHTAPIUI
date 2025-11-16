import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/pages/login.page';
import { HomePage } from '../../page-objects/pages/home.page';
import { ProductsPage } from '../../page-objects/pages/products.page';
import { APIHelper } from '../../utils/api-helper';
import { TestDataLoader } from '../../utils/test-data-loader';

/**
 * App3 - Combined API and UI Tests
 * End-to-end user flow tests combining API and UI
 */
test.describe('App3 - E2E User Login and Browse Flow', () => {
  let testData: any;

  test.beforeEach(async () => {
    testData = TestDataLoader.load('app3-combined', 'e2e-scenarios.json');
  });

  test('should login via API and verify user session in UI', async ({ page, request }) => {
    const scenario = testData.e2eScenarios[0];
    const apiHelper = new APIHelper(request);

    // Step 1: Login via API
    const loginResponse = await apiHelper.post('/api/login', {
      username: scenario.user.username,
      password: scenario.user.password
    }, 200);

    const loginData = await apiHelper.getJSON(loginResponse);
    expect(loginData.success).toBe(true);
    expect(loginData.token).toBeTruthy();

    // Step 2: Verify user in UI by logging in
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(scenario.user.username, scenario.user.password);

    // Verify login success message
    await loginPage.verifyLoginSuccess(scenario.user.username);
  });

  test('should verify products via API and then check them in UI', async ({ page, request }) => {
    const apiHelper = new APIHelper(request);

    // Step 1: Get products via API
    const apiResponse = await apiHelper.get(`/api/products?region=${testData.region}`);
    const apiData = await apiHelper.getJSON(apiResponse);

    const apiProductNames = apiData.products.map((p: any) => p.name);

    // Step 2: Verify same products in UI
    const productsPage = new ProductsPage(page);
    await productsPage.navigate();
    await productsPage.filterByRegion(testData.region);
    await productsPage.waitForProductsToLoad();

    const uiProductNames = await productsPage.getAllProductNames();

    // Compare API and UI results
    expect(apiProductNames.sort()).toEqual(uiProductNames.sort());
  });

  test('should create user via API and verify in UI', async ({ page, request }) => {
    const scenario = testData.e2eScenarios[1];
    const apiHelper = new APIHelper(request);

    // Step 1: Create user via API
    const createResponse = await apiHelper.post('/api/users', scenario.newUser, 201);
    const createdUser = await apiHelper.getJSON(createResponse);

    expect(createdUser.username).toBe(scenario.newUser.username);
    expect(createdUser.region).toBe(scenario.newUser.region);

    // Step 2: Verify user appears in UI
    const usersPage = await import('../../page-objects/pages/users.page').then(m => m.UsersPage);
    const usersPageInstance = new usersPage(page);

    await usersPageInstance.navigate();
    await usersPageInstance.filterByRegion(scenario.newUser.region);
    await usersPageInstance.waitForUsersToLoad();

    // Verify user is visible
    await usersPageInstance.verifyUserDisplayed(scenario.newUser.username);

    // Cleanup: Delete the created user
    await request.delete(`/api/users/${createdUser.id}`);
  });

  test('should match product prices between API and UI', async ({ page, request }) => {
    const apiHelper = new APIHelper(request);

    // Step 1: Get product via API
    const apiResponse = await apiHelper.get(`/api/products?region=${testData.region}`);
    const apiData = await apiHelper.getJSON(apiResponse);
    const apiProduct = apiData.products[0];

    // Step 2: Navigate to products page
    const productsPage = new ProductsPage(page);
    await productsPage.navigate();
    await productsPage.filterByRegion(testData.region);
    await productsPage.waitForProductsToLoad();

    // Step 3: Verify product is displayed with correct price
    const productCard = page.locator('.product-card').first();
    const uiPrice = await productCard.locator('.product-price').textContent();

    expect(uiPrice).toContain(apiProduct.price.toString());
    expect(uiPrice).toContain(apiProduct.currency);
  });

  test('should handle full user journey: browse, login, view products', async ({ page, request }) => {
    const scenario = testData.e2eScenarios[0];

    // Step 1: Browse home page
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageTitle('Welcome to E-Commerce App');

    // Step 2: Navigate to products (before login)
    await homePage.goToProducts();
    const productsPage = new ProductsPage(page);
    await productsPage.waitForProductsToLoad();

    // Step 3: Login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(scenario.user.username, scenario.user.password);

    // Step 4: Verify login via API
    const apiHelper = new APIHelper(request);
    const userResponse = await apiHelper.get(`/api/users?region=${testData.region}`);
    const userData = await apiHelper.getJSON(userResponse);

    const userExists = userData.users.some((u: any) => u.username === scenario.user.username);
    expect(userExists).toBe(true);
  });
});

/**
 * Cross-region E2E tests
 */
test.describe('App3 - Cross-Region E2E Tests', () => {
  const regions = ['us', 'eu', 'asia'];

  for (const region of regions) {
    test(`should verify API and UI consistency for ${region.toUpperCase()}`, async ({ page, request }) => {
      const apiHelper = new APIHelper(request);
      const testData = TestDataLoader.load('app3-combined', 'e2e-scenarios.json', region);

      // Get products from API
      const apiResponse = await apiHelper.get(`/api/products?region=${region}`);
      const apiData = await apiHelper.getJSON(apiResponse);

      // Get products from UI
      const productsPage = new ProductsPage(page);
      await productsPage.navigate();
      await productsPage.filterByRegion(region);
      await productsPage.waitForProductsToLoad();

      const uiProductCount = await productsPage.getProductCount();

      // Verify counts match
      expect(apiData.products.length).toBe(uiProductCount);

      // Verify currency matches
      apiData.products.forEach((product: any) => {
        expect(product.currency).toBe(testData.currency);
      });
    });
  }
});
