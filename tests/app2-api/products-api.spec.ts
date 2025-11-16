import { test, expect } from '@playwright/test';
import { APIHelper } from '../../utils/api-helper';
import { TestDataLoader } from '../../utils/test-data-loader';

/**
 * App2 - API Tests Only
 * Products API functionality tests
 */
test.describe('App2 - Products API Tests', () => {
  let apiHelper: APIHelper;
  let testData: any;

  test.beforeEach(async ({ request }) => {
    apiHelper = new APIHelper(request);
    testData = TestDataLoader.load('app2-api', 'products.json');
  });

  test('should get all products', async () => {
    const response = await apiHelper.get('/api/products');
    const json = await apiHelper.getJSON(response);

    // Validate response structure
    expect(json).toHaveProperty('products');
    expect(json).toHaveProperty('count');
    expect(json.products).toBeInstanceOf(Array);
    expect(json.products.length).toBeGreaterThan(0);
  });

  test('should get products by region', async () => {
    const endpoint = `/api${testData.apiEndpoints.getByRegion}`;
    const response = await apiHelper.get(endpoint);
    const json = await apiHelper.getJSON(response);

    // Verify all products are from the specified region
    expect(json.products.length).toBe(testData.expectedProducts.length);

    json.products.forEach((product: any) => {
      expect(product.region).toBe(testData.region);
      expect(product.currency).toBe(testData.currency);
    });
  });

  test('should get product by ID', async () => {
    const productId = testData.expectedProducts[0].id;
    const response = await apiHelper.get(`/api/products/${productId}`);
    const json = await apiHelper.getJSON(response);

    // Validate response
    expect(json.id).toBe(productId);
    expect(json.name).toBe(testData.expectedProducts[0].name);
    expect(json.price).toBe(testData.expectedProducts[0].price);
    expect(json.currency).toBe(testData.expectedProducts[0].currency);
    expect(json.region).toBe(testData.expectedProducts[0].region);
  });

  test('should create a new product', async () => {
    const newProduct = testData.newProduct;
    const response = await apiHelper.post('/api/products', newProduct, 201);
    const json = await apiHelper.getJSON(response);

    // Validate created product
    expect(json).toHaveProperty('id');
    expect(json.name).toBe(newProduct.name);
    expect(json.price).toBe(newProduct.price);
    expect(json.currency).toBe(newProduct.currency);
    expect(json.region).toBe(newProduct.region);
  });

  test('should return 404 for non-existent product', async ({ request }) => {
    const response = await request.get('/api/products/99999');
    expect(response.status()).toBe(404);

    const json = await response.json();
    expect(json).toHaveProperty('error');
    expect(json.error).toContain('not found');
  });

  test('should validate product schema', async () => {
    const response = await apiHelper.get('/api/products');
    const json = await apiHelper.getJSON(response);

    // Validate product schema
    const requiredFields = ['products', 'count'];
    await apiHelper.validateSchema(response, requiredFields);

    // Validate individual product schema
    if (json.products.length > 0) {
      const product = json.products[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('currency');
      expect(product).toHaveProperty('region');
    }
  });

  test('should verify product data types', async () => {
    const productId = testData.expectedProducts[0].id;
    const response = await apiHelper.get(`/api/products/${productId}`);
    const product = await apiHelper.getJSON(response);

    // Verify data types
    expect(typeof product.id).toBe('number');
    expect(typeof product.name).toBe('string');
    expect(typeof product.price).toBe('number');
    expect(typeof product.currency).toBe('string');
    expect(typeof product.region).toBe('string');
  });
});

/**
 * Cross-region Products API tests
 */
test.describe('App2 - Cross-Region Products API Tests', () => {
  const regions = ['us', 'eu', 'asia'];

  for (const region of regions) {
    test(`should get products for ${region.toUpperCase()} region`, async ({ request }) => {
      const apiHelper = new APIHelper(request);
      const testData = TestDataLoader.load('app2-api', 'products.json', region);

      const response = await apiHelper.get(`/api/products?region=${region}`);
      const json = await apiHelper.getJSON(response);

      // Verify products match expected data
      expect(json.products.length).toBe(testData.expectedProducts.length);
      json.products.forEach((product: any) => {
        expect(product.region).toBe(region);
        expect(product.currency).toBe(testData.currency);
      });
    });
  }
});
