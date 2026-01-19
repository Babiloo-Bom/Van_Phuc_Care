/**
 * ====================================
 * Role-based Middleware
 * ====================================
 * Checks if user has required role(s)
 * Usage: definePageMeta({ 
 *   middleware: ['auth', 'role'],
 *   requiredRole: 'admin'  // Single role
 *   // OR
 *   requiredRole: ['admin', 'manager']  // Multiple roles
 * })
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // First check if authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Get required role from route meta
  const requiredRole = to.meta.requiredRole as string | string[] | undefined

  if (!requiredRole) {
    // No role requirement, allow access
    return
  }

  // Check if user has the required role(s)
  const userRole = authStore.user?.role

  if (!userRole) {
    return navigateTo('/unauthorized')
  }

  // Support both single role and array of roles
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  const hasRequiredRole = allowedRoles.includes(userRole)

  if (!hasRequiredRole) {
    
    // Show error message
    if (process.client) {
      const { message } = await import('ant-design-vue')
      message.error('Bạn không có quyền truy cập trang này')
    }
    
    // Redirect to dashboard
    return navigateTo('/')
  }
})

