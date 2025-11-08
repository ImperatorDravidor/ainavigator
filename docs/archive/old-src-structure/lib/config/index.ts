/**
 * Enterprise Configuration Management
 * Centralized configuration with validation and type safety
 */

import { z } from 'zod'

const configSchema = z.object({
  app: z.object({
    name: z.string().default('AI Navigator'),
    version: z.string().default('1.0.0'),
    environment: z.enum(['development', 'staging', 'production']).default('development'),
  }),
  api: z.object({
    url: z.string().url().default('http://localhost:3000/api'),
    timeout: z.number().default(30000),
  }),
  features: z.object({
    analytics: z.boolean().default(false),
    errorReporting: z.boolean().default(false),
    performanceMonitoring: z.boolean().default(false),
  }),
  security: z.object({
    csrfTokenHeader: z.string().default('X-CSRF-Token'),
    maxFileSize: z.number().default(10 * 1024 * 1024), // 10MB
  }),
  rateLimit: z.object({
    windowMs: z.number().default(15 * 60 * 1000), // 15 minutes
    maxRequests: z.number().default(100),
  }),
})

export type Config = z.infer<typeof configSchema>

class ConfigurationManager {
  private static instance: ConfigurationManager
  private config: Config

  private constructor() {
    this.config = this.loadConfig()
  }

  static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager()
    }
    return ConfigurationManager.instance
  }

  private loadConfig(): Config {
    const rawConfig = {
      app: {
        name: process.env.NEXT_PUBLIC_APP_NAME,
        version: process.env.NEXT_PUBLIC_APP_VERSION,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
      },
      api: {
        url: process.env.NEXT_PUBLIC_API_URL,
        timeout: process.env.NEXT_PUBLIC_API_TIMEOUT ? Number(process.env.NEXT_PUBLIC_API_TIMEOUT) : undefined,
      },
      features: {
        analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
        errorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
        performanceMonitoring: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true',
      },
      security: {
        csrfTokenHeader: process.env.NEXT_PUBLIC_CSRF_TOKEN_HEADER,
        maxFileSize: process.env.NEXT_PUBLIC_MAX_FILE_SIZE ? Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) : undefined,
      },
      rateLimit: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS ? Number(process.env.RATE_LIMIT_WINDOW_MS) : undefined,
        maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS ? Number(process.env.RATE_LIMIT_MAX_REQUESTS) : undefined,
      },
    }

    return configSchema.parse(rawConfig)
  }

  getConfig(): Config {
    return this.config
  }

  get<K extends keyof Config>(key: K): Config[K] {
    return this.config[key]
  }

  isProduction(): boolean {
    return this.config.app.environment === 'production'
  }

  isDevelopment(): boolean {
    return this.config.app.environment === 'development'
  }
}

export const config = ConfigurationManager.getInstance()
export default config.getConfig()
