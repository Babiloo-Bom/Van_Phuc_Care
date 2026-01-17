/**
 * SSO utility to share authentication token between CRM and Elearning sites using cookies
 * This allows seamless navigation between sites without re-login
 * Similar to logout sync, uses cookies for cross-subdomain sharing
 */

const SSO_COOKIE = 'auth_sso_token';
const COOKIE_DOMAIN = '.vanphuccare.vn'; // Hardcode domain for production

/**
 * Check if running on localhost (but not local test domains)
 */
function isLocalhost(): boolean {
  if (!process.client) return false;
  const hostname = window.location.hostname;
  // Allow local test domains like my.local.test, edu.local.test
  if (hostname.endsWith('.local.test')) return false;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.');
}

/**
 * Check if current page is using HTTPS
 */
function isSecure(): boolean {
  if (!process.client) return false;
  return window.location.protocol === 'https:';
}

/**
 * Build cookie attributes string
 */
function buildCookieAttributes(domain: string | null): string {
  let attrs = 'path=/; SameSite=Lax';
  if (domain) {
    attrs += `; domain=${domain}`;
  }
  if (isSecure()) {
    attrs += '; Secure';
  }
  return attrs;
}

/**
 * Get cookie domain dynamically from current hostname
 * Returns domain like '.vanphuccare.vn' for subdomains, or null for localhost
 */
function getCookieDomain(): string | null {
  if (!process.client) return null;
  if (isLocalhost()) return null;
  
  const hostname = window.location.hostname;
  
  // Extract root domain from hostname
  // Examples:
  // - edu.vanphuccare.vn -> .vanphuccare.vn
  // - my.vanphuccare.vn -> .vanphuccare.vn
  // - admin.vanphuccare.vn -> .vanphuccare.vn
  // - vanphuccare.vn -> .vanphuccare.vn
  
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    // Get last 2 parts for domain (e.g., vanphuccare.vn)
    const rootDomain = parts.slice(-2).join('.');
    return '.' + rootDomain;
  }
  
  return null;
}

/**
 * Determine site type from hostname
 */
function getSiteType(): 'admin' | 'elearning' | 'crm' {
  if (!process.client) return 'crm';
  const hostname = window.location.hostname.toLowerCase();
  if (hostname.startsWith('admin.') || hostname.includes('.admin') || hostname.includes('admin.')) return 'admin';
  if (hostname.includes('edu') || hostname.includes('elearning') || hostname.includes('learn')) return 'elearning';
  return 'crm';
}

/**
 * Set SSO cookie/token
 * - Admin: store in localStorage (no cookie)
 * - CRM / Elearning: store in cookie (omit domain on localhost)
 */
export function setSSOCookie(token: string): void {
  if (!process.client || !token) return;
  const site = getSiteType();
  const ssoData = { token, timestamp: Date.now(), expiresIn: 60000 };
  const encodedToken = btoa(JSON.stringify(ssoData));
  const expires = new Date(Date.now() + 60000);

  if (site === 'admin') {
    // Admin: use localStorage only (no cookie)
    const syncKey = 'auth_sso_token_' + Date.now();
    localStorage.setItem(syncKey, encodedToken);
    // Clean up old keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('auth_sso_token_') && key !== syncKey) {
        const parts = key.split('_');
        const timestamp = parts[3] ? parseInt(parts[3]) : 0;
        if (timestamp && Date.now() - timestamp > 60000) localStorage.removeItem(key);
      }
    });
    return;
  }

  // CRM / Elearning: set cookie (omit domain on localhost)
  const domain = getCookieDomain();
  let cookieString = `${SSO_COOKIE}=${encodedToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  if (domain) cookieString += `; domain=${domain}`;
  if (isSecure()) cookieString += '; Secure';
  document.cookie = cookieString;
}

/**
 * Check if SSO cookie/token exists and return encoded value
 */
export function checkSSOCookie(): string | null {
  if (!process.client) return null;
  const site = getSiteType();
  if (site === 'admin') {
    // scan localStorage keys for recent SSO tokens
    const keys = Object.keys(localStorage);
    for (let key of keys) {
      if (key.startsWith('auth_sso_token_')) {
        const parts = key.split('_');
        const timestamp = parts[3] ? parseInt(parts[3]) : 0;
        if (timestamp && Date.now() - timestamp < 60000) return localStorage.getItem(key) || null;
      }
    }
    return null;
  }

  // CRM / Elearning: check cookie only
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, ...rest] = cookie.trim().split('=');
    if (name === SSO_COOKIE) return rest.join('=') || null;
  }
  return null;
}

/**
 * Clear SSO token
 */
export function clearSSOCookie(): void {
  if (!process.client) return;
  const site = getSiteType();
  if (site === 'admin') {
    // Clear admin localStorage keys
    Object.keys(localStorage).forEach(key => { if (key.startsWith('auth_sso_token_')) localStorage.removeItem(key); });
    return;
  }
  // CRM / Elearning: clear cookie (try both with domain and without)
  const domain = getCookieDomain();
  try {
    if (domain) {
      document.cookie = `${SSO_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}; SameSite=Lax`;
    }
  } catch (e) {
    // ignore
  }
  document.cookie = `${SSO_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
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
      // Persist login timestamp according to site policy (admin -> localStorage, others -> cookie)
      const site = getSiteType();
      if (process.client) {
        if (site === 'admin') {
          localStorage.setItem('login_timestamp', String(authStore.loginTimestamp));
        } else {
          const domain = getCookieDomain();
          let cookieStr = `login_timestamp=${authStore.loginTimestamp}; path=/; SameSite=Lax`;
          if (domain) cookieStr += `; domain=${domain}`;
          if (isSecure()) cookieStr += '; Secure';
          document.cookie = cookieStr;
        }
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
      // Persist auth token according to site policy: admin uses localStorage, others use cookie
      const site = getSiteType();
      if (site === 'admin') {
        localStorage.setItem('auth_token', ssoData.token);
      } else {
        const domain = getCookieDomain();
        let cookieStr = `auth_token=${ssoData.token}; path=/; SameSite=Lax`;
        if (domain) cookieStr += `; domain=${domain}`;
        if (isSecure()) cookieStr += '; Secure';
        document.cookie = cookieStr;
      }
    }
    
    // Set justLoggedIn flag IMMEDIATELY to protect against auto-logout
    // This must be set BEFORE verifying with backend, as API calls might happen during verification
    authStore.justLoggedIn = true;
    authStore.loginTimestamp = Date.now();
    // Persist loginTimestamp according to site policy (admin -> localStorage, others -> cookie)
    if (process.client) {
      const site = getSiteType();
      if (site === 'admin') {
        localStorage.setItem('login_timestamp', String(authStore.loginTimestamp));
      } else {
        const domain = getCookieDomain();
        let cookieStr = `login_timestamp=${authStore.loginTimestamp}; path=/; SameSite=Lax`;
        if (domain) cookieStr += `; domain=${domain}`;
        if (isSecure()) cookieStr += '; Secure';
        document.cookie = cookieStr;
      }
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
        
        // Persist user and authData according to site policy (admin -> localStorage, others -> cookies)
        if (process.client) {
          const site = getSiteType();
          if (site === 'admin') {
            localStorage.setItem('user', JSON.stringify(authStore.user));
            const authData = {
              user: authStore.user,
              token: authStore.token,
              tokenExpireAt: authStore.tokenExpireAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              rememberAccount: authStore.rememberAccount || false,
              loginTimestamp: authStore.loginTimestamp,
            };
            localStorage.setItem('authData', JSON.stringify(authData));
            if (authStore.loginTimestamp) localStorage.setItem('login_timestamp', String(authStore.loginTimestamp));
          } else {
            const domain = getCookieDomain();
            const expires = authStore.tokenExpireAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
            // user cookie
            let userCookie = `user=${encodeURIComponent(JSON.stringify(authStore.user))}; path=/; SameSite=Lax`;
            if (domain) userCookie += `; domain=${domain}`;
            if (isSecure()) userCookie += '; Secure';
            document.cookie = userCookie;
            // authData cookie
            let authCookie = `authData=${encodeURIComponent(JSON.stringify({ user: authStore.user, token: authStore.token, tokenExpireAt: expires }))}; path=/; SameSite=Lax`;
            if (domain) authCookie += `; domain=${domain}`;
            if (isSecure()) authCookie += '; Secure';
            document.cookie = authCookie;
            if (authStore.loginTimestamp) {
              let tsCookie = `login_timestamp=${authStore.loginTimestamp}; path=/; SameSite=Lax`;
              if (domain) tsCookie += `; domain=${domain}`;
              if (isSecure()) tsCookie += '; Secure';
              document.cookie = tsCookie;
            }
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
