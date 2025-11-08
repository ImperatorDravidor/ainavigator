/**
 * Enterprise API Service Layer
 * Centralized API communication with interceptors and retry logic
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { logger } from './logger.service'
import { NetworkError, ValidationError, AuthenticationError, ApplicationError } from './error.service'
import { config } from '@/lib/config'
import { BaseResponse } from '@/lib/types/models'

interface RetryConfig {
  retries: number
  retryDelay: number
  retryCondition?: (error: AxiosError) => boolean
}

interface RequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean
  retry?: RetryConfig | boolean
  cache?: boolean
  cacheTime?: number
  _retry?: boolean
  _retryCount?: number
}

class ApiService {
  private static instance: ApiService
  private axiosInstance: AxiosInstance
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private pendingRequests: Map<string, Promise<any>> = new Map()

  private constructor() {
    this.axiosInstance = this.createAxiosInstance()
    this.setupInterceptors()
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-App-Version': config.app.version,
      },
      withCredentials: true,
    })
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken()
        if (token && !config.headers['skipAuth']) {
          config.headers['Authorization'] = `Bearer ${token}`
        }

        // Add CSRF token
        const csrfToken = this.getCSRFToken()
        if (csrfToken) {
          config.headers[config.headers['X-CSRF-Token'] || 'X-CSRF-Token'] = csrfToken
        }

        // Add request ID for tracing
        config.headers['X-Request-ID'] = this.generateRequestId()

        // Log request
        logger.debug('API Request', {
          method: config.method,
          url: config.url,
          params: config.params,
          requestId: config.headers['X-Request-ID']
        })

        return config
      },
      (error) => {
        logger.error('Request Interceptor Error', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Log successful response
        logger.debug('API Response', {
          status: response.status,
          url: response.config.url,
          requestId: response.config.headers['X-Request-ID']
        })

        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as RequestOptions

        // Handle different error scenarios
        if (error.response) {
          const { status, data } = error.response

          switch (status) {
            case 401:
              // Handle authentication error
              if (!originalRequest._retry) {
                originalRequest._retry = true
                try {
                  await this.refreshToken()
                  return this.axiosInstance(originalRequest)
                } catch (refreshError) {
                  this.handleAuthenticationFailure()
                  throw new AuthenticationError('Authentication failed')
                }
              }
              break

            case 403:
              throw new AuthenticationError('Access forbidden')

            case 422:
            case 400:
              throw new ValidationError('Validation failed', { 
                errors: (data as any)?.errors 
              })

            case 429:
              // Rate limiting - retry with backoff
              if (originalRequest.retry !== false) {
                return this.retryWithBackoff(originalRequest)
              }
              break

            case 500:
            case 502:
            case 503:
            case 504:
              // Server errors - retry if configured
              if (originalRequest.retry !== false) {
                return this.retryWithBackoff(originalRequest)
              }
              break
          }

          logger.error('API Error Response', {
            status,
            data,
            url: originalRequest.url,
            requestId: originalRequest.headers?.['X-Request-ID']
          })
        } else if (error.request) {
          // Request made but no response received
          throw new NetworkError('Network error - no response received')
        } else {
          // Error in request configuration
          throw new ApplicationError('Request configuration error')
        }

        return Promise.reject(error)
      }
    )
  }

  private getAuthToken(): string | null {
    // Get from store or localStorage
    const store = typeof window !== 'undefined' ? window.localStorage.getItem('auth-token') : null
    return store
  }

  private getCSRFToken(): string | null {
    // Get CSRF token from meta tag or cookie
    if (typeof document !== 'undefined') {
      const meta = document.querySelector('meta[name="csrf-token"]')
      return meta?.getAttribute('content') || null
    }
    return null
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async refreshToken(): Promise<void> {
    // Implement token refresh logic
    const response = await this.post<{ token: string }>('/auth/refresh', {}, { skipAuth: true })
    if (response.data?.token) {
      localStorage.setItem('auth-token', response.data.token)
    }
  }

  private handleAuthenticationFailure(): void {
    // Clear auth state and redirect to login
    localStorage.removeItem('auth-token')
    window.location.href = '/login'
  }

  private async retryWithBackoff(
    config: RequestOptions,
    retryCount = 0
  ): Promise<AxiosResponse> {
    const maxRetries = typeof config.retry === 'object' ? config.retry.retries : 3
    const delay = typeof config.retry === 'object' ? config.retry.retryDelay : 1000

    if (retryCount >= maxRetries) {
      throw new NetworkError('Max retries exceeded')
    }

    // Exponential backoff
    const backoffDelay = delay * Math.pow(2, retryCount)
    
    logger.info(`Retrying request (${retryCount + 1}/${maxRetries})`, {
      url: config.url,
      delay: backoffDelay
    })

    await new Promise(resolve => setTimeout(resolve, backoffDelay))

    config._retry = true
    config._retryCount = retryCount + 1

    try {
      return await this.axiosInstance(config)
    } catch (error) {
      return this.retryWithBackoff(config, retryCount + 1)
    }
  }

  private getCacheKey(url: string, params?: any): string {
    return `${url}_${JSON.stringify(params || {})}`
  }

  private checkCache(key: string, cacheTime: number): any | null {
    const cached = this.cache.get(key)
    if (cached) {
      const isValid = Date.now() - cached.timestamp < cacheTime
      if (isValid) {
        logger.debug('Cache hit', { key })
        return cached.data
      }
      this.cache.delete(key)
    }
    return null
  }

  // Public API methods
  async get<T = any>(
    url: string,
    params?: any,
    options: RequestOptions = {}
  ): Promise<BaseResponse<T>> {
    // Check cache if enabled
    if (options.cache) {
      const cacheKey = this.getCacheKey(url, params)
      const cached = this.checkCache(cacheKey, options.cacheTime || 5 * 60 * 1000)
      if (cached) {
        return cached
      }

      // Check for pending request
      const pending = this.pendingRequests.get(cacheKey)
      if (pending) {
        return pending
      }

      // Create new request
      const request = this.axiosInstance.get<BaseResponse<T>>(url, {
        params,
        ...options
      }).then(response => {
        // Cache successful response
        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        })
        this.pendingRequests.delete(cacheKey)
        return response.data
      }).catch(error => {
        this.pendingRequests.delete(cacheKey)
        throw error
      })

      this.pendingRequests.set(cacheKey, request)
      return request
    }

    const response = await this.axiosInstance.get<BaseResponse<T>>(url, {
      params,
      ...options
    })
    return response.data
  }

  async post<T = any>(
    url: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<BaseResponse<T>> {
    const response = await this.axiosInstance.post<BaseResponse<T>>(url, data, options)
    return response.data
  }

  async put<T = any>(
    url: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<BaseResponse<T>> {
    const response = await this.axiosInstance.put<BaseResponse<T>>(url, data, options)
    return response.data
  }

  async patch<T = any>(
    url: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<BaseResponse<T>> {
    const response = await this.axiosInstance.patch<BaseResponse<T>>(url, data, options)
    return response.data
  }

  async delete<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<BaseResponse<T>> {
    const response = await this.axiosInstance.delete<BaseResponse<T>>(url, options)
    return response.data
  }

  // File upload with progress
  async uploadFile(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    options: RequestOptions = {}
  ): Promise<BaseResponse<any>> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.axiosInstance.post<BaseResponse<any>>(url, formData, {
      ...options,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress?.(progress)
        }
      }
    })

    return response.data
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
    logger.info('API cache cleared')
  }
}

export const apiService = ApiService.getInstance()
export default apiService
