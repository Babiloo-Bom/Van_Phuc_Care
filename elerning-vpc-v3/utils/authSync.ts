/**
 * Utility to sync logout state between CRM and Elearning sites using cookies
 * This works alongside LocalStorage auth without interfering with existing auth logic
 */

const LOGOUT_SYNC_COOKIE = 'auth_logout_sync';

function getSiteType(): 'admin' | 'elearning' | 'crm' {
  if (!process.client) return 'elearning';
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
    
    
    const site = getSiteType();
    if (site === 'admin') {
      // Admin: use localStorage only
      const syncKey = 'auth_logout_sync_' + Date.now();
      localStorage.setItem(syncKey, 'true');
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
      // Verify cookie was set
      setTimeout(() => {
        const wasSet = checkLogoutSyncCookie();
        if (!wasSet) {
          document.cookie = cookieStringBase;
        }
      }, 100);
    } catch (e) {
      // Fallback if domain setting fails
      document.cookie = `${LOGOUT_SYNC_COOKIE}=${cookieValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
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
            return true;
          } else {
            // Clear expired cookie
            clearLogoutSyncCookie();
            return false;
          }
        } else {
          // If value is not a timestamp, treat as valid (backward compatibility)
          return true;
        }
      }
    }
  } catch (e) {
    return false;
  }
  return false;
}

/**
 * Clear logout sync cookie
 */
export function clearLogoutSyncCookie() {
  if (process.client) {
    const site = getSiteType();
    if (site === 'admin') {
      // Clear admin localStorage keys
      const keys = Object.keys(localStorage).filter(key => key.startsWith('auth_logout_sync_'));
      keys.forEach(key => {
        localStorage.removeItem(key);
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
    } catch (e) {
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
      // This prevents multiple triggers while ensuring the callback runs
      callback();
      // Clear cookie after a short delay to ensure callback has processed
      setTimeout(() => {
        clearLogoutSyncCookie();
      }, 100);
    }
  }, intervalMs);
  
  return () => {
    clearInterval(interval);
  };
}

