/**
 * Utility to sync logout state between CRM and Elearning sites using cookies
 * This works alongside LocalStorage auth without interfering with existing auth logic
 */

const LOGOUT_SYNC_COOKIE = 'auth_logout_sync';

/**
 * Check if running on localhost
 */
function isLocalhost(): boolean {
  if (!process.client) return false;
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.');
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
 * Check if current page is using HTTPS
 */
function isSecure(): boolean {
  if (!process.client) return false;
  return window.location.protocol === 'https:';
}

/**
 * Build cookie attributes string
 */
function buildCookieAttributes(domain: string | null, includeSecure: boolean = true): string {
  let attrs = 'path=/; SameSite=Lax';
  if (domain) {
    attrs += `; domain=${domain}`;
  }
  if (includeSecure && isSecure()) {
    attrs += '; Secure';
  }
  return attrs;
}

/**
 * Set logout sync cookie to notify other site
 */
export function setLogoutSyncCookie() {
  if (process.client) {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 1);
    const cookieValue = Date.now().toString();
    
    console.log('[LogoutSync] Setting logout sync cookie, value:', cookieValue);
    
    if (isLocalhost()) {
      const syncKey = 'auth_logout_sync_' + Date.now();
      localStorage.setItem(syncKey, 'true');
      console.log('[LogoutSync] Set logout sync key in localStorage:', syncKey);
      // Clean up old sync keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('auth_logout_sync_') && key !== syncKey) {
          const parts = key.split('_');
          const timestamp = parts[3] ? parseInt(parts[3]) : 0;
          if (timestamp && Date.now() - timestamp > 60000) {
            localStorage.removeItem(key);
          }
        }
      });
    } else {
      // Production: Use cookie with domain for subdomain sharing
      const cookieDomain = getCookieDomain();
      const cookieValueStr = cookieValue.toString();
      
      try {
        if (cookieDomain) {
          // Try with domain first (for subdomain sharing)
          const attrs = buildCookieAttributes(cookieDomain);
          const cookieString = `${LOGOUT_SYNC_COOKIE}=${cookieValueStr}; expires=${expires.toUTCString()}; ${attrs}`;
          document.cookie = cookieString;
          console.log('[LogoutSync] Set logout sync cookie with domain:', cookieDomain, 'value:', cookieValueStr, 'secure:', isSecure());
          
          // Verify cookie was set after a short delay
          setTimeout(() => {
            const wasSet = checkLogoutSyncCookie();
            if (!wasSet) {
              console.warn('[LogoutSync] Cookie may not have been set with domain, trying without domain');
              // Fallback: try without domain (for same-origin)
              const fallbackAttrs = buildCookieAttributes(null);
              document.cookie = `${LOGOUT_SYNC_COOKIE}=${cookieValueStr}; expires=${expires.toUTCString()}; ${fallbackAttrs}`;
            } else {
              console.log('[LogoutSync] Cookie verified successfully');
            }
          }, 200);
        } else {
          // No domain detected, set without domain (same-origin only)
          const attrs = buildCookieAttributes(null);
          document.cookie = `${LOGOUT_SYNC_COOKIE}=${cookieValueStr}; expires=${expires.toUTCString()}; ${attrs}`;
          console.log('[LogoutSync] Set logout sync cookie without domain (no subdomain detected)');
        }
      } catch (e) {
        console.error('[LogoutSync] Error setting cookie:', e);
        // Fallback if domain setting fails
        const fallbackAttrs = buildCookieAttributes(null);
        document.cookie = `${LOGOUT_SYNC_COOKIE}=${cookieValueStr}; expires=${expires.toUTCString()}; ${fallbackAttrs}`;
        console.log('[LogoutSync] Set logout sync cookie without domain (fallback)');
      }
    }
  }
}

/**
 * Check if logout sync cookie exists and is valid
 */
export function checkLogoutSyncCookie(): boolean {
  if (!process.client) return false;
  
  if (isLocalhost()) {
    // On localhost, check localStorage for sync keys
    const keys = Object.keys(localStorage);
    for (let key of keys) {
      if (key.startsWith('auth_logout_sync_')) {
        const parts = key.split('_');
        const timestamp = parts[3] ? parseInt(parts[3]) : 0;
        // Check if sync key is recent (within 1 minute)
        if (timestamp && Date.now() - timestamp < 60000) {
          console.log('[LogoutSync] Found logout sync key in localStorage:', key);
          return true;
        }
      }
    }
    return false;
  } else {
    // Production: Check cookie with better parsing
    try {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const trimmed = cookie.trim();
        if (!trimmed) continue;
        
        // Handle cookies with = in value
        const equalIndex = trimmed.indexOf('=');
        if (equalIndex === -1) continue;
        
        const name = trimmed.substring(0, equalIndex).trim();
        const value = trimmed.substring(equalIndex + 1).trim();
        
        if (name === LOGOUT_SYNC_COOKIE && value) {
          // Check if cookie value is a valid timestamp (should be recent)
          const timestamp = parseInt(value);
          if (!isNaN(timestamp)) {
            const age = Date.now() - timestamp;
            // Cookie should be within 1 minute (60000ms)
            if (age >= 0 && age < 60000) {
              console.log('[LogoutSync] Found valid logout sync cookie, age:', age, 'ms');
              return true;
            } else {
              console.log('[LogoutSync] Found expired logout sync cookie, age:', age, 'ms');
              // Clear expired cookie
              clearLogoutSyncCookie();
              return false;
            }
          } else {
            // If value is not a timestamp, treat as valid (backward compatibility)
            console.log('[LogoutSync] Found logout sync cookie with non-timestamp value');
            return true;
          }
        }
      }
    } catch (e) {
      console.error('[LogoutSync] Error checking cookie:', e);
      return false;
    }
    return false;
  }
}

/**
 * Clear logout sync cookie
 */
export function clearLogoutSyncCookie() {
  if (process.client) {
    console.log('[LogoutSync] Clearing logout sync cookie');
    if (isLocalhost()) {
      // Clear all localStorage sync keys
      const keys = Object.keys(localStorage).filter(key => key.startsWith('auth_logout_sync_'));
      keys.forEach(key => {
        localStorage.removeItem(key);
        console.log('[LogoutSync] Removed localStorage key:', key);
      });
    } else {
      // Production: Clear cookie (try both with and without domain)
      try {
        const cookieDomain = getCookieDomain();
        
        // Clear with domain if available
        if (cookieDomain) {
          const attrs = buildCookieAttributes(cookieDomain);
          document.cookie = `${LOGOUT_SYNC_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${attrs}`;
        }
        // Also clear without domain (in case it was set without domain or domain setting failed)
        const fallbackAttrs = buildCookieAttributes(null);
        document.cookie = `${LOGOUT_SYNC_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${fallbackAttrs}`;
        console.log('[LogoutSync] Cleared logout sync cookie', cookieDomain ? `(domain: ${cookieDomain})` : '(no domain)');
      } catch (e) {
        console.error('[LogoutSync] Error clearing cookie:', e);
        // Fallback
        const fallbackAttrs = buildCookieAttributes(null);
        document.cookie = `${LOGOUT_SYNC_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${fallbackAttrs}`;
      }
    }
  }
}

/**
 * Start monitoring logout sync cookie
 * Call this in onMounted to check periodically
 */
export function startLogoutSyncMonitor(callback: () => void, intervalMs: number = 2000) {
  if (!process.client) return () => {};
  
  const interval = setInterval(() => {
    const hasCookie = checkLogoutSyncCookie();
    if (hasCookie) {
      // Clear cookie AFTER calling callback to ensure it's processed
      // But clear it to prevent multiple triggers
      clearLogoutSyncCookie();
      callback();
    }
  }, intervalMs);
  
  return () => {
    clearInterval(interval);
  };
}

