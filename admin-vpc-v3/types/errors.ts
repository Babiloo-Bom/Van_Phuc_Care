/**
 * Enhanced Error Handling System
 * Centralized error types, codes, and Vietnamese messages
 */

// ===== ERROR CODES =====
export enum AuthErrorCode {
  // Network & Connection
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  CONNECTION_REFUSED = 'CONNECTION_REFUSED',
  
  // Authentication
  BAD_AUTHENTICATION = 215,
  UNAUTHORIZED = 403,
  INVALID_PASSWORD = 425,
  INVALID_OTP = 426,
  ACCOUNT_EXISTS = 400,
  INVALID_PARAMETER = 415,
  
  // Server Errors
  INTERNAL_ERROR = 131,
  NO_DATA = 8,
  FAIL_VALIDATION = 120,
  
  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// ===== VIETNAMESE ERROR MESSAGES =====
export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode | number, string> = {
  // Network errors
  [AuthErrorCode.NETWORK_ERROR]: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại',
  [AuthErrorCode.TIMEOUT]: 'Kết nối quá lâu. Vui lòng thử lại',
  [AuthErrorCode.CONNECTION_REFUSED]: 'Không thể kết nối đến server. Vui lòng thử lại sau',
  
  // Authentication errors
  [AuthErrorCode.BAD_AUTHENTICATION]: 'Tên đăng nhập hoặc mật khẩu không đúng',
  [AuthErrorCode.UNAUTHORIZED]: 'Bạn không có quyền truy cập. Vui lòng đăng nhập lại',
  [AuthErrorCode.INVALID_PASSWORD]: 'Mật khẩu không đúng',
  [AuthErrorCode.INVALID_OTP]: 'Mã OTP không đúng hoặc đã hết hạn',
  [AuthErrorCode.ACCOUNT_EXISTS]: 'Tài khoản đã tồn tại',
  [AuthErrorCode.INVALID_PARAMETER]: 'Thông tin không hợp lệ',
  
  // Server errors
  [AuthErrorCode.INTERNAL_ERROR]: 'Lỗi hệ thống. Vui lòng thử lại sau',
  [AuthErrorCode.NO_DATA]: 'Không tìm thấy dữ liệu',
  [AuthErrorCode.FAIL_VALIDATION]: 'Dữ liệu không hợp lệ',
  
  // Unknown
  [AuthErrorCode.UNKNOWN_ERROR]: 'Đã có lỗi xảy ra. Vui lòng thử lại'
}

// ===== ERROR CLASSES =====
export class AuthError extends Error {
  public readonly code: AuthErrorCode | number
  public readonly originalError?: Error
  public readonly retryable: boolean

  constructor(
    code: AuthErrorCode | number,
    message?: string,
    originalError?: Error,
    retryable: boolean = false
  ) {
    const errorMessage = message || AUTH_ERROR_MESSAGES[code] || AUTH_ERROR_MESSAGES[AuthErrorCode.UNKNOWN_ERROR]
    super(errorMessage)
    
    this.name = 'AuthError'
    this.code = code
    this.originalError = originalError
    this.retryable = retryable
  }
}

export class NetworkError extends AuthError {
  constructor(message?: string, originalError?: Error) {
    super(AuthErrorCode.NETWORK_ERROR, message, originalError, true)
    this.name = 'NetworkError'
  }
}

export class TimeoutError extends AuthError {
  constructor(message?: string, originalError?: Error) {
    super(AuthErrorCode.TIMEOUT, message, originalError, true)
    this.name = 'TimeoutError'
  }
}

export class ValidationError extends AuthError {
  constructor(message?: string, originalError?: Error) {
    super(AuthErrorCode.FAIL_VALIDATION, message, originalError, false)
    this.name = 'ValidationError'
  }
}

// ===== ERROR UTILITIES =====
export const isRetryableError = (error: any): boolean => {
  if (error instanceof AuthError) {
    return error.retryable
  }
  
  // Network errors are usually retryable
  if (error?.code === 'ECONNREFUSED' || 
      error?.code === 'ENOTFOUND' || 
      error?.code === 'ETIMEDOUT') {
    return true
  }
  
  // HTTP status codes that are retryable
  if (error?.status >= 500 || error?.status === 429) {
    return true
  }
  
  return false
}

export const getErrorMessage = (error: any): string => {
  if (error instanceof AuthError) {
    return error.message
  }
  
  if (error?.code && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code]
  }
  
  if (error?.message) {
    return error.message
  }
  
  return AUTH_ERROR_MESSAGES[AuthErrorCode.UNKNOWN_ERROR]
}

export const getErrorCode = (error: any): AuthErrorCode | number => {
  if (error instanceof AuthError) {
    return error.code
  }
  
  if (error?.code && AUTH_ERROR_MESSAGES[error.code]) {
    return error.code
  }
  
  return AuthErrorCode.UNKNOWN_ERROR
}
