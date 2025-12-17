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

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Initialize auth from localStorage
  await authStore.initAuth()

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
    
    // Show error message and redirect to dashboard
    if (process.client) {
      const { message } = await import('ant-design-vue')
      message.error('Bạn không có quyền truy cập trang này. Chỉ quản trị viên mới được phép.')
    }
    
    // Redirect to dashboard
    return navigateTo('/')
  }
})

