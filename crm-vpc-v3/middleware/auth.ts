/**
 * Auth Middleware
 * Protects routes that require authentication
 * Migrated from @nuxtjs/auth-next
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    // Save the intended destination
    if (process.client) {
      localStorage.setItem('redirect_after_login', to.fullPath)
    }

    // Redirect to login
    return navigateTo('/login')
  }
})
