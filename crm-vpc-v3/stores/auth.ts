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
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  rememberAccount: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
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

        // Backend returns: { accessToken, tokenExpireAt }
        const token = response.accessToken || response.token

        if (!token) {
          throw new Error('No token received from server')
        }

        // Save token and basic user info
        this.token = token
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
    async register(email: string, password: string, repeatPassword: string) {
      this.isLoading = true
      
      try {
        if (password !== repeatPassword) {
          throw new Error('Mật khẩu không khớp')
        }

        const authApi = useAuthApi()
        
        // Call API register
        const response: any = await authApi.register(email, password, repeatPassword)

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
     * Verify email with OTP (after registration)
     * Migrated from crm-vpc/components/auth/forms/SignUp.vue
     */
    async verifyEmail(email: string, otp: string) {
      this.isLoading = true
      
      try {
        const authApi = useAuthApi()
        
        // Verify OTP
        await authApi.verifyEmail(email, otp)

        return { success: true }
      } catch (error: any) {
        console.error('Verify email error:', error)
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Mã xác thực không chính xác!'
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
      return await this.login(email, password, false)
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
        const userStr = localStorage.getItem('user')
        const authDataStr = localStorage.getItem('auth_data')

        if (token && userStr) {
          try {
            this.token = token
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
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
            localStorage.removeItem('auth_data')
          }
        }
      }
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
    }
  }
})

