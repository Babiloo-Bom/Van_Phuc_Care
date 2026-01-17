<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const router = useRouter();

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Van Phuc Care E-Learning` : 'Van Phuc Care E-Learning'
  }
})

// Handle SSO login from cookie (monitor periodically)
let stopSSOMonitor: (() => void) | null = null;
let stopLogoutMonitor: (() => void) | null = null;

onMounted(async () => {
  if (process.client) {
    const authStore = useAuthStore();
    
    // Check SSO cookie immediately on mount
    try {
      const { handleSSOLogin } = await import('~/utils/sso');
      await handleSSOLogin();
    } catch (error) {
      console.error('[SSO] Error handling SSO login:', error);
    }
    
    // Start monitoring SSO cookie periodically
    try {
      const { startSSOMonitor, handleSSOLogin } = await import('~/utils/sso');
      stopSSOMonitor = startSSOMonitor(async () => {
        await handleSSOLogin();
      });
    } catch (error) {
      console.error('[SSO] Error starting SSO monitor:', error);
    }
    
    // Start monitoring logout sync cookie from CRM site
    // This ensures logout sync works even if header/sidebar components are not mounted
    try {
      const { startLogoutSyncMonitor } = await import('~/utils/authSync');
      // Use 1 second interval for faster detection
      stopLogoutMonitor = startLogoutSyncMonitor(async () => {
        console.log('[App] Logout sync cookie detected');
        // Logout if sync cookie detected, but not immediately after SSO login
        if (authStore.isAuthenticated) {
          const timeSinceLogin = authStore.loginTimestamp 
            ? Date.now() - authStore.loginTimestamp 
            : Infinity;
          // Only skip logout if login was VERY recent (within 2 seconds) - this protects against SSO race conditions
          // But allow logout sync for normal logouts from other site
          if (timeSinceLogin >= 2000) { // Only skip if login was less than 2 seconds ago
            console.log('[App] Logging out due to logout sync cookie, timeSinceLogin:', timeSinceLogin, 'ms');
            await authStore.logout();
          } else {
            console.log('[App] Skipping logout sync (login was too recent):', timeSinceLogin, 'ms');
          }
        }
      }, 1000); // Check every 1 second for faster detection
      console.log('[App] Started logout sync monitor (1s interval)');
    } catch (error) {
      console.error('[App] Error starting logout sync monitor:', error);
    }
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
