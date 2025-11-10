/**
 * ====================================
 * Auth Middleware (Named)
 * ====================================
 * Protects routes that require authentication
 * Usage: definePageMeta({ middleware: 'auth' })
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  await authStore.initAuth()

  if (!authStore.isAuthenticated && process.client) {
    
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('user')
    const tokenExpireAt = localStorage.getItem('token_expire_at')
    
    if (token && userStr && tokenExpireAt) {
      await authStore.initAuth()
      
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  if (!authStore.isAuthenticated) {
    if (process.client) {
      localStorage.setItem('redirect_after_login', to.fullPath)
    }

    navigateTo('/login')
  }

  if (authStore.user && authStore.user.status === 'inactive') {
    authStore.logout()
    return navigateTo('/login')
  }
})
