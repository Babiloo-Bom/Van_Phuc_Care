/**
 * ====================================
 * Auth Middleware (Named)
 * ====================================
 * Protects routes that require authentication
 * Usage: definePageMeta({ middleware: 'auth' })
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    console.warn('[Auth Middleware] User not authenticated, redirecting to login');
    
    // Save intended destination
    if (process.client) {
      localStorage.setItem('redirect_after_login', to.fullPath);
    }

    // Redirect to login
    return navigateTo('/login');
  }

  // Optional: Check if user account is active
  if (authStore.user && authStore.user.status === 'inactive') {
    console.warn('[Auth Middleware] User account is inactive');
    
    // Logout and redirect
    authStore.logout();
    return navigateTo('/login');
  }
});
