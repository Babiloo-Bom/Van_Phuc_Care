/**
 * ====================================
 * Admin-only Middleware
 * ====================================
 * Shortcut middleware for admin-only pages
 * Usage: definePageMeta({ middleware: 'admin' })
 * 
 * Equivalent to:
 * definePageMeta({ 
 *   middleware: ['auth', 'role'],
 *   requiredRole: 'admin'
 * })
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Check if authenticated
  if (!authStore.isAuthenticated) {
    
    if (process.client) {
      localStorage.setItem('redirect_after_login', to.fullPath)
    }
    
    return navigateTo('/login')
  }

  // Check if user is admin
  const userRole = authStore.user?.role

  if (userRole !== 'admin' && userRole !== 'super_admin') {
    
    // Redirect to dashboard or unauthorized
    return navigateTo('/unauthorized')
  }
})

