/**
 * ====================================
 * Email Verified Middleware
 * ====================================
 * Checks if user's email is verified
 * Usage: definePageMeta({ middleware: ['auth', 'verified'] })
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Check if authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }

  // Check if email is verified
  const isVerified = authStore.user?.verified;

  if (!isVerified) {
    console.warn('[Verified Middleware] User email not verified');
    
    // Redirect to email verification page
    return navigateTo('/verify-email');
  }
});

