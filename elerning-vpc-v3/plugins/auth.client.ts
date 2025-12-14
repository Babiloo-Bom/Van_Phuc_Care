/**
 * Auth Plugin
 * Initializes authentication state from localStorage
 * Migrated from @nuxtjs/auth-next
 */

export default defineNuxtPlugin(nuxtApp => {
  const authStore = useAuthStore();

  // Initialize auth state from localStorage
  authStore.initAuth();

  // Handle navigation after login
  nuxtApp.hook('app:mounted', () => {
    if (authStore.isAuthenticated) {
      const redirectPath = localStorage.getItem('redirect_after_login');
      if (redirectPath && redirectPath !== '/login') {
        localStorage.removeItem('redirect_after_login');
        navigateTo(redirectPath);
      }
    }
  });

  // Add global $fetch interceptor for API calls
  globalThis.$fetch = $fetch.create({
    onRequest({ request, options }) {
      // Add auth token to all API requests
      if (authStore.token) {
        if (!options.headers) {
          options.headers = {} as any;
        }
        const headers = options.headers as any;
        headers['Authorization'] = `Bearer ${authStore.token}`;
      }
    },
    onRequestError({ request, error }) {
      // Ignore AbortError (request cancelled due to navigation/reload)
      if (error?.name === 'AbortError' || String(error?.message).includes('aborted')) {
        return
      }
      console.error('Request error:', error);
    },
    onResponseError({ request, response }) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        const requestUrl = typeof request === 'string' ? request : request?.url || '';
        const isLogoutRequest = requestUrl.includes('/logout') || requestUrl.includes('/auth/logout');
        const isProfileRequest = requestUrl.includes('/users/profile') || requestUrl.includes('/profile');
        
        // Don't logout immediately after login
        if (authStore.justLoggedIn) {
          console.warn('[Auth] 401 immediately after login, skipping logout');
          return;
        }
        
        // Check if login was recent (within last 15 seconds)
        const timeSinceLogin = authStore.loginTimestamp 
          ? Date.now() - authStore.loginTimestamp 
          : Infinity;
        if (timeSinceLogin < 15000) {
          console.warn('[Auth] 401 but login was recent (', timeSinceLogin, 'ms ago), skipping logout');
          return;
        }
        
        // Don't logout on profile refresh errors - session might still be valid
        if (isProfileRequest) {
          console.warn('[Auth] 401 on profile request, skipping logout (non-critical)');
          return;
        }
        
        // Prevent infinite loop: don't logout if this is logout request
        if (isLogoutRequest) {
          return;
        }
        
        console.warn('[Auth] Unauthorized (401), logging out...');
        console.warn('[Auth] Request URL:', requestUrl);
        console.warn('[Auth] Time since login:', timeSinceLogin, 'ms');
        authStore.logout();
      }
    },
  });
});

