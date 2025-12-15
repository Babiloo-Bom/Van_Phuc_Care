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
} from "~/types/errors";
import { useApiBase } from "./useApiBase";

// ===== RETRY CONFIG =====
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  timeout: 30000, // 30 seconds
};

export const useAuthApi = () => {
  const { apiUser, apiAdmin, baseUrl } = useApiBase()
  let apiBase = apiUser

  // Debug: Log API base URL
  console.log("🔍 API Base URL:", apiBase);
  console.log("🔍 Base URL:", baseUrl);

  // Debug: Log final API base URL
  console.log("🔍 Final API Base URL:", apiBase);

  /**
   * Exponential backoff delay
   */
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Retry wrapper with exponential backoff
   */
  const withRetry = async <T>(
    operation: () => Promise<T>,
    retries = RETRY_CONFIG.maxRetries
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
          `🔄 Retry attempt ${attempt + 1}/${retries} after ${backoffDelay}ms`
        );
        await delay(backoffDelay);
      }
    }

    throw new Error("Max retries exceeded");
  };

  /**
   * Transform raw error to AuthError with Vietnamese message
   */
  const transformError = (error: any): AuthError => {
    // Already an AuthError
    if (error instanceof AuthError) {
      return error;
    }

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
        error
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
      RETRY_CONFIG.timeout
    );

    try {
      const response = (await $fetch(url, {
        ...options,
        signal: controller.signal,
      })) as T;
      return response;
    } catch (error: any) {
      if (error.name === "AbortError") {
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
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/sessions/login`, {
            method: "POST",
            body: {
              username,
              password,
              remindAccount,
            },
          })
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
      phone?: string
    ) {
      try {
        
        const result = await withRetry(() =>
          fetchWithTimeout(`${apiBase}/sessions`, {
            method: "POST",
            body: {
              email,
              password,
              repeat_password,
              fullname: fullname || email.split("@")[0], // Use email prefix if no fullname
              phone: phone || "",
            },
          })
        )
        
        return result
      } catch (error: any) {
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
            method: "POST",
            body: {
              email,
              otp,
            },
          })
        );
      } catch (error: any) {
        throw transformError(error);
      }
    },

    /**
     * Verify OTP (used for password reset links)
     * @param email Email
     * @param otp OTP token
     */
    async verifyOtp(email: string, otp: string) {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/sessions/verify_otp`, {
            method: "POST",
            body: { email, otp },
          })
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
            method: "PATCH",
            body: data,
          })
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
            method: "PATCH",
            body: {
              oldPassword,
              newPassword,
            },
          })
        );
      } catch (error: any) {
        throw transformError(error);
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
            method: "POST",
            body: { email },
          })
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
            method: "POST",
            body: {
              token,
              password: newPassword,
            },
          })
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
            method: "GET",
            params,
          })
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
            method: "POST",
            body: data,
          })
        );
      } catch (error: any) {
        throw transformError(error);
      }
    },

    /**
     * Logout
     */
    async logout() {
      try {
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/active-logs/logout`, {
            method: "PATCH",
          })
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
          fetchWithTimeout("https://get.geojs.io/v1/ip/geo.json", {
            method: "GET",
          })
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
        return await withRetry(() =>
          fetchWithTimeout(`${apiAdmin}/auth/google/login`, {
            method: "POST",
            body: { code, state },
          })
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
        return await withRetry(() =>
          fetchWithTimeout(`${apiAdmin}/auth/google/url`, {
            method: "GET",
          })
        );
      } catch (error: any) {
        throw transformError(error);
      }
    },

    /**
     * Get user profile
     */
    async getUserProfile() {
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/users/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );
      } catch (error: any) {
        throw transformError(error)
      }
    },

    /**
     * Update course register
     */
    async updateCourseRegister(
      courseIds: string[],
      action: "add" | "remove" = "add"
    ) {
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        
        return await withRetry(() =>
          fetchWithTimeout(`${apiBase}/users/course-register`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: {
              courseIds,
              action,
            },
          })
        );
      } catch (error: any) {
        throw transformError(error)
      }
    },
  };
};
