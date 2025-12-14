/**
 * SSO utility to share authentication token between CRM and Elearning sites using cookies
 * This allows seamless navigation between sites without re-login
 * Similar to logout sync, uses cookies for cross-subdomain sharing
 */

const SSO_COOKIE = 'auth_sso_token';
const COOKIE_DOMAIN = '.vanphuccare.com';

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
  if (!process.client || !token) return;
  
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
      document.cookie = `${SSO_COOKIE}=${encodedToken}; expires=${expires.toUTCString()}; path=/; domain=${COOKIE_DOMAIN}; SameSite=Lax`;
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
          return localStorage.getItem(key);
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
  if (!encodedToken) return false;
  
  try {
    // Decode token
    const ssoData = JSON.parse(atob(encodedToken));
    
    // Check if token is expired
    if (Date.now() - ssoData.timestamp > ssoData.expiresIn) {
      console.warn('[SSO] Token expired');
      clearSSOCookie();
      return false;
    }
    
    const authStore = useAuthStore();
    
    // If already logged in, clear cookie and skip
    if (authStore.isAuthenticated) {
      clearSSOCookie();
      return true;
    }
    
    // Set token FIRST before calling API (so API can use it)
    authStore.token = ssoData.token;
    if (process.client) {
      localStorage.setItem('auth_token', ssoData.token);
    }
    
    // Verify token with backend
    const authApi = useAuthApi();
    try {
      // Verify token by getting user profile
      const profileResponse: any = await authApi.getUserProfile();
      const userData = profileResponse?.data?.user || profileResponse?.data?.data || profileResponse?.data;
      
      if (userData) {
        // Set auth state
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
          courseRegister: userData?.courseRegister || [],
          courseCompleted: userData?.courseCompleted || [],
        };
        
        // Save user to localStorage (token already saved above)
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(authStore.user));
        }
        
        // Clear SSO cookie after successful login
        clearSSOCookie();
        
        return true;
      }
    } catch (error) {
      console.error('[SSO] Failed to verify token:', error);
      // Clear token if verification failed
      authStore.token = null;
      authStore.isAuthenticated = false;
      if (process.client) {
        localStorage.removeItem('auth_token');
      }
      clearSSOCookie();
      return false;
    }
    
    // If no userData, clear everything
    authStore.token = null;
    authStore.isAuthenticated = false;
    if (process.client) {
      localStorage.removeItem('auth_token');
    }
    clearSSOCookie();
    return false;
  } catch (error) {
    console.error('[SSO] Failed to parse SSO token:', error);
    clearSSOCookie();
    return false;
  }
}

/**
 * Build SSO URL and set cookie
 * This sets the SSO cookie before navigation
 */
export function buildSSOUrl(baseUrl: string, path: string): string {
  if (!process.client) return baseUrl + path;
  
  const authStore = useAuthStore();
  const token = authStore.token;
  
  if (!token) return baseUrl + path;
  
  // Set SSO cookie before navigation
  setSSOCookie(token);
  
  // Return clean URL without token parameter
  return baseUrl + path;
}

/**
 * Start monitoring SSO cookie
 * Call this in onMounted to check periodically
 */
export function startSSOMonitor(callback: () => void, intervalMs: number = 2000) {
  if (!process.client) return () => {};
  
  const interval = setInterval(() => {
    if (checkSSOCookie()) {
      callback();
    }
  }, intervalMs);
  
  return () => clearInterval(interval);
}

