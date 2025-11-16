import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/pages/home.page';

/**
 * App1 - UI Tests Only
 * Home page functionality tests
 */
test.describe('App1 - Home Page UI Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
  });

  test('should display home page correctly', async () => {
    // Verify page title
    await homePage.verifyPageTitle('Welcome to E-Commerce App');

    // Verify navigation is visible
    await homePage.verifyNavigationVisible();
  });

  test('should change region selection', async () => {
    // Select US region
    await homePage.selectRegion('us');
    let currentRegion = await homePage.getCurrentRegion();
    expect(currentRegion).toBe('US');

    // Select EU region
    await homePage.selectRegion('eu');
    currentRegion = await homePage.getCurrentRegion();
    expect(currentRegion).toBe('EU');

    // Select Asia region
    await homePage.selectRegion('asia');
    currentRegion = await homePage.getCurrentRegion();
    expect(currentRegion).toBe('ASIA');
  });

  test('should navigate to login page', async ({ page }) => {
    await homePage.goToLogin();
    await expect(page).toHaveURL(/.*login/);
  });

  test('should navigate to products page', async ({ page }) => {
    await homePage.goToProducts();
    await expect(page).toHaveURL(/.*products/);
  });

  test('should navigate to users page', async ({ page }) => {
    await homePage.goToUsers();
    await expect(page).toHaveURL(/.*users/);
  });

  test('should have correct meta viewport', async ({ page }) => {
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
  });

  test('should load all navigation links', async () => {
    const homeLink = homePage.navHome;
    const loginLink = homePage.navLogin;
    const productsLink = homePage.navProducts;
    const usersLink = homePage.navUsers;

    await expect(homeLink).toBeVisible();
    await expect(loginLink).toBeVisible();
    await expect(productsLink).toBeVisible();
    await expect(usersLink).toBeVisible();
  });

  test('should persist region selection in localStorage', async ({ page }) => {
    await homePage.selectRegion('eu');

    // Check localStorage
    const storedRegion = await page.evaluate(() => localStorage.getItem('selectedRegion'));
    expect(storedRegion).toBe('eu');
  });
});
