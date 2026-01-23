import { defineStore } from "pinia";

// Helper functions for cookie-based auth persistence (Elearning uses cookies-only)
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
  const raw = match?.[2];
  return raw ? decodeURIComponent(raw) : null;
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
  justLoggedIn: boolean; // Flag to disable auto-logout immediately after login
  loginTimestamp: number | null; // Timestamp of last login
}

export const useAuthStore = defineStore("auth", {
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
    userRole: (state) => state.user?.role || "guest",
    userName: (state) => state.user?.fullname || state.user?.name || "Unknown",
    userEmail: (state) => state.user?.email || "",
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
          remindAccount
        );

        // Backend returns: { data: { accessToken, tokenExpireAt } }
        const token =
          response.data?.accessToken || response.accessToken || response.token;
        const tokenExpireAt =
          response.data?.tokenExpireAt || response.tokenExpireAt;

        if (!token) {
          throw new Error("No token received from server");
        }

        // Calculate token expiry time (default 7 days if not provided)
        this.token = token
        this.tokenExpireAt = tokenExpireAt ? this.calculateExpireTime(tokenExpireAt) : this.calculateExpireTime('7d')
        this.isAuthenticated = true
        this.rememberAccount = remindAccount
        // Create basic user object (will be enhanced later if needed)
        this.user = {
          id: response.data._id || "temp-id",
          email: username,
          username: username,
          fullname: response.fullname || username,
        };

        // Set justLoggedIn flag to prevent auto-logout for 30 seconds
        this.justLoggedIn = true;
        this.loginTimestamp = Date.now();
        setTimeout(() => {
          this.justLoggedIn = false;
        }, 30000); // 30 seconds grace period (increased from 15)

        // Clear logout sync cookie when logging in successfully to prevent auto-logout
        if (process.client) {
          try {
            const { clearLogoutSyncCookie } = await import('~/utils/authSync');
            clearLogoutSyncCookie();
          } catch (e) {
            // Ignore errors
          }
        }

        // Persist auth using cookies (Elearning uses cookie-only persistence)
        if (process.client) {
          setCookie('auth_token', token, this.tokenExpireAt || undefined);
          setCookie('token_expire_at', this.tokenExpireAt || '');
          setCookie('user', JSON.stringify(this.user), this.tokenExpireAt || undefined);
          if (this.loginTimestamp) setCookie('login_timestamp', String(this.loginTimestamp));

          if (remindAccount) {
            setCookie('auth_data', JSON.stringify({ username, remindAccount, origin: 'vanphuccare.gensi.vn' }), this.tokenExpireAt || undefined);
          }
          
          // Also save authData for initAuth compatibility (as cookie)
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
            await setSSOCookie(token);
          } catch (e) {
          }
        }

        return { success: true, user: this.user, token };
      } catch (error: any) {
        // Ignore AbortError (request cancelled due to navigation/reload)
        if (
          error?.name === "AbortError" ||
          error?.message?.includes("aborted")
        ) {
          return { success: false, error: "Request cancelled" };
        }
        return {
          success: false,
          error:
            error.data?.message ||
            error.message ||
            "Tên đăng nhập hoặc mật khẩu không chính xác",
        };
      } finally {
        this.isLoading = false;
      }
    },

    async loginAfterVerify(data: any) {
      try {
        // Backend returns: { data: { accessToken, tokenExpireAt } }
        const token = data?.accessToken;
        const tokenExpireAt = data?.tokenExpireAt;

        if (!token) {
          throw new Error("No token received from server");
        }

        // Calculate token expiry time (default 7 days if not provided)
        this.token = token
        this.tokenExpireAt = tokenExpireAt ? this.calculateExpireTime(tokenExpireAt) : this.calculateExpireTime('7d')
        this.isAuthenticated = true
        this.rememberAccount = false
        // Create basic user object (will be enhanced later if needed)
        this.user = {
          id: data._id || "temp-id",
          email: data.email,
          username: data.username,
          fullname: data.fullname,
        };

        // Save to cookies (E-Learning uses cookie-based persistence for SSO)
        if (process.client) {
          setCookie('auth_token', token, this.tokenExpireAt || undefined);
          setCookie('token_expire_at', this.tokenExpireAt || '');
          setCookie('user', JSON.stringify(this.user), this.tokenExpireAt || undefined);
          
          // Set SSO cookie to sync login with other sites
          try {
            const { setSSOCookie } = await import('~/utils/sso');
            await setSSOCookie(token);
          } catch (e) {
          }
        }

        return { success: true, user: this.user, token };
      } catch (error: any) {
        // Ignore AbortError (request cancelled due to navigation/reload)
        if (
          error?.name === "AbortError" ||
          error?.message?.includes("aborted")
        ) {
          return { success: false, error: "Request cancelled" };
        }
        return {
          success: false,
          error:
            error.data?.message ||
            error.message ||
            "Tên đăng nhập hoặc mật khẩu không chính xác",
        };
      }
    },

    /**
     * Update course register via API
     */
    async updateCourseRegister(
      courseIds: string[],
      action: "add" | "remove" = "add"
    ) {
      if (!this.user || !this.token) {
        return false
      }

      try {
        const authApi = useAuthApi()
        const response = await authApi.updateCourseRegister(courseIds, action) as any
        
        if (response.data?.user) {
          // Update local user data
          this.user.courseRegister = response.data.user.courseRegister
          this.saveAuth()
          return true
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
        return
      }

      try {
        const authApi = useAuthApi()
        const response = await authApi.getUserProfile() as any
        const userData = response?.data?.user || response?.data?.data || response?.data;
        
        if (userData) {
          // Update user data with fresh data from backend (same mapping as CRM)
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
            courseRegister: userData?.courseRegister || [],
            courseCompleted: userData?.courseCompleted || [],
          }
          this.saveAuth()
        }
      } catch (error) {
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
      phone?: string
    ) {
      this.isLoading = true;

      try {
        if (password !== repeatPassword) {
          throw new Error("Mật khẩu không khớp");
        }

        const authApi = useAuthApi();

        // Call API register
        const response: any = await authApi.register(
          email,
          password,
          repeatPassword,
          fullname,
          phone
        );

        return { success: true, data: response };
      } catch (error: any) {
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Email đã được sử dụng, vui lòng nhập email khác!'
        }
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Verify email with OTP (after registration)
     * Migrated from crm-vpc/components/auth/forms/SignUp.vue
     */
    async verifyEmail(email: string, otp: string) {
      this.isLoading = true;

      try {
        const authApi = useAuthApi();

        // Verify OTP
        const res:any = await authApi.verifyEmail(email, otp);
        this.loginAfterVerify(res.data)
        return { 
          success: true,
         };
      } catch (error: any) {
        return { 
          success: false, 
          error: error.data?.message || error.message?.message || error.message || 'Mã xác thực không chính xác!'
        }
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
    async forgotPassword(email: string) {
      this.isLoading = true;

      try {
        const authApi = useAuthApi();

        await authApi.forgotPassword(email);

        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Gửi OTP thất bại'
        }
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
    async resetPassword(email: string, token: string, newPassword: string, confirmPassword: string) {
      this.isLoading = true;

      try {
        const authApi = useAuthApi();

        await authApi.resetPassword(email, token, newPassword, confirmPassword);

        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Đổi mật khẩu thất bại'
        }
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
            error: "Mật khẩu cũ không chính xác",
          };
        }

        return {
          success: false,
          error:
            error.data?.message || error.message || "Đổi mật khẩu thất bại",
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
        // Note: API /api/u/active-logs/logout may not exist (404), so we ignore errors
        const authApi = useAuthApi();
        try {
          await authApi.logout();
        } catch (error: any) {
          // Ignore logout API errors (404 is expected if API doesn't exist)
          // This is not critical for logout functionality
        }

        // Set logout sync cookie to notify CRM site
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
        this.justLoggedIn = false;
        this.loginTimestamp = null;

        // Clear cookies (Elearning uses cookie-only persistence)
        if (process.client) {
          removeCookie('auth_token');
          removeCookie('user');
          removeCookie('login_timestamp');
          removeCookie('authData'); // Clear authData (camelCase)
          removeCookie('token_expire_at');

          // Keep auth_data if rememberAccount was true
          if (!this.rememberAccount) {
            removeCookie('auth_data');
          }
        }

        // Redirect to login
        navigateTo("/login");
      } catch (error) {
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Save current auth state (Elearning: cookie-based)
     */
    saveAuth() {
      if (process.client && this.user && this.token) {
        try {
          const authData = {
            user: this.user,
            token: this.token,
            tokenExpireAt: this.tokenExpireAt,
            rememberAccount: this.rememberAccount
          }
          setCookie('authData', JSON.stringify(authData), this.tokenExpireAt || undefined)
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
        
        // Skip if already authenticated (might be from a fresh login)
        // This prevents initAuth from overriding state after a successful login
        // But still restore loginTimestamp if missing
        if (this.isAuthenticated && this.token && this.user) {
          // Still restore loginTimestamp if missing (might have been lost)
          if (!this.loginTimestamp) {
            // Try cookie-based login timestamp first (Elearning uses cookies)
            const loginTimestampStr = getCookie('login_timestamp') || localStorage.getItem('login_timestamp');
            if (loginTimestampStr) {
              const loginTimestamp = parseInt(loginTimestampStr);
              if (!isNaN(loginTimestamp)) {
                this.loginTimestamp = loginTimestamp;
                // Check if login was recent (within 30 seconds)
                const timeSinceLogin = Date.now() - this.loginTimestamp;
                if (timeSinceLogin < 30000) {
                  this.justLoggedIn = true;
                  setTimeout(() => {
                    this.justLoggedIn = false;
                  }, 30000 - timeSinceLogin);
                }
              }
            }
            // Also try to restore from authData cookie
            const authDataStr = getCookie('authData') || localStorage.getItem('authData');
            if (authDataStr && !this.loginTimestamp) {
              try {
                const authData = JSON.parse(authDataStr);
                if (authData && authData.loginTimestamp) {
                  this.loginTimestamp = authData.loginTimestamp;
                  if (this.loginTimestamp) {
                    const timeSinceLogin = Date.now() - this.loginTimestamp;
                    if (timeSinceLogin < 30000) {
                      this.justLoggedIn = true;
                      setTimeout(() => {
                        this.justLoggedIn = false;
                      }, 30000 - timeSinceLogin);
                    }
                  }
                }
              } catch (e) {
                // Ignore parse error
              }
            }
          }
          return;
        }
        
        // Read from cookies (Elearning uses cookies for persistence)
        const token = getCookie('auth_token');
        const tokenExpireAt = getCookie('token_expire_at');
        const userStr = getCookie('user');
        const authDataStr = getCookie('authData') || getCookie('auth_data');

        let authData: any = null;
            if (authDataStr) {
              try {
                authData = JSON.parse(authDataStr)
              } catch (e) {
              }
            }

        if (authData && authData.user && authData.token) {
          try {
            if (authData.tokenExpireAt) {
              const expireTime = new Date(authData.tokenExpireAt).getTime()
              const now = Date.now()
              
              if (now >= expireTime) {
                this.logout();
                return;
              }
            }

            this.token = authData.token;
            this.tokenExpireAt = authData.tokenExpireAt;
            this.user = authData.user;
            this.isAuthenticated = true;
            // Restore loginTimestamp if available
            if (authData.loginTimestamp) {
              this.loginTimestamp = authData.loginTimestamp;
              // Check if login was recent (within 30 seconds)
              if (this.loginTimestamp) {
                const timeSinceLogin = Date.now() - this.loginTimestamp;
                if (timeSinceLogin < 30000) {
                  this.justLoggedIn = true;
                  setTimeout(() => {
                    this.justLoggedIn = false;
                  }, 30000 - timeSinceLogin);
                }
              }
            }

          } catch (e) {
            this.logout()
            return
          }
        } else if (token && userStr && tokenExpireAt) {
          // Fallback to old format
          try {
            // Check if token is expired
            if (tokenExpireAt) {
              const expireTime = new Date(tokenExpireAt).getTime()
              const now = Date.now()
              
              if (now >= expireTime) {
                // Token expired, clear data
                this.logout();
                return;
              }
            }

            this.token = token;
            this.tokenExpireAt = tokenExpireAt;
            this.user = JSON.parse(userStr);
            this.isAuthenticated = true;
            // Try to restore loginTimestamp from localStorage
            const loginTimestampStr = localStorage.getItem("login_timestamp");
            if (loginTimestampStr) {
              const loginTimestamp = parseInt(loginTimestampStr);
              if (!isNaN(loginTimestamp)) {
                this.loginTimestamp = loginTimestamp;
                // Check if login was recent (within 30 seconds)
                const timeSinceLogin = Date.now() - this.loginTimestamp;
                if (timeSinceLogin < 30000) {
                  this.justLoggedIn = true;
                  setTimeout(() => {
                    this.justLoggedIn = false;
                  }, 30000 - timeSinceLogin);
                }
              }
            }

            // Check for remember account
            if (authDataStr) {
              try {
                const authData = JSON.parse(authDataStr);
                this.rememberAccount = authData.remindAccount || false;
              } catch (e) {
                // Ignore parse error for auth_data
              }
            }

            // Refresh user data from backend to get latest courseRegister
            // Skip refresh if login was very recent (within 5 seconds) to avoid 401 errors
            const timeSinceLogin = this.loginTimestamp 
              ? Date.now() - this.loginTimestamp 
              : Infinity;
            if (timeSinceLogin > 5000) {
              try {
                await this.refreshUserData();
              } catch (error) {
                // Don't logout on refresh error - session might still be valid
              }
            } else {
            }
          } catch (error) {
            // Clear corrupted data only if it's a critical error
            this.logout();
          }
        } else {
        }
      }
    },

    /**
     * Calculate token expiry time from TTL string (e.g., '7d', '24h', '1y')
     */
    calculateExpireTime(ttl: string | Date | number): string {
      const now = new Date()
      
      // If ttl is already a Date object, return it
      if (ttl instanceof Date) {
        return ttl.toISOString()
      }

      // If ttl is a number (timestamp), convert to Date
      if (typeof ttl === 'number') {
        return new Date(ttl).toISOString()
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
      const amount = parseInt(value || "0");

      let milliseconds = 0;
      switch (unit) {
        case "s": // seconds
          milliseconds = amount * 1000;
          break;
        case "m": // minutes
          milliseconds = amount * 60 * 1000;
          break;
        case "h": // hours
          milliseconds = amount * 60 * 60 * 1000;
          break;
        case "d": // days
          milliseconds = amount * 24 * 60 * 60 * 1000;
          break;
        case "y": // years
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
      userData?: User
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

        // Persist token via cookie immediately
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
            courseRegister: fetchedUserData?.courseRegister || [],
            courseCompleted: fetchedUserData?.courseCompleted || [],
          };
        }

        this.user = userData;
        this.isAuthenticated = true;

        // Set justLoggedIn flag to prevent auto-logout for 30 seconds
        this.justLoggedIn = true;
        this.loginTimestamp = Date.now();
        setTimeout(() => {
          this.justLoggedIn = false;
        }, 30000); // 30 seconds grace period (increased from 15)

        // Clear logout sync cookie when logging in successfully to prevent auto-logout
        if (process.client) {
          try {
            const { clearLogoutSyncCookie } = await import('~/utils/authSync');
            clearLogoutSyncCookie();
          } catch (e) {
            // Ignore errors
          }
        }

          // Save to cookies (E-Learning uses cookie-based persistence for SSO)
          if (process.client) {
            setCookie('auth_token', accessToken, this.tokenExpireAt || undefined);
            setCookie('token_expire_at', this.tokenExpireAt || '');
            setCookie('user', JSON.stringify(userData), this.tokenExpireAt || undefined);
            // Save loginTimestamp to cookie for initAuth restoration
            setCookie('login_timestamp', String(this.loginTimestamp));
            
            // Also save authData for initAuth compatibility
            const authData = {
              user: this.user,
              token: this.token,
              tokenExpireAt: this.tokenExpireAt,
              rememberAccount: false,
              loginTimestamp: this.loginTimestamp,
            };
            setCookie('authData', JSON.stringify(authData), this.tokenExpireAt || undefined);
            
            // Clear logout sync cookie on successful login
            const { clearLogoutSyncCookie } = await import('~/utils/authSync');
            clearLogoutSyncCookie();
            // Set SSO cookie to sync login with other sites
            try {
              const { setSSOCookie } = await import('~/utils/sso');
              await setSSOCookie(accessToken);
            } catch (e) {
            }
          }

        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message }
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
          error: error.data?.message || error.message || 'Cập nhật thông tin thất bại'
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
});

// Expose store to window for console debugging
if (process.client) {
  (window as any).authStore = useAuthStore;
}
