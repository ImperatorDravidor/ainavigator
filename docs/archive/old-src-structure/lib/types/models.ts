/**
 * Enterprise Type Definitions
 * Comprehensive type safety with strict interfaces
 */

// Base types
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
  version: number
}

export interface BaseResponse<T> {
  success: boolean
  data?: T
  error?: ErrorResponse
  metadata?: ResponseMetadata
}

export interface ErrorResponse {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
}

export interface ResponseMetadata {
  requestId: string
  timestamp: Date
  version: string
  pagination?: PaginationMetadata
}

export interface PaginationMetadata {
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
}

// Domain Models
export interface Organization extends BaseEntity {
  name: string
  industry: Industry
  size: OrganizationSize
  region: string
  metadata: OrganizationMetadata
}

export interface OrganizationMetadata {
  employeeCount: number
  annualRevenue?: number
  foundedYear?: number
  tags: string[]
}

export enum Industry {
  TECHNOLOGY = 'TECHNOLOGY',
  FINANCIAL_SERVICES = 'FINANCIAL_SERVICES',
  HEALTHCARE = 'HEALTHCARE',
  MANUFACTURING = 'MANUFACTURING',
  RETAIL = 'RETAIL',
  EDUCATION = 'EDUCATION',
  GOVERNMENT = 'GOVERNMENT',
  OTHER = 'OTHER'
}

export enum OrganizationSize {
  STARTUP = 'STARTUP',
  SMB = 'SMB',
  MID_MARKET = 'MID_MARKET',
  ENTERPRISE = 'ENTERPRISE'
}

// Sentiment Analysis Types
export interface SentimentResponse extends BaseEntity {
  organizationId: string
  respondentId: string
  sentimentAreas: SentimentArea[]
  overallSentiment: SentimentLevel
  metadata: SentimentMetadata
}

export interface SentimentArea {
  areaId: string
  areaName: string
  sentimentLevel: SentimentLevel
  reason?: string
  confidence: number
}

export enum SentimentLevel {
  VERY_NEGATIVE = 1,
  NEGATIVE = 2,
  NEUTRAL = 3,
  POSITIVE = 4,
  VERY_POSITIVE = 5
}

export interface SentimentMetadata {
  department?: string
  region?: string
  ageGroup?: string
  tenure?: string
  role?: string
  businessUnit?: string
  completionTime: number
}

// Capability Assessment Types
export interface CapabilityResponse extends BaseEntity {
  organizationId: string
  respondentId: string
  dimensions: CapabilityDimension[]
  overallMaturity: number
  metadata: CapabilityMetadata
}

export interface CapabilityDimension {
  dimensionId: string
  dimensionName: string
  constructs: CapabilityConstruct[]
  averageScore: number
  benchmarkScore: number
}

export interface CapabilityConstruct {
  constructId: string
  constructName: string
  score: number
  evidence?: string
  gaps?: string[]
}

export interface CapabilityMetadata {
  assessmentType: AssessmentType
  completionTime: number
  validatedBy?: string
  certificationLevel?: string
}

export enum AssessmentType {
  SELF = 'SELF',
  PEER = 'PEER',
  MANAGER = 'MANAGER',
  EXTERNAL = 'EXTERNAL'
}

// Filter and Query Types
export interface FilterState {
  regions: string[]
  departments: string[]
  ageGroups: string[]
  businessUnits: string[]
  dateRange: DateRange
  customFilters: CustomFilter[]
}

export interface DateRange {
  start: Date
  end: Date
}

export interface CustomFilter {
  field: string
  operator: FilterOperator
  value: any
}

export enum FilterOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  CONTAINS = 'CONTAINS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  IN = 'IN',
  NOT_IN = 'NOT_IN'
}

// Analytics Types
export interface HeatmapData {
  zones: HeatmapZone[]
  summary: HeatmapSummary
}

export interface HeatmapZone {
  id: string
  name: string
  value: number
  color: string
  respondents: number
  trend: TrendDirection
}

export interface HeatmapSummary {
  averageScore: number
  totalRespondents: number
  strongZones: string[]
  weakZones: string[]
  recommendations: Recommendation[]
}

export interface Recommendation {
  id: string
  priority: Priority
  title: string
  description: string
  impact: ImpactLevel
  effort: EffortLevel
  estimatedROI?: number
  relatedZones: string[]
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ImpactLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  TRANSFORMATIONAL = 'TRANSFORMATIONAL'
}

export enum EffortLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH'
}

export enum TrendDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE'
}

// Session and Authentication Types
export interface Session extends BaseEntity {
  userId: string
  organizationId: string
  token: string
  refreshToken: string
  expiresAt: Date
  permissions: Permission[]
}

export interface Permission {
  resource: string
  actions: string[]
}

export interface User extends BaseEntity {
  email: string
  name: string
  role: UserRole
  organizationId: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: NotificationPreferences
  dashboard: DashboardPreferences
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  frequency: 'immediate' | 'daily' | 'weekly'
}

export interface DashboardPreferences {
  defaultView: string
  widgets: string[]
  refreshInterval: number
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER'
}

// File Upload Types
export interface FileUpload extends BaseEntity {
  filename: string
  mimetype: string
  size: number
  status: UploadStatus
  processingResult?: ProcessingResult
}

export enum UploadStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface ProcessingResult {
  recordsProcessed: number
  recordsFailed: number
  errors: ProcessingError[]
  warnings: string[]
}

export interface ProcessingError {
  row: number
  column: string
  error: string
}


