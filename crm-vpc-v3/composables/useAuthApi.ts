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
  AuthErrorCode,
} from '~/types/errors';

// ===== RETRY CONFIG =====
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  timeout: 30000, // 30 seconds
};

export const useAuthApi = () => {
  const config = useRuntimeConfig();
  // Use runtime config, fallback to relative path for production
  let apiBase = config.public.apiBase || '/api/u';

  // Check if it's absolute path (http://...) or relative path
  const isAbsolutePath =
    apiBase.startsWith('http://') || apiBase.startsWith('https://');

  // Store isAbsolutePath for use in Google OAuth methods
  const _isAbsolutePath = isAbsolutePath;

  // For absolute paths (development/local/Docker), normalize and use /api/u
  if (isAbsolutePath) {
    // Step 1: Remove ALL duplicate /api/api/ patterns (handle multiple duplicates)
    while (apiBase.includes('/api/api/')) {
      apiBase = apiBase.replace(/\/api\/api\//g, '/api/');
    }

    // Step 2: Normalize trailing slashes
    apiBase = apiBase.replace(/\/+$/, '');

    // Step 3: Extract base URL (http://host:port) and path
    const urlMatch = apiBase.match(/^(https?:\/\/[^\/]+)(\/.*)?$/);
    if (urlMatch) {
      const baseUrl = urlMatch[1]; // e.g., http://localhost:3000
      let path = urlMatch[2] || ''; // e.g., /u, /api/a, /a, etc.

      // Step 4: Normalize path to /api/u
      if (path === '/u' || path === '/u/') {
        // Case: http://localhost:3000/u -> http://localhost:3000/api/u
        path = '/api/u';
      } else if (path === '/a' || path === '/a/') {
        path = '/api/u';
      } else if (path === '/api/a' || path === '/api/a/') {
        path = '/api/u';
      } else if (!path || path === '/') {
        // No path, add /api/u
        path = '/api/u';
      } else if (!path.endsWith('/api/u') && !path.endsWith('/api/u/')) {
        // Path exists but not /api/u - check if it contains /api/
        if (path.includes('/api/')) {
          // Already has /api/, just ensure ends with /u
          path = path.replace(/\/+$/, '') + '/u';
        } else {
          // No /api/ in path, replace with /api/u
          path = '/api/u';
        }
      }

      apiBase = baseUrl + path;
    }
  } else {
    // Relative path (production) - Nginx has /api/ prefix, so use /u
    apiBase = apiBase.replace(/\/+$/, '');

    if (apiBase.endsWith('/api/u') || apiBase.endsWith('/api/u/')) {
      apiBase = apiBase.replace(/\/api\/u\/?$/, '/u');
    } else if (apiBase.endsWith('/a') || apiBase.endsWith('/a/')) {
      apiBase = apiBase.replace(/\/a\/?$/, '/u');
    } else if (apiBase.endsWith('/api/a') || apiBase.endsWith('/api/a/')) {
      apiBase = apiBase.replace(/\/api\/a\/?$/, '/u');
    } else if (!apiBase.endsWith('/u') && !apiBase.endsWith('/u/')) {
      apiBase = apiBase + '/u';
    }
  }

  // Final normalize: remove any remaining duplicate /api/api/
  apiBase = apiBase.replace(/\/api\/api+/g, '/api');
  // apiBase = 'http://localhost:3000/api/a'
  // Debug: Log final API base URL
  /**
   * Exponential backoff delay
   */
  const delay = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Retry wrapper with exponential backoff
   */
  const withRetry = async <T>(
    operation: () => Promise<T>,
    retries = RETRY_CONFIG.maxRetries,
  ): Promise<T> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        // Don't retry if not retryable or last attempt
        if (!isRetryableError(error) || attempt === retries) {
          throw error;
        }

        // Exponential backoff: 1s, 2s, 4s, 8s...
        const backoffDelay = RETRY_CONFIG.retryDelay * Math.pow(2, attempt);
        console.warn(
          `🔄 Retry attempt ${attempt + 1}/${retries} after ${backoffDelay}ms`,
        );
        await delay(backoffDelay);
      }
    }

    throw new Error('Max retries exceeded');
  };

  /**
   * Transform raw error to AuthError with Vietnamese message
   */
  const transformError = (error: any): AuthError => {
    // Already an AuthError
    if (error instanceof AuthError) {
      return error;
    }
    console.log("Transforming error:", error);
    // Try to extract message from API response
    let customMessage = null;
    if (error.data?.error) {
      customMessage = error.data.error;
    } else if (error.data?.message) {
      customMessage = error.data.message;
    }

    // Get error code and create AuthError
    const errorCode = getErrorCode(error);
    const statusCode = error.statusCode || error.status || 500;

    // Create AuthError with custom message if available
    if (customMessage) {
      const authError = new AuthError(
        errorCode as AuthErrorCode,
        statusCode,
        error,
      );
      authError.message = customMessage;
      return authError;
    }

    return new AuthError(errorCode as AuthErrorCode, statusCode, error);
  };

  /**
   * Fetch with timeout support
   */
  const fetchWithTimeout = async <T>(url: string, options: any): Promise<T> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      RETRY_CONFIG.timeout,
    );

    try {
      const response = (await $fetch(url, {
        ...options,
        signal: controller.signal,
      })) as T;
      return response;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new TimeoutError(error);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return {
    /**
     * Login
     * @param username Email or phone
     * @param password Password
     * @param remindAccount Remember account
     */
    async login(username: string, password: string, remindAccount = false) {
      try {
        // Use Nuxt server proxy endpoint
        return await withRetry(() =>
          fetchWithTimeout('/api/auth/login', {
            method: 'POST',
            body: {
              username,
              password,
              remindAccount,
              origin: 'vanphuccare.gensi.vn',
            },
          }),
        );
      } catch (error: any) {
        throw transformError(error);
      }
    },

    /**
     * Register new account
     * @param email Email
     * @param password Password
     * @param repeat_password Repeat password
     * @param fullname Full name
     */
    async register(
      email: string,
      password: string,
      repeat_password: string,
      fullname?: string,
      phone?: string,
    ) {
      try {
        // Use Nuxt server proxy endpoint (same pattern as login)
        const result = await withRetry(() =>
          fetchWithTimeout('/api/auth/register', {
            method: 'POST',
            body: {
              email,
              password,
              repeat_password,
              fullname: fullname || email.split('@')[0],
              phone: phone || '',
            },
          }),
        );

        return result;
      } catch (error: any) {
        console.error('🔍 Register API error:', error);
        throw transformError(error);
      }
    },

    /**
     * Verify email with OTP after registration
     * @param email Email
     * @param otp OTP code
     */
    async verifyEmail(email: string, otp: string) {
      try {
        // Use Nuxt server proxy endpoint
        return await withRetry(() =>
          fetchWithTimeout('/api/auth/verify-email', {
            method: 'POST',
            body: {
              email,
              otp,
            },
          }),
        );
      } catch (error: any) {
        throw transformError(error);
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
            body: data,
          }),
        );
      } catch (error: any) {
        throw transformError(error);
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
              newPassword,
            },
          }),
        );
      } catch (error: any) {
        throw transformError(error);
      }
    },

    /**
     * Forgot password - Send OTP to email
     * @param email Email
     */
    async forgotPassword(email: string, source?: string) {
      try {
        // Call Nuxt server API instead of backend directly
        return await withRetry(() =>
          fetchWithTimeout(`/api/sessions/forgot-password`, {
            method: 'POST',
            body: { email, source },
          }),
        );
      } catch (error: any) {
        throw transformError(error);
      }
    },

    /**
     * Reset password with token
     * @param token Token from OTP verification
     * @param newPassword New password
     */
    async resetPassword(token: string, newPassword: string) {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/passwords/reset`, {
            method: 'POST',
            body: {
              token,
              password: newPassword,
            },
          }),
        );
      } catch (error: any) {
        throw transformError(error);
      }
    },

    /**
     * Reset password for user using email + token (OTP)
     * POST /sessions/reset_password with { email, token, newPassword, confirmPassword }
     */
    async resetPasswordWithEmail(email: string, token: string, newPassword: string) {
      try {
        // Call Nuxt server API instead of backend directly
        return await withRetry(() =>
          fetchWithTimeout(`/api/sessions/reset-password`, {
            method: 'POST',
            body: {
              email,
              token,
              newPassword,
              confirmPassword: newPassword,
            },
          }),
        );
      } catch (error: any) {
        throw transformError(error);
      }
    },

    /**
     * Verify OTP for user (email + otp)
     * POST /sessions/verify_otp
     */
    async verifyOtp(email: string, otp: string) {
      try {
        // Call Nuxt server API instead of backend directly
        return await withRetry(() =>
          fetchWithTimeout(`/api/sessions/verify-otp`, {
            method: 'POST',
            body: { email, otp },
          }),
        );
      } catch (error: any) {
        throw transformError(error);
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
            params,
          }),
        );
      } catch (error: any) {
        throw transformError(error);
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
            body: data,
          }),
        );
      } catch (error: any) {
        throw transformError(error);
      }
    },

    /**
     * Logout
     * Uses Nuxt server proxy: /api/sessions/logout -> backend /api/u/sessions/logout
     */
    async logout() {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;

        // Use Nuxt server proxy instead of direct backend call
        return await withRetry(() =>
          fetchWithTimeout('/api/sessions/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        );
      } catch (error: any) {
        throw transformError(error);
      }
    },

    /**
     * Get geo IP information
     */
    async getGeoIp() {
      try {
        return await withRetry(() =>
          fetchWithTimeout('https://get.geojs.io/v1/ip/geo.json', {
            method: 'GET',
          }),
        );
      } catch (error: any) {
        throw transformError(error);
      }
    },

    /**
     * Google Login
     * Exchange authorization code for user data and JWT
     */
    async googleLogin(code: string, state: string) {
      try {
        // Google OAuth always uses /api/a (admin endpoint), not /api/u
        let googleBase: string;
        if (_isAbsolutePath) {
          // Absolute path: replace /api/u or /u with /api/a
          googleBase = apiBase
            .replace(/\/api\/u\/?$/, '/api/a')
            .replace(/\/u\/?$/, '/api/a');
        } else {
          // Relative path: use /api/a (Nginx will add /api/ prefix in production)
          googleBase = '/api/a';
        }
        return await withRetry(() =>
          fetchWithTimeout(`${googleBase}/auth/google/login`, {
            method: 'POST',
            body: { code, state },
          }),
        );
      } catch (error: any) {
        throw transformError(error);
      }
    },

    /**
     * Get Google OAuth URL
     */
    async getGoogleAuthUrl() {
      try {
        // Google OAuth always uses /api/a (admin endpoint), not /api/u
        let googleBase: string;
        if (_isAbsolutePath) {
          // Absolute path: replace /api/u or /u with /api/a
          googleBase = apiBase
            .replace(/\/api\/u\/?$/, '/api/a')
            .replace(/\/u\/?$/, '/api/a');
        } else {
          // Relative path: use /api/a (Nginx will add /api/ prefix in production)
          googleBase = '/api/a';
        }
        return await withRetry(() =>
          fetchWithTimeout(`${googleBase}/auth/google/url`, {
            method: 'GET',
          }),
        );
      } catch (error: any) {
        throw transformError(error);
      }
    },

    /**
     * Get user profile
     * Uses Nuxt server proxy: /api/users/profile -> backend /api/u/users/profile
     */
    async getUserProfile() {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;

        // Use Nuxt server proxy instead of direct backend call
        return await withRetry(() =>
          fetchWithTimeout('/api/users/profile', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        );
      } catch (error: any) {
        console.error('❌ getUserProfile error:', error);
        throw transformError(error);
      }
    },

    /**
     * Update course register
     */
    async updateCourseRegister(
      courseIds: string[],
      action: 'add' | 'remove' = 'add',
    ) {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;

        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/admins/course-register`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: {
              courseIds,
              action,
            },
          }),
        );
      } catch (error: any) {
        console.error('❌ updateCourseRegister error:', error);
        throw transformError(error);
      }
    },
  };
};
