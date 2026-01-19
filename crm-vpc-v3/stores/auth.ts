import { defineStore } from 'pinia';

// Helper functions for cookie-based auth persistence (CRM uses cookies-only)
function isSecure() {
  if (!process.client) return false;
  return window.location.protocol === 'https:';
}
function getCookieDomain() {
  if (!process.client) return null;
  const hostname = window.location.hostname;
  // Allow localhost without domain (cookies won't be shared between ports)
  if (hostname === 'localhost' || hostname === '127.0.0.1') return null;
  // Support local test domains like my.local.test, edu.local.test
  const parts = hostname.split('.');
  if (parts.length >= 2) return '.' + parts.slice(-2).join('.');
  return null;
}
function setCookie(name: string, value: string, expiresIso?: string) {
  if (!process.client) return;
  let cookieStr = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
  if (expiresIso) cookieStr += `; expires=${new Date(expiresIso).toUTCString()}`;
  const domain = getCookieDomain();
  if (domain) cookieStr += `; domain=${domain}`;
  if (isSecure()) cookieStr += '; Secure';
  document.cookie = cookieStr;
}
function getCookie(name: string): string | null {
  if (!process.client) return null;
  const match = document.cookie.match(new RegExp('(^|;)\\s*' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}
function removeCookie(name: string) {
  if (!process.client) return;
  const domain = getCookieDomain();
  if (domain) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}; SameSite=Lax`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

export interface User {
  id: string | number;
  email: string;
  fullname?: string;
  name?: string;
  username?: string;
  phone?: string;
  role?: string;
  avatar?: string;
  verified?: boolean;
  status?: string;
  fullAddress?: string;
  address?: string;
  courseRegister?: string[]; // Danh sách khóa học đã mua
  courseCompleted?: string[]; // Danh sách khóa học đã hoàn thành
}

export interface AuthState {
  user: User | null;
  token: string | null;
  tokenExpireAt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberAccount: boolean;
  isSSOLoginInProgress: boolean; // Flag to disable auto-logout during SSO
  justLoggedIn: boolean; // Flag to disable auto-logout immediately after login
  loginTimestamp: number | null; // Timestamp of last login
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    tokenExpireAt: null,
    isAuthenticated: false,
    isLoading: false,
    rememberAccount: false,
    isSSOLoginInProgress: false,
    justLoggedIn: false,
    loginTimestamp: null,
  }),

  getters: {
    currentUser: state => state.user,
    isLoggedIn: state => state.isAuthenticated,
    userRole: state => state.user?.role || 'guest',
    userName: state => state.user?.fullname || state.user?.name || 'Unknown',
    userEmail: state => state.user?.email || '',
  },

  actions: {
    /**
     * Login user (Admin)
     * Migrated from admin-vpc/pages/login.vue
     */
    async login(username: string, password: string, remindAccount = false) {
      this.isLoading = true;

      try {
        const authApi = useAuthApi();

        // Call API login
        const response: any = await authApi.login(
          username,
          password,
          remindAccount,
        );

        // Backend returns: { data: { accessToken, tokenExpireAt } }
        const token =
          response.data?.accessToken || response.accessToken || response.token;
        const tokenExpireAt =
          response.data?.tokenExpireAt || response.tokenExpireAt;

        if (!token) {
          throw new Error('No token received from server');
        }

        // Calculate token expiry time (default 7 days if not provided)
        this.token = token;
        this.tokenExpireAt = tokenExpireAt
          ? this.calculateExpireTime(tokenExpireAt)
          : this.calculateExpireTime('7d');
        this.isAuthenticated = true;
        this.rememberAccount = remindAccount;

        // Fetch full user profile data from API
        try {
          const profileResponse = (await authApi.getUserProfile()) as any;
          const userData = profileResponse?.data?.user || profileResponse?.data?.data || profileResponse?.data;
          
          this.user = {
            id: userData?._id || userData?.id || 'temp-id',
            email: userData?.email || username,
            username: userData?.username || username,
            fullname: userData?.fullname || userData?.name || username,
            name: userData?.name || userData?.fullname,
            phone: userData?.phoneNumber || userData?.phone,
            avatar: userData?.avatar,
            role: userData?.role || userData?.type,
            verified: userData?.verified,
            status: userData?.status,
            fullAddress: userData?.fullAddress || '',
            address: userData?.address || '',
            courseRegister: userData?.courseRegister || [],
            courseCompleted: userData?.courseCompleted || [],
          };
          
        } catch (profileError) {
          // Fallback to basic user data if profile fetch fails
          this.user = {
            id: response.id || response._id || 'temp-id',
            email: username,
            username: username,
            fullname: response.fullname || username,
            fullAddress: response.fullAddress || '',
            address: response.address || '',
          };
        }

        // Persist auth using cookies (CRM uses cookie-only persistence)
        if (process.client) {
          // token & expiry
          setCookie('auth_token', token, this.tokenExpireAt || undefined);
          setCookie('token_expire_at', this.tokenExpireAt || '');
          // user
          setCookie('user', JSON.stringify(this.user), this.tokenExpireAt || undefined);
          // authData for compatibility
          const authData = { user: this.user, token: this.token, tokenExpireAt: this.tokenExpireAt, rememberAccount: this.rememberAccount };
          setCookie('authData', JSON.stringify(authData), this.tokenExpireAt || undefined);

          if (remindAccount) {
            setCookie('auth_data', JSON.stringify({ username, remindAccount, origin: 'vanphuccare.gensi.vn' }), this.tokenExpireAt || undefined);
          }
        }

        // Set justLoggedIn flag to prevent auto-logout for 15 seconds
        this.justLoggedIn = true;
        this.loginTimestamp = Date.now();
        // Clear any leftover logout sync cookie when logging in
        // Set SSO cookie to sync login with other sites
        if (process.client) {
          try {
            const { clearLogoutSyncCookie } = await import('~/utils/authSync');
            clearLogoutSyncCookie();
          } catch (e) {
          }
          
          try {
            const { setSSOCookie } = await import('~/utils/sso');
            setSSOCookie(token);
          } catch (e) {
          }
        }
        
        setTimeout(() => {
          this.justLoggedIn = false;
        }, 15000); // 15 seconds grace period

        return { success: true, user: this.user, token };
      } catch (error: any) {
        // Ignore AbortError (request cancelled due to navigation/reload)
        if (
          error?.name === 'AbortError' ||
          error?.message?.includes('aborted')
        ) {
          return { success: false, error: 'Request cancelled' };
        }
        return {
          success: false,
          error:
            error.data?.message ||
            error.message ||
            'Tên đăng nhập hoặc mật khẩu không chính xác',
        };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Update course register via API
     */
    async updateCourseRegister(
      courseIds: string[],
      action: 'add' | 'remove' = 'add',
    ) {
      if (!this.user || !this.token) {
        return false;
      }

      try {
        const authApi = useAuthApi();
        const response = (await authApi.updateCourseRegister(
          courseIds,
          action,
        )) as any;

        if (response.data?.user) {
          // Update local user data
          this.user.courseRegister = response.data.user.courseRegister;
          this.saveAuth();
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },

    /**
     * Refresh user data from backend
     */
    async refreshUserData() {
      if (!this.user || !this.token) {
        return;
      }

      try {
        const authApi = useAuthApi();
        const response = (await authApi.getUserProfile()) as any;
        const userData = response?.data?.user || response?.data?.data || response?.data;

        if (userData) {
          // Update user data with fresh data from backend (same mapping as login)
          this.user = {
            id: userData?._id || userData?.id || this.user.id,
            email: userData?.email || this.user.email,
            username: userData?.username || this.user.username,
            fullname: userData?.fullname || userData?.name || this.user.fullname,
            name: userData?.name || userData?.fullname,
            phone: userData?.phoneNumber || userData?.phone,
            avatar: userData?.avatar,
            role: userData?.role || userData?.type,
            verified: userData?.verified,
            status: userData?.status,
            fullAddress: userData?.fullAddress || '',
            address: userData?.address || '',
            courseRegister: userData?.courseRegister || [],
            courseCompleted: userData?.courseCompleted || [],
          };
          this.saveAuth();
        }
      } catch (error) {
        // Don't throw error - just log it. This is a non-critical operation.
        // The session is still valid even if refresh fails.
        // Re-throw only if it's a critical error (not 401, not network error)
        const status = (error as any)?.statusCode || (error as any)?.status;
        if (status && status !== 401 && status !== 0) {
          // Only re-throw for unexpected server errors (500, 403, etc.)
          throw error;
        }
      }
    },

    /**
     * Register new account (CRM/E-Learning)
     * Migrated from crm-vpc/components/auth/forms/SignUp.vue
     */
    async register(
      email: string,
      password: string,
      repeatPassword: string,
      fullname?: string,
      phone?: string,
    ) {
      this.isLoading = true;

      try {
        if (password !== repeatPassword) {
          throw new Error('Mật khẩu không khớp');
        }

        const authApi = useAuthApi();

        // Call API register
        const response: any = await authApi.register(
          email,
          password,
          repeatPassword,
          fullname,
          phone,
        );
        return { success: true, data: response };
      } catch (error: any) {
        // Error đã được transform bởi transformError() trong useAuthApi
        // AuthError có message được set từ API response
        return {
          success: false,
          error:
            error.message ||
            error.data?.message ||
            'Email đã được sử dụng, vui lòng nhập email khác!',
        };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Verify email with OTP (after registration)
     * Migrated from crm-vpc/components/auth/forms/SignUp.vue
     * Updated: Auto login after successful verification
     */
    async verifyEmail(email: string, otp: string) {
      this.isLoading = true;

      try {
        const authApi = useAuthApi();

        // Verify OTP - API returns { message, data: { accessToken, ... } }
        const response: any = await authApi.verifyEmail(email, otp);
        
        // Response from Nuxt server proxy: { message, data: { accessToken, ... } }
        // Extract actual data from response.data
        const responseData = response?.data || response;
        // Auto login: Save token and user info from response
        if (responseData?.accessToken) {
          this.token = responseData.accessToken;
          
          // Handle tokenExpireAt from response
          this.tokenExpireAt = responseData.tokenExpireAt
            ? this.calculateExpireTime(responseData.tokenExpireAt)
            : this.calculateExpireTime('7d');
          
          this.user = {
            id: responseData._id || responseData.id,
            email: responseData.email,
            fullname: responseData.fullname,
            username: responseData.username,
          };
          this.isAuthenticated = true;
          
          // Set justLoggedIn flag to prevent auto-logout for 30 seconds
          this.justLoggedIn = true;
          this.loginTimestamp = Date.now();
          setTimeout(() => {
            this.justLoggedIn = false;
          }, 30000);
          
          // Persist using cookies (CRM uses cookie-only persistence)
          if (import.meta.client) {
            setCookie('auth_token', responseData.accessToken, this.tokenExpireAt || undefined);
            setCookie('token_expire_at', this.tokenExpireAt || '');
            setCookie('user', JSON.stringify(this.user), this.tokenExpireAt || undefined);
            setCookie('login_timestamp', String(this.loginTimestamp));

            // Also save authData for initAuth compatibility
            const authData = {
              user: this.user,
              token: this.token,
              tokenExpireAt: this.tokenExpireAt,
              rememberAccount: this.rememberAccount,
              loginTimestamp: this.loginTimestamp,
            };
            setCookie('authData', JSON.stringify(authData), this.tokenExpireAt || undefined);

            // Clear logout sync cookie on successful login
            const { clearLogoutSyncCookie } = await import('~/utils/authSync');
            clearLogoutSyncCookie();
            // Set SSO cookie to sync login with other sites
            try {
              const { setSSOCookie } = await import('~/utils/sso');
              setSSOCookie(responseData.accessToken);
            } catch (e) {
            }
          }
          
          // Fetch full user profile
          await this.refreshUserData();
        }

        return { success: true, user: this.user, token: this.token };
      } catch (error: any) {
        return {
          success: false,
          error:
            error.data?.message ||
            error.message ||
            'Mã xác thực không chính xác!',
        };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Login after email verification
     * Auto login user after successful registration
     */
    async loginAfterRegister(email: string, password: string) {
      return await this.login(email, password, false);
    },

    /**
     * Forgot password - Send OTP
     * Migrated from admin-vpc/components/auth/forms/GetOtp.vue
     */
    async forgotPassword(email: string, source?: string) {
      this.isLoading = true;

      try {
        const authApi = useAuthApi();

        await authApi.forgotPassword(email, source || 'crm');

        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.data?.message || error.message || 'Gửi OTP thất bại',
        };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Verify OTP for password reset
     */
    async verifyOtp(email: string, otp: string) {
      this.isLoading = true;

      try {
        const authApi = useAuthApi();

        const result = await authApi.verifyOtp(email, otp);

        return { success: true, data: result };
      } catch (error: any) {
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Mã OTP không hợp lệ hoặc đã hết hạn'
        }
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Reset password with token
     * Migrated from admin-vpc/components/auth/forms/NewPassword.vue
     */
    async resetPassword(email: string, token: string, newPassword: string) {
      this.isLoading = true;

      try {
        const authApi = useAuthApi();

        await authApi.resetPassword(email, token, newPassword);

        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error:
            error.data?.message || error.message || 'Đổi mật khẩu thất bại',
        };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Change password (logged in user)
     * Migrated from admin-vpc/components/auth/dialogs/UpdatePassword.vue
     */
    async changePassword(oldPassword: string, newPassword: string) {
      this.isLoading = true;

      try {
        const authApi = useAuthApi();

        await authApi.changePassword(oldPassword, newPassword);

        // Logout after password change
        await this.logout();

        return { success: true };
      } catch (error: any) {

        // Check for specific error code
        if (error.status === 425 || error.data?.error?.code === 425) {
          return {
            success: false,
            error: 'Mật khẩu cũ không chính xác',
          };
        }

        return {
          success: false,
          error:
            error.data?.message || error.message || 'Đổi mật khẩu thất bại',
        };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Logout user
     * Migrated from admin-vpc/api/auth.js
     */
    async logout() {
      this.isLoading = true;

      try {
        // Clear SSO cookie FIRST to prevent SSO login immediately after logout
        if (process.client) {
          const { clearSSOCookie } = await import('~/utils/sso');
          clearSSOCookie();
        }
        
        // Call logout API to clear server session
        const authApi = useAuthApi();
        await authApi.logout().catch(() => {
          // Ignore logout API errors
        });

        // Set logout sync cookie to notify Elearning site
        // Do this BEFORE clearing state to ensure cookie is set while still authenticated
        if (process.client) {
          const { setLogoutSyncCookie } = await import('~/utils/authSync');
          setLogoutSyncCookie();
          // Add a small delay to ensure cookie is propagated before clearing state
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Clear state
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        this.rememberAccount = false;
        this.isSSOLoginInProgress = false;
        this.justLoggedIn = false;
        this.loginTimestamp = null;

        // Clear cookies (CRM uses cookie-only persistence)
        if (process.client) {
          removeCookie('auth_token');
          removeCookie('user');
          removeCookie('authData');
          removeCookie('token_expire_at');
          removeCookie('login_timestamp');

          // Keep auth_data if rememberAccount was true
          if (!this.rememberAccount) {
            removeCookie('auth_data');
          }
        }

        // Redirect to login
        navigateTo('/login');
      } catch (error) {
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Save current auth state (CRM: using cookies)
     */
    saveAuth() {
      if (process.client && this.user && this.token) {
        try {
          const authData = {
            user: this.user,
            token: this.token,
            tokenExpireAt: this.tokenExpireAt,
            rememberAccount: this.rememberAccount,
          };
          setCookie('authData', JSON.stringify(authData), this.tokenExpireAt || undefined);
        } catch (error) {
        }
      }
    },


    /**
     * Check and restore session from localStorage
     * Migrated from @nuxtjs/auth-next behavior
     */
    async initAuth() {
      if (process.client) {
        // FIRST: Check SSO cookie - if exists, it means user is logging in from another portal
        // SSO cookie takes priority over logout sync cookie (SSO is newer, means user just logged in)
        try {
          const { checkSSOCookie } = await import('~/utils/sso');
          const hasSSOCookie = checkSSOCookie();
          
          if (hasSSOCookie) {
            const { handleSSOLogin } = await import('~/utils/sso');
            const ssoResult = await handleSSOLogin();
            if (ssoResult) {
              // Clear logout sync cookie if it exists (SSO login takes priority)
              try {
                const { clearLogoutSyncCookie } = await import('~/utils/authSync');
                clearLogoutSyncCookie();
              } catch (e) {
                // Ignore errors
              }
              return;
            }
          }
        } catch (e) {
        }
        
        // SECOND: Check logout sync cookie - if exists, don't restore auth and clear it
        // This prevents restoring auth when user was logged out from another portal
        try {
          const { checkLogoutSyncCookie, clearLogoutSyncCookie } = await import('~/utils/authSync');
          const hasLogoutSync = checkLogoutSyncCookie();
          if (hasLogoutSync) {
            clearLogoutSyncCookie();
            // Clear local auth state
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            // Don't restore from localStorage if logout sync cookie exists
            return;
          }
        } catch (e) {
        }
        
        // Read from cookies (CRM uses cookies for persistence)
        const token = getCookie('auth_token');
        const tokenExpireAt = getCookie('token_expire_at');
        const userStr = getCookie('user');
        // Check both 'authData' (new format) and 'auth_data' (old format) for compatibility
        const authDataStr = getCookie('authData') || getCookie('auth_data');

        // Try to restore from authData first (new format), then fallback to old format
        let authData = null;
        if (authDataStr) {
          try {
            authData = JSON.parse(authDataStr);
          } catch (e) {
          }
        }

        if (authData && authData.user && authData.token) {
          // Use new format (authData)
          try {
            // Check if token is expired
            if (authData.tokenExpireAt) {
              const expireTime = new Date(authData.tokenExpireAt).getTime();
              const now = Date.now();
              if (!isNaN(expireTime) && now >= expireTime) {
                // Token expired, clear data
                this.logout();
                return;
              }
            }

            this.token = authData.token;
            this.tokenExpireAt = authData.tokenExpireAt;
            this.user = authData.user;
            this.isAuthenticated = true;
          } catch (e) {
            this.logout();
            return;
          }
        } else if (token && userStr && tokenExpireAt) {
          // Fallback to old format
          try {
            // Check if token is expired
            if (tokenExpireAt) {
              const expireTime = new Date(tokenExpireAt).getTime();
              const now = Date.now();

              if (!isNaN(expireTime) && now >= expireTime) {
                // Token expired, clear data
                this.logout();
                return;
              }
            }

            this.token = token;
            this.tokenExpireAt = tokenExpireAt;
            this.user = JSON.parse(userStr);
            this.isAuthenticated = true;

            // Check for remember account
            if (authDataStr) {
              try {
                const authData = JSON.parse(authDataStr);
                this.rememberAccount = authData.remindAccount || false;
              } catch (e) {
                // Ignore parse error for authData, it's optional
              }
            }

            // Refresh user data from backend to get latest courseRegister
            // Skip refresh if SSO login is in progress to avoid race condition
            if (!this.isSSOLoginInProgress) {
              try {
                await this.refreshUserData();
              } catch (refreshError) {
                // Don't logout on refresh error - session might still be valid
              }
            } else {
            }
          } catch (error) {
            // Only logout on critical errors (parse errors, etc.), not on refresh errors
            // Check if error is from refreshUserData (it should not throw for non-critical errors)
            const isCriticalError = !(error as any)?.isRefreshError;
            if (isCriticalError) {
              // Only logout if not during SSO login
              if (!this.isSSOLoginInProgress) {
                this.logout();
              }
            }
          }
        } else {
          // Check if we have token and user from SSO (they might be set separately)
          if (token && userStr) {
            try {
              const user = JSON.parse(userStr);
              // Check if token is expired
              if (tokenExpireAt) {
                const expireTime = new Date(tokenExpireAt).getTime();
                const now = Date.now();
                if (!isNaN(expireTime) && now >= expireTime) {
                  // Token expired, clear data
                  this.logout();
                  return;
                }
              }
              
              this.token = token;
              this.tokenExpireAt = tokenExpireAt;
              this.user = user;
              this.isAuthenticated = true;
              // Save as authData for future compatibility
              this.saveAuth();
            } catch (e) {
              this.logout();
            }
          } else {
            // Check if we're already authenticated (might be from SSO)
            if (this.isAuthenticated && this.token && this.user) {
              return;
            }
          }
        }
      }
    },

    /**
     * Calculate token expiry time from TTL string (e.g., '7d', '24h', '1y')
     */
    calculateExpireTime(ttl: string | Date | number): string {
      const now = new Date();

      // If ttl is already a Date object, return it
      if (ttl instanceof Date) {
        return ttl.toISOString();
      }

      // If ttl is a number (timestamp), convert to Date
      if (typeof ttl === 'number') {
        return new Date(ttl + new Date().getTime()).toISOString();
      }

      // If ttl is a string, parse it
      if (typeof ttl !== 'string') {
        // Default to 7 days if format is invalid
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      }

      // Parse TTL string (e.g., '7d' = 7 days, '24h' = 24 hours)
      const match = ttl.match(/^(\d+)([smhdy])$/);

      if (!match) {
        // Default to 7 days if format is invalid
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      }

      const [, value, unit] = match;
      const amount = parseInt(value || '0');

      let milliseconds = 0;
      switch (unit) {
        case 's': // seconds
          milliseconds = amount * 1000;
          break;
        case 'm': // minutes
          milliseconds = amount * 60 * 1000;
          break;
        case 'h': // hours
          milliseconds = amount * 60 * 60 * 1000;
          break;
        case 'd': // days
          milliseconds = amount * 24 * 60 * 60 * 1000;
          break;
        case 'y': // years
          milliseconds = amount * 365 * 24 * 60 * 60 * 1000;
          break;
        default:
          milliseconds = 7 * 24 * 60 * 60 * 1000; // default 7 days
      }

      return new Date(now.getTime() + milliseconds).toISOString();
    },

    /**
     * Complete Google Login
     * Store token and user data from Google OAuth
     * If userData is not provided, will fetch from API
     * If tokenExpireAt is not provided, defaults to 7 days
     */
    async completeGoogleLogin(
      accessToken: string,
      tokenExpireAt?: string | number,
      userData?: User,
    ) {
      try {
        this.token = accessToken;

        // Handle tokenExpireAt properly
        if (tokenExpireAt) {
          if (typeof tokenExpireAt === 'number') {
            this.tokenExpireAt = new Date(Date.now() + tokenExpireAt).toISOString();
          } else if (typeof tokenExpireAt === 'string') {
            // Could be ISO string or duration string like '7d'
            const parsed = new Date(tokenExpireAt);
            if (!isNaN(parsed.getTime())) {
              this.tokenExpireAt = parsed.toISOString();
            } else {
              this.tokenExpireAt = this.calculateExpireTime(tokenExpireAt);
            }
          }
        } else {
          // Default to 7 days if not provided
          this.tokenExpireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        }

        // Persist token via cookie (CRM uses cookie-only persistence)
        if (process.client) {
          setCookie('auth_token', accessToken, this.tokenExpireAt || undefined);
        }

        // If userData is not provided, fetch from API
        if (!userData) {
          const authApi = useAuthApi();
          const profileResponse = (await authApi.getUserProfile()) as any;
          const fetchedUserData = profileResponse?.data?.user || profileResponse?.data?.data || profileResponse?.data;
          
          userData = {
            id: fetchedUserData?._id || fetchedUserData?.id || 'temp-id',
            email: fetchedUserData?.email || '',
            username: fetchedUserData?.username || fetchedUserData?.email,
            fullname: fetchedUserData?.fullname || fetchedUserData?.name || '',
            name: fetchedUserData?.name || fetchedUserData?.fullname,
            phone: fetchedUserData?.phoneNumber || fetchedUserData?.phone,
            role: fetchedUserData?.role || 'user',
            avatar: fetchedUserData?.avatar,
            verified: fetchedUserData?.verified,
            status: fetchedUserData?.status,
          };
        }

        this.user = userData;
        this.isAuthenticated = true;

        // Save to cookies (CRM uses cookie-based persistence for SSO)
        if (process.client) {
          setCookie('token_expire_at', this.tokenExpireAt, this.tokenExpireAt || undefined);
          setCookie('user', JSON.stringify(userData), this.tokenExpireAt || undefined);
          // Also save authData for initAuth compatibility
          const authData = {
            user: userData,
            token: accessToken,
            tokenExpireAt: this.tokenExpireAt,
            rememberAccount: false,
          };
          setCookie('authData', JSON.stringify(authData), this.tokenExpireAt || undefined);
        }

        // Set justLoggedIn flag to prevent auto-logout for 15 seconds
        this.justLoggedIn = true;
        this.loginTimestamp = Date.now();
        // Clear any leftover logout sync cookie when logging in
        // Set SSO cookie to sync login with other sites
        if (process.client) {
          try {
            const { clearLogoutSyncCookie } = await import('~/utils/authSync');
            clearLogoutSyncCookie();
          } catch (e) {
          }
          
          try {
            const { setSSOCookie } = await import('~/utils/sso');
            setSSOCookie(accessToken);
          } catch (e) {
          }
        }
        
        setTimeout(() => {
          this.justLoggedIn = false;
        }, 15000); // 15 seconds grace period

        return { success: true };
      } catch (error: any) {
        // Cleanup on error
        if (process.client) {
          localStorage.removeItem('auth_token');
        }
        this.token = null;
        this.isAuthenticated = false;
        return { success: false, error: error.message };
      }
    },

    /**
     * Update user profile
     * Migrated from admin-vpc/api/auth.js
     */
    async updateProfile(userData: Partial<User>) {
      this.isLoading = true;

      try {
        const authApi = useAuthApi();

        const response: any = await authApi.updateProfile(userData);

        // Update local user data
        if (this.user) {
          this.user = { ...this.user, ...response.user };

          if (process.client) {
            setCookie('user', JSON.stringify(this.user), this.tokenExpireAt || undefined);
          }
        }

        return { success: true, user: response.user };
      } catch (error: any) {
        return {
          success: false,
          error:
            error.data?.message ||
            error.message ||
            'Cập nhật thông tin thất bại',
        };
      } finally {
        this.isLoading = false;
      }
    },
  },
});

// Expose store to window for console debugging (lazy initialization to avoid circular dependency)
if (process.client) {
  (window as any).authStore = () => useAuthStore();
}
