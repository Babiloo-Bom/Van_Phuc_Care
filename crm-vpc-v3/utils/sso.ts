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
    // Production: Use cookie with domain for subdomain sharing
    try {
      const cookieString = `${SSO_COOKIE}=${encodedToken}; expires=${expires.toUTCString()}; path=/; domain=${COOKIE_DOMAIN}; SameSite=Lax`;
      document.cookie = cookieString;
      console.log('[SSO] Cookie set:', cookieString.substring(0, 100) + '...');
      // Verify cookie was set
      const cookies = document.cookie.split(';');
      const found = cookies.some(c => c.trim().startsWith(SSO_COOKIE + '='));
      console.log('[SSO] Cookie verification:', found ? 'SUCCESS' : 'FAILED');
    } catch (e) {
      console.error('[SSO] Error setting cookie with domain, using fallback:', e);
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
    console.log('[SSO] Looking for cookie name:', SSO_COOKIE);
    console.log('[SSO] Current hostname:', window.location.hostname);
    console.log('[SSO] All cookies:', cookies.map(c => {
      const parts = c.trim().split('=');
      return parts[0];
    }));
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      console.log('[SSO] Checking cookie:', name, '===', SSO_COOKIE, '?', name === SSO_COOKIE);
      if (name === SSO_COOKIE && value) {
        console.log('[SSO] ✅ Found SSO cookie:', name, 'value length:', value.length);
        return value;
      }
    }
    console.log('[SSO] ❌ No SSO cookie found on', window.location.hostname);
    console.log('[SSO] Note: Cookie with domain=.vanphuccare.com set on elearning.vanphuccare.com should be readable on crm.vanphuccare.com');
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
    
    // If already logged in, don't clear cookie immediately
    // Let the other site read it first, then it will be cleared
    if (authStore.isAuthenticated) {
      console.log('[SSO] Already logged in on this site, but keeping cookie for other site');
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
    
    // Use $fetch directly to avoid auto-logout on 401 from useApiClient
    // We'll handle errors manually during SSO
    try {
      console.log('[SSO] Verifying token with backend...');
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
          console.log('[SSO] Got 401 on first attempt, waiting 300ms and retrying...');
          await new Promise(resolve => setTimeout(resolve, 300));
          try {
            profileResponse = await $fetch('/api/users/profile', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${ssoData.token}`,
              },
            });
          } catch (retryError: any) {
            console.error('[SSO] Retry also failed:', retryError);
            throw retryError;
          }
        } else {
          throw error;
        }
      }
      
      console.log('[SSO] Profile response received:', profileResponse);
      const userData = profileResponse?.data?.user || profileResponse?.data?.data || profileResponse?.data;
      
      if (userData) {
        console.log('[SSO] User data found, setting auth state...');
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
        }
        
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
  
  if (!token) {
    console.warn('[SSO] No token available for SSO, returning URL without SSO');
    return baseUrl + path;
  }
  
  console.log('[SSO] Building SSO URL for:', baseUrl + path);
  // Set SSO cookie before navigation
  setSSOCookie(token);
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

