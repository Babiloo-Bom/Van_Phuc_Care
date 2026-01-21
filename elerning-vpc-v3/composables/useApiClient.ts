/**
 * ====================================
 * Base API Client Composable
 * ====================================
 * Core HTTP client with error handling, interceptors, and retry logic
 * Replaces @nuxtjs/axios
 */

import type { ApiResponse, ApiRequestOptions } from '~/types/api';
import { message as antMessage } from 'ant-design-vue';

export const useApiClient = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const router = useRouter();
  
  // Base API URL
  // Trong production, nếu apiHost rỗng, dùng relative path
  // Trong development, dùng localhost:3000
  let baseURL = config.public.apiHost || ''
  
  // Nếu baseURL rỗng và đang ở client-side, dùng relative path
  // Nếu baseURL có giá trị nhưng là Docker internal hostname, cần xử lý
  if (baseURL && (baseURL.includes('api:3000') || baseURL.includes('api:'))) {
    // Nếu là client-side và baseURL là Docker internal, không dùng
    if (process.client) {
      baseURL = '' // Dùng relative path
    }
  }

  /**
   * Create fetch options with defaults
   */
  const createFetchOptions = (options: ApiRequestOptions = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`;
    }

    return {
      baseURL,
      headers,
      timeout: options.timeout || 30000,
      retry: typeof options.retry === 'number' ? options.retry : options.retry?.limit || 0,
      retryDelay: typeof options.retry === 'object' ? options.retry.delay : 1000,
      ...options,
    };
  };

  /**
   * Handle API errors
   */
  const handleError = (error: any, options: ApiRequestOptions = {}) => {

    let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại';
    
    // Extract error message from response
    if (error.data) {
      errorMessage = error.data.message || error.data.error || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Handle specific status codes
    if (error.statusCode || error.status) {
      const status = error.statusCode || error.status;
      
      switch (status) {
        case 401:
          errorMessage = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại';
          // Don't auto logout if:
          // 1. User is not authenticated (no token) - nothing to logout from
          // 2. SSO login is in progress
          // 3. User just logged in (grace period)
          // 4. It's a profile request (non-critical)
          const requestUrl = error.request?.url || error.url || '';
          const isProfileRequest = requestUrl.includes('/users/profile') || requestUrl.includes('/profile');
          
          // Check if login was recent (within last 30 seconds)
          const timeSinceLogin = authStore.loginTimestamp 
            ? Date.now() - authStore.loginTimestamp 
            : Infinity;
          
          // Only logout if user was actually authenticated
          if (!authStore.isAuthenticated && !authStore.token) {
          } else if (authStore.justLoggedIn) {
          } else if (timeSinceLogin < 30000) {
          } else if (isProfileRequest) {
          } else {
            // Auto logout and redirect
            authStore.logout();
            router.push('/login');
          }
          break;
        case 403:
          errorMessage = 'Bạn không có quyền thực hiện thao tác này';
          break;
        case 404:
          errorMessage = 'Không tìm thấy dữ liệu';
          break;
        case 422:
          errorMessage = 'Dữ liệu không hợp lệ';
          // Extract validation errors
          if (error.data?.errors && Array.isArray(error.data.errors)) {
            errorMessage = error.data.errors.map((e: any) => e.message).join(', ');
          }
          break;
        case 429:
          errorMessage = 'Bạn đã thực hiện quá nhiều yêu cầu, vui lòng thử lại sau';
          break;
        case 500:
          errorMessage = 'Lỗi máy chủ, vui lòng thử lại sau';
          break;
      }
    }

    // Show error message if enabled
    if (options.showError !== false) {
      antMessage.error(options.errorMessage || errorMessage);
    }

    return {
      status: false,
      message: errorMessage,
      error,
    };
  };

  /**
   * GET request
   */
  const get = async <T = any>(
    url: string,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> => {
    try {
      const fetchOptions = createFetchOptions(options);
      
      const response = await $fetch<T>(url, {
        method: 'GET',
        params: options.params,
        ...fetchOptions,
      });

      return {
        status: true,
        data: response,
      };
    } catch (error: any) {
      return handleError(error, options);
    }
  };

  /**
   * POST request
   */
  const post = async <T = any>(
    url: string,
    body?: any,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> => {
    try {
      const fetchOptions = createFetchOptions(options);
      
      const response = await $fetch<T>(url, {
        method: 'POST',
        body,
        params: options.params,
        ...fetchOptions,
      });

      return {
        status: true,
        data: response,
      };
    } catch (error: any) {
      return handleError(error, options);
    }
  };

  /**
   * PUT request
   */
  const put = async <T = any>(
    url: string,
    body?: any,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> => {
    try {
      const fetchOptions = createFetchOptions(options);
      
      const response = await $fetch<T>(url, {
        method: 'PUT',
        body,
        params: options.params,
        ...fetchOptions,
      });

      return {
        status: true,
        data: response,
      };
    } catch (error: any) {
      return handleError(error, options);
    }
  };

  /**
   * PATCH request
   */
  const patch = async <T = any>(
    url: string,
    body?: any,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> => {
    try {
      const fetchOptions = createFetchOptions(options);
      
      const response = await $fetch<T>(url, {
        method: 'PATCH',
        body,
        params: options.params,
        ...fetchOptions,
      });

      return {
        status: true,
        data: response,
      };
    } catch (error: any) {
      return handleError(error, options);
    }
  };

  /**
   * DELETE request
   */
  const del = async <T = any>(
    url: string,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> => {
    try {
      const fetchOptions = createFetchOptions(options);
      
      const response = await $fetch<T>(url, {
        method: 'DELETE',
        params: options.params,
        ...fetchOptions,
      });

      return {
        status: true,
        data: response,
      };
    } catch (error: any) {
      return handleError(error, options);
    }
  };

  /**
   * Upload file(s)
   */
  const upload = async (
    url: string,
    formData: FormData,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse> => {
    try {
      const headers: Record<string, string> = {
        ...options.headers,
      };

      // Add auth token
      if (authStore.token) {
        headers['Authorization'] = `Bearer ${authStore.token}`;
      }

      // Don't set Content-Type for FormData (browser will set it with boundary)
      const response = await $fetch(url, {
        method: 'POST',
        body: formData,
        baseURL,
        headers,
        timeout: options.timeout || 7200000, // Default 2 hours for large uploads
      });

      return {
        status: true,
        data: response,
      };
    } catch (error: any) {
      return handleError(error, options);
    }
  };

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    baseURL,
  };
};

