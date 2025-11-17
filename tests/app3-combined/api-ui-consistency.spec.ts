import { test, expect } from '@playwright/test';
import { UsersPage } from '../../page-objects/pages/users.page';
import { ProductsPage } from '../../page-objects/pages/products.page';
import { APIHelper } from '../../utils/api-helper';

/**
 * App3 - Combined API and UI Tests
 * Data consistency validation between API and UI
 */
test.describe('App3 - API and UI Data Consistency Tests', () => {
  test('should have matching user counts between API and UI', async ({ page, request }) => {
    const apiHelper = new APIHelper(request);

    // Get user count from API
    const apiResponse = await apiHelper.get('/api/users');
    const apiData = await apiHelper.getJSON(apiResponse);
    const apiUserCount = apiData.count;

    // Get user count from UI
    const usersPage = new UsersPage(page);
    await usersPage.navigate();
    await usersPage.waitForUsersToLoad();
    const uiUserCount = await usersPage.getUserCount();

    // Verify counts match
    expect(apiUserCount).toBe(uiUserCount);
  });

  test('should have matching product counts between API and UI', async ({ page, request }) => {
    const apiHelper = new APIHelper(request);

    // Get product count from API
    const apiResponse = await apiHelper.get('/api/products');
    const apiData = await apiHelper.getJSON(apiResponse);
    const apiProductCount = apiData.count;

    // Get product count from UI
    const productsPage = new ProductsPage(page);
    await productsPage.navigate();
    await productsPage.waitForProductsToLoad();
    const uiProductCount = await productsPage.getProductCount();

    // Verify counts match
    expect(apiProductCount).toBe(uiProductCount);
  });

  test('should validate user data consistency between API and UI', async ({ page, request }) => {
    const apiHelper = new APIHelper(request);

    // Get users from API
    const apiResponse = await apiHelper.get('/api/users');
    const apiData = await apiHelper.getJSON(apiResponse);
    const apiUsernames = apiData.users.map((u: any) => u.username).sort();

    // Get users from UI
    const usersPage = new UsersPage(page);
    await usersPage.navigate();
    await usersPage.waitForUsersToLoad();
    const uiUsernames = (await usersPage.getAllUsernames()).sort();

    // Verify usernames match
    expect(apiUsernames).toEqual(uiUsernames);
  });

  test('should validate product data consistency between API and UI', async ({ page, request }) => {
    const apiHelper = new APIHelper(request);

    // Get products from API
    const apiResponse = await apiHelper.get('/api/products');
    const apiData = await apiHelper.getJSON(apiResponse);
    const apiProductNames = apiData.products.map((p: any) => p.name).sort();

    // Get products from UI
    const productsPage = new ProductsPage(page);
    await productsPage.navigate();
    await productsPage.waitForProductsToLoad();
    const uiProductNames = (await productsPage.getAllProductNames()).sort();

    // Verify product names match
    expect(apiProductNames).toEqual(uiProductNames);
  });

  test('should create product via API and immediately see it in UI', async ({ page, request }) => {
    const apiHelper = new APIHelper(request);

    const newProduct = {
      name: 'Test Headphones',
      price: 149,
      currency: 'USD',
      region: 'us'
    };

    // Create product via API
    const createResponse = await apiHelper.post('/api/products', newProduct, 201);
    const createdProduct = await apiHelper.getJSON(createResponse);

    // Refresh products page
    const productsPage = new ProductsPage(page);
    await productsPage.navigate();
    await productsPage.filterByRegion('us');
    await productsPage.waitForProductsToLoad();

    // Verify product appears in UI
    await productsPage.verifyProductDisplayed(newProduct.name);

    // Clean up - delete the created product
    if (createdProduct.id) {
      const deleteResponse = await request.delete(`/api/products/${createdProduct.id}`);
      expect(deleteResponse.status()).toBe(200);
    }
  });

  test('should update user via API and verify change in UI', async ({ page, request }) => {
    const apiHelper = new APIHelper(request);

    // Create a test user
    const newUser = {
      username: 'testuser_api_ui',
      email: 'testuser@example.com',
      region: 'us'
    };

    const createResponse = await apiHelper.post('/api/users', newUser, 201);
    const createdUser = await apiHelper.getJSON(createResponse);

    // Update user via API
    const updateData = {
      username: 'testuser_updated',
      email: 'updated@example.com',
      region: 'us'
    };

    await apiHelper.put(`/api/users/${createdUser.id}`, updateData);

    // Verify update in UI
    const usersPage = new UsersPage(page);
    await usersPage.navigate();
    await usersPage.filterByRegion('us');
    await usersPage.waitForUsersToLoad();

    await usersPage.verifyUserDisplayed(updateData.username);

    // Cleanup
    await request.delete(`/api/users/${createdUser.id}`);
  });

  test('should delete user via API and verify removal in UI', async ({ page, request }) => {
    const apiHelper = new APIHelper(request);

    // Create a test user
    const newUser = {
      username: 'testuser_delete',
      email: 'delete@example.com',
      region: 'us'
    };

    const createResponse = await apiHelper.post('/api/users', newUser, 201);
    const createdUser = await apiHelper.getJSON(createResponse);

    // Verify user exists in UI
    const usersPage = new UsersPage(page);
    await usersPage.navigate();
    await usersPage.filterByRegion('us');
    await usersPage.waitForUsersToLoad();
    await usersPage.verifyUserDisplayed(newUser.username);

    // Delete user via API
    await apiHelper.delete(`/api/users/${createdUser.id}`);

    // Refresh and verify user is gone
    await usersPage.navigate();
    await usersPage.filterByRegion('us');
    await usersPage.waitForUsersToLoad();

    const userRow = usersPage.getUserByUsername(newUser.username);
    await expect(userRow).not.toBeVisible();
  });

  test('should validate region filtering consistency between API and UI', async ({ page, request }) => {
    const regions = ['us', 'eu', 'asia'];

    for (const region of regions) {
      const apiHelper = new APIHelper(request);

      // Get products for region from API
      const apiResponse = await apiHelper.get(`/api/products?region=${region}`);
      const apiData = await apiHelper.getJSON(apiResponse);

      // Get products for region from UI
      const productsPage = new ProductsPage(page);
      await productsPage.navigate();
      await productsPage.filterByRegion(region);
      await productsPage.waitForProductsToLoad();
      const uiProductCount = await productsPage.getProductCount();

      // Verify consistency
      expect(apiData.products.length).toBe(uiProductCount);
    }
  });
});

/**
 * Performance comparison tests
 */
test.describe('App3 - API vs UI Performance Tests', () => {
  test('should compare response times for data retrieval', async ({ page, request }) => {
    // Measure API response time
    const apiStartTime = Date.now();
    const response = await request.get('/api/products');
    const apiEndTime = Date.now();
    const apiResponseTime = apiEndTime - apiStartTime;

    expect(response.status()).toBe(200);

    // Measure UI load time
    const productsPage = new ProductsPage(page);
    const uiStartTime = Date.now();
    await productsPage.navigate();
    await productsPage.waitForProductsToLoad();
    const uiEndTime = Date.now();
    const uiResponseTime = uiEndTime - uiStartTime;

    // Log performance metrics (for analysis)
    console.log(`API Response Time: ${apiResponseTime}ms`);
    console.log(`UI Load Time: ${uiResponseTime}ms`);

    // API should generally be faster than UI
    expect(apiResponseTime).toBeLessThan(5000);
    expect(uiResponseTime).toBeLessThan(10000);
  });
});
