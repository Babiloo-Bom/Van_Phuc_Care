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
  // Hardcode for testing - should be http://localhost:3000/api/a
  const apiBase = 'http://localhost:3000/api/a'
  
  // Debug: Log API base URL
  console.log('🔍 API Base URL:', apiBase)
  console.log('🔍 Config public.apiBase:', config.public.apiBase)

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
    let customMessage = null
    if (error.data?.error) {
      customMessage = error.data.error
    } else if (error.data?.message) {
      customMessage = error.data.message
    }

    // Get error code and create AuthError
    const errorCode = getErrorCode(error)
    const statusCode = error.statusCode || error.status || 500

    // Create AuthError with custom message if available
    if (customMessage) {
      const authError = new AuthError(errorCode as AuthErrorCode, statusCode, error)
      authError.message = customMessage
      return authError
    }

    return new AuthError(errorCode as AuthErrorCode, statusCode, error)
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
      })
      return response
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new TimeoutError(error)
      }
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
        return await withRetry(() => 
          fetchWithTimeout(`${apiBase}/sessions/login`, {
            method: 'POST',
            body: {
              username,
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
     */
    async register(email: string, password: string, repeat_password: string, fullname?: string) {
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
          fetchWithTimeout(`${apiBase}/api/a/passwords/forgot_password`, {
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
          fetchWithTimeout(`${apiBase}/api/a/passwords/verify_otp`, {
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
          fetchWithTimeout(`${apiBase}/api/a/passwords`, {
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
          fetchWithTimeout(`${apiBase}/api/a/active-logs`, {
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
          fetchWithTimeout(`${apiBase}/api/a/active-logs`, {
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
          fetchWithTimeout(`${apiBase}/api/a/active-logs/logout`, {
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
