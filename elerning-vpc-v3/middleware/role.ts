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
    console.warn('[Role Middleware] User not authenticated')
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
    console.warn('[Role Middleware] User does not have required role:', requiredRole)
    
    // Redirect to unauthorized page or dashboard
    return navigateTo('/unauthorized')
  }
})

