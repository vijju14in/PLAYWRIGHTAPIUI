import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object
 * All page objects should extend this class
 * Provides common methods and utilities
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   */
  async goto(url: string) {
    await this.page.goto(url);
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get element by test ID
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Get element by role
   */
  getByRole(role: any, options?: any): Locator {
    return this.page.getByRole(role, options);
  }

  /**
   * Get element by text
   */
  getByText(text: string | RegExp): Locator {
    return this.page.getByText(text);
  }

  /**
   * Get element by placeholder
   */
  getByPlaceholder(text: string): Locator {
    return this.page.getByPlaceholder(text);
  }

  /**
   * Get element by label
   */
  getByLabel(text: string): Locator {
    return this.page.getByLabel(text);
  }

  /**
   * Click element
   */
  async click(selector: string | Locator) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.click();
  }

  /**
   * Fill input field
   */
  async fill(selector: string | Locator, value: string) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.fill(value);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout: number = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Take screenshot
   */
  async screenshot(path: string) {
    await this.page.screenshot({ path, fullPage: true });
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Verify page title
   */
  async verifyTitle(expectedTitle: string) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Verify URL contains text
   */
  async verifyUrlContains(text: string) {
    expect(this.page.url()).toContain(text);
  }

  /**
   * Wait for timeout
   */
  async wait(ms: number) {
    await this.page.waitForTimeout(ms);
  }
}
