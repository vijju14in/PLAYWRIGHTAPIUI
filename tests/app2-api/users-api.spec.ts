import { test, expect } from '@playwright/test';
import { APIHelper } from '../../utils/api-helper';
import { TestDataLoader } from '../../utils/test-data-loader';

/**
 * App2 - API Tests Only
 * Users API functionality tests
 */
test.describe('App2 - Users API Tests', () => {
  let apiHelper: APIHelper;
  let testData: any;

  test.beforeEach(async ({ request }) => {
    apiHelper = new APIHelper(request);
    testData = TestDataLoader.load('app2-api', 'users.json');
  });

  test('should get all users', async () => {
    const response = await apiHelper.get('/api/users');
    const json = await apiHelper.getJSON(response);

    // Validate response structure
    expect(json).toHaveProperty('users');
    expect(json).toHaveProperty('count');
    expect(json.users).toBeInstanceOf(Array);
    expect(json.users.length).toBeGreaterThanOrEqual(testData.expectedUsers.length);
  });

  test('should get users by region', async () => {
    const endpoint = `/api${testData.apiEndpoints.getByRegion}`;
    const response = await apiHelper.get(endpoint);
    const json = await apiHelper.getJSON(response);

    // Verify all users are from the specified region
    json.users.forEach((user: any) => {
      expect(user.region).toBe(testData.region);
    });
  });

  test('should get user by ID', async () => {
    const userId = testData.expectedUsers[0].id;
    const response = await apiHelper.get(`/api/users/${userId}`);
    const json = await apiHelper.getJSON(response);

    // Validate response
    expect(json.id).toBe(userId);
    expect(json.username).toBe(testData.expectedUsers[0].username);
    expect(json.email).toBe(testData.expectedUsers[0].email);
    expect(json.region).toBe(testData.expectedUsers[0].region);
  });

  test('should create a new user', async ({ request }) => {
    const newUser = testData.newUser;
    const apiHelper = new APIHelper(request);

    const response = await apiHelper.post('/api/users', newUser, 201);
    const json = await apiHelper.getJSON(response);

    // Validate created user
    expect(json).toHaveProperty('id');
    expect(json.username).toBe(newUser.username);
    expect(json.email).toBe(newUser.email);
    expect(json.region).toBe(newUser.region);

    // Clean up - delete the created user
    if (json.id) {
      await request.delete(`/api/users/${json.id}`);
    }
  });

  test('should update a user', async ({ request }) => {
    // First create a user
    const apiHelper = new APIHelper(request);
    const createResponse = await apiHelper.post('/api/users', testData.newUser, 201);
    const createdUser = await apiHelper.getJSON(createResponse);

    // Update the user
    const updateData = testData.updateUser;
    const updateResponse = await apiHelper.put(`/api/users/${createdUser.id}`, updateData);
    const updatedUser = await apiHelper.getJSON(updateResponse);

    // Verify update
    expect(updatedUser.id).toBe(createdUser.id);
    expect(updatedUser.username).toBe(updateData.username);
    expect(updatedUser.email).toBe(updateData.email);

    // Clean up
    await request.delete(`/api/users/${createdUser.id}`);
  });

  test('should delete a user', async ({ request }) => {
    // First create a user
    const apiHelper = new APIHelper(request);
    const createResponse = await apiHelper.post('/api/users', testData.newUser, 201);
    const createdUser = await apiHelper.getJSON(createResponse);

    // Delete the user
    const deleteResponse = await apiHelper.delete(`/api/users/${createdUser.id}`);
    const deleteJson = await apiHelper.getJSON(deleteResponse);

    // Verify deletion
    expect(deleteJson).toHaveProperty('message');
    expect(deleteJson.message).toContain('deleted');

    // Verify user is actually deleted
    const getResponse = await request.get(`/api/users/${createdUser.id}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should return 404 for non-existent user', async ({ request }) => {
    const response = await request.get('/api/users/99999');
    expect(response.status()).toBe(404);

    const json = await response.json();
    expect(json).toHaveProperty('error');
    expect(json.error).toContain('not found');
  });

  test('should validate user schema', async () => {
    const response = await apiHelper.get('/api/users');
    const json = await apiHelper.getJSON(response);

    // Validate response schema
    const requiredFields = ['users', 'count'];
    await apiHelper.validateSchema(response, requiredFields);

    // Validate individual user schema
    if (json.users.length > 0) {
      const user = json.users[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('region');
    }
  });

  test('should verify user data types', async () => {
    const userId = testData.expectedUsers[0].id;
    const response = await apiHelper.get(`/api/users/${userId}`);
    const user = await apiHelper.getJSON(response);

    // Verify data types
    expect(typeof user.id).toBe('number');
    expect(typeof user.username).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.region).toBe('string');
  });
});

/**
 * Cross-region Users API tests
 */
test.describe('App2 - Cross-Region Users API Tests', () => {
  const regions = ['us', 'eu', 'asia'];

  for (const region of regions) {
    test(`should get users for ${region.toUpperCase()} region`, async ({ request }) => {
      const apiHelper = new APIHelper(request);
      const testData = TestDataLoader.load('app2-api', 'users.json', region);

      const response = await apiHelper.get(`/api/users?region=${region}`);
      const json = await apiHelper.getJSON(response);

      // Verify users match expected data
      expect(json.users.length).toBeGreaterThanOrEqual(testData.expectedUsers.length);
      json.users.forEach((user: any) => {
        expect(user.region).toBe(region);
      });
    });
  }
});
