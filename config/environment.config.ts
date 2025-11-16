import * as dotenv from 'dotenv';
import * as path from 'path';

export type Environment = 'dev' | 'staging' | 'prod';
export type Region = 'us' | 'eu' | 'asia';

export interface EnvironmentConfig {
  env: Environment;
  baseUrl: string;
  apiBaseUrl: string;
  defaultRegion: Region;
  timeout: number;
  headless: boolean;
}

/**
 * Load environment configuration based on ENV variable
 * Priority: ENV variable > default (dev)
 */
export function loadEnvironmentConfig(): EnvironmentConfig {
  const env = (process.env.ENV || 'dev') as Environment;
  const envFile = `.env.${env}`;
  const envPath = path.resolve(process.cwd(), envFile);

  // Load environment-specific config
  dotenv.config({ path: envPath });

  return {
    env: env,
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
    defaultRegion: (process.env.DEFAULT_REGION || 'us') as Region,
    timeout: parseInt(process.env.TIMEOUT || '30000'),
    headless: process.env.HEADLESS === 'true'
  };
}

/**
 * Get region from environment variable or use default
 */
export function getRegion(): Region {
  return (process.env.REGION || process.env.DEFAULT_REGION || 'us') as Region;
}

/**
 * Get test data path for current region
 */
export function getTestDataPath(app: string, fileName: string): string {
  const region = getRegion();
  return path.resolve(process.cwd(), 'test-data', app, region, fileName);
}

// Export singleton instance
export const envConfig = loadEnvironmentConfig();
