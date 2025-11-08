/**
 * Enterprise Validation Schemas
 * Comprehensive input validation using Zod
 */

import { z } from 'zod'
import {
  Industry,
  OrganizationSize,
  SentimentLevel,
  AssessmentType,
  FilterOperator,
  Priority,
  ImpactLevel,
  EffortLevel,
  UserRole,
  UploadStatus
} from '@/lib/types/models'

// File validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, {
      message: 'File size must be less than 10MB'
    })
    .refine(file => ['text/csv', 'application/vnd.ms-excel'].includes(file.type), {
      message: 'File must be a CSV'
    }),
  type: z.enum(['sentiment', 'capability']).optional()
})

// CSV data validation
export const sentimentCsvRowSchema = z.object({
  responseId: z.string().min(1, 'Response ID is required'),
  sentimentLevel: z.coerce.number()
    .min(1)
    .max(5)
    .transform(val => Math.round(val)),
  sentimentReason: z.string().optional(),
  region: z.string().min(1),
  department: z.string().min(1),
  ageGroup: z.string().optional(),
  businessUnit: z.string().optional(),
  tenure: z.string().optional(),
  role: z.string().optional()
})

export const capabilityCsvRowSchema = z.object({
  responseId: z.string().min(1, 'Response ID is required'),
  strategyVision_C1: z.coerce.number().min(1).max(5),
  strategyVision_C2: z.coerce.number().min(1).max(5),
  strategyVision_C3: z.coerce.number().min(1).max(5),
  strategyVision_C4: z.coerce.number().min(1).max(5),
  data_C1: z.coerce.number().min(1).max(5),
  data_C2: z.coerce.number().min(1).max(5),
  data_C3: z.coerce.number().min(1).max(5),
  data_C4: z.coerce.number().min(1).max(5),
  technology_C1: z.coerce.number().min(1).max(5),
  technology_C2: z.coerce.number().min(1).max(5),
  technology_C3: z.coerce.number().min(1).max(5),
  technology_C4: z.coerce.number().min(1).max(5),
  people_C1: z.coerce.number().min(1).max(5),
  people_C2: z.coerce.number().min(1).max(5),
  people_C3: z.coerce.number().min(1).max(5),
  people_C4: z.coerce.number().min(1).max(5),
  process_C1: z.coerce.number().min(1).max(5),
  process_C2: z.coerce.number().min(1).max(5),
  process_C3: z.coerce.number().min(1).max(5),
  process_C4: z.coerce.number().min(1).max(5),
  culture_C1: z.coerce.number().min(1).max(5),
  culture_C2: z.coerce.number().min(1).max(5),
  culture_C3: z.coerce.number().min(1).max(5),
  culture_C4: z.coerce.number().min(1).max(5),
  governance_C1: z.coerce.number().min(1).max(5),
  governance_C2: z.coerce.number().min(1).max(5),
  governance_C3: z.coerce.number().min(1).max(5),
  governance_C4: z.coerce.number().min(1).max(5),
  innovation_C1: z.coerce.number().min(1).max(5),
  innovation_C2: z.coerce.number().min(1).max(5),
  innovation_C3: z.coerce.number().min(1).max(5),
  innovation_C4: z.coerce.number().min(1).max(5),
  openFeedback: z.string().optional()
})

// Organization validation
export const organizationSchema = z.object({
  name: z.string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&.]+$/, 'Organization name contains invalid characters'),
  industry: z.nativeEnum(Industry),
  size: z.nativeEnum(OrganizationSize),
  region: z.string().min(1, 'Region is required'),
  metadata: z.object({
    employeeCount: z.number().min(1).max(1000000),
    annualRevenue: z.number().optional(),
    foundedYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
    tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed')
  })
})

// User validation
export const userRegistrationSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .transform(val => val.trim()),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  role: z.nativeEnum(UserRole),
  organizationId: z.string().uuid('Invalid organization ID')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
})

// Filter validation
export const filterSchema = z.object({
  regions: z.array(z.string()).default([]),
  departments: z.array(z.string()).default([]),
  ageGroups: z.array(z.string()).default([]),
  businessUnits: z.array(z.string()).default([]),
  dateRange: z.object({
    start: z.date(),
    end: z.date()
  }).refine(data => data.start <= data.end, {
    message: 'Start date must be before end date'
  }),
  customFilters: z.array(z.object({
    field: z.string().min(1),
    operator: z.nativeEnum(FilterOperator),
    value: z.any()
  })).default([])
})

// Recommendation validation
export const recommendationSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  priority: z.nativeEnum(Priority),
  impact: z.nativeEnum(ImpactLevel),
  effort: z.nativeEnum(EffortLevel),
  estimatedROI: z.number().min(0).optional(),
  relatedZones: z.array(z.string()).min(1, 'At least one related zone is required')
})

// API request validation
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
})

export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  filters: filterSchema.optional(),
  pagination: paginationSchema.optional()
})

// Environment variable validation
export const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('AI Navigator'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),
  NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']).default('development'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3000/api'),
  NEXT_PUBLIC_API_TIMEOUT: z.coerce.number().default(30000),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  NEXT_PUBLIC_ENABLE_ERROR_REPORTING: z.coerce.boolean().default(false),
  NEXT_PUBLIC_MAX_FILE_SIZE: z.coerce.number().default(10485760),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  SESSION_SECRET: z.string().optional()
})

// Utility function for safe parsing with error handling
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options?: {
    onError?: (errors: z.ZodError) => void
    throwOnError?: boolean
  }
): T | null {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      options?.onError?.(error)
      if (options?.throwOnError) {
        throw error
      }
      return null
    }
    throw error
  }
}

// Type exports
export type FileUploadInput = z.infer<typeof fileUploadSchema>
export type SentimentCsvRow = z.infer<typeof sentimentCsvRowSchema>
export type CapabilityCsvRow = z.infer<typeof capabilityCsvRowSchema>
export type OrganizationInput = z.infer<typeof organizationSchema>
export type UserRegistration = z.infer<typeof userRegistrationSchema>
export type UserLogin = z.infer<typeof userLoginSchema>
export type FilterInput = z.infer<typeof filterSchema>
export type RecommendationInput = z.infer<typeof recommendationSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type SearchInput = z.infer<typeof searchSchema>


