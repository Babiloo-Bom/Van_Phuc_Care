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
export async function setSSOCookie(token: string): Promise<void> {
  if (!process.client || !token) {
    console.warn('[SSO] Cannot set SSO cookie: not client or no token');
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
  console.log('[SSO] Setting SSO cookie, token length:', token.length, 'encoded length:', encodedToken.length);
  
  // Set cookie with expiration in 1 minute
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 1);
  
  if (isLocalhost()) {
    console.log('[SSO] Using localStorage for localhost');
    // On localhost, use localStorage as fallback (same as logout sync)
    const syncKey = 'auth_sso_token_' + Date.now();
    localStorage.setItem(syncKey, encodedToken);
    console.log('[SSO] Saved to localStorage with key:', syncKey);
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
    console.log('[SSO] Using cookie with domain:', COOKIE_DOMAIN);
    console.log('[SSO] Current hostname:', window.location.hostname);
    // Production: Use cookie with domain for subdomain sharing
    try {
      const cookieString = `${SSO_COOKIE}=${encodedToken}; expires=${expires.toUTCString()}; path=/; domain=${COOKIE_DOMAIN}; SameSite=Lax`;
      document.cookie = cookieString;
      console.log('[SSO] Cookie set command executed');
      console.log('[SSO] Cookie string (first 150 chars):', cookieString.substring(0, 150));
      
      // Note: Cookie with domain=.vanphuccare.com will NOT appear in document.cookie
      // on the subdomain that set it, but it WILL be accessible on other subdomains
      // This is expected browser behavior
      
      // Verify cookie was set - check both with and without domain
      const allCookies = document.cookie;
      console.log('[SSO] All cookies after setting:', allCookies);
      const cookies = allCookies.split(';');
      const found = cookies.some(c => c.trim().startsWith(SSO_COOKIE + '='));
      console.log('[SSO] Cookie verification on current domain:', found ? 'SUCCESS' : 'FAILED');
      
      if (!found) {
        console.warn('[SSO] Cookie not found on current domain, but it may be set for parent domain');
        console.warn('[SSO] This is expected - cookie with domain=.vanphuccare.com will not appear in document.cookie on subdomain');
      }
    } catch (e) {
      console.error('[SSO] Error setting cookie with domain, using fallback:', e);
      // Fallback if domain setting fails
      document.cookie = `${SSO_COOKIE}=${encodedToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      console.log('[SSO] Fallback cookie set (without domain)');
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
          console.log('[SSO] Found SSO token in localStorage:', key);
          return value;
        }
      }
    }
    return null;
  } else {
    // Production: Check cookie
    const cookies = document.cookie.split(';');
    console.log('[SSO] Checking cookies, total:', cookies.length);
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === SSO_COOKIE && value) {
        console.log('[SSO] Found SSO cookie:', name, 'value length:', value.length);
        return value;
      }
    }
    console.log('[SSO] No SSO cookie found');
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
  
  console.log('[SSO] Checking for SSO cookie...');
  const encodedToken = checkSSOCookie();
  if (!encodedToken) {
    console.log('[SSO] No SSO cookie found');
    return false;
  }
  
  console.log('[SSO] SSO cookie found, decoding...');
  try {
    // Decode token
    const ssoData = JSON.parse(atob(encodedToken));
    console.log('[SSO] Token decoded, timestamp:', ssoData.timestamp, 'age:', Date.now() - ssoData.timestamp, 'ms');
    
    // Check if token is expired
    if (Date.now() - ssoData.timestamp > ssoData.expiresIn) {
      console.warn('[SSO] Token expired');
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
      console.log('[SSO] Set justLoggedIn flag IMMEDIATELY when SSO cookie detected, timestamp:', authStore.loginTimestamp);
      // Save to localStorage immediately for restoration after refresh
      if (process.client) {
        localStorage.setItem('login_timestamp', String(authStore.loginTimestamp));
      }
      setTimeout(() => {
        authStore.justLoggedIn = false;
        console.log('[SSO] Cleared justLoggedIn flag after 30 seconds');
      }, 30000); // 30 seconds grace period (increased from 15)
    }
    
    // If already logged in, don't clear cookie immediately
    // Let the other site read it first, then it will be cleared
    if (authStore.isAuthenticated) {
      console.log('[SSO] Already logged in on this site, but keeping cookie for other site');
      // justLoggedIn flag was already set above
      // Don't clear cookie immediately - let other site read it first
      // Cookie will expire in 1 minute anyway
      return true;
    }
    
    console.log('[SSO] Setting token to authStore...');
    // Set token FIRST before calling API (so API can use it)
    authStore.token = ssoData.token;
    if (process.client) {
      localStorage.setItem('auth_token', ssoData.token);
      console.log('[SSO] Token saved to localStorage');
    }
    
    // Set justLoggedIn flag IMMEDIATELY to protect against auto-logout
    // This must be set BEFORE verifying with backend, as API calls might happen during verification
    // Only set if not already set (might have been set above when detecting SSO cookie)
    if (!authStore.justLoggedIn) {
      authStore.justLoggedIn = true;
      authStore.loginTimestamp = Date.now();
      console.log('[SSO] Set justLoggedIn flag IMMEDIATELY, timestamp:', authStore.loginTimestamp);
      // Save to localStorage immediately for restoration after refresh
      if (process.client) {
        localStorage.setItem('login_timestamp', String(authStore.loginTimestamp));
      }
      setTimeout(() => {
        authStore.justLoggedIn = false;
        console.log('[SSO] Cleared justLoggedIn flag after 30 seconds');
      }, 30000); // 30 seconds grace period (increased from 15)
    } else {
      // Update timestamp if already set (to extend grace period)
      authStore.loginTimestamp = Date.now();
      console.log('[SSO] Updated loginTimestamp, timestamp:', authStore.loginTimestamp);
      if (process.client) {
        localStorage.setItem('login_timestamp', String(authStore.loginTimestamp));
      }
    }
    
    // Verify token with backend
    const authApi = useAuthApi();
    try {
      console.log('[SSO] Verifying token with backend...');
      // Verify token by getting user profile
      const profileResponse: any = await authApi.getUserProfile();
      console.log('[SSO] Profile response received:', profileResponse);
      const userData = profileResponse?.data?.user || profileResponse?.data?.data || profileResponse?.data;
      
      if (userData) {
        console.log('[SSO] User data found, setting auth state...');
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
          console.log('[SSO] Auth data saved to localStorage with loginTimestamp:', authStore.loginTimestamp);
        }
        
        // justLoggedIn flag was already set above, before verification
        // This ensures API calls during verification are protected
        console.log('[SSO] SSO login successful!');
        
        // Clear SSO cookie after a short delay to ensure it's been read
        // This prevents the cookie from being cleared too early
        setTimeout(() => {
          clearSSOCookie();
          console.log('[SSO] SSO cookie cleared after successful login');
        }, 1000);
        
        return true;
      } else {
        console.warn('[SSO] No user data in response');
      }
    } catch (error: any) {
      console.error('[SSO] Failed to verify token:', error);
      console.error('[SSO] Error details:', {
        message: error?.message,
        status: error?.statusCode || error?.status,
        data: error?.data,
      });
      // Clear token if verification failed
      authStore.token = null;
      authStore.isAuthenticated = false;
      authStore.justLoggedIn = false;
      authStore.loginTimestamp = null;
      if (process.client) {
        localStorage.removeItem('auth_token');
      }
      clearSSOCookie();
      return false;
    }
    
    // If no userData, clear everything
    authStore.token = null;
    authStore.isAuthenticated = false;
    authStore.justLoggedIn = false;
    authStore.loginTimestamp = null;
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
export async function buildSSOUrl(baseUrl: string, path: string): Promise<string> {
  if (!process.client) return baseUrl + path;
  
  const authStore = useAuthStore();
  const token = authStore.token;
  
  if (!token) {
    console.warn('[SSO] No token available for SSO, returning URL without SSO');
    return baseUrl + path;
  }
  
  console.log('[SSO] Building SSO URL for:', baseUrl + path);
  // Set SSO cookie before navigation
  await setSSOCookie(token);
  console.log('[SSO] SSO cookie set, navigating...');
  
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

