/**
 * ====================================
 * Base API Client Composable
 * ====================================
 * Core HTTP client with error handling, interceptors, and retry logic
 * Replaces @nuxtjs/axios
 */

import type { ApiResponse, ApiRequestOptions } from '~/types/api'
import { message as antMessage } from 'ant-design-vue'

export const useApiClient = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const router = useRouter()
  
  // Base API URL
  // Trong production, phải dùng absolute URL để gọi external API
  // Nếu apiHost rỗng, dùng apiHostInternal (server-side) hoặc window.location.origin
  let baseURL = (config.public.apiHost || '').replace(/\/+$/, '')
  
  // Nếu baseURL rỗng, cần xử lý đặc biệt
  if (!baseURL) {
    if (process.server) {
      // Server-side: dùng apiHostInternal
      baseURL = (config.apiHostInternal || 'http://localhost:3000').replace(/\/+$/, '')
    } else {
      // Client-side: trong production, cần absolute URL
      // Nếu không có, có thể dùng window.location.origin nhưng cần đảm bảo API cùng domain
      // Hoặc tốt nhất là set NUXT_PUBLIC_API_HOST trong docker-compose
      if (process.env.NODE_ENV === 'production') {
        // Trong production, nếu không có apiHost, có thể API đang ở cùng domain
        // Nhưng để chắc chắn, nên set NUXT_PUBLIC_API_HOST
        baseURL = ''
      } else {
        // Development: dùng localhost
        baseURL = 'http://localhost:3000'
      }
    }
  }
  
  /**
   * Create fetch options with defaults
   */
  const createFetchOptions = (options: ApiRequestOptions = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    // Add auth token if available
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    return {
      baseURL,
      headers,
      timeout: options.timeout || 30000,
      retry: typeof options.retry === 'number' ? options.retry : options.retry?.limit || 0,
      retryDelay: typeof options.retry === 'object' ? options.retry.delay : 1000,
      ...options
    }
  }

  /**
   * Handle API errors
   */
  /**
   * Parse validation error from Mongoose/MongoDB format
   * Example: "chapters validation failed: title: Path `title` is required."
   * Returns: "Lỗi validation: Chương học thiếu tiêu đề (title là bắt buộc)"
   */
  const parseValidationError = (errorText: string): string => {
    if (!errorText) return errorText

    // Check if it's a validation error
    if (errorText.includes('validation failed')) {
      // Extract field and message
      const match = errorText.match(/(\w+)\s+validation failed:\s*(\w+):\s*Path\s+`(\w+)`\s+is\s+(required|invalid)\.?/i)
      if (match) {
        const [, entity, field, path, type] = match
        
        // Map entity names to Vietnamese
        const entityMap: Record<string, string> = {
          'chapters': 'Chương học',
          'lessons': 'Bài học',
          'course': 'Khóa học',
          'chapter': 'Chương học',
          'lesson': 'Bài học',
        }
        
        // Map field names to Vietnamese
        const fieldMap: Record<string, string> = {
          'title': 'tiêu đề',
          'description': 'mô tả',
          'content': 'nội dung',
          'videoUrl': 'video',
          'slug': 'slug',
          'thumbnail': 'ảnh đại diện',
        }
        
        const entityName = entityMap[entity.toLowerCase()] || entity
        const fieldName = fieldMap[path.toLowerCase()] || path
        const isRequired = type === 'required'
        
        if (isRequired) {
          return `Lỗi validation: ${entityName} thiếu ${fieldName} (${path} là bắt buộc)`
        } else {
          return `Lỗi validation: ${entityName} có ${fieldName} không hợp lệ (${path} invalid)`
        }
      }
      
      // Fallback: try to extract any field name
      const fieldMatch = errorText.match(/Path\s+`(\w+)`\s+is\s+(required|invalid)/i)
      if (fieldMatch) {
        const [, field, type] = fieldMatch
        const fieldName = fieldMap[field.toLowerCase()] || field
        if (type === 'required') {
          return `Lỗi validation: Thiếu trường ${fieldName} (${field} là bắt buộc)`
        } else {
          return `Lỗi validation: Trường ${fieldName} không hợp lệ (${field} invalid)`
        }
      }
      
      // General validation error
      return `Lỗi validation: ${errorText.replace('validation failed:', '')}`
    }
    
    return errorText
  }

  const handleError = (error: any, options: ApiRequestOptions = {}) => {

    let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại'
    
    // Extract error message from response
    if (error.data) {
      const rawError = error.data.message || error.data.error || errorMessage
      // Parse validation errors
      errorMessage = parseValidationError(rawError)
    } else if (error.message) {
      errorMessage = parseValidationError(error.message)
    }

    // Handle specific status codes
    if (error.statusCode || error.status) {
      const status = error.statusCode || error.status
      
      switch (status) {
        case 401:
          errorMessage = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại'
          // Auto logout and redirect
          authStore.logout()
          router.push('/login')
          break
        case 403:
          // Check if it's a file size error
          if (error.message?.includes('413') || error.message?.includes('Request Entity Too Large') || 
              error.data?.message?.includes('413') || error.data?.message?.includes('Request Entity Too Large')) {
            errorMessage = 'File quá lớn! Kích thước file không được vượt quá 5GB. Vui lòng chọn file nhỏ hơn.'
          } else {
            errorMessage = 'Bạn không có quyền thực hiện thao tác này'
          }
          break
        case 404:
          errorMessage = 'Không tìm thấy dữ liệu'
          break
        case 413:
          errorMessage = 'File quá lớn! Kích thước file không được vượt quá 5GB. Vui lòng chọn file nhỏ hơn.'
          break
        case 422:
          errorMessage = 'Dữ liệu không hợp lệ'
          // Extract validation errors
          if (error.data?.errors && Array.isArray(error.data.errors)) {
            errorMessage = error.data.errors.map((e: any) => e.message).join(', ')
          }
          break
        case 429:
          errorMessage = 'Bạn đã thực hiện quá nhiều yêu cầu, vui lòng thử lại sau'
          break
        case 400:
        case 500:
          // Check if it's a validation error (Mongoose format)
          const rawError = error.data?.error || error.data?.message || error.message || ''
          if (rawError.includes('validation failed') || rawError.includes('Path `') || rawError.includes('is required')) {
            errorMessage = parseValidationError(rawError)
          } else if (status === 500) {
            errorMessage = 'Lỗi máy chủ, vui lòng thử lại sau'
          } else {
            // For 400, try to parse the error
            errorMessage = parseValidationError(rawError) || 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại'
          }
          break
        case 503:
        case 504:
          // Check if it's a timeout error
          if (error.message?.includes('timeout') || error.message?.includes('504') || 
              error.message?.includes('Gateway Timeout') || error.message?.includes('503')) {
            errorMessage = 'Upload video mất quá nhiều thời gian. Video có thể quá lớn hoặc quá trình xử lý (convert HLS) mất nhiều thời gian. Vui lòng thử lại với video nhỏ hơn hoặc đợi và thử lại sau.'
          } else {
            errorMessage = 'Dịch vụ tạm thời không khả dụng, vui lòng thử lại sau'
          }
          break
      }
    }
    
    // Ẩn các message dạng mã lỗi kỹ thuật kiểu: [POST] "/api/...": 500, FetchError,...
    const technicalPatterns = [
      /\[[A-Z]+\]\s+"\/api[^"]*":\s*\d{3}/,
      /FetchError/i,
      /\/api\/[a-z0-9/_-]+/i,
    ]

    if (technicalPatterns.some((re) => re.test(errorMessage))) {
      // Nếu đã có errorMessage thân thiện theo status code ở trên thì giữ,
      // còn nếu vẫn là chuỗi kỹ thuật thì thay bằng message chung dễ hiểu.
      errorMessage = options.errorMessage ||
        'Hệ thống đang gặp sự cố khi xử lý yêu cầu. Vui lòng thử lại sau hoặc liên hệ quản trị viên.'
    }

    // Handle FetchError with status code
    if (error.name === 'FetchError' || error.name === 'FetchError') {
      // Check for timeout
      if (error.message?.includes('timeout') || error.message?.includes('504') || error.message?.includes('503')) {
        errorMessage = 'Upload video mất quá nhiều thời gian. Video có thể quá lớn hoặc quá trình xử lý (convert HLS) mất nhiều thời gian. Vui lòng thử lại với video nhỏ hơn hoặc đợi và thử lại sau.'
      }
      // Check for 413
      if (error.message?.includes('413') || error.message?.includes('Request Entity Too Large')) {
        errorMessage = 'File quá lớn! Kích thước file không được vượt quá 5GB. Vui lòng chọn file nhỏ hơn.'
      }
    }

    // Show error message if enabled
    if (options.showError !== false) {
      antMessage.error(options.errorMessage || errorMessage)
    }

    return {
      status: false,
      message: errorMessage,
      error
    }
  }

  /**
   * Build full URL from baseURL and path
   */
  const buildUrl = (url: string): string => {
    // If URL is already absolute, use it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    
    // If baseURL is empty, use URL as is (for relative paths with Nuxt proxy)
    if (!baseURL) {
      return url
    }
    
    // Combine baseURL and url
    const base = baseURL.replace(/\/+$/, '')
    const path = url.startsWith('/') ? url : `/${url}`
    return `${base}${path}`
  }

  /**
   * GET request
   */
  const get = async <T = any>(
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const fetchOptions = createFetchOptions(options)
      const fullUrl = buildUrl(url)
      
      const response = await $fetch<T>(fullUrl, {
        method: 'GET',
        params: options.params,
        headers: fetchOptions.headers,
        timeout: fetchOptions.timeout
      } as any)

      return {
        status: true,
        data: response
      }
    } catch (error: any) {
      return handleError(error, options)
    }
  }

  /**
   * POST request
   */
  const post = async <T = any>(
    url: string,
    body?: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const fetchOptions = createFetchOptions(options)
      const fullUrl = buildUrl(url)
      
      const response = await $fetch<T>(fullUrl, {
        method: 'POST',
        body,
        params: options.params,
        headers: fetchOptions.headers,
        timeout: fetchOptions.timeout
      } as any)

      return {
        status: true,
        data: response
      }
    } catch (error: any) {
      return handleError(error, options)
    }
  }

  /**
   * PUT request
   */
  const put = async <T = any>(
    url: string,
    body?: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const fetchOptions = createFetchOptions(options)
      
      const response = await $fetch<T>(url, {
        method: 'PUT',
        body,
        params: options.params,
        ...fetchOptions
      })

      return {
        status: true,
        data: response
      }
    } catch (error: any) {
      return handleError(error, options)
    }
  }

  /**
   * PATCH request
   */
  const patch = async <T = any>(
    url: string,
    body?: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const fetchOptions = createFetchOptions(options)
      const fullUrl = buildUrl(url)
      
      const response = await $fetch<T>(fullUrl, {
        method: 'PATCH',
        body,
        params: options.params,
        headers: fetchOptions.headers,
        timeout: fetchOptions.timeout
      } as any)

      return {
        status: true,
        data: response
      }
    } catch (error: any) {
      return handleError(error, options)
    }
  }

  /**
   * DELETE request
   */
  const del = async <T = any>(
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const fetchOptions = createFetchOptions(options)
      const fullUrl = buildUrl(url)
      
      const response = await $fetch<T>(fullUrl, {
        method: 'DELETE',
        params: options.params,
        headers: fetchOptions.headers,
        timeout: fetchOptions.timeout
      } as any)

      return {
        status: true,
        data: response
      }
    } catch (error: any) {
      return handleError(error, options)
    }
  }

  /**
   * Upload file(s)
   */
  const upload = async (
    url: string,
    formData: FormData,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse> => {
    try {
      const headers: Record<string, string> = {
        ...options.headers
      }

      // Add auth token
      if (authStore.token) {
        headers['Authorization'] = `Bearer ${authStore.token}`
      }

      // Don't set Content-Type for FormData (browser will set it with boundary)
      const fullUrl = buildUrl(url)
      const response = await $fetch(fullUrl, {
        method: 'POST',
        body: formData,
        headers,
        timeout: options.timeout || 60000, // 60s for uploads
      })

      return {
        status: true,
        data: response
      }
    } catch (error: any) {
      return handleError(error, options)
    }
  }

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    baseURL
  }
}

