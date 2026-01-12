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
  
  // Use apiHost for absolute URL, fallback to apiBase
  const apiHost = (config.public.apiHost || '').replace(/\/+$/, '')
  const apiBase = config.public.apiBase || '/api/a'
  
  // Build full API base URL
  let fullApiBase: string
  if (apiHost) {
    // Use absolute URL with apiHost
    fullApiBase = `${apiHost}/api/a`
  } else if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
    // Already absolute URL
    fullApiBase = apiBase.replace(/\/+$/, '')
    if (!fullApiBase.endsWith('/api/a')) {
      fullApiBase = fullApiBase.replace(/\/api\/u\/?$/, '/api/a').replace(/\/u\/?$/, '/api/a')
      if (!fullApiBase.endsWith('/api/a')) {
        fullApiBase = fullApiBase + '/api/a'
      }
    }
  } else {
    // Relative path - use as is (will work if Nuxt proxy is configured)
    fullApiBase = apiBase.replace(/\/+$/, '')
    if (!fullApiBase.endsWith('/api/a') && !fullApiBase.endsWith('/a')) {
      fullApiBase = fullApiBase.replace(/\/api\/u\/?$/, '/api/a').replace(/\/u\/?$/, '/api/a')
      if (!fullApiBase.endsWith('/api/a') && !fullApiBase.endsWith('/a')) {
        fullApiBase = '/api/a'
      }
    }
  }

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
        const url = `${fullApiBase}/sessions/login`
        console.log('🔍 Login URL:', url)
        console.log('🔍 Login payload:', { username, hasPassword: !!password, remindAccount })
        
        const response = await withRetry(() => 
          fetchWithTimeout(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: {
              username,
              password,
              remindAccount,
              origin: 'vanphuccare.gensi.vn'
            }
          })
        )
        
        console.log('🔍 Login API response type:', typeof response)
        console.log('🔍 Login API response:', response)
        
        return response
      } catch (error: any) {
        console.error('❌ Login API error:', error)
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          statusCode: error.statusCode,
          data: error.data
        })
        throw transformError(error)
      }
    },

    /**
     * Get user profile
     */
    async getUserProfile() {
      try {
        return await withRetry(() => 
          fetchWithTimeout(`${fullApiBase}/sessions/current_admin`, {
            method: 'GET'
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
          fetchWithTimeout(`${fullApiBase}/sessions`, {
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
          fetchWithTimeout(`${fullApiBase}/sessions/change_password`, {
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
          fetchWithTimeout(`${fullApiBase}/sessions/forgot_password`, {
            method: 'POST',
            body: { email }
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Verify OTP
     * @param email Email
     * @param otp OTP code
     */
    async verifyOtp(email: string, otp: string) {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${fullApiBase}/sessions/verify_otp`, {
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
          fetchWithTimeout(`${fullApiBase}/passwords`, {
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
          fetchWithTimeout(`${fullApiBase}/active-logs`, {
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
          fetchWithTimeout(`${fullApiBase}/active-logs`, {
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
     * Note: Logout endpoint may not exist, so we ignore errors
     */
    async logout() {
      try {
        // Try to call logout endpoint if it exists
        // If it doesn't exist (404), that's fine - we'll just clear local state
        return await withRetry(() =>
          fetchWithTimeout(`${fullApiBase}/active-logs/logout`, {
            method: 'PATCH',
            showError: false // Don't show error if endpoint doesn't exist
          })
        )
      } catch (error: any) {
        // Ignore 404 errors - logout endpoint may not exist
        if (error.statusCode === 404 || error.status === 404) {
          console.log('ℹ️ Logout endpoint not found, continuing with local logout')
          return { success: true }
        }
        // For other errors, still ignore to allow logout to complete
        console.warn('⚠️ Logout API error (ignored):', error)
        return { success: true }
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
    async googleLogin(code: string, state: string, redirectUri?: string) {
      try {
        // Get redirect_uri from state or use current frontend callback URL
        let finalRedirectUri = redirectUri
        if (!finalRedirectUri && typeof window !== 'undefined') {
          try {
            if (state) {
              const decoded = JSON.parse(decodeURIComponent(state))
              finalRedirectUri = decoded?.redirectUri
            }
          } catch {}
          
          // Fallback to current frontend callback URL
          if (!finalRedirectUri) {
            const baseUrl = window.location.origin.replace(/\/$/, '')
            finalRedirectUri = `${baseUrl}/auth/google/callback`
          }
        }
        
        return await withRetry(() =>
          fetchWithTimeout(`${fullApiBase}/auth/google/login`, {
            method: 'POST',
            body: { 
              code, 
              state,
              redirectUri: finalRedirectUri
            }
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
          fetchWithTimeout(`${fullApiBase}/auth/google/url`, {
            method: 'GET'
          })
        )
      } catch (error: any) {
        throw transformError(error)
      }
    }
  }
}
