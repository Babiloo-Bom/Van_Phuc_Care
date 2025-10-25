/**
 * Registration Composable
 * Handles user registration with validation and error handling
 */

// ===== TYPES (Inline to avoid import issues) =====
interface RegisterRequest {
  email: string
  password: string
  repeat_password: string
  fullname?: string
  phone?: string
  domain?: string
  origin?: string
}

interface RegisterResponse {
  status: boolean
  user?: {
    id: string
    email: string
    fullname?: string
    phone?: string
    verified: boolean
    status: string
  }
  message?: string
}

// ===== VALIDATION RULES =====
const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email không hợp lệ'
  },
  password: {
    minLength: 6,
    message: 'Mật khẩu phải có ít nhất 6 ký tự'
  },
  phone: {
    pattern: /^(0|\+84)[0-9]{9,10}$/,
    message: 'Số điện thoại không hợp lệ'
  },
  fullname: {
    minLength: 2,
    message: 'Họ tên phải có ít nhất 2 ký tự'
  }
}

// ===== ERROR MESSAGES =====
const ERROR_MESSAGES = {
  EMAIL_EXISTS: 'Email này đã được sử dụng. Vui lòng sử dụng email khác',
  WEAK_PASSWORD: 'Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn',
  INVALID_EMAIL: 'Địa chỉ email không hợp lệ',
  INVALID_PHONE: 'Số điện thoại không hợp lệ',
  PASSWORD_MISMATCH: 'Mật khẩu nhập lại không khớp',
  MISSING_FIELDS: 'Vui lòng điền đầy đủ thông tin bắt buộc',
  INVALID_OTP: 'Mã xác thực không chính xác',
  OTP_EXPIRED: 'Mã xác thực đã hết hạn. Vui lòng đăng ký lại',
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau',
  UNKNOWN_ERROR: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại'
}

export const useRegister = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  // State
  const isRegistering = ref(false)
  const isVerifying = ref(false)
  const registrationStep = ref<'register' | 'verify' | 'complete'>('register')
  const registeredEmail = ref('')
  const registeredPassword = ref('')

  /**
   * Validate email format
   */
  const validateEmail = (email: string): { valid: boolean; error?: string } => {
    if (!email) {
      return { valid: false, error: 'Email là bắt buộc' }
    }
    if (!VALIDATION_RULES.email.pattern.test(email)) {
      return { valid: false, error: VALIDATION_RULES.email.message }
    }
    return { valid: true }
  }

  /**
   * Validate password strength
   */
  const validatePassword = (password: string): { valid: boolean; error?: string } => {
    if (!password) {
      return { valid: false, error: 'Mật khẩu là bắt buộc' }
    }
    if (password.length < VALIDATION_RULES.password.minLength) {
      return { valid: false, error: VALIDATION_RULES.password.message }
    }
    return { valid: true }
  }

  /**
   * Validate phone number
   */
  const validatePhone = (phone: string): { valid: boolean; error?: string } => {
    if (!phone) {
      return { valid: true } // Phone is optional
    }
    if (!VALIDATION_RULES.phone.pattern.test(phone)) {
      return { valid: false, error: VALIDATION_RULES.phone.message }
    }
    return { valid: true }
  }

  /**
   * Validate fullname
   */
  const validateFullname = (fullname: string): { valid: boolean; error?: string } => {
    if (!fullname) {
      return { valid: false, error: 'Họ tên là bắt buộc' }
    }
    if (fullname.length < VALIDATION_RULES.fullname.minLength) {
      return { valid: false, error: VALIDATION_RULES.fullname.message }
    }
    return { valid: true }
  }

  /**
   * Validate password match
   */
  const validatePasswordMatch = (password: string, repeatPassword: string): { valid: boolean; error?: string } => {
    if (password !== repeatPassword) {
      return { valid: false, error: ERROR_MESSAGES.PASSWORD_MISMATCH }
    }
    return { valid: true }
  }

  /**
   * Validate all registration data
   */
  const validateRegistrationData = (data: RegisterRequest): { valid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {}

    // Validate email
    const emailValidation = validateEmail(data.email)
    if (!emailValidation.valid) {
      errors.email = emailValidation.error!
    }

    // Validate password
    const passwordValidation = validatePassword(data.password)
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.error!
    }

    // Validate password match
    const passwordMatchValidation = validatePasswordMatch(data.password, data.repeat_password)
    if (!passwordMatchValidation.valid) {
      errors.repeat_password = passwordMatchValidation.error!
    }

    // Validate fullname (if provided)
    if (data.fullname) {
      const fullnameValidation = validateFullname(data.fullname)
      if (!fullnameValidation.valid) {
        errors.fullname = fullnameValidation.error!
      }
    }

    // Validate phone (if provided)
    if (data.phone) {
      const phoneValidation = validatePhone(data.phone)
      if (!phoneValidation.valid) {
        errors.phone = phoneValidation.error!
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * Register new user
   */
  const register = async (data: RegisterRequest): Promise<{
    success: boolean
    error?: string
    errors?: Record<string, string>
  }> => {
    // Validate data
    const validation = validateRegistrationData(data)
    if (!validation.valid) {
      return {
        success: false,
        error: 'Vui lòng kiểm tra lại thông tin đăng ký',
        errors: validation.errors
      }
    }

    isRegistering.value = true

    try {
      // Call register API through auth store
      const result = await authStore.register(data.email, data.password, data.repeat_password)

      if (result.success) {
        // Save email and password for later use
        registeredEmail.value = data.email
        registeredPassword.value = data.password
        registrationStep.value = 'verify'

        return { success: true }
      } else {
        // Map error message
        let errorMessage = result.error || ERROR_MESSAGES.UNKNOWN_ERROR

        // Check for specific error codes
        if (errorMessage.includes('đã được sử dụng') || errorMessage.includes('already exists')) {
          errorMessage = ERROR_MESSAGES.EMAIL_EXISTS
        } else if (errorMessage.includes('password') && errorMessage.includes('weak')) {
          errorMessage = ERROR_MESSAGES.WEAK_PASSWORD
        }

        return {
          success: false,
          error: errorMessage
        }
      }
    } catch (error: any) {
      // Handle AbortError
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return {
          success: false,
          error: 'Yêu cầu đã bị hủy'
        }
      }

      // Handle network errors
      if (error?.message?.includes('fetch failed') || error?.message?.includes('Network')) {
        return {
          success: false,
          error: ERROR_MESSAGES.NETWORK_ERROR
        }
      }

      return {
        success: false,
        error: ERROR_MESSAGES.SERVER_ERROR
      }
    } finally {
      isRegistering.value = false
    }
  }

  /**
   * Verify email with OTP
   */
  const verifyEmail = async (otp: string): Promise<{
    success: boolean
    error?: string
  }> => {
    if (!registeredEmail.value) {
      return {
        success: false,
        error: 'Email chưa được đăng ký'
      }
    }

    if (!otp || otp.length !== 6) {
      return {
        success: false,
        error: 'Mã OTP phải có 6 chữ số'
      }
    }

    isVerifying.value = true

    try {
      const result = await authStore.verifyEmail(registeredEmail.value, otp)

      if (result.success) {
        registrationStep.value = 'complete'
        
        // Auto login after verification
        if (registeredPassword.value) {
          await completeRegistration()
        }
        
        return { success: true }
      } else {
        let errorMessage = result.error || ERROR_MESSAGES.INVALID_OTP

        // Map specific error messages
        if (errorMessage.includes('expired') || errorMessage.includes('hết hạn')) {
          errorMessage = ERROR_MESSAGES.OTP_EXPIRED
        } else if (errorMessage.includes('incorrect') || errorMessage.includes('không chính xác')) {
          errorMessage = ERROR_MESSAGES.INVALID_OTP
        }

        return {
          success: false,
          error: errorMessage
        }
      }
    } catch (error: any) {
      // Handle AbortError
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return {
          success: false,
          error: 'Yêu cầu đã bị hủy'
        }
      }

      return {
        success: false,
        error: ERROR_MESSAGES.SERVER_ERROR
      }
    } finally {
      isVerifying.value = false
    }
  }

  /**
   * Complete registration and auto-login
   */
  const completeRegistration = async (): Promise<{
    success: boolean
    error?: string
  }> => {
    if (!registeredEmail.value || !registeredPassword.value) {
      return {
        success: false,
        error: 'Email hoặc mật khẩu chưa được xác thực'
      }
    }

    try {
      // Auto login after successful verification
      const result = await authStore.loginAfterRegister(registeredEmail.value, registeredPassword.value)

      if (result.success) {
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/')
        }, 1500)
        return { success: true }
      } else {
        return {
          success: false,
          error: result.error || 'Đăng nhập thất bại sau khi đăng ký'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: 'Đăng nhập thất bại sau khi đăng ký'
      }
    }
  }

  /**
   * Reset registration flow
   */
  const resetRegistration = () => {
    registrationStep.value = 'register'
    registeredEmail.value = ''
    registeredPassword.value = ''
    isRegistering.value = false
    isVerifying.value = false
  }

  return {
    // State
    isRegistering: readonly(isRegistering),
    isVerifying: readonly(isVerifying),
    registrationStep: readonly(registrationStep),
    registeredEmail: readonly(registeredEmail),

    // Validation methods
    validateEmail,
    validatePassword,
    validatePhone,
    validateFullname,
    validatePasswordMatch,
    validateRegistrationData,

    // Registration methods
    register,
    verifyEmail,
    completeRegistration,
    resetRegistration
  }
}

