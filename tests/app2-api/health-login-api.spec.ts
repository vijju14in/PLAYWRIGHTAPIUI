import { test, expect } from '@playwright/test';
import { APIHelper } from '../../utils/api-helper';

/**
 * App2 - API Tests Only
 * Health check and Login API functionality tests
 */
test.describe('App2 - Health Check API Tests', () => {
  test('should return healthy status', async ({ request }) => {
    const apiHelper = new APIHelper(request);
    const response = await apiHelper.get('/api/health');
    const json = await apiHelper.getJSON(response);

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('healthy');
    expect(json).toHaveProperty('timestamp');
  });

  test('should have valid timestamp format', async ({ request }) => {
    const apiHelper = new APIHelper(request);
    const response = await apiHelper.get('/api/health');
    const json = await apiHelper.getJSON(response);

    // Verify timestamp is a valid ISO string
    const timestamp = new Date(json.timestamp);
    expect(timestamp.toString()).not.toBe('Invalid Date');
  });

  test('should respond quickly (performance test)', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/api/health');
    const endTime = Date.now();

    expect(response.status()).toBe(200);

    // Health check should respond within 1 second
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThan(1000);
  });
});

/**
 * Login API Tests
 */
test.describe('App2 - Login API Tests', () => {
  test('should login successfully with valid credentials', async ({ request }) => {
    const apiHelper = new APIHelper(request);

    const loginData = {
      username: 'john_us',
      password: 'password123'
    };

    const response = await apiHelper.post('/api/login', loginData, 200);
    const json = await apiHelper.getJSON(response);

    // Validate response
    expect(json.success).toBe(true);
    expect(json).toHaveProperty('token');
    expect(json).toHaveProperty('user');
    expect(json.user.username).toBe(loginData.username);
  });

  test('should fail login with invalid password', async ({ request }) => {
    const loginData = {
      username: 'john_us',
      password: 'wrongpassword'
    };

    const response = await request.post('/api/login', {
      data: loginData
    });

    expect(response.status()).toBe(401);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json).toHaveProperty('error');
    expect(json.error).toContain('Invalid credentials');
  });

  test('should fail login with non-existent user', async ({ request }) => {
    const loginData = {
      username: 'nonexistent_user',
      password: 'password123'
    };

    const response = await request.post('/api/login', {
      data: loginData
    });

    expect(response.status()).toBe(401);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json).toHaveProperty('error');
  });

  test('should return token with correct format', async ({ request }) => {
    const apiHelper = new APIHelper(request);

    const loginData = {
      username: 'jane_eu',
      password: 'password123'
    };

    const response = await apiHelper.post('/api/login', loginData, 200);
    const json = await apiHelper.getJSON(response);

    // Verify token format
    expect(json.token).toMatch(/^mock-jwt-token-\d+$/);
  });

  test('should login with different regional users', async ({ request }) => {
    const apiHelper = new APIHelper(request);

    const users = [
      { username: 'john_us', password: 'password123' },
      { username: 'jane_eu', password: 'password123' },
      { username: 'bob_asia', password: 'password123' }
    ];

    for (const user of users) {
      const response = await apiHelper.post('/api/login', user, 200);
      const json = await apiHelper.getJSON(response);

      expect(json.success).toBe(true);
      expect(json.user.username).toBe(user.username);
    }
  });

  test('should validate login response schema', async ({ request }) => {
    const apiHelper = new APIHelper(request);

    const loginData = {
      username: 'john_us',
      password: 'password123'
    };

    const response = await apiHelper.post('/api/login', loginData, 200);

    // Validate schema
    const requiredFields = ['success', 'token', 'user'];
    await apiHelper.validateSchema(response, requiredFields);
  });
});
