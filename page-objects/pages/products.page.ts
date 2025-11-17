import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Products Page Object Model
 * Represents the products page and its interactions
 */
export class ProductsPage extends BasePage {
  // Locators
  readonly productsTitle: Locator;
  readonly regionFilter: Locator;
  readonly productsContainer: Locator;
  readonly productCount: Locator;

  constructor(page: Page) {
    super(page);
    this.productsTitle = page.locator('#products-title');
    this.regionFilter = page.locator('#region-filter');
    this.productsContainer = page.locator('#products-container');
    this.productCount = page.locator('#product-count');
  }

  /**
   * Navigate to products page
   */
  async navigate() {
    await this.goto('/products');
    await this.waitForPageLoad();
  }

  /**
   * Filter products by region
   */
  async filterByRegion(region: string) {
    await this.regionFilter.selectOption(region);
    // Wait for loading indicator to appear and disappear
    await this.page.waitForSelector('.loading', { state: 'attached', timeout: 2000 }).catch(() => {});
    await this.page.waitForSelector('.loading', { state: 'detached', timeout: 5000 }).catch(() => {});
    await this.wait(500); // Additional wait for stability
  }

  /**
   * Get product cards
   */
  getProductCards() {
    return this.page.locator('.product-card');
  }

  /**
   * Get product by name
   */
  getProductByName(name: string) {
    return this.page.locator('.product-name', { hasText: name });
  }

  /**
   * Get product count
   */
  async getProductCount(): Promise<number> {
    const cards = this.getProductCards();
    return await cards.count();
  }

  /**
   * Get product count text
   */
  async getProductCountText(): Promise<string> {
    return await this.productCount.textContent() || '';
  }

  /**
   * Verify product is displayed
   */
  async verifyProductDisplayed(productName: string) {
    const product = this.getProductByName(productName);
    await expect(product).toBeVisible();
  }

  /**
   * Verify products count
   */
  async verifyProductsCount(expectedCount: number) {
    const count = await this.getProductCount();
    expect(count).toBe(expectedCount);
  }

  /**
   * Get all product names
   */
  async getAllProductNames(): Promise<string[]> {
    const productNames = await this.page.locator('.product-name').allTextContents();
    return productNames;
  }

  /**
   * Wait for products to load
   */
  async waitForProductsToLoad() {
    // Wait for loading to disappear
    await this.page.waitForSelector('.loading', { state: 'detached', timeout: 10000 }).catch(() => {});
    // Ensure at least one product card is visible
    await this.page.waitForSelector('.product-card', { state: 'visible', timeout: 10000 });
    // Wait for network to be idle
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    // Small additional wait for DOM to stabilize
    await this.wait(200);
  }
}
