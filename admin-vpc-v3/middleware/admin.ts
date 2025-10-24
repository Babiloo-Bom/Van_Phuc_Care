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
    console.warn('[Admin Middleware] User not authenticated')
    
    if (process.client) {
      localStorage.setItem('redirect_after_login', to.fullPath)
    }
    
    return navigateTo('/login')
  }

  // Check if user is admin
  const userRole = authStore.user?.role

  if (userRole !== 'admin' && userRole !== 'super_admin') {
    console.warn('[Admin Middleware] User is not an admin. Role:', userRole)
    
    // Redirect to dashboard or unauthorized
    return navigateTo('/unauthorized')
  }
})

