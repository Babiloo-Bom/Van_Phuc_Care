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
        const isCoursesRequest = requestUrl.includes('/courses/my-courses');
        
        // Don't logout immediately after login
        if (authStore.justLoggedIn) {
          console.warn('[Auth] 401 immediately after login, skipping logout');
          return;
        }
        
        // Check if login was recent (within last 15 seconds)
        // If loginTimestamp is null but justLoggedIn is true, still skip logout
        const timeSinceLogin = authStore.loginTimestamp 
          ? Date.now() - authStore.loginTimestamp 
          : (authStore.justLoggedIn ? 0 : Infinity); // If justLoggedIn but no timestamp, treat as just logged in
        if (timeSinceLogin < 15000) {
          console.warn('[Auth] 401 but login was recent (', timeSinceLogin, 'ms ago), skipping logout');
          return;
        }
        
        // Check if SSO cookie exists (user might be in the middle of SSO login)
        if (process.client) {
          try {
            const { checkSSOCookie } = require('~/utils/sso');
            const hasSSOCookie = checkSSOCookie();
            if (hasSSOCookie) {
              console.warn('[Auth] 401 but SSO cookie exists, skipping logout (SSO in progress)');
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
          console.warn('[Auth] 401 on profile request, skipping logout (non-critical)');
          return;
        }
        
        // Don't logout on courses request if login was very recent (might be SSO in progress)
        if (isCoursesRequest && timeSinceLogin < 30000) {
          console.warn('[Auth] 401 on courses request but login was recent (', timeSinceLogin, 'ms ago), skipping logout');
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

