import { test, expect } from '@playwright/test';
import { UsersPage } from '../../page-objects/pages/users.page';

/**
 * App1 - UI Tests Only
 * Users page functionality tests
 */
test.describe('App1 - Users Page UI Tests', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page);
    await usersPage.navigate();
    await usersPage.waitForUsersToLoad();
  });

  test('should display users page correctly', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Users/);

    // Verify users table is displayed
    const userCount = await usersPage.getUserCount();
    expect(userCount).toBeGreaterThan(0);
  });

  test('should display all users by default', async () => {
    // Should show users from all regions
    const userCount = await usersPage.getUserCount();
    expect(userCount).toBe(3); // 1 user per region * 3 regions
  });

  test('should filter users by US region', async () => {
    await usersPage.filterByRegion('us');
    await usersPage.waitForUsersToLoad();

    const userCount = await usersPage.getUserCount();
    expect(userCount).toBe(1);

    // Verify user is from US region
    await usersPage.verifyUserDisplayed('john_us');
  });

  test('should filter users by EU region', async () => {
    await usersPage.filterByRegion('eu');
    await usersPage.waitForUsersToLoad();

    const userCount = await usersPage.getUserCount();
    expect(userCount).toBe(1);

    // Verify user is from EU region
    await usersPage.verifyUserDisplayed('jane_eu');
  });

  test('should filter users by Asia region', async () => {
    await usersPage.filterByRegion('asia');
    await usersPage.waitForUsersToLoad();

    const userCount = await usersPage.getUserCount();
    expect(userCount).toBe(1);

    // Verify user is from Asia region
    await usersPage.verifyUserDisplayed('bob_asia');
  });

  test('should display user count', async () => {
    const countText = await usersPage.getUserCountText();
    expect(countText).toContain('Showing');
    expect(countText).toContain('user');
  });

  test('should display users in table format', async ({ page }) => {
    // Verify table headers
    await expect(page.locator('th:has-text("ID")')).toBeVisible();
    await expect(page.locator('th:has-text("Username")')).toBeVisible();
    await expect(page.locator('th:has-text("Email")')).toBeVisible();
    await expect(page.locator('th:has-text("Region")')).toBeVisible();
  });

  test('should reset filter when selecting all regions', async () => {
    // First filter by US
    await usersPage.filterByRegion('us');
    await usersPage.waitForUsersToLoad();
    expect(await usersPage.getUserCount()).toBe(1);

    // Reset to all regions
    await usersPage.filterByRegion('');
    await usersPage.waitForUsersToLoad();
    expect(await usersPage.getUserCount()).toBe(3);
  });

  test('should display all user information correctly', async ({ page }) => {
    const firstUserRow = page.locator('tbody tr').first();

    // Verify all columns are present
    expect(await firstUserRow.locator('td').count()).toBe(4); // ID, Username, Email, Region
  });
});
