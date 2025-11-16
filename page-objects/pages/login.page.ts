import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Login Page Object Model
 * Represents the login page and its interactions
 */
export class LoginPage extends BasePage {
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly messageDiv: Locator;
  readonly loginTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-btn');
    this.messageDiv = page.locator('#message');
    this.loginTitle = page.locator('#login-title');
  }

  /**
   * Navigate to login page
   */
  async navigate() {
    await this.goto('/login');
    await this.waitForPageLoad();
  }

  /**
   * Perform login
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Get message text
   */
  async getMessageText(): Promise<string> {
    await this.messageDiv.waitFor({ state: 'visible', timeout: 5000 });
    return await this.messageDiv.textContent() || '';
  }

  /**
   * Verify login success
   */
  async verifyLoginSuccess(expectedMessage: string) {
    const message = await this.getMessageText();
    expect(message).toContain(expectedMessage);
  }

  /**
   * Verify login failure
   */
  async verifyLoginFailure(expectedMessage: string) {
    const message = await this.getMessageText();
    expect(message).toContain(expectedMessage);
  }

  /**
   * Check if login page is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.loginTitle.isVisible();
  }

  /**
   * Get page title text
   */
  async getPageTitle(): Promise<string> {
    return await this.loginTitle.textContent() || '';
  }
}
