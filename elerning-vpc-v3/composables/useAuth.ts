/**
 * ====================================
 * useAuth() Composable
 * ====================================
 * Main authentication composable
 * Provides easy access to auth functionality
 */

export const useAuth = () => {
  const authStore = useAuthStore();
  const router = useRouter();
  const config = useRuntimeConfig();

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => authStore.isAuthenticated);

  /**
   * Get current user
   */
  const user = computed(() => authStore.user);

  /**
   * Get auth token
   */
  const token = computed(() => authStore.token);

  /**
   * Check if token is expired or will expire soon (within 5 minutes)
   */
  const isTokenExpiringSoon = computed(() => {
    if (!authStore.tokenExpireAt) return false;
    const now = Date.now();
    const expireTime = new Date(authStore.tokenExpireAt).getTime();
    const fiveMinutes = 5 * 60 * 1000;
    return (expireTime - now) < fiveMinutes;
  });

  /**
   * Get token expiry time in human readable format
   */
  const tokenExpiresIn = computed(() => {
    if (!authStore.tokenExpireAt) return null;
    const now = Date.now();
    const expireTime = new Date(authStore.tokenExpireAt).getTime();
    const diff = expireTime - now;
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  });

  /**
   * Login with credentials
   */
  const login = async (
    username: string,
    password: string,
    remindAccount = false,
  ): Promise<{
    success: boolean
    error?: string
    user?: any
  }> => {
    try {
      const result = await authStore.login(username, password, remindAccount);
      
      if (result.success) {
        // Redirect to intended page or dashboard
        const redirectPath = localStorage.getItem('redirect_after_login') || '/dashboard';
        localStorage.removeItem('redirect_after_login');
        await router.push(redirectPath);
      }
      
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Đăng nhập thất bại',
      };
    }
  };

  /**
   * Logout
   */
  const logout = async (redirectToLogin = true) => {
    await authStore.logout();
    
    if (redirectToLogin) {
      await router.push('/login');
    }
  };

  /**
   * Register new account
   */
  const register = async (
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    return await authStore.register(email, password, confirmPassword);
  };

  /**
   * Verify email with OTP
   */
  const verifyEmail = async (email: string, otp: string) => {
    return await authStore.verifyEmail(email, otp);
  };

  /**
   * Send forgot password request
   */
  const forgotPassword = async (email: string) => {
    return await authStore.forgotPassword(email);
  };

  /**
   * Verify OTP for password reset
   */
  const verifyOtp = async (email: string, otp: string) => {
    return await authStore.verifyOtp(email, otp);
  };

  /**
   * Reset password with token
   */
  const resetPassword = async (
    email: string,
    token: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    return await authStore.resetPassword(email, token, newPassword, confirmPassword);
  };

  /**
   * Change password (when logged in)
   */
  const changePassword = async (
    oldPassword: string,
    newPassword: string,
  ) => {
    return await authStore.changePassword(oldPassword, newPassword);
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    return await authStore.fetchUser();
  };

  /**
   * Check if user has specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!authStore.user) return false;
    return authStore.user.permissions?.includes(permission) || false;
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role: string): boolean => {
    if (!authStore.user) return false;
    return authStore.user.role === role;
  };

  /**
   * Renew token (re-login silently if remember me was enabled)
   */
  const renewToken = async (): Promise<boolean> => {
    try {
      // Check if we have saved credentials
      if (!authStore.rememberAccount) {
        return false;
      }

      const savedAuthData = localStorage.getItem('auth_data');
      if (!savedAuthData) {
        return false;
      }

      const authData = JSON.parse(savedAuthData);
      if (!authData.username || !authData.password) {
        return false;
      }

      // Silently re-login
      const result = await authStore.login(
        authData.username,
        authData.password,
        true,
      );

      return result.success;
    } catch (error) {
      return false;
    }
  };

  /**
   * Initialize auth state (called on app start)
   */
  const initAuth = () => {
    authStore.initAuth();
  };

  return {
    // State
    isAuthenticated,
    user,
    token,
    isTokenExpiringSoon,
    tokenExpiresIn,
    
    // Actions
    login,
    logout,
    register,
    verifyEmail,
    forgotPassword,
    verifyOtp,
    resetPassword,
    changePassword,
    refreshUser,
    renewToken,
    initAuth,
    
    // Helpers
    hasPermission,
    hasRole,
  };
};
