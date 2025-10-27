/**
 * ====================================
 * Auth Middleware (Named)
 * ====================================
 * Protects routes that require authentication
 * Usage: definePageMeta({ middleware: 'auth' })
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  console.log('🔍 [Auth Middleware] Checking auth state:', {
    route: to.fullPath,
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    hasUser: !!authStore.user,
    userStatus: authStore.user?.status,
    timestamp: new Date().toISOString()
  })

  // If not authenticated, try to initialize auth first
  if (!authStore.isAuthenticated && process.client) {
    console.log('🔄 [Auth Middleware] Not authenticated, trying to init auth...')
    
    // Check localStorage directly
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('user')
    const tokenExpireAt = localStorage.getItem('token_expire_at')
    
    console.log('🔍 [Auth Middleware] localStorage check:', {
      hasToken: !!token,
      hasUser: !!userStr,
      hasExpireAt: !!tokenExpireAt
    })
    
    if (token && userStr && tokenExpireAt) {
      console.log('🔄 [Auth Middleware] Found auth data, initializing...')
      await authStore.initAuth()
      
      // Wait a bit for auth to initialize
      await new Promise(resolve => setTimeout(resolve, 200))
      
      console.log('✅ [Auth Middleware] Auth init result:', {
        isAuthenticated: authStore.isAuthenticated,
        hasToken: !!authStore.token,
        hasUser: !!authStore.user
      })
    }
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    console.warn('[Auth Middleware] User not authenticated, redirecting to login')
    
    // Save intended destination
    if (process.client) {
      localStorage.setItem('redirect_after_login', to.fullPath)
    }

    // Redirect to login
    return navigateTo('/login')
  }

  // Optional: Check if user account is active
  if (authStore.user && authStore.user.status === 'inactive') {
    console.warn('[Auth Middleware] User account is inactive')
    
    // Logout and redirect
    authStore.logout()
    return navigateTo('/login')
  }
})
