import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Home Page Object Model
 * Represents the home page and its interactions
 */
export class HomePage extends BasePage {
  // Locators
  readonly appTitle: Locator;
  readonly regionSelect: Locator;
  readonly currentRegion: Locator;
  readonly navHome: Locator;
  readonly navLogin: Locator;
  readonly navProducts: Locator;
  readonly navUsers: Locator;

  constructor(page: Page) {
    super(page);
    this.appTitle = page.locator('#app-title');
    this.regionSelect = page.locator('#region-select');
    this.currentRegion = page.locator('#current-region');
    this.navHome = page.locator('#nav-home');
    this.navLogin = page.locator('#nav-login');
    this.navProducts = page.locator('#nav-products');
    this.navUsers = page.locator('#nav-users');
  }

  /**
   * Navigate to home page
   */
  async navigate() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Select region
   */
  async selectRegion(region: string) {
    await this.regionSelect.selectOption(region);
    await this.wait(500); // Wait for JS to update
  }

  /**
   * Get current selected region
   */
  async getCurrentRegion(): Promise<string> {
    return await this.currentRegion.textContent() || '';
  }

  /**
   * Verify page title
   */
  async verifyPageTitle(expectedTitle: string) {
    await expect(this.appTitle).toHaveText(expectedTitle);
  }

  /**
   * Navigate to login
   */
  async goToLogin() {
    await this.navLogin.click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to products
   */
  async goToProducts() {
    await this.navProducts.click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to users
   */
  async goToUsers() {
    await this.navUsers.click();
    await this.waitForPageLoad();
  }

  /**
   * Verify navigation links are visible
   */
  async verifyNavigationVisible() {
    await expect(this.navHome).toBeVisible();
    await expect(this.navLogin).toBeVisible();
    await expect(this.navProducts).toBeVisible();
    await expect(this.navUsers).toBeVisible();
  }
}
