/**
 * Auth Plugin
 * Initializes authentication state from localStorage
 * Migrated from @nuxtjs/auth-next
 */

// Flag to prevent infinite logout loop
let isLoggingOut = false;

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
        options.headers = options.headers || {};
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${authStore.token}`,
        };
      }
    },
    onRequestError({ request, error }) {
      // Ignore AbortError (request cancelled due to navigation/reload)
      if (error?.name === 'AbortError' || String(error?.message).includes('aborted')) {
        console.log('[API] Request cancelled (navigation/reload)');
        return;
      }
      console.error('Request error:', error);
    },
    onResponseError({ request, response }) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        // Check if this is a logout request - don't trigger logout again
        const requestUrl = typeof request === 'string' ? request : request?.url || '';
        const isLogoutRequest = requestUrl.includes('/logout') || requestUrl.includes('/auth/logout');
        
        // Prevent infinite loop: don't logout if already logging out or if this is logout request
        if (isLoggingOut || isLogoutRequest) {
          return;
        }
        
        console.warn('[Auth] Unauthorized (401), logging out...');
        isLoggingOut = true;
        
        // Clear auth state directly without calling logout API
        authStore.user = null;
        authStore.token = null;
        authStore.isAuthenticated = false;
        
        // Clear localStorage
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('token_expire_at');
        }
        
        // Redirect to login
        navigateTo('/login');
        
        // Reset flag after a delay
        setTimeout(() => {
          isLoggingOut = false;
        }, 1000);
      }
    },
  });
});

