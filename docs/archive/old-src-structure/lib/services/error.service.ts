/**
 * Enterprise Error Management Service
 * Centralized error handling with categorization and recovery strategies
 */

import { logger } from './logger.service'

export enum ErrorCategory {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  SYSTEM = 'SYSTEM',
  UNKNOWN = 'UNKNOWN'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ErrorMetadata {
  category: ErrorCategory
  severity: ErrorSeverity
  code: string
  timestamp: Date
  context?: Record<string, any>
  stack?: string
  recoverable: boolean
}

export class ApplicationError extends Error {
  public metadata: ErrorMetadata

  constructor(
    message: string,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    code?: string,
    context?: Record<string, any>
  ) {
    super(message)
    this.name = 'ApplicationError'
    
    this.metadata = {
      category,
      severity,
      code: code || this.generateErrorCode(category),
      timestamp: new Date(),
      context,
      stack: this.stack,
      recoverable: this.isRecoverable(category, severity)
    }

    // Log the error
    this.logError()
  }

  private generateErrorCode(category: ErrorCategory): string {
    const timestamp = Date.now().toString(36)
    return `${category}_${timestamp}`.toUpperCase()
  }

  private isRecoverable(category: ErrorCategory, severity: ErrorSeverity): boolean {
    if (severity === ErrorSeverity.CRITICAL) return false
    
    const recoverableCategories = [
      ErrorCategory.NETWORK,
      ErrorCategory.VALIDATION,
      ErrorCategory.AUTHENTICATION
    ]
    
    return recoverableCategories.includes(category)
  }

  private logError() {
    const logLevel = this.getLogLevel()
    logger[logLevel](this.message, {
      ...this.metadata.context,
      errorCode: this.metadata.code,
      category: this.metadata.category,
      severity: this.metadata.severity
    })
  }

  private getLogLevel(): 'warn' | 'error' | 'fatal' {
    switch (this.metadata.severity) {
      case ErrorSeverity.LOW:
      case ErrorSeverity.MEDIUM:
        return 'warn'
      case ErrorSeverity.HIGH:
        return 'error'
      case ErrorSeverity.CRITICAL:
        return 'fatal'
      default:
        return 'error'
    }
  }

  toJSON() {
    return {
      message: this.message,
      ...this.metadata
    }
  }
}

export class NetworkError extends ApplicationError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCategory.NETWORK, ErrorSeverity.MEDIUM, undefined, context)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCategory.VALIDATION, ErrorSeverity.LOW, undefined, context)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCategory.AUTHENTICATION, ErrorSeverity.HIGH, undefined, context)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCategory.AUTHORIZATION, ErrorSeverity.HIGH, undefined, context)
    this.name = 'AuthorizationError'
  }
}

export class BusinessLogicError extends ApplicationError {
  constructor(message: string, severity: ErrorSeverity = ErrorSeverity.MEDIUM, context?: Record<string, any>) {
    super(message, ErrorCategory.BUSINESS_LOGIC, severity, undefined, context)
    this.name = 'BusinessLogicError'
  }
}

export class SystemError extends ApplicationError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCategory.SYSTEM, ErrorSeverity.CRITICAL, undefined, context)
    this.name = 'SystemError'
  }
}

class ErrorService {
  private static instance: ErrorService
  private errorHandlers: Map<ErrorCategory, (error: ApplicationError) => void> = new Map()

  private constructor() {
    this.setupDefaultHandlers()
  }

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService()
    }
    return ErrorService.instance
  }

  private setupDefaultHandlers() {
    // Network errors - retry logic
    this.registerHandler(ErrorCategory.NETWORK, (error) => {
      // Implement retry logic
      console.log('Network error detected, implementing retry logic...')
    })

    // Validation errors - show user feedback
    this.registerHandler(ErrorCategory.VALIDATION, (error) => {
      // Show validation feedback to user
      console.log('Validation error:', error.message)
    })

    // Authentication errors - redirect to login
    this.registerHandler(ErrorCategory.AUTHENTICATION, (error) => {
      // Redirect to login page
      console.log('Authentication required')
    })
  }

  registerHandler(category: ErrorCategory, handler: (error: ApplicationError) => void) {
    this.errorHandlers.set(category, handler)
  }

  handleError(error: Error | ApplicationError): void {
    let appError: ApplicationError

    if (error instanceof ApplicationError) {
      appError = error
    } else {
      // Convert regular errors to ApplicationError
      appError = new ApplicationError(
        error.message,
        ErrorCategory.UNKNOWN,
        ErrorSeverity.MEDIUM
      )
    }

    // Execute specific handler if available
    const handler = this.errorHandlers.get(appError.metadata.category)
    if (handler) {
      handler(appError)
    }

    // Execute recovery strategy if recoverable
    if (appError.metadata.recoverable) {
      this.attemptRecovery(appError)
    }
  }

  private attemptRecovery(error: ApplicationError) {
    switch (error.metadata.category) {
      case ErrorCategory.NETWORK:
        // Implement network recovery (retry, offline mode, etc.)
        break
      case ErrorCategory.VALIDATION:
        // Clear invalid input, show suggestions
        break
      case ErrorCategory.AUTHENTICATION:
        // Refresh token, re-authenticate
        break
      default:
        // Generic recovery
        break
    }
  }

  // Utility method for async error handling
  async handleAsync<T>(
    fn: () => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await fn()
    } catch (error) {
      this.handleError(error as Error)
      return fallback
    }
  }
}

export const errorService = ErrorService.getInstance()
export default errorService


