/**
 * ====================================
 * Global Auth Middleware
 * ====================================
 * Automatically runs on ALL routes
 * Handles auth state initialization and token validation
 */

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server-side
  if (process.server) return

  const authStore = useAuthStore()

  // Initialize auth if not already done
  if (!authStore.isAuthenticated && process.client) {
    authStore.initAuth()
  }

  // Check if token is expired
  if (authStore.isAuthenticated && authStore.tokenExpireAt) {
    const now = Date.now()
    const expireTime = new Date(authStore.tokenExpireAt).getTime()
    
    if (now >= expireTime) {
      console.warn('[Auth Global] Token expired, logging out...')
      authStore.logout()
      
      // Redirect to login if trying to access protected route
      if (to.meta.requiresAuth) {
        return navigateTo('/login')
      }
    }
  }
})

