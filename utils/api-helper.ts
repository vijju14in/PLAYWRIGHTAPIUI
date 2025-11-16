import { APIRequestContext, expect } from '@playwright/test';

/**
 * API Helper Utility
 * Provides reusable methods for API testing
 */
export class APIHelper {
  constructor(private request: APIRequestContext) {}

  /**
   * GET request with optional validation
   */
  async get(endpoint: string, expectedStatus: number = 200) {
    const response = await this.request.get(endpoint);
    expect(response.status()).toBe(expectedStatus);
    return response;
  }

  /**
   * POST request with optional validation
   */
  async post(endpoint: string, data: any, expectedStatus: number = 201) {
    const response = await this.request.post(endpoint, {
      data: data
    });
    expect(response.status()).toBe(expectedStatus);
    return response;
  }

  /**
   * PUT request with optional validation
   */
  async put(endpoint: string, data: any, expectedStatus: number = 200) {
    const response = await this.request.put(endpoint, {
      data: data
    });
    expect(response.status()).toBe(expectedStatus);
    return response;
  }

  /**
   * DELETE request with optional validation
   */
  async delete(endpoint: string, expectedStatus: number = 200) {
    const response = await this.request.delete(endpoint);
    expect(response.status()).toBe(expectedStatus);
    return response;
  }

  /**
   * Validate response schema
   */
  async validateSchema(response: any, requiredFields: string[]) {
    const json = await response.json();
    for (const field of requiredFields) {
      expect(json).toHaveProperty(field);
    }
    return json;
  }

  /**
   * Get response as JSON
   */
  async getJSON(response: any) {
    return await response.json();
  }

  /**
   * Validate response contains expected data
   */
  validateResponseData(actualData: any, expectedData: any) {
    for (const key in expectedData) {
      expect(actualData[key]).toBe(expectedData[key]);
    }
  }

  /**
   * Wait for API condition (polling)
   */
  async waitForCondition(
    checkFn: () => Promise<boolean>,
    timeout: number = 10000,
    interval: number = 1000
  ): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await checkFn()) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    throw new Error('Timeout waiting for condition');
  }
}
