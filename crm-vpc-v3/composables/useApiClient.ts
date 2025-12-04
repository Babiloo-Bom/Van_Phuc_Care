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
  const baseURL = config.public.apiHost;

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
    console.error('[API Error]', error);

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
          // Auto logout and redirect
          authStore.logout();
          router.push('/login');
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
        timeout: options.timeout || 60000, // 60s for uploads
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

