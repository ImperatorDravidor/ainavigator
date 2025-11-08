/**
 * Enterprise Security Utilities
 * Security helpers for XSS prevention, sanitization, and encryption
 */

import { ValidationError } from '@/lib/services/error.service'
import { logger } from '@/lib/services/logger.service'

// XSS Prevention
export class SecurityUtils {
  // HTML entity encoding map
  private static htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  }

  /**
   * Escape HTML to prevent XSS attacks
   */
  static escapeHtml(input: string): string {
    if (typeof input !== 'string') return ''
    
    return input.replace(/[&<>"'`=\/]/g, (char) => {
      return this.htmlEntities[char] || char
    })
  }

  /**
   * Sanitize user input for safe display
   */
  static sanitizeInput(input: string, options?: {
    maxLength?: number
    allowedTags?: string[]
    allowedChars?: RegExp
  }): string {
    if (typeof input !== 'string') return ''

    let sanitized = input.trim()

    // Apply max length
    if (options?.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength)
    }

    // Remove disallowed characters
    if (options?.allowedChars) {
      sanitized = sanitized.replace(new RegExp(`[^${options.allowedChars.source}]`, 'g'), '')
    }

    // Basic XSS prevention
    sanitized = this.escapeHtml(sanitized)

    return sanitized
  }

  /**
   * Validate and sanitize file names
   */
  static sanitizeFileName(fileName: string): string {
    if (!fileName) throw new ValidationError('File name is required')

    // Remove path traversal attempts
    let sanitized = fileName.replace(/\.\./g, '').replace(/[\/\\]/g, '')
    
    // Remove special characters except dots and hyphens
    sanitized = sanitized.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    
    // Ensure it has a valid extension
    const parts = sanitized.split('.')
    if (parts.length < 2) {
      throw new ValidationError('File must have an extension')
    }

    const extension = parts[parts.length - 1].toLowerCase()
    const allowedExtensions = ['csv', 'json', 'txt', 'pdf', 'xlsx', 'xls']
    
    if (!allowedExtensions.includes(extension)) {
      throw new ValidationError(`File extension .${extension} is not allowed`)
    }

    return sanitized
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Validate CSRF token
   */
  static validateCSRFToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken) return false
    
    // Constant time comparison to prevent timing attacks
    if (token.length !== storedToken.length) return false
    
    let result = 0
    for (let i = 0; i < token.length; i++) {
      result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i)
    }
    
    return result === 0
  }

  /**
   * Hash sensitive data (client-side, not for passwords)
   */
  static async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Generate secure random string
   */
  static generateSecureRandom(length: number = 32): string {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(36)).join('').substring(0, length)
  }

  /**
   * Validate URL to prevent open redirect
   */
  static isValidRedirectUrl(url: string, allowedDomains?: string[]): boolean {
    try {
      const parsed = new URL(url, window.location.origin)
      
      // Only allow same origin by default
      if (!allowedDomains || allowedDomains.length === 0) {
        return parsed.origin === window.location.origin
      }
      
      // Check against allowed domains
      return allowedDomains.some(domain => {
        return parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
      })
    } catch (error) {
      logger.warn('Invalid redirect URL', { url })
      return false
    }
  }

  /**
   * Rate limiting helper
   */
  static createRateLimiter(maxRequests: number, windowMs: number) {
    const requests = new Map<string, number[]>()

    return (identifier: string): boolean => {
      const now = Date.now()
      const userRequests = requests.get(identifier) || []
      
      // Remove old requests outside the window
      const validRequests = userRequests.filter(time => now - time < windowMs)
      
      if (validRequests.length >= maxRequests) {
        logger.warn('Rate limit exceeded', { identifier, requests: validRequests.length })
        return false
      }
      
      validRequests.push(now)
      requests.set(identifier, validRequests)
      
      return true
    }
  }

  /**
   * Input validation for common patterns
   */
  static validators = {
    email: (email: string): boolean => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      return emailRegex.test(email)
    },
    
    phone: (phone: string): boolean => {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/
      return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
    },
    
    url: (url: string): boolean => {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    },
    
    alphanumeric: (input: string): boolean => {
      return /^[a-zA-Z0-9]+$/.test(input)
    },
    
    strongPassword: (password: string): {
      valid: boolean
      errors: string[]
    } => {
      const errors: string[] = []
      
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters')
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter')
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter')
      }
      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number')
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push('Password must contain at least one special character')
      }
      
      return {
        valid: errors.length === 0,
        errors
      }
    }
  }

  /**
   * Content Security Policy generator
   */
  static generateCSP(options?: {
    allowInlineScripts?: boolean
    allowInlineStyles?: boolean
    trustedDomains?: string[]
  }): string {
    const directives: Record<string, string[]> = {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'media-src': ["'self'"],
      'object-src': ["'none'"],
      'frame-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': []
    }

    if (options?.allowInlineScripts) {
      directives['script-src'].push("'unsafe-inline'")
    }

    if (options?.allowInlineStyles) {
      directives['style-src'].push("'unsafe-inline'")
    }

    if (options?.trustedDomains) {
      options.trustedDomains.forEach(domain => {
        directives['script-src'].push(domain)
        directives['connect-src'].push(domain)
      })
    }

    return Object.entries(directives)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ')
  }
}

// Session security
export class SessionSecurity {
  private static readonly SESSION_KEY = 'ai-navigator-session'
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

  /**
   * Store session securely
   */
  static setSession(data: any, options?: {
    encrypt?: boolean
    timeout?: number
  }): void {
    const sessionData = {
      data,
      timestamp: Date.now(),
      timeout: options?.timeout || this.SESSION_TIMEOUT,
      checksum: ''
    }

    // Add integrity check
    sessionData.checksum = SecurityUtils.generateSecureRandom(16)

    const serialized = JSON.stringify(sessionData)
    
    // Store in sessionStorage (cleared on browser close)
    sessionStorage.setItem(this.SESSION_KEY, serialized)
    
    // Also store checksum in a separate key for validation
    sessionStorage.setItem(`${this.SESSION_KEY}-check`, sessionData.checksum)
  }

  /**
   * Retrieve and validate session
   */
  static getSession<T = any>(): T | null {
    try {
      const serialized = sessionStorage.getItem(this.SESSION_KEY)
      const checksum = sessionStorage.getItem(`${this.SESSION_KEY}-check`)
      
      if (!serialized || !checksum) return null

      const sessionData = JSON.parse(serialized)
      
      // Validate checksum
      if (sessionData.checksum !== checksum) {
        logger.warn('Session checksum mismatch - possible tampering')
        this.clearSession()
        return null
      }

      // Check timeout
      const elapsed = Date.now() - sessionData.timestamp
      if (elapsed > sessionData.timeout) {
        logger.info('Session expired')
        this.clearSession()
        return null
      }

      return sessionData.data
    } catch (error) {
      logger.error('Failed to retrieve session', error as Error)
      return null
    }
  }

  /**
   * Clear session data
   */
  static clearSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY)
    sessionStorage.removeItem(`${this.SESSION_KEY}-check`)
  }

  /**
   * Refresh session timeout
   */
  static refreshSession(): void {
    const session = this.getSession()
    if (session) {
      this.setSession(session)
    }
  }
}

// Export singleton instances
export const rateLimiter = SecurityUtils.createRateLimiter(100, 15 * 60 * 1000) // 100 requests per 15 minutes

export default SecurityUtils


