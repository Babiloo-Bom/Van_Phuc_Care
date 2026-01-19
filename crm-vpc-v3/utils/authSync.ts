/**
 * Utility to sync logout state between CRM and Elearning sites using cookies
 * This works alongside LocalStorage auth without interfering with existing auth logic
 */

const LOGOUT_SYNC_COOKIE = 'auth_logout_sync';

function getSiteType(): 'admin' | 'elearning' | 'crm' {
  if (!process.client) return 'crm';
  const hostname = window.location.hostname.toLowerCase();
  if (hostname.startsWith('admin.') || hostname.includes('.admin') || hostname.includes('admin.')) return 'admin';
  if (hostname.includes('edu') || hostname.includes('elearning') || hostname.includes('learn')) return 'elearning';
  return 'crm';
}

/**
 * Get cookie domain dynamically from current hostname (returns .vanphuccare.vn) or null for localhost
 */
function getCookieDomain(): string | null {
  if (!process.client) return null;
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    const rootDomain = parts.slice(-2).join('.');
    return '.' + rootDomain;
  }
  return null;
}

/**
 * Check if running on localhost
 */
function isLocalhost(): boolean {
  if (!process.client) return false;
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.');
}

/**
 * Set logout sync cookie to notify other site
 */
export function setLogoutSyncCookie() {
  if (process.client) {
    // Set cookie with expiration in 3 minutes (enough time for sync across tabs/sites)
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 3);
    const cookieValue = Date.now().toString();
    
    console.log('[LogoutSync] Setting logout sync cookie, value:', cookieValue);
    
      const site = getSiteType();
    if (site === 'admin') {
      // Admin: use localStorage only
      const syncKey = 'auth_logout_sync_' + Date.now();
      localStorage.setItem(syncKey, 'true');
      console.log('[LogoutSync] (admin) Set logout sync key in localStorage:', syncKey);
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
      return;
    }

    // CRM / Elearning: set cookie (use dynamic domain if possible)
    try {
      const domain = getCookieDomain();
      const cookieStringBase = `${LOGOUT_SYNC_COOKIE}=${cookieValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      const cookieString = domain ? cookieStringBase + `; domain=${domain}` : cookieStringBase;
      document.cookie = cookieString;
      console.log('[LogoutSync] Set logout sync cookie with domain:', domain, 'value:', cookieValue);
      // Verify cookie was set
      setTimeout(() => {
        const wasSet = checkLogoutSyncCookie();
        if (!wasSet) {
          console.warn('[LogoutSync] Cookie may not have been set with domain, trying without domain');
          document.cookie = cookieStringBase;
        }
      }, 100);
    } catch (e) {
      console.error('[LogoutSync] Error setting cookie with domain:', e);
      // Fallback if domain setting fails
      document.cookie = `${LOGOUT_SYNC_COOKIE}=${cookieValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      console.log('[LogoutSync] Set logout sync cookie without domain (fallback)');
    }
  }
}

/**
 * Check if logout sync cookie exists and is valid
 */
export function checkLogoutSyncCookie(): boolean {
  if (!process.client) return false;
  
  const site = getSiteType();
  if (site === 'admin') {
    // On admin site, check localStorage for sync keys
    const keys = Object.keys(localStorage);
    for (let key of keys) {
      if (key.startsWith('auth_logout_sync_')) {
        const parts = key.split('_');
        const timestamp = parts[3] ? parseInt(parts[3]) : 0;
        // Check if sync key is recent (within 3 minutes)
        if (timestamp && Date.now() - timestamp < 180000) {
          console.log('[LogoutSync] (admin) Found logout sync key in localStorage:', key);
          return true;
        }
      }
    }
    return false;
  }

  // CRM / Elearning: check cookie with better parsing
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
          // Cookie should be within 3 minutes (180000ms)
          if (age >= 0 && age < 180000) {
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

/**
 * Clear logout sync cookie
 */
export function clearLogoutSyncCookie() {
  if (process.client) {
    console.log('[LogoutSync] Clearing logout sync cookie');
    const site = getSiteType();
    console.log('[LogoutSync] Clearing logout sync state for site:', site);
    if (site === 'admin') {
      // Clear admin localStorage keys
      const keys = Object.keys(localStorage).filter(key => key.startsWith('auth_logout_sync_'));
      keys.forEach(key => {
        localStorage.removeItem(key);
        console.log('[LogoutSync] Removed localStorage key:', key);
      });
      return;
    }

    // CRM / Elearning: Clear cookie (try both with and without domain)
    try {
      const domain = getCookieDomain();
      if (domain) {
        document.cookie = `${LOGOUT_SYNC_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}; SameSite=Lax`;
      }
      // Also clear without domain (in case it was set without domain)
      document.cookie = `${LOGOUT_SYNC_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
      console.log('[LogoutSync] Cleared logout sync cookie');
    } catch (e) {
      console.error('[LogoutSync] Error clearing cookie:', e);
      // Fallback
      document.cookie = `${LOGOUT_SYNC_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
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

