/**
 * Enhanced Error Handling Types
 * Centralized error management with Vietnamese messages
 */

// ===== ERROR CODES =====
export enum AuthErrorCode {
  // Authentication Errors (400-499)
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_EXISTS = 'EMAIL_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_OTP = 'INVALID_OTP',
  OTP_EXPIRED = 'OTP_EXPIRED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  PASSWORD_MISMATCH = 'PASSWORD_MISMATCH',
  
  // Network Errors (500-599)
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Validation Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  INVALID_PHONE_FORMAT = 'INVALID_PHONE_FORMAT',
  
  // Rate Limiting
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// ===== VIETNAMESE ERROR MESSAGES =====
export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  // Authentication
  [AuthErrorCode.INVALID_CREDENTIALS]: 'Tên đăng nhập hoặc mật khẩu không chính xác',
  [AuthErrorCode.EMAIL_EXISTS]: 'Email này đã được sử dụng',
  [AuthErrorCode.USER_NOT_FOUND]: 'Không tìm thấy người dùng',
  [AuthErrorCode.INVALID_TOKEN]: 'Phiên đăng nhập không hợp lệ',
  [AuthErrorCode.TOKEN_EXPIRED]: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại',
  [AuthErrorCode.INVALID_OTP]: 'Mã xác thực không chính xác',
  [AuthErrorCode.OTP_EXPIRED]: 'Mã xác thực đã hết hạn',
  [AuthErrorCode.EMAIL_NOT_VERIFIED]: 'Email chưa được xác thực',
  [AuthErrorCode.ACCOUNT_DISABLED]: 'Tài khoản đã bị vô hiệu hóa',
  [AuthErrorCode.WEAK_PASSWORD]: 'Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn',
  [AuthErrorCode.PASSWORD_MISMATCH]: 'Mật khẩu không khớp',
  
  // Network
  [AuthErrorCode.NETWORK_ERROR]: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại',
  [AuthErrorCode.TIMEOUT_ERROR]: 'Yêu cầu quá thời gian chờ. Vui lòng thử lại',
  [AuthErrorCode.SERVER_ERROR]: 'Lỗi máy chủ. Vui lòng thử lại sau',
  [AuthErrorCode.SERVICE_UNAVAILABLE]: 'Dịch vụ tạm thời không khả dụng',
  
  // Validation
  [AuthErrorCode.VALIDATION_ERROR]: 'Dữ liệu không hợp lệ',
  [AuthErrorCode.MISSING_REQUIRED_FIELD]: 'Vui lòng điền đầy đủ thông tin bắt buộc',
  [AuthErrorCode.INVALID_EMAIL_FORMAT]: 'Định dạng email không hợp lệ',
  [AuthErrorCode.INVALID_PHONE_FORMAT]: 'Định dạng số điện thoại không hợp lệ',
  
  // Rate Limiting
  [AuthErrorCode.TOO_MANY_REQUESTS]: 'Bạn đã thử quá nhiều lần. Vui lòng đợi một chút',
  
  // Unknown
  [AuthErrorCode.UNKNOWN_ERROR]: 'Đã xảy ra lỗi không xác định'
}

// ===== CUSTOM ERROR CLASSES =====

/**
 * Base Authentication Error
 */
export class AuthError extends Error {
  code: AuthErrorCode
  statusCode: number
  originalError?: any

  constructor(code: AuthErrorCode, statusCode = 400, originalError?: any) {
    super(AUTH_ERROR_MESSAGES[code] || AUTH_ERROR_MESSAGES[AuthErrorCode.UNKNOWN_ERROR])
    this.name = 'AuthError'
    this.code = code
    this.statusCode = statusCode
    this.originalError = originalError
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode
    }
  }
}

/**
 * Network Error (timeout, connection failed, etc.)
 */
export class NetworkError extends AuthError {
  constructor(originalError?: any) {
    super(AuthErrorCode.NETWORK_ERROR, 0, originalError)
    this.name = 'NetworkError'
  }
}

/**
 * Timeout Error
 */
export class TimeoutError extends AuthError {
  constructor(originalError?: any) {
    super(AuthErrorCode.TIMEOUT_ERROR, 408, originalError)
    this.name = 'TimeoutError'
  }
}

/**
 * Validation Error
 */
export class ValidationError extends AuthError {
  fields?: string[]

  constructor(message?: string, fields?: string[]) {
    super(AuthErrorCode.VALIDATION_ERROR, 422)
    this.name = 'ValidationError'
    if (message) {
      this.message = message
    }
    this.fields = fields
  }
}

// ===== ERROR DETECTION HELPERS =====

/**
 * Map HTTP status code to AuthErrorCode
 */
export function mapHttpStatusToErrorCode(status: number): AuthErrorCode {
  switch (status) {
    case 400:
      return AuthErrorCode.VALIDATION_ERROR
    case 401:
      return AuthErrorCode.INVALID_CREDENTIALS
    case 403:
      return AuthErrorCode.ACCOUNT_DISABLED
    case 404:
      return AuthErrorCode.USER_NOT_FOUND
    case 408:
      return AuthErrorCode.TIMEOUT_ERROR
    case 422:
      return AuthErrorCode.VALIDATION_ERROR
    case 429:
      return AuthErrorCode.TOO_MANY_REQUESTS
    case 500:
    case 502:
    case 503:
      return AuthErrorCode.SERVER_ERROR
    case 504:
      return AuthErrorCode.TIMEOUT_ERROR
    default:
      return AuthErrorCode.UNKNOWN_ERROR
  }
}

/**
 * Detect error type from error object
 */
export function detectErrorType(error: any): AuthErrorCode {
  // Check if already AuthError
  if (error instanceof AuthError) {
    return error.code
  }

  // Check for network errors
  if (error.message?.includes('fetch failed') || error.message?.includes('Network')) {
    return AuthErrorCode.NETWORK_ERROR
  }

  // Check for timeout
  if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
    return AuthErrorCode.TIMEOUT_ERROR
  }

  // Check HTTP status
  if (error.statusCode || error.status) {
    const status = error.statusCode || error.status
    return mapHttpStatusToErrorCode(status)
  }

  // Check error message keywords
  const message = error.message?.toLowerCase() || ''
  
  if (message.includes('password') && message.includes('incorrect')) {
    return AuthErrorCode.INVALID_CREDENTIALS
  }
  if (message.includes('email') && message.includes('exists')) {
    return AuthErrorCode.EMAIL_EXISTS
  }
  if (message.includes('not found')) {
    return AuthErrorCode.USER_NOT_FOUND
  }
  if (message.includes('token') && message.includes('expired')) {
    return AuthErrorCode.TOKEN_EXPIRED
  }
  if (message.includes('otp') && message.includes('invalid')) {
    return AuthErrorCode.INVALID_OTP
  }

  return AuthErrorCode.UNKNOWN_ERROR
}

/**
 * Create user-friendly error message
 */
export function createErrorMessage(error: any): string {
  const errorCode = detectErrorType(error)
  return AUTH_ERROR_MESSAGES[errorCode]
}

/**
 * Check if error is retryable (network, timeout, server errors)
 */
export function isRetryableError(error: any): boolean {
  const code = detectErrorType(error)
  return [
    AuthErrorCode.NETWORK_ERROR,
    AuthErrorCode.TIMEOUT_ERROR,
    AuthErrorCode.SERVER_ERROR,
    AuthErrorCode.SERVICE_UNAVAILABLE
  ].includes(code)
}

