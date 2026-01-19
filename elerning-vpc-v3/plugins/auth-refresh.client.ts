/**
 * ====================================
 * Auto Token Refresh Plugin
 * ====================================
 * Automatically checks and refreshes token before expiry
 * Runs every 5 minutes in the background
 * 
 * TEMPORARILY DISABLED - Causing Premature Close errors
 */

export default defineNuxtPlugin(nuxtApp => {
  // DISABLED: Causing too many premature close errors
  return;
  
  const authStore = useAuthStore();
  let refreshInterval: NodeJS.Timeout | null = null;

  // Check token expiry and auto-refresh if needed
  const checkAndRefreshToken = async () => {
    if (!authStore.isAuthenticated || !authStore.tokenExpireAt) {
      return;
    }

    const now = Date.now();
    const expireTime = new Date(authStore.tokenExpireAt).getTime();
    const timeUntilExpiry = expireTime - now;

    // If token expires in less than 30 minutes
    const thirtyMinutes = 30 * 60 * 1000;
    
    if (timeUntilExpiry < thirtyMinutes && timeUntilExpiry > 0) {
      
      // Try to renew token if remember me is enabled
      if (authStore.rememberAccount) {
        try {
          const savedAuthData = localStorage.getItem('auth_data');
          if (savedAuthData) {
            const authData = JSON.parse(savedAuthData);
            
            if (authData.username) {
              // Get saved password (note: in production, use more secure method)
              const savedPassword = sessionStorage.getItem('temp_pwd') || authData.password;
              
              if (savedPassword) {
                const result = await authStore.login(
                  authData.username,
                  savedPassword,
                  true,
                );
                
                if (result.success) {
                } else {
                }
              }
            }
          }
        } catch (error: any) {
          // Ignore AbortError (request cancelled due to navigation/reload)
          if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
            return;
          }
        }
      }
    } else if (timeUntilExpiry <= 0) {
      // Token already expired
      authStore.logout();
      navigateTo('/login');
    }
  };

  // Start refresh interval on client side
  if (process.client) {
    // Wait for app to be fully mounted before checking
    nuxtApp.hook('app:mounted', () => {
      // Check after 5 seconds (give time for app to stabilize)
      setTimeout(() => {
        checkAndRefreshToken();
      }, 5000);
    });

    // Then check every 5 minutes
    refreshInterval = setInterval(() => {
      checkAndRefreshToken();
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Cleanup on app unmount
  nuxtApp.hook('app:unmount', () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  });

  // Provide helper to manually trigger refresh
  return {
    provide: {
      checkAuth: checkAndRefreshToken,
    },
  };
});

