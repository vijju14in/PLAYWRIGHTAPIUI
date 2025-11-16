import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Users Page Object Model
 * Represents the users page and its interactions
 */
export class UsersPage extends BasePage {
  // Locators
  readonly usersTitle: Locator;
  readonly regionFilter: Locator;
  readonly usersContainer: Locator;
  readonly userCount: Locator;

  constructor(page: Page) {
    super(page);
    this.usersTitle = page.locator('#users-title');
    this.regionFilter = page.locator('#region-filter');
    this.usersContainer = page.locator('#users-container');
    this.userCount = page.locator('#user-count');
  }

  /**
   * Navigate to users page
   */
  async navigate() {
    await this.goto('/users');
    await this.waitForPageLoad();
  }

  /**
   * Filter users by region
   */
  async filterByRegion(region: string) {
    await this.regionFilter.selectOption(region);
    await this.wait(1000); // Wait for users to load
  }

  /**
   * Get user rows
   */
  getUserRows() {
    return this.page.locator('tbody tr');
  }

  /**
   * Get user by username
   */
  getUserByUsername(username: string) {
    return this.page.locator(`tbody tr:has-text("${username}")`);
  }

  /**
   * Get user count
   */
  async getUserCount(): Promise<number> {
    const rows = this.getUserRows();
    return await rows.count();
  }

  /**
   * Get user count text
   */
  async getUserCountText(): Promise<string> {
    return await this.userCount.textContent() || '';
  }

  /**
   * Verify user is displayed
   */
  async verifyUserDisplayed(username: string) {
    const user = this.getUserByUsername(username);
    await expect(user).toBeVisible();
  }

  /**
   * Verify users count
   */
  async verifyUsersCount(expectedCount: number) {
    const count = await this.getUserCount();
    expect(count).toBe(expectedCount);
  }

  /**
   * Get all usernames
   */
  async getAllUsernames(): Promise<string[]> {
    const usernames = await this.page.locator('tbody tr td:nth-child(2)').allTextContents();
    return usernames;
  }

  /**
   * Wait for users to load
   */
  async waitForUsersToLoad() {
    await this.page.waitForSelector('tbody tr', { state: 'visible', timeout: 10000 });
  }
}
