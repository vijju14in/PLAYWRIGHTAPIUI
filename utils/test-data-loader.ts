import * as fs from 'fs';
import * as path from 'path';
import { getRegion } from '../config/environment.config';

/**
 * Test Data Loader Utility
 * Loads JSON test data based on app, region, and file name
 */
export class TestDataLoader {
  /**
   * Load test data for specific app and file
   * @param app - App name (app1-ui, app2-api, app3-combined)
   * @param fileName - JSON file name (e.g., 'login.json')
   * @param region - Optional region override (defaults to env REGION)
   * @returns Parsed JSON data
   */
  static load<T = any>(app: string, fileName: string, region?: string): T {
    const targetRegion = region || getRegion();
    const filePath = path.resolve(
      process.cwd(),
      'test-data',
      app,
      targetRegion,
      fileName
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Test data file not found: ${filePath}\nApp: ${app}, Region: ${targetRegion}, File: ${fileName}`
      );
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent) as T;
  }

  /**
   * Load test data for all regions
   * @param app - App name
   * @param fileName - JSON file name
   * @returns Object with data for each region
   */
  static loadAllRegions<T = any>(
    app: string,
    fileName: string
  ): { us: T; eu: T; asia: T } {
    return {
      us: this.load<T>(app, fileName, 'us'),
      eu: this.load<T>(app, fileName, 'eu'),
      asia: this.load<T>(app, fileName, 'asia')
    };
  }

  /**
   * Validate that test data file exists
   * @param app - App name
   * @param fileName - JSON file name
   * @param region - Optional region
   * @returns True if file exists
   */
  static exists(app: string, fileName: string, region?: string): boolean {
    const targetRegion = region || getRegion();
    const filePath = path.resolve(
      process.cwd(),
      'test-data',
      app,
      targetRegion,
      fileName
    );
    return fs.existsSync(filePath);
  }
}
