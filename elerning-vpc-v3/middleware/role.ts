/**
 * ====================================
 * Role-based Middleware
 * ====================================
 * Checks if user has required role
 * Usage: definePageMeta({ 
 *   middleware: 'auth',
 *   requiredRole: 'admin' 
 * })
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // First check if authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Get required role from route meta
  const requiredRole = to.meta.requiredRole as string | undefined

  if (!requiredRole) {
    // No role requirement, allow access
    return
  }

  // Check if user has the required role
  const userRole = authStore.user?.role

  if (!userRole || userRole !== requiredRole) {
    
    // Redirect to unauthorized page or dashboard
    return navigateTo('/unauthorized')
  }
})

