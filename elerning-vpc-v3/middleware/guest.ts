/**
 * ====================================
 * Guest Middleware
 * ====================================
 * Redirects authenticated users away from guest-only pages
 * Usage: definePageMeta({ middleware: 'guest' })
 * 
 * Use on: Login, Register, Forgot Password pages
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // If user is already authenticated, redirect to dashboard
  if (authStore.isAuthenticated) {
    
    // Check if there's a saved redirect path
    if (process.client) {
      const redirectPath = localStorage.getItem('redirect_after_login');
      if (redirectPath && redirectPath !== '/login') {
        localStorage.removeItem('redirect_after_login');
        return navigateTo(redirectPath);
      }
    }

    // Default redirect to dashboard
    return navigateTo('/dashboard');
  }
});
