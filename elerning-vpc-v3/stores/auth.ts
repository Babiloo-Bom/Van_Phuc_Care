import { defineStore } from "pinia";

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

        // Set justLoggedIn flag to prevent auto-logout for 15 seconds
        this.justLoggedIn = true;
        this.loginTimestamp = Date.now();
        setTimeout(() => {
          this.justLoggedIn = false;
        }, 15000); // 15 seconds grace period

        // Save to localStorage
        if (process.client) {
          localStorage.setItem("auth_token", token);
          localStorage.setItem("token_expire_at", this.tokenExpireAt || "");
          localStorage.setItem("user", JSON.stringify(this.user));

          if (remindAccount) {
            localStorage.setItem(
              "auth_data",
              JSON.stringify({
                username,
                remindAccount,
                origin: "vanphuccare.gensi.vn",
              })
            );
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

        // Save to localStorage
        if (process.client) {
          localStorage.setItem("auth_token", token);
          localStorage.setItem("token_expire_at", this.tokenExpireAt || "");
          localStorage.setItem("user", JSON.stringify(this.user));
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
        console.error("❌ Error updating course register:", error);
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
        console.error("❌ Error refreshing user data:", error);
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
     * Reset password with token
     * Migrated from admin-vpc/components/auth/forms/NewPassword.vue
     */
    async resetPassword(token: string, newPassword: string) {
      this.isLoading = true;

      try {
        const authApi = useAuthApi();

        await authApi.resetPassword(token, newPassword);

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
        // Call logout API to clear server session
        const authApi = useAuthApi();
        await authApi.logout().catch(() => {
          // Ignore logout API errors
        });

        // Set logout sync cookie to notify CRM site
        if (process.client) {
          const { setLogoutSyncCookie } = await import('~/utils/authSync');
          setLogoutSyncCookie();
        }

        // Clear state
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        this.rememberAccount = false;

        // Clear localStorage
        if (process.client) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");

          // Keep auth_data if rememberAccount was true
          if (!this.rememberAccount) {
            localStorage.removeItem("auth_data");
          }
        }

        // Redirect to login
        navigateTo("/login");
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        this.isLoading = false;
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
            rememberAccount: this.rememberAccount
          }
          localStorage.setItem('authData', JSON.stringify(authData))
        } catch (error) {
          console.error("❌ Error saving auth data:", error);
        }
      }
    },

    /**
     * Check and restore session from localStorage
     * Migrated from @nuxtjs/auth-next behavior
     */
    async initAuth() {
      if (process.client) {
        const token = localStorage.getItem("auth_token");
        const tokenExpireAt = localStorage.getItem("token_expire_at");
        const userStr = localStorage.getItem("user");
        const authDataStr = localStorage.getItem("auth_data");

        // Try to restore from authData first (new format), then fallback to old format
        let authData = null;
        if (authDataStr) {
          try {
            authData = JSON.parse(authDataStr)
          } catch (e) {
            console.log("⚠️ Failed to parse authData:", e);
          }
        }

        if (authData && authData.user && authData.token) {
          // Use new format (authData)
          try {
            // Check if token is expired
            if (authData.tokenExpireAt) {
              const expireTime = new Date(authData.tokenExpireAt).getTime()
              const now = Date.now()
              
              if (now >= expireTime) {
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

            // Check for remember account
            if (authDataStr) {
              const authData = JSON.parse(authDataStr);
              this.rememberAccount = authData.remindAccount || false;
            }

            // Refresh user data from backend to get latest courseRegister
            await this.refreshUserData();
          } catch (error) {
            // Clear corrupted data
            this.logout();
          }
        } else {
          console.log("ℹ️ No auth data found in localStorage");
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
     */
    async completeGoogleLogin(
      accessToken: string,
      tokenExpireAt: number,
      userData: User
    ) {
      try {
        this.token = accessToken;

        // Handle tokenExpireAt properly
        if (typeof tokenExpireAt === "number") {
          this.tokenExpireAt = new Date(
            Date.now() + tokenExpireAt
          ).toISOString();
        } else {
          // Default to 7 days if not provided
          this.tokenExpireAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString();
        }

        this.user = userData;
        this.isAuthenticated = true;

        // Save to localStorage
        if (process.client) {
          localStorage.setItem("auth_token", accessToken);
          localStorage.setItem("token_expire_at", this.tokenExpireAt);
          localStorage.setItem("user", JSON.stringify(userData));
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
            localStorage.setItem("user", JSON.stringify(this.user));
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
