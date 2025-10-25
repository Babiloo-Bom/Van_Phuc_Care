import { defineStore } from 'pinia'

export interface User {
  id: string | number
  email: string
  fullname?: string
  name?: string
  username?: string
  phone?: string
  role?: string
  avatar?: string
  verified?: boolean
  status?: string
  provider?: string
  googleId?: string
  isActive?: boolean
  permissions?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  tokenExpireAt: string | null
  isAuthenticated: boolean
  isLoading: boolean
  rememberAccount: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    tokenExpireAt: null,
    isAuthenticated: false,
    isLoading: false,
    rememberAccount: false
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    userRole: (state) => state.user?.role || 'guest',
    userName: (state) => state.user?.fullname || state.user?.name || 'Unknown',
    userEmail: (state) => state.user?.email || ''
  },

  actions: {
    /**
     * Login user (Admin)
     * Migrated from admin-vpc/pages/login.vue
     */
    async login(username: string, password: string, remindAccount = false) {
      this.isLoading = true
      
      try {
        const authApi = useAuthApi()
        
        // Call API login
        const response: any = await authApi.login(username, password, remindAccount)

        // Backend returns: { data: { accessToken, tokenExpireAt } }
        const token = response.data?.accessToken || response.accessToken || response.token
        const tokenExpireAt = response.data?.tokenExpireAt || response.tokenExpireAt

        console.log('🔍 Login response:', { token: !!token, tokenExpireAt, responseData: response.data })

        if (!token) {
          throw new Error('No token received from server')
        }

        // Calculate token expiry time (default 7 days if not provided)
        this.token = token
        console.log('🔍 About to calculate expire time with:', tokenExpireAt, 'type:', typeof tokenExpireAt)
        this.tokenExpireAt = tokenExpireAt ? this.calculateExpireTime(tokenExpireAt) : this.calculateExpireTime('7d')
        console.log('🔍 Calculated tokenExpireAt:', this.tokenExpireAt)
        this.isAuthenticated = true
        this.rememberAccount = remindAccount
        
        // Create basic user object (will be enhanced later if needed)
        this.user = { 
          id: response.id || 'temp-id',
          email: username,
          username: username,
          fullname: response.fullname || username
        }

        // Save to localStorage
        if (process.client) {
          localStorage.setItem('auth_token', token)
          localStorage.setItem('token_expire_at', this.tokenExpireAt || '')
          localStorage.setItem('user', JSON.stringify(this.user))
          
          if (remindAccount) {
            localStorage.setItem('auth_data', JSON.stringify({
              username,
              remindAccount,
              origin: 'vanphuccare.gensi.vn'
            }))
          }
        }

        return { success: true, user: this.user, token }
      } catch (error: any) {
        // Ignore AbortError (request cancelled due to navigation/reload)
        if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
          console.log('[Auth] Login cancelled (navigation/reload)')
          return { success: false, error: 'Request cancelled' }
        }
        console.error('Login error:', error)
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Tên đăng nhập hoặc mật khẩu không chính xác'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Register new account (CRM/E-Learning)
     * Migrated from crm-vpc/components/auth/forms/SignUp.vue
     */
    async register(email: string, password: string, repeatPassword: string, fullname?: string) {
      this.isLoading = true
      
      try {
        if (password !== repeatPassword) {
          throw new Error('Mật khẩu không khớp')
        }

        const authApi = useAuthApi()
        
        // Call API register
        const response: any = await authApi.register(email, password, repeatPassword, fullname)

        return { success: true, data: response }
      } catch (error: any) {
        console.error('Register error:', error)
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Email đã được sử dụng, vui lòng nhập email khác!'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Login after email verification
     * Auto login user after successful registration
     */
    async loginAfterRegister(email: string, password: string) {
      console.log('🔍 authStore.loginAfterRegister called with email:', email)
      const result = await this.login(email, password, false)
      console.log('🔍 authStore.loginAfterRegister result:', result)
      return result
    },

    /**
     * Forgot password - Send OTP
     * Migrated from admin-vpc/components/auth/forms/GetOtp.vue
     */
    async forgotPassword(email: string) {
      this.isLoading = true
      
      try {
        const authApi = useAuthApi()
        
        await authApi.forgotPassword(email)

        return { success: true }
      } catch (error: any) {
        console.error('Forgot password error:', error)
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Gửi OTP thất bại'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Verify OTP for password reset
     */
    async verifyOtpForPassword(email: string, otp: string) {
      this.isLoading = true
      
      try {
        const authApi = useAuthApi()
        
        const response: any = await authApi.verifyOtp(email, otp)

        return { success: true, token: response.data?.token }
      } catch (error: any) {
        console.error('Verify OTP error:', error)
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Mã OTP không chính xác'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Reset password with token
     * Migrated from admin-vpc/components/auth/forms/NewPassword.vue
     */
    async resetPassword(email: string, token: string, newPassword: string) {
      this.isLoading = true
      
      try {
        const authApi = useAuthApi()
        
        await authApi.resetPassword(email, token, newPassword)

        return { success: true }
      } catch (error: any) {
        console.error('Reset password error:', error)
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Đổi mật khẩu thất bại'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Verify email with OTP
     * For user registration verification
     */
    async verifyEmail(email: string, otp: string) {
      this.isLoading = true
      
      try {
        const authApi = useAuthApi()
        
        const response: any = await authApi.verifyEmail(email, otp)
        console.log('🔍 authStore.verifyEmail response:', response)

        return { success: true, data: response.data }
      } catch (error: any) {
        console.error('🔍 authStore.verifyEmail error:', error)
        console.error('🔍 error.data:', error.data)
        console.error('🔍 error.message:', error.message)
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Xác thực email thất bại'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Change password (logged in user)
     * Migrated from admin-vpc/components/auth/dialogs/UpdatePassword.vue
     */
    async changePassword(oldPassword: string, newPassword: string) {
      this.isLoading = true
      
      try {
        const authApi = useAuthApi()
        
        await authApi.changePassword(oldPassword, newPassword)

        // Logout after password change
        await this.logout()

        return { success: true }
      } catch (error: any) {
        console.error('Change password error:', error)
        
        // Check for specific error code
        if (error.status === 425 || error.data?.error?.code === 425) {
          return {
            success: false,
            error: 'Mật khẩu cũ không chính xác'
          }
        }
        
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Đổi mật khẩu thất bại'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Logout user
     * Migrated from admin-vpc/api/auth.js
     */
    async logout() {
      this.isLoading = true

      try {
        // Call logout API to clear server session
        const authApi = useAuthApi()
        await authApi.logout().catch(() => {
          // Ignore logout API errors
        })

        // Clear state
        this.user = null
        this.token = null
        this.isAuthenticated = false
        this.rememberAccount = false

        // Clear localStorage
        if (process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          
          // Keep auth_data if rememberAccount was true
          if (!this.rememberAccount) {
            localStorage.removeItem('auth_data')
          }
        }

        // Redirect to login
        navigateTo('/login')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Check and restore session from localStorage
     * Migrated from @nuxtjs/auth-next behavior
     */
    initAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const tokenExpireAt = localStorage.getItem('token_expire_at')
        const userStr = localStorage.getItem('user')
        const authDataStr = localStorage.getItem('auth_data')

        if (token && userStr) {
          try {
            // Check if token is expired
            if (tokenExpireAt) {
              const expireTime = new Date(tokenExpireAt).getTime()
              const now = Date.now()
              
              if (now >= expireTime) {
                // Token expired, clear data
                this.logout()
                return
              }
            }

            this.token = token
            this.tokenExpireAt = tokenExpireAt
            this.user = JSON.parse(userStr)
            this.isAuthenticated = true

            // Check for remember account
            if (authDataStr) {
              const authData = JSON.parse(authDataStr)
              this.rememberAccount = authData.remindAccount || false
            }
          } catch (error) {
            console.error('Init auth error:', error)
            // Clear corrupted data
            this.logout()
          }
        }
      }
    },

    /**
     * Calculate token expiry time from TTL string (e.g., '7d', '24h', '1y')
     */
    calculateExpireTime(ttl: string | Date | number): string {
      console.log('🔍 calculateExpireTime called with:', ttl, 'type:', typeof ttl)
      const now = new Date()
      
      // If ttl is already a Date object, return it
      if (ttl instanceof Date) {
        console.log('🔍 ttl is Date object')
        return ttl.toISOString()
      }
      
      // If ttl is a number (timestamp), convert to Date
      if (typeof ttl === 'number') {
        console.log('🔍 ttl is number')
        return new Date(ttl).toISOString()
      }
      
      // If ttl is a string, parse it
      if (typeof ttl !== 'string') {
        console.log('🔍 ttl is not string, using default')
        // Default to 7 days if format is invalid
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      // Parse TTL string (e.g., '7d' = 7 days, '24h' = 24 hours)
      const match = ttl.match(/^(\d+)([smhdy])$/)
      
      if (!match) {
        // Default to 7 days if format is invalid
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }

      const [, value, unit] = match
      const amount = parseInt(value)
      
      let milliseconds = 0
      switch (unit) {
        case 's': // seconds
          milliseconds = amount * 1000
          break
        case 'm': // minutes
          milliseconds = amount * 60 * 1000
          break
        case 'h': // hours
          milliseconds = amount * 60 * 60 * 1000
          break
        case 'd': // days
          milliseconds = amount * 24 * 60 * 60 * 1000
          break
        case 'y': // years
          milliseconds = amount * 365 * 24 * 60 * 60 * 1000
          break
        default:
          milliseconds = 7 * 24 * 60 * 60 * 1000 // default 7 days
      }

      return new Date(now.getTime() + milliseconds).toISOString()
    },

    /**
     * Update user profile
     * Migrated from admin-vpc/api/auth.js
     */
    async updateProfile(userData: Partial<User>) {
      this.isLoading = true
      
      try {
        const authApi = useAuthApi()
        
        const response: any = await authApi.updateProfile(userData)

        // Update local user data
        if (this.user) {
          this.user = { ...this.user, ...response.user }
          
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(this.user))
          }
        }

        return { success: true, user: response.user }
      } catch (error: any) {
        console.error('Update profile error:', error)
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Cập nhật thông tin thất bại'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Set token and expiry time
     * For Google OAuth and other external auth flows
     */
    async setToken(accessToken: string, tokenExpireAt: string | number) {
      this.token = accessToken
      this.tokenExpireAt = typeof tokenExpireAt === 'number' 
        ? new Date(tokenExpireAt).toISOString()
        : tokenExpireAt
      this.isAuthenticated = true

      // Save to localStorage
      if (process.client) {
        localStorage.setItem('auth_token', accessToken)
        localStorage.setItem('token_expire_at', this.tokenExpireAt || '')
      }
    },

    /**
     * Set user data
     * For Google OAuth and other external auth flows
     */
    async setUser(userData: User) {
      this.user = userData
      this.isAuthenticated = true

      // Save to localStorage
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(userData))
      }
    },

    /**
     * Complete Google OAuth login
     * Combines setToken and setUser
     */
    async completeGoogleLogin(accessToken: string, tokenExpireAt: string | number, userData: User) {
      await this.setToken(accessToken, tokenExpireAt)
      await this.setUser(userData)
      
      return { success: true, user: userData, token: accessToken }
    }
  }
})

