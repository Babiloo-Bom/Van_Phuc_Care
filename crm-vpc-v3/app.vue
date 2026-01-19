<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

// Global app setup
const { appName, isDevelopment, apiHost } = useEnvConfig()

// Set page title
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Van Phuc Care CRM` : 'Van Phuc Care CRM'
  }
})

// Handle SSO login from cookie (monitor periodically)
let stopSSOMonitor: (() => void) | null = null;
let stopLogoutMonitor: (() => void) | null = null;

// Check logout sync cookie immediately
async function checkLogoutSync() {
  if (!process.client) return;
  const authStore = useAuthStore();
  
  try {
    const { checkLogoutSyncCookie } = await import('~/utils/authSync');
    const hasLogoutSync = checkLogoutSyncCookie();
    
    if (hasLogoutSync && authStore.isAuthenticated) {
      const timeSinceLogin = authStore.loginTimestamp 
        ? Date.now() - authStore.loginTimestamp 
        : Infinity;
      // Only skip logout if login was VERY recent (within 2 seconds)
      if (timeSinceLogin >= 2000) {
        await authStore.logout();
      }
    }
  } catch (error) {
  }
}

onMounted(async () => {
  if (process.client) {
    const authStore = useAuthStore();
    
    // Check logout sync cookie immediately on mount
    await checkLogoutSync();
    
    // Check logout sync cookie when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkLogoutSync();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Check logout sync cookie when window gains focus
    const handleFocus = () => {
      checkLogoutSync();
    };
    window.addEventListener('focus', handleFocus);
    
    // Check SSO cookie immediately on mount
    try {
      const { handleSSOLogin } = await import('~/utils/sso');
      await handleSSOLogin();
    } catch (error) {
    }
    
    // Start monitoring SSO cookie periodically
    try {
      const { startSSOMonitor, handleSSOLogin } = await import('~/utils/sso');
      stopSSOMonitor = startSSOMonitor(async () => {
        await handleSSOLogin();
      });
    } catch (error) {
    }
    
    // Start monitoring logout sync cookie from Elearning site
    // This ensures logout sync works even if header/sidebar components are not mounted
    try {
      const { startLogoutSyncMonitor } = await import('~/utils/authSync');
      // Use 500ms interval for faster detection
      stopLogoutMonitor = startLogoutSyncMonitor(async () => {
        // Logout if sync cookie detected, but not immediately after SSO login
        if (authStore.isAuthenticated) {
          const timeSinceLogin = authStore.loginTimestamp 
            ? Date.now() - authStore.loginTimestamp 
            : Infinity;
          // Only skip logout if login was VERY recent (within 2 seconds) - this protects against SSO race conditions
          // But allow logout sync for normal logouts from other site
          if (timeSinceLogin >= 2000) { // Only skip if login was less than 2 seconds ago
            await authStore.logout();
          }
        }
      }, 500); // Check every 500ms for faster detection
    } catch (error) {
    }
    
    // Cleanup event listeners on unmount
    onUnmounted(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    });
  }
});

onUnmounted(() => {
  if (stopSSOMonitor) {
    stopSSOMonitor();
  }
  if (stopLogoutMonitor) {
    stopLogoutMonitor();
  }
});

</script>
