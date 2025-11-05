/**
 * ====================================
 * Global Auth Middleware
 * ====================================
 * Automatically runs on ALL routes
 * Handles auth state initialization and token validation
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware on server-side
  if (process.server) return;

  const authStore = useAuthStore();

  console.log('🔍 Global auth middleware - checking auth state:', {
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    hasUser: !!authStore.user,
    route: to.path,
    timestamp: new Date().toISOString(),
  });

  // Initialize auth if not already done
  if (!authStore.isAuthenticated && process.client) {
    console.log('🔄 Initializing auth in middleware...');
    authStore.initAuth();
    
    // Wait a bit for auth to initialize
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('✅ Auth initialized in middleware:', {
      isAuthenticated: authStore.isAuthenticated,
      hasToken: !!authStore.token,
      hasUser: !!authStore.user,
    });
  }

  // Check if token is expired
  if (authStore.isAuthenticated && authStore.tokenExpireAt) {
    const now = Date.now();
    const expireTime = new Date(authStore.tokenExpireAt).getTime();
    
    if (now >= expireTime) {
      console.warn('[Auth Global] Token expired, logging out...');
      authStore.logout();
      
      // Redirect to login if trying to access protected route
      if (to.meta.requiresAuth) {
        return navigateTo('/login');
      }
    }
  }
});

