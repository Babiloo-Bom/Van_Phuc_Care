/**
 * ====================================
 * Auto Token Refresh Plugin
 * ====================================
 * Automatically checks and refreshes token before expiry
 * Runs every 5 minutes in the background
 */

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()
  let refreshInterval: NodeJS.Timeout | null = null

  // Check token expiry and auto-refresh if needed
  const checkAndRefreshToken = async () => {
    if (!authStore.isAuthenticated || !authStore.tokenExpireAt) {
      return
    }

    const now = Date.now()
    const expireTime = new Date(authStore.tokenExpireAt).getTime()
    const timeUntilExpiry = expireTime - now

    // If token expires in less than 30 minutes
    const thirtyMinutes = 30 * 60 * 1000
    
    if (timeUntilExpiry < thirtyMinutes && timeUntilExpiry > 0) {
      console.log('[Auth] Token expiring soon, attempting renewal...')
      
      // Try to renew token if remember me is enabled
      if (authStore.rememberAccount) {
        try {
          const savedAuthData = localStorage.getItem('auth_data')
          if (savedAuthData) {
            const authData = JSON.parse(savedAuthData)
            
            if (authData.username) {
              // Get saved password (note: in production, use more secure method)
              const savedPassword = sessionStorage.getItem('temp_pwd') || authData.password
              
              if (savedPassword) {
                const result = await authStore.login(
                  authData.username,
                  savedPassword,
                  true
                )
                
                if (result.success) {
                  console.log('[Auth] Token renewed successfully')
                } else {
                  console.warn('[Auth] Token renewal failed:', result.error)
                }
              }
            }
          }
        } catch (error) {
          console.error('[Auth] Token renewal error:', error)
        }
      } else {
        console.log('[Auth] Token expiring soon but remember me not enabled')
      }
    } else if (timeUntilExpiry <= 0) {
      // Token already expired
      console.warn('[Auth] Token expired, logging out...')
      authStore.logout()
      navigateTo('/login')
    }
  }

  // Start refresh interval on client side
  if (process.client) {
    // Check immediately on app start
    setTimeout(() => {
      checkAndRefreshToken()
    }, 2000)

    // Then check every 5 minutes
    refreshInterval = setInterval(() => {
      checkAndRefreshToken()
    }, 5 * 60 * 1000) // 5 minutes
  }

  // Cleanup on app unmount
  nuxtApp.hook('app:unmount', () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
  })

  // Provide helper to manually trigger refresh
  return {
    provide: {
      checkAuth: checkAndRefreshToken
    }
  }
})

