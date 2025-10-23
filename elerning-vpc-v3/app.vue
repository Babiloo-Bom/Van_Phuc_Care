<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Global app setup
const { appName, isDevelopment, apiHost } = useEnvConfig()

// Set page title
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Van Phuc Care E-Learning` : 'Van Phuc Care E-Learning'
  }
})

// Log app info
console.log('🎉 E-Learning Portal initialized!')
console.log('📡 API Host:', apiHost)
console.log('🌍 Environment:', isDevelopment ? 'Development' : 'Production')
</script>
