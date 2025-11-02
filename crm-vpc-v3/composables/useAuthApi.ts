/**
 * Auth API Composable with Enhanced Error Handling
 * Migrated from admin-vpc/api/auth.js
 */

import {
  AuthError,
  NetworkError,
  TimeoutError,
  isRetryableError,
  getErrorCode,
  getErrorMessage,
  AuthErrorCode
} from '~/types/errors'

// ===== RETRY CONFIG =====
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  timeout: 30000 // 30 seconds
}

export const useAuthApi = () => {
  const config = useRuntimeConfig()
  let apiBase = config.public.apiBase || 'http://localhost:3000/api/u'
  
  // Ensure apiBase ends with /api/u (CRM uses user endpoints, not admin)
  if (!apiBase.endsWith('/api/u') && !apiBase.endsWith('/api/u/')) {
    // If it ends with /a, replace with /api/u (convert from admin to user)
    if (apiBase.endsWith('/a') || apiBase.endsWith('/a/')) {
      apiBase = apiBase.replace(/\/a\/?$/, '/api/u')
    } else if (apiBase.endsWith('/api/a') || apiBase.endsWith('/api/a/')) {
      // Convert /api/a to /api/u
      apiBase = apiBase.replace(/\/api\/a\/?$/, '/api/u')
    } else {
      // Otherwise append /api/u
      apiBase = apiBase.replace(/\/$/, '') + '/api/u'
    }
  }
  
  // Debug: Log API base URL
  console.log('🔍 API Base URL:', apiBase)

  /**
   * Exponential backoff delay
   */
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  /**
   * Retry wrapper with exponential backoff
   */
  const withRetry = async <T>(
    operation: () => Promise<T>,
    retries = RETRY_CONFIG.maxRetries
  ): Promise<T> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation()
      } catch (error: any) {
        // Don't retry if not retryable or last attempt
        if (!isRetryableError(error) || attempt === retries) {
          throw error
        }

        // Exponential backoff: 1s, 2s, 4s, 8s...
        const backoffDelay = RETRY_CONFIG.retryDelay * Math.pow(2, attempt)
        console.warn(`🔄 Retry attempt ${attempt + 1}/${retries} after ${backoffDelay}ms`)
        await delay(backoffDelay)
      }
    }

    throw new Error('Max retries exceeded')
  }

  /**
   * Transform raw error to AuthError with Vietnamese message
   */
  const transformError = (error: any): AuthError => {
    // Already an AuthError
    if (error instanceof AuthError) {
      return error
    }

    // Try to extract message from API response
    // Backend format: { error: { code: number, message: string } }
    let customMessage = null
    let errorCodeFromBackend = null
    
    if (error.data?.error) {
      // Handle both cases: error.data.error could be string or object
      if (typeof error.data.error === 'string') {
        customMessage = error.data.error
      } else if (error.data.error?.message) {
        customMessage = error.data.error.message
        errorCodeFromBackend = error.data.error?.code
      } else if (typeof error.data.error === 'object') {
        customMessage = error.data.error.message || JSON.stringify(error.data.error)
        errorCodeFromBackend = error.data.error?.code
      }
    } else if (error.data?.message) {
      customMessage = error.data.message
    } else if (error.message) {
      customMessage = error.message
    }

    // Get error code and create AuthError
    const errorCode = getErrorCode(error)
    const statusCode = error.statusCode || error.status || 500
    
    // Ensure statusCode is a valid number
    const validStatusCode = typeof statusCode === 'number' && !isNaN(statusCode) ? statusCode : 500
    const validErrorCode = errorCode || AuthErrorCode.UNKNOWN_ERROR

    // Special handling for BadAuthentication (code 215) - always map to Vietnamese
    if (errorCodeFromBackend === 215 || (validStatusCode === 404 && customMessage?.toLowerCase().includes('bad authentication'))) {
      const authError = new AuthError(AuthErrorCode.INVALID_CREDENTIALS, validStatusCode, error)
      authError.message = 'Tên đăng nhập hoặc mật khẩu không chính xác'
      return authError
    }

    // Create AuthError with custom message if available
    if (customMessage) {
      const authError = new AuthError(validErrorCode, validStatusCode, error)
      authError.message = customMessage
      return authError
    }

    return new AuthError(validErrorCode, validStatusCode, error)
  }

  /**
   * Fetch with timeout support
   */
  const fetchWithTimeout = async <T>(url: string, options: any): Promise<T> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.timeout)

    try {
      const response = await $fetch<T>(url, {
        ...options,
        signal: controller.signal
      }) as T
      return response
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new TimeoutError(error)
      }
      // Log error for debugging
      console.log('🔍 API Error Response:', {
        status: error.status || error.statusCode,
        data: error.data,
        dataError: error.data?.error,
        dataErrorMessage: error.data?.error?.message,
        message: error.message,
        url
      })
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  return {
    /**
     * Login
     * @param username Email or phone
     * @param password Password
     * @param remindAccount Remember account
     */
    async login(username: string, password: string, remindAccount = false) {
      try {
        // Backend expects 'email' field, not 'username'
        return await withRetry(() => 
          fetchWithTimeout(`${apiBase}/sessions/login`, {
            method: 'POST',
            body: {
              email: username, // Map username to email for backend
              password,
              remindAccount,
              origin: 'vanphuccare.gensi.vn'
            }
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Register new account
     * @param email Email
     * @param password Password
     * @param repeat_password Repeat password
     * @param fullname Full name
     * @param phone Phone number
     */
    async register(email: string, password: string, repeat_password: string, fullname?: string, phone?: string) {
      try {
        console.log('🔍 Register API call:', {
          url: `${apiBase}/sessions`,
          email,
          fullname: fullname || email.split('@')[0],
          domain: 'vanphuccare.gensi.vn',
          origin: 'vanphuccare.gensi.vn'
        })
        
        const result = await withRetry(() =>
          fetchWithTimeout(`${apiBase}/sessions`, {
            method: 'POST',
            body: {
              email,
              password,
              repeat_password,
              fullname: fullname || email.split('@')[0], // Use email prefix if no fullname
              phone: phone || '',
              domain: 'vanphuccare.gensi.vn',
              origin: 'vanphuccare.gensi.vn'
            }
          })
        )
        
        console.log('🔍 Register API response:', result)
        return result
      } catch (error: any) {
        console.error('🔍 Register API error:', error)
        throw transformError(error)
      }
    },

    /**
     * Verify email with OTP after registration
     * @param email Email
     * @param otp OTP code
     */
    async verifyEmail(email: string, otp: string) {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/sessions/verify_email`, {
            method: 'POST',
            body: {
              email,
              otp,
              origin: 'vanphuccare.gensi.vn'
            }
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Update profile
     * @param data Profile data
     */
    async updateProfile(data: Record<string, any>) {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/sessions`, {
            method: 'PATCH',
            body: data
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Change password
     * @param oldPassword Old password
     * @param newPassword New password
     */
    async changePassword(oldPassword: string, newPassword: string) {
      try {
        await withRetry(() =>
          fetchWithTimeout(`${apiBase}/sessions/change_password`, {
            method: 'PATCH',
            body: {
              oldPassword,
              newPassword
            }
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Forgot password - Send OTP to email
     * @param email Email
     */
    async forgotPassword(email: string) {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/passwords/forgot_password`, {
            method: 'POST',
            body: { email }
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Verify OTP for forgot password
     * @param email Email
     * @param otp OTP code
     */
    async verifyOtp(email: string, otp: string) {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/passwords/verify_otp`, {
            method: 'POST',
            body: { email, otp }
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Reset password with token
     * @param email Email
     * @param token Token from OTP verification
     * @param newPassword New password
     */
    async resetPassword(email: string, token: string, newPassword: string) {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/passwords`, {
            method: 'POST',
            params: { email, token },
            body: { password: newPassword }
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Get active logs
     * @param params Query parameters
     */
    async getActiveLogs(params?: Record<string, any>) {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/active-logs`, {
            method: 'GET',
            params
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Write activity log
     * @param data Log data
     */
    async writeLog(data: Record<string, any>) {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/active-logs`, {
            method: 'POST',
            body: data
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Logout
     */
    async logout() {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/active-logs/logout`, {
            method: 'PATCH'
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Get geo IP information
     */
    async getGeoIp() {
      try {
        return await withRetry(() =>
          fetchWithTimeout('https://get.geojs.io/v1/ip/geo.json', {
            method: 'GET'
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Google Login
     * Exchange authorization code for user data and JWT
     */
    async googleLogin(code: string, state: string) {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/api/auth/google/login`, {
            method: 'POST',
            body: { code, state }
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Get Google OAuth URL
     */
    async getGoogleAuthUrl() {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/api/auth/google/url`, {
            method: 'GET'
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    }
  }
}
