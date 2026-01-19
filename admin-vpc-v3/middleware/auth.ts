/**
 * ====================================
 * Auth Middleware (Named)
 * ====================================
 * Protects routes that require authentication
 * Only allows admin, manager, worker roles
 * Usage: definePageMeta({ middleware: 'auth' })
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  
  // Initialize auth from localStorage
  await authStore.initAuth()

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    
    // Save intended destination
    if (process.client) {
      localStorage.setItem('redirect_after_login', to.fullPath)
    }

    // Redirect to login
    return navigateTo('/login')
  }

  // Check if user has allowed role (admin, manager, worker)
  const userRole = authStore.user?.role
  const allowedRoles = ['admin', 'manager', 'worker']
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    
    // Show error message before logout
    if (process.client) {
      const { message } = await import('ant-design-vue')
      message.error('Bạn không có quyền truy cập vào hệ thống quản trị. Chỉ admin, manager và worker mới được phép.')
    }
    
    // Logout and redirect
    await authStore.logout(false)
    return navigateTo('/login')
  }

  // Optional: Check if user account is active
  if (authStore.user && authStore.user.status === 'inactive') {
    
    // Logout and redirect (don't show message - account inactive)
    await authStore.logout(false)
    return navigateTo('/login')
  }
})
