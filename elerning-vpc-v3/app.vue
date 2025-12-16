<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Van Phuc Care E-Learning` : 'Van Phuc Care E-Learning'
  }
})

// Handle SSO login from cookie (monitor periodically)
let stopSSOMonitor: (() => void) | null = null;

onMounted(async () => {
  if (process.client) {
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
  }
});

onUnmounted(() => {
  if (stopSSOMonitor) {
    stopSSOMonitor();
  }
});
</script>
