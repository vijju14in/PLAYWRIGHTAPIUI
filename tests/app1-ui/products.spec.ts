import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../page-objects/pages/products.page';

/**
 * App1 - UI Tests Only
 * Products page functionality tests
 */
test.describe('App1 - Products Page UI Tests', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    await productsPage.navigate();
    await productsPage.waitForProductsToLoad();
  });

  test('should display products page correctly', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Products/);

    // Verify products are displayed
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('should display all products by default', async () => {
    // Should show products from all regions
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBe(6); // 2 products per region * 3 regions
  });

  test('should filter products by US region', async () => {
    await productsPage.filterByRegion('us');
    await productsPage.waitForProductsToLoad();

    const productCount = await productsPage.getProductCount();
    expect(productCount).toBe(2);

    // Verify products are from US region
    await productsPage.verifyProductDisplayed('Laptop');
    await productsPage.verifyProductDisplayed('Mouse');
  });

  test('should filter products by EU region', async () => {
    await productsPage.filterByRegion('eu');
    await productsPage.waitForProductsToLoad();

    const productCount = await productsPage.getProductCount();
    expect(productCount).toBe(2);

    // Verify products are from EU region
    await productsPage.verifyProductDisplayed('Laptop');
    await productsPage.verifyProductDisplayed('Mouse');
  });

  test('should filter products by Asia region', async () => {
    await productsPage.filterByRegion('asia');
    await productsPage.waitForProductsToLoad();

    const productCount = await productsPage.getProductCount();
    expect(productCount).toBe(2);

    // Verify products are from Asia region
    await productsPage.verifyProductDisplayed('Laptop');
    await productsPage.verifyProductDisplayed('Mouse');
  });

  test('should display product count', async () => {
    const countText = await productsPage.getProductCountText();
    expect(countText).toContain('Showing');
    expect(countText).toContain('product');
  });

  test('should show product cards with correct information', async ({ page }) => {
    const firstProductCard = page.locator('.product-card').first();

    // Verify product card contains name, price, and region
    await expect(firstProductCard.locator('.product-name')).toBeVisible();
    await expect(firstProductCard.locator('.product-price')).toBeVisible();
    await expect(firstProductCard.locator('.product-region')).toBeVisible();
  });

  test('should reset filter when selecting all regions', async () => {
    // First filter by US
    await productsPage.filterByRegion('us');
    await productsPage.waitForProductsToLoad();
    expect(await productsPage.getProductCount()).toBe(2);

    // Reset to all regions
    await productsPage.filterByRegion('');
    await productsPage.waitForProductsToLoad();
    expect(await productsPage.getProductCount()).toBe(6);
  });
});
