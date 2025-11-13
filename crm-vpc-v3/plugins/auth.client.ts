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
        console.warn('Unauthorized, logging out...');
        authStore.logout();
      }
    },
  });
});

