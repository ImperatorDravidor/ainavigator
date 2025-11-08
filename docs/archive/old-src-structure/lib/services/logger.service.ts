/**
 * Enterprise Logging Service
 * Structured logging with multiple transports and log levels
 */

import { config } from '@/lib/config'

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export interface LogContext {
  userId?: string
  sessionId?: string
  requestId?: string
  [key: string]: any
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: Error
  stack?: string
}

class LoggerService {
  private static instance: LoggerService
  private logBuffer: LogEntry[] = []
  private readonly MAX_BUFFER_SIZE = 100

  private constructor() {
    this.setupErrorHandlers()
    this.flushBufferPeriodically()
  }

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService()
    }
    return LoggerService.instance
  }

  private setupErrorHandlers() {
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        this.error('Unhandled Promise Rejection', {
          reason: event.reason,
          promise: event.promise
        })
      })

      window.addEventListener('error', (event) => {
        this.error('Global Error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        })
      })
    }
  }

  private flushBufferPeriodically() {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.flushBuffer()
      }, 30000) // Flush every 30 seconds
    }
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      stack: error?.stack
    }
  }

  private log(entry: LogEntry) {
    // Console output in development
    if (config.isDevelopment()) {
      const style = this.getConsoleStyle(entry.level)
      console.log(
        `%c[${entry.level.toUpperCase()}]%c ${entry.timestamp} - ${entry.message}`,
        style,
        'color: inherit',
        entry.context || '',
        entry.error || ''
      )
    }

    // Add to buffer for batch sending
    this.logBuffer.push(entry)

    // Flush if buffer is full
    if (this.logBuffer.length >= this.MAX_BUFFER_SIZE) {
      this.flushBuffer()
    }

    // Send to external service if configured
    // TODO: Implement external error reporting
    // if (config.features?.errorReporting) {
    //   this.sendToExternalService(entry)
    // }
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles = {
      [LogLevel.DEBUG]: 'color: #6b7280',
      [LogLevel.INFO]: 'color: #3b82f6',
      [LogLevel.WARN]: 'color: #f59e0b',
      [LogLevel.ERROR]: 'color: #ef4444',
      [LogLevel.FATAL]: 'color: #dc2626; font-weight: bold'
    }
    return styles[level]
  }

  private async sendToExternalService(entry: LogEntry) {
    // Integration with Sentry, LogRocket, or custom logging endpoint
    try {
      if (entry.level === LogLevel.ERROR || entry.level === LogLevel.FATAL) {
        // Send to error tracking service
        // await sentryClient.captureException(entry.error)
      }
    } catch (error) {
      console.error('Failed to send log to external service:', error)
    }
  }

  private async flushBuffer() {
    if (this.logBuffer.length === 0) return

    const entries = [...this.logBuffer]
    this.logBuffer = []

    try {
      // Send batch to logging endpoint
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries })
      })
    } catch (error) {
      console.error('Failed to flush log buffer:', error)
      // Re-add entries to buffer if send failed
      this.logBuffer.unshift(...entries)
    }
  }

  debug(message: string, context?: LogContext) {
    this.log(this.createLogEntry(LogLevel.DEBUG, message, context))
  }

  info(message: string, context?: LogContext) {
    this.log(this.createLogEntry(LogLevel.INFO, message, context))
  }

  warn(message: string, context?: LogContext) {
    this.log(this.createLogEntry(LogLevel.WARN, message, context))
  }

  error(message: string, contextOrError?: LogContext | Error, error?: Error) {
    if (contextOrError instanceof Error) {
      this.log(this.createLogEntry(LogLevel.ERROR, message, undefined, contextOrError))
    } else {
      this.log(this.createLogEntry(LogLevel.ERROR, message, contextOrError, error))
    }
  }

  fatal(message: string, context?: LogContext, error?: Error) {
    this.log(this.createLogEntry(LogLevel.FATAL, message, context, error))
  }

  // Performance logging
  measurePerformance(name: string, fn: () => Promise<any>) {
    return async () => {
      const start = performance.now()
      try {
        const result = await fn()
        const duration = performance.now() - start
        this.info(`Performance: ${name}`, { duration, status: 'success' })
        return result
      } catch (error) {
        const duration = performance.now() - start
        this.error(`Performance: ${name}`, { duration, status: 'error' }, error as Error)
        throw error
      }
    }
  }
}

export const logger = LoggerService.getInstance()
export default logger
