/**
 * Utility to sync logout state between CRM and Elearning sites using cookies
 * This works alongside LocalStorage auth without interfering with existing auth logic
 */

const LOGOUT_SYNC_COOKIE = 'auth_logout_sync';
const COOKIE_DOMAIN = '.vanphuccare.com'; // Adjust based on your domain structure

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
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 1);
    
    if (isLocalhost()) {
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
    } else {
      try {
        document.cookie = `${LOGOUT_SYNC_COOKIE}=${Date.now()}; expires=${expires.toUTCString()}; path=/; domain=${COOKIE_DOMAIN}; SameSite=Lax`;
      } catch (e) {
        // Fallback if domain setting fails
        document.cookie = `${LOGOUT_SYNC_COOKIE}=${Date.now()}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      }
    }
  }
}

/**
 * Check if logout sync cookie exists
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
          return true;
        }
      }
    }
    return false;
  } else {
    // Production: Check cookie
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === LOGOUT_SYNC_COOKIE && value) {
        console.log('[Logout Sync] [CRM] Found logout sync cookie:', name, 'value:', value);
        return true;
      }
    }
    return false;
  }
}

/**
 * Clear logout sync cookie
 */
export function clearLogoutSyncCookie() {
  if (process.client) {
    if (isLocalhost()) {
      // Clear all localStorage sync keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('auth_logout_sync_')) {
          localStorage.removeItem(key);
        }
      });
    } else {
      // Production: Clear cookie
      try {
        document.cookie = `${LOGOUT_SYNC_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${COOKIE_DOMAIN}; SameSite=Lax`;
      } catch (e) {
        document.cookie = `${LOGOUT_SYNC_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
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
  
  console.log('[Logout Sync] [CRM] Starting logout sync monitor, interval:', intervalMs, 'ms');
  
  let checkCount = 0;
  const interval = setInterval(() => {
    checkCount++;
    const hasCookie = checkLogoutSyncCookie();
    if (hasCookie) {
      console.log('[Logout Sync] [CRM] Monitor detected logout sync cookie (check #' + checkCount + '), calling callback...');
      // Clear cookie AFTER calling callback to ensure it's processed
      // But clear it to prevent multiple triggers
      clearLogoutSyncCookie();
      callback();
    } else if (checkCount % 10 === 0) {
      // Log every 10 checks to confirm monitor is running (every 20 seconds)
      console.log('[Logout Sync] [CRM] Monitor running, check #' + checkCount + ', no logout sync cookie found');
    }
  }, intervalMs);
  
  return () => {
    console.log('[Logout Sync] [CRM] Stopping logout sync monitor');
    clearInterval(interval);
  };
}

