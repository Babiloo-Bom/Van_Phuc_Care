/**
 * SSO utility to share authentication token between CRM and Elearning sites using cookies
 * This allows seamless navigation between sites without re-login
 * Similar to logout sync, uses cookies for cross-subdomain sharing
 */

const SSO_COOKIE = 'auth_sso_token';
const COOKIE_DOMAIN = '.vanphuccare.vn';

/**
 * Check if running on localhost
 */
function isLocalhost(): boolean {
  if (!process.client) return false;
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.');
}

/**
 * Set SSO cookie to share token with other site
 */
export function setSSOCookie(token: string): void {
  if (!process.client || !token) {
    return;
  }
  
  // Create SSO data
  const ssoData = {
    token: token,
    timestamp: Date.now(),
    expiresIn: 60000, // 1 minute
  };
  
  // Encode to base64
  const encodedToken = btoa(JSON.stringify(ssoData));
  
  // Set cookie with expiration in 1 minute
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 1);
  
  if (isLocalhost()) {
    // On localhost, use localStorage as fallback (same as logout sync)
    const syncKey = 'auth_sso_token_' + Date.now();
    localStorage.setItem(syncKey, encodedToken);
    // Clean up old sync keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('auth_sso_token_') && key !== syncKey) {
        const parts = key.split('_');
        const timestamp = parts[3] ? parseInt(parts[3]) : 0;
        if (timestamp && Date.now() - timestamp > 60000) {
          localStorage.removeItem(key);
        }
      }
    });
  } else {
    // Production: Use cookie with domain for subdomain sharing
    try {
      const cookieString = `${SSO_COOKIE}=${encodedToken}; expires=${expires.toUTCString()}; path=/; domain=${COOKIE_DOMAIN}; SameSite=Lax`;
      document.cookie = cookieString;
    } catch (e) {
      // Fallback if domain setting fails
      document.cookie = `${SSO_COOKIE}=${encodedToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    }
  }
}

/**
 * Check if SSO cookie exists and get token
 */
export function checkSSOCookie(): string | null {
  if (!process.client) return null;
  
  if (isLocalhost()) {
    // On localhost, check localStorage for sync keys
    const keys = Object.keys(localStorage);
    for (let key of keys) {
      if (key.startsWith('auth_sso_token_')) {
        const parts = key.split('_');
        const timestamp = parts[3] ? parseInt(parts[3]) : 0;
        // Check if sync key is recent (within 1 minute)
        if (timestamp && Date.now() - timestamp < 60000) {
          const value = localStorage.getItem(key);
          return value;
        }
      }
    }
    return null;
  } else {
    // Production: Check cookie
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === SSO_COOKIE && value) {
        return value;
      }
    }
    return null;
  }
}

/**
 * Clear SSO cookie
 */
export function clearSSOCookie(): void {
  if (process.client) {
    if (isLocalhost()) {
      // Clear all localStorage sync keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('auth_sso_token_')) {
          localStorage.removeItem(key);
        }
      });
    } else {
      // Production: Clear cookie
      try {
        document.cookie = `${SSO_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${COOKIE_DOMAIN}; SameSite=Lax`;
      } catch (e) {
        document.cookie = `${SSO_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
      }
    }
  }
}

/**
 * Handle SSO login from cookie
 */
export async function handleSSOLogin(): Promise<boolean> {
  if (!process.client) return false;
  
  const encodedToken = checkSSOCookie();
  if (!encodedToken) {
    return false;
  }
  
  try {
    // Decode token
    const ssoData = JSON.parse(atob(encodedToken));
    
    // Check if token is expired
    if (Date.now() - ssoData.timestamp > ssoData.expiresIn) {
      clearSSOCookie();
      return false;
    }
    
    const authStore = useAuthStore();
    
    // Set justLoggedIn flag IMMEDIATELY when SSO cookie is detected
    // This protects against API calls that might happen before we finish processing
    // This must be set BEFORE checking if already logged in
    if (!authStore.justLoggedIn) {
      authStore.justLoggedIn = true;
      authStore.loginTimestamp = Date.now();
      // Save to localStorage immediately for restoration after refresh
      if (process.client) {
        localStorage.setItem('login_timestamp', String(authStore.loginTimestamp));
      }
      setTimeout(() => {
        authStore.justLoggedIn = false;
      }, 30000); // 30 seconds grace period (increased from 15)
    }
    
    // If already logged in, don't clear cookie immediately
    // Let the other site read it first, then it will be cleared
    if (authStore.isAuthenticated) {
      // justLoggedIn flag was already set above
      // Don't clear cookie immediately - let other site read it first
      // Cookie will expire in 1 minute anyway
      return true;
    }
    
    // Set SSO flag to disable auto-logout during SSO process
    authStore.isSSOLoginInProgress = true;
    
    // Set token FIRST before calling API (so API can use it)
    authStore.token = ssoData.token;
    if (process.client) {
      localStorage.setItem('auth_token', ssoData.token);
    }
    
    // Set justLoggedIn flag IMMEDIATELY to protect against auto-logout
    // This must be set BEFORE verifying with backend, as API calls might happen during verification
    authStore.justLoggedIn = true;
    authStore.loginTimestamp = Date.now();
    // Save loginTimestamp to localStorage immediately for restoration after refresh
    if (process.client) {
      localStorage.setItem('login_timestamp', String(authStore.loginTimestamp));
    }
    setTimeout(() => {
      authStore.justLoggedIn = false;
    }, 30000); // 30 seconds grace period
    
    // Use $fetch directly to avoid auto-logout on 401 from useApiClient
    // We'll handle errors manually during SSO
    try {
      let profileResponse: any;
      
      try {
        // First attempt
        profileResponse = await $fetch('/api/users/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${ssoData.token}`,
          },
        });
      } catch (error: any) {
        // If 401, wait a bit and retry (token might need time to propagate)
        if (error.statusCode === 401 || error.status === 401) {
          await new Promise(resolve => setTimeout(resolve, 300));
          try {
            profileResponse = await $fetch('/api/users/profile', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${ssoData.token}`,
              },
            });
          } catch (retryError: any) {
            throw retryError;
          }
        } else {
          throw error;
        }
      }
      
      const userData = profileResponse?.data?.user || profileResponse?.data?.data || profileResponse?.data;
      
      if (userData) {
        authStore.isAuthenticated = true;
        authStore.user = {
          id: userData?._id || userData?.id || 'temp-id',
          email: userData?.email || '',
          username: userData?.username || userData?.email,
          fullname: userData?.fullname || userData?.name || '',
          name: userData?.name || userData?.fullname,
          phone: userData?.phoneNumber || userData?.phone,
          avatar: userData?.avatar,
          role: userData?.role || userData?.type,
          verified: userData?.verified,
          status: userData?.status,
          fullAddress: userData?.fullAddress || '',
          address: userData?.address || '',
          courseRegister: userData?.courseRegister || [],
          courseCompleted: userData?.courseCompleted || [],
        };
        
        // Save user to localStorage (token already saved above)
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(authStore.user));
          // Also save authData for initAuth compatibility
          const authData = {
            user: authStore.user,
            token: authStore.token,
            tokenExpireAt: authStore.tokenExpireAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            rememberAccount: authStore.rememberAccount || false,
            loginTimestamp: authStore.loginTimestamp, // Include loginTimestamp for restoration
          };
          localStorage.setItem('authData', JSON.stringify(authData));
          // Also save loginTimestamp separately for fallback
          if (authStore.loginTimestamp) {
            localStorage.setItem('login_timestamp', String(authStore.loginTimestamp));
          }
        }
        
        // Ensure authData is saved (call saveAuth to be safe)
        authStore.saveAuth();
        
        // Clear SSO flag
        authStore.isSSOLoginInProgress = false;
        
        // Clear SSO cookie after a short delay to ensure it's been read
        // This prevents the cookie from being cleared too early
        setTimeout(() => {
          clearSSOCookie();
        }, 1000);
        
        return true;
      } else {
        // Clear flags if no user data
        authStore.justLoggedIn = false;
        authStore.loginTimestamp = null;
        authStore.isSSOLoginInProgress = false;
        if (process.client) {
          localStorage.removeItem('login_timestamp');
        }
      }
    } catch (error: any) {
      // Clear SSO flag
      authStore.isSSOLoginInProgress = false;
      // Clear token if verification failed
      authStore.token = null;
      authStore.isAuthenticated = false;
      authStore.justLoggedIn = false;
      authStore.loginTimestamp = null;
      if (process.client) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('login_timestamp');
      }
      clearSSOCookie();
      return false;
    }
    
    // If no userData, clear everything
    authStore.isSSOLoginInProgress = false;
    authStore.token = null;
    authStore.isAuthenticated = false;
    if (process.client) {
      localStorage.removeItem('auth_token');
    }
    clearSSOCookie();
    return false;
  } catch (error) {
    clearSSOCookie();
    return false;
  }
}

/**
 * Build SSO URL and set cookie
 * This sets the SSO cookie before navigation
 */
export async function buildSSOUrl(baseUrl: string, path: string): Promise<string> {
  if (!process.client) return baseUrl + path;
  
  const authStore = useAuthStore();
  const token = authStore.token;
  
  if (!token) {
    return baseUrl + path;
  }
  
  // Clear any leftover logout sync cookie when setting SSO (we're logging in, not out)
  try {
    const { clearLogoutSyncCookie } = await import('~/utils/authSync');
    clearLogoutSyncCookie();
  } catch (e) {
    // Ignore errors
  }
  
  // Set SSO cookie before navigation
  await setSSOCookie(token);
  
  // Return clean URL without token parameter
  return baseUrl + path;
}

/**
 * Start monitoring SSO cookie
 * Call this in onMounted to check periodically
 */
export function startSSOMonitor(callback: () => void, intervalMs: number = 1000) {
  if (!process.client) return () => {};
  
  // Check immediately
  if (checkSSOCookie()) {
    callback();
  }
  
  // Check more frequently in the first 5 seconds (every 500ms)
  let fastCheckCount = 0;
  const fastInterval = setInterval(() => {
    fastCheckCount++;
    if (checkSSOCookie()) {
      callback();
    }
    if (fastCheckCount >= 10) { // 10 * 500ms = 5 seconds
      clearInterval(fastInterval);
    }
  }, 500);
  
  // Then check at normal interval
  const interval = setInterval(() => {
    if (checkSSOCookie()) {
      callback();
    }
  }, intervalMs);
  
  return () => {
    clearInterval(fastInterval);
    clearInterval(interval);
  };
}
