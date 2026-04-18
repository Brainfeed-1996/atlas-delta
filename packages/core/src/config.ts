import { logger } from './logger.js';

export interface Config {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  corsOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  logLevel: string;
  dbPath: string;
}

export const defaultConfig: Config = {
  port: parseInt(process.env.PORT || '8200', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  corsOrigins: (process.env.CORS_ORIGINS || '*').split(','),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  dbPath: process.env.DB_PATH || './data/atlas-delta.db'
};

let currentConfig: Config = { ...defaultConfig };

export function getConfig(): Config {
  return currentConfig;
}

export function setConfig(config: Partial<Config>): void {
  currentConfig = { ...currentConfig, ...config };
  logger.info('Configuration updated', { config: currentConfig });
}

export function validateConfig(config: Config): string[] {
  const errors: string[] = [];

  if (config.port < 1 || config.port > 65535) {
    errors.push('PORT must be between 1 and 65535');
  }

  if (!['development', 'test', 'production'].includes(config.nodeEnv)) {
    errors.push('NODE_ENV must be development, test, or production');
  }

  if (config.rateLimitWindowMs < 1000) {
    errors.push('RATE_LIMIT_WINDOW_MS must be at least 1000');
  }

  if (config.rateLimitMaxRequests < 1) {
    errors.push('RATE_LIMIT_MAX_REQUESTS must be at least 1');
  }

  return errors;
}

export function initConfig(overrides?: Partial<Config>): Config {
  const config = { ...defaultConfig, ...overrides };
  const errors = validateConfig(config);

  if (errors.length > 0) {
    throw new Error(`Invalid configuration: ${errors.join(', ')}`);
  }

  setConfig(config);
  return config;
}