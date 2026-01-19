/**
 * Auth Plugin
 * Initializes authentication state from localStorage
 * Migrated from @nuxtjs/auth-next
 */

export default defineNuxtPlugin(async nuxtApp => {
  const authStore = useAuthStore();

  // Initialize auth state from cookies - MUST await to ensure auth is ready before app loads
  // Only init if not already authenticated (to avoid overriding fresh login)
  // This prevents initAuth from running after a successful login
  if (!authStore.isAuthenticated || !authStore.token) {
    await authStore.initAuth();
  }

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
    },
    onResponseError({ request, response }) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        const requestUrl = typeof request === 'string' ? request : request?.url || '';
        const isLogoutRequest = requestUrl.includes('/logout') || requestUrl.includes('/auth/logout');
        const isProfileRequest = requestUrl.includes('/users/profile') || requestUrl.includes('/profile');
        const isCoursesRequest = requestUrl.includes('/courses/my-courses');
        
        // Don't logout if user is not authenticated (nothing to logout from)
        if (!authStore.isAuthenticated && !authStore.token) {
          return;
        }
        
        // Don't logout immediately after login
        if (authStore.justLoggedIn) {
          return;
        }
        
        // Check if login was recent (within last 30 seconds)
        // If loginTimestamp is null but justLoggedIn is true, still skip logout
        const timeSinceLogin = authStore.loginTimestamp 
          ? Date.now() - authStore.loginTimestamp 
          : (authStore.justLoggedIn ? 0 : Infinity); // If justLoggedIn but no timestamp, treat as just logged in
        if (timeSinceLogin < 30000) {
          return;
        }
        
        // Check if SSO cookie exists (user might be in the middle of SSO login)
        if (process.client) {
          try {
            const { checkSSOCookie } = require('~/utils/sso');
            const hasSSOCookie = checkSSOCookie();
            if (hasSSOCookie) {
              // Set justLoggedIn to protect against further 401s
              if (!authStore.justLoggedIn) {
                authStore.justLoggedIn = true;
                authStore.loginTimestamp = Date.now();
                setTimeout(() => {
                  authStore.justLoggedIn = false;
                }, 15000);
              }
              return;
            }
          } catch (e) {
            // Ignore if sso utils not available
          }
        }
        
        // Don't logout on profile refresh errors - session might still be valid
        if (isProfileRequest) {
          return;
        }
        
        // Don't logout on courses request if login was very recent (might be SSO in progress)
        // Increase grace period for courses request to 60 seconds
        if (isCoursesRequest && timeSinceLogin < 60000) {
          return;
        }
        
        // Prevent infinite loop: don't logout if this is logout request
        if (isLogoutRequest) {
          return;
        }
        
        authStore.logout();
      }
    },
  });
});

