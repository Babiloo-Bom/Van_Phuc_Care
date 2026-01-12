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
  fullAddress?: string
  address?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  tokenExpireAt: string | null
  isAuthenticated: boolean
  isLoading: boolean
  rememberAccount: boolean
  justLoggedIn: boolean // Flag to disable auto-logout immediately after login
  loginTimestamp: number | null // Timestamp of last login
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    tokenExpireAt: null,
    isAuthenticated: false,
    isLoading: false,
    rememberAccount: false,
    justLoggedIn: false,
    loginTimestamp: null,
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
     * Only allows admin, manager, worker roles
     */
    async login(username: string, password: string, remindAccount = false) {
      this.isLoading = true

      try {
        const authApi = useAuthApi()

        // Call API login
        const response: any = await authApi.login(
          username,
          password,
          remindAccount,
        )

        console.log('🔍 Login response (full):', JSON.stringify(response, null, 2))
        console.log('🔍 Response type:', typeof response)
        console.log('🔍 Response keys:', response ? Object.keys(response) : 'null/undefined')
        console.log('🔍 Response structure check:', {
          hasData: !!response?.data,
          hasAccessToken: !!response?.data?.accessToken,
          hasDirectAccessToken: !!response?.accessToken,
          hasToken: !!response?.token,
          responseDataKeys: response?.data ? Object.keys(response.data) : [],
          fullResponse: response
        })

        // Backend returns: { message: "", data: { accessToken, tokenExpireAt } }
        // $fetch may unwrap response, so check multiple structures
        let token: string | undefined
        let tokenExpireAt: any

        // Try different response structures
        if (response?.data?.accessToken) {
          // Structure: { message: "", data: { accessToken, tokenExpireAt } }
          token = response.data.accessToken
          tokenExpireAt = response.data.tokenExpireAt
          console.log('✅ Found token in response.data.accessToken')
        } else if (response?.data?.data?.accessToken) {
          // Structure: { message: "", data: { data: { accessToken, tokenExpireAt } } }
          token = response.data.data.accessToken
          tokenExpireAt = response.data.data.tokenExpireAt
          console.log('✅ Found token in response.data.data.accessToken')
        } else if (response?.accessToken) {
          // Structure: { accessToken, tokenExpireAt } (unwrapped)
          token = response.accessToken
          tokenExpireAt = response.tokenExpireAt
          console.log('✅ Found token in response.accessToken (unwrapped)')
        } else if (response?.token) {
          // Structure: { token, tokenExpireAt }
          token = response.token
          tokenExpireAt = response.tokenExpireAt
          console.log('✅ Found token in response.token')
        } else if (response?.data?.token) {
          // Structure: { message: "", data: { token, tokenExpireAt } }
          token = response.data.token
          tokenExpireAt = response.data.tokenExpireAt
          console.log('✅ Found token in response.data.token')
        }

        console.log('🔍 Extracted values:', { 
          hasToken: !!token, 
          tokenLength: token?.length,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
          tokenExpireAt: tokenExpireAt 
        })

        if (!token) {
          console.error('❌ No token found in response. Full response:', response)
          console.error('❌ Response stringified:', JSON.stringify(response, null, 2))
          throw new Error('No token received from server')
        }

        // Calculate token expiry time (default 7 days if not provided)
        this.token = token
        this.tokenExpireAt = tokenExpireAt
          ? this.calculateExpireTime(tokenExpireAt)
          : this.calculateExpireTime('7d')
        this.isAuthenticated = true
        this.rememberAccount = remindAccount

        // Save token to localStorage immediately (needed for API calls)
        if (process.client) {
          localStorage.setItem('auth_token', token)
          if (this.tokenExpireAt) {
            localStorage.setItem('token_expire_at', this.tokenExpireAt)
          }
        }

        // Fetch full user profile data from API
        try {
          const profileResponse = (await authApi.getUserProfile()) as any
          const userData = profileResponse?.data?.user || profileResponse?.data?.data || profileResponse?.data?.admin || profileResponse?.data
          
          if (!userData) {
            throw new Error('Không thể lấy thông tin người dùng')
          }
          
          // Check if user has allowed role (admin, manager, worker)
          const userRole = userData?.role || userData?.type
          const allowedRoles = ['admin', 'manager', 'worker']
          
          if (!allowedRoles.includes(userRole)) {
            throw new Error('Bạn không có quyền truy cập vào hệ thống quản trị')
          }
          
          this.user = userData
          
          // Save user to localStorage
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(userData))
          }
          
          return { success: true, user: userData, token }
        } catch (profileError: any) {
          console.error('❌ Failed to fetch user profile:', profileError)
          // Even if profile fetch fails, login is still successful if we have token
          return { success: true, user: null, token, error: profileError.message }
        }
      } catch (error: any) {
        console.error('❌ Login error:', error)
        console.error('❌ Error stack:', error.stack)
        this.isLoading = false
        this.isAuthenticated = false
        this.token = null
        this.user = null
        
        // Clear localStorage on error
        if (process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('token_expire_at')
          localStorage.removeItem('user')
        }
        
        return {
          success: false,
          error: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Refresh user data from backend
     */
    async refreshUserData() {
      if (!this.user || !this.token) {
        return
      }

      try {
        const authApi = useAuthApi()
        const response = (await authApi.getUserProfile()) as any
        // getCurrentAdmin returns { data: { admin } }
        const userData = response?.data?.admin || response?.data?.user || response?.data?.data || response?.data

        if (userData) {
          // Check role before updating - if role becomes invalid, don't update
          const newRole = userData?.role || userData?.type
          const allowedRoles = ['admin', 'manager', 'worker']
          
          if (newRole && !allowedRoles.includes(newRole)) {
            console.warn('⚠️ Refreshed user data has invalid role:', newRole, '- keeping existing role')
            // Don't update role if it becomes invalid - just update other fields
            this.user = {
              ...this.user,
              id: userData?._id || userData?.id || this.user.id,
              email: userData?.email || this.user.email,
              username: userData?.username || userData?.email || this.user.username,
              fullname: userData?.fullname || userData?.name || this.user.fullname,
              name: userData?.name || userData?.fullname || this.user.name,
              phone: userData?.phoneNumber || userData?.phone || this.user.phone,
              avatar: userData?.avatar || this.user.avatar,
              verified: userData?.verified !== undefined ? userData?.verified : this.user.verified,
              status: userData?.status || this.user.status,
              fullAddress: userData?.fullAddress || this.user.fullAddress || '',
              address: userData?.address || this.user.address || '',
            }
          } else {
            // Update user data with fresh data from backend (same mapping as login)
            this.user = {
              id: userData?._id || userData?.id || this.user.id,
              email: userData?.email || this.user.email,
              username: userData?.username || userData?.email || this.user.username,
              fullname: userData?.fullname || userData?.name || this.user.fullname,
              name: userData?.name || userData?.fullname || this.user.name,
              phone: userData?.phoneNumber || userData?.phone || this.user.phone,
              avatar: userData?.avatar || this.user.avatar,
              role: newRole || this.user.role, // Use new role or keep existing
              verified: userData?.verified !== undefined ? userData?.verified : this.user.verified,
              status: userData?.status || this.user.status,
              fullAddress: userData?.fullAddress || this.user.fullAddress || '',
              address: userData?.address || this.user.address || '',
            }
          }
          this.saveAuth()
        }
      } catch (error) {
        // Don't throw error - just silently ignore it. This is a non-critical operation.
        // The session is still valid even if refresh fails.
        // Silently ignore 401 errors (user not logged in) and network errors
        const status = (error as any)?.statusCode || (error as any)?.status
        if (status && status !== 401 && status !== 0) {
          // Only re-throw for unexpected server errors (500, 403, etc.)
          throw error
        }
        // Silently ignore 401 and network errors (non-critical)
      }
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
     * Save current auth state to localStorage
     */
    saveAuth() {
      if (process.client && this.user && this.token) {
        try {
          const authData = {
            user: this.user,
            token: this.token,
            tokenExpireAt: this.tokenExpireAt,
            rememberAccount: this.rememberAccount,
            loginTimestamp: this.loginTimestamp,
          }
          localStorage.setItem('authData', JSON.stringify(authData))
        } catch (error) {
          console.error('❌ Error saving auth data:', error)
        }
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
     * @param showMessage Whether to show success message (default: true, set to false when called from initAuth)
     */
    async logout(showMessage = true) {
      console.log('[Auth] Logout called', { showMessage })
      this.isLoading = true

      try {
        // Call logout API to clear server session (ignore errors if endpoint doesn't exist)
        const authApi = useAuthApi()
        await authApi.logout().catch(() => {
          // Ignore logout API errors - endpoint may not exist
        })

        // Clear state
        this.user = null
        this.token = null
        this.isAuthenticated = false
        this.rememberAccount = false
        this.justLoggedIn = false
        this.loginTimestamp = null

        // Clear localStorage
        if (process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          localStorage.removeItem('authData')
          localStorage.removeItem('token_expire_at')
          localStorage.removeItem('redirect_after_login')

          // Keep auth_data if rememberAccount was true
          if (!this.rememberAccount) {
            localStorage.removeItem('auth_data')
          }
        }

        // Show success message only if explicitly requested (not when called from initAuth)
        if (showMessage && process.client && typeof window !== 'undefined') {
          // Use Ant Design message if available
          try {
            const { message } = await import('ant-design-vue')
            message.success('Đăng xuất thành công')
          } catch {
            // Message component not available, continue without notification
          }
        }

        // Redirect to login
        if (process.client) {
          window.location.href = '/login'
        } else {
          await navigateTo('/login')
        }
      } catch (error) {
        console.error('Logout error:', error)
        // Still redirect to login even if there's an error
        if (process.client) {
          window.location.href = '/login'
        } else {
          await navigateTo('/login')
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Check and restore session from localStorage
     * Migrated from @nuxtjs/auth-next behavior
     */
    async initAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const tokenExpireAt = localStorage.getItem('token_expire_at')
        const userStr = localStorage.getItem('user')
        // Check both 'authData' (new format) and 'auth_data' (old format) for compatibility
        const authDataStr = localStorage.getItem('authData') || localStorage.getItem('auth_data')

        // Try to restore from authData first (new format), then fallback to old format
        let authData = null
        if (authDataStr) {
          try {
            authData = JSON.parse(authDataStr)
          } catch (e) {
            console.error('⚠️ Failed to parse authData:', e)
          }
        }

        if (authData && authData.user && authData.token) {
          // Use new format (authData)
          try {
            // Check if token is expired
            if (authData.tokenExpireAt) {
              const expireTime = new Date(authData.tokenExpireAt).getTime()
              const now = Date.now()
              if (!isNaN(expireTime) && now >= expireTime) {
                // Token expired, clear data (don't show message - session expired)
                this.logout(false)
                return
              }
            }

            this.token = authData.token
            this.tokenExpireAt = authData.tokenExpireAt
            this.user = authData.user
            this.isAuthenticated = true
            this.rememberAccount = authData.rememberAccount || false
            this.loginTimestamp = authData.loginTimestamp || null

            // Check if user has allowed role
            const userRole = this.user?.role
            const allowedRoles = ['admin', 'manager', 'worker']
            if (!userRole || !allowedRoles.includes(userRole)) {
              console.warn('[InitAuth] User role not allowed:', userRole)
              this.logout(false) // Don't show message - invalid session
              return
            }

            // Refresh user data from backend to get latest info
            // Skip refresh if SSO login is in progress to avoid race condition
            try {
              await this.refreshUserData()
            } catch (refreshError) {
              console.warn('⚠️ Failed to refresh user data during initAuth, but keeping session:', refreshError)
              // Don't logout on refresh error - session might still be valid
            }
          } catch (e) {
            console.error('❌ Error restoring from authData:', e)
            this.logout(false) // Don't show message - error restoring session
            return
          }
        } else if (token && userStr && tokenExpireAt) {
          // Fallback to old format
          try {
            // Check if token is expired
            if (tokenExpireAt) {
              const expireTime = new Date(tokenExpireAt).getTime()
              const now = Date.now()

              if (!isNaN(expireTime) && now >= expireTime) {
                // Token expired, clear data (don't show message - session expired)
                this.logout(false)
                return
              }
            }

            this.token = token
            this.tokenExpireAt = tokenExpireAt
            this.user = JSON.parse(userStr)
            this.isAuthenticated = true

            // Check if user has allowed role
            const userRole = this.user?.role
            const allowedRoles = ['admin', 'manager', 'worker']
            if (!userRole || !allowedRoles.includes(userRole)) {
              console.warn('[InitAuth] User role not allowed:', userRole)
              this.logout(false) // Don't show message - invalid session
              return
            }

            // Check for remember account
            if (authDataStr) {
              try {
                const authData = JSON.parse(authDataStr)
                this.rememberAccount = authData.remindAccount || false
              } catch (e) {
                // Ignore parse error for authData, it's optional
                console.warn('⚠️ Failed to parse authData, continuing:', e)
              }
            }

            // Refresh user data from backend to get latest info
            // Skip refresh if just logged in to avoid race condition
            const timeSinceLogin = this.loginTimestamp ? Date.now() - this.loginTimestamp : Infinity
            if (timeSinceLogin > 5000) { // Only refresh if logged in more than 5 seconds ago
              try {
                await this.refreshUserData()
              } catch (refreshError) {
                console.warn('⚠️ Failed to refresh user data during initAuth, but keeping session:', refreshError)
                // Don't logout on refresh error - session might still be valid
              }
            } else {
              console.log('ℹ️ Skipping refreshUserData - just logged in', timeSinceLogin, 'ms ago')
            }
          } catch (error) {
            console.error('❌ Init auth error (critical):', error)
            // Only logout on critical errors (parse errors, etc.), not on refresh errors
            this.logout(false) // Don't show message - critical error
          }
        } else {
          console.log('ℹ️ No auth data found in localStorage')
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
      if (!value || !unit) {
        // Default to 7 days if format is invalid
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
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

