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
    return titleChunk ? `${titleChunk} - Van Phuc Care CRM` : 'Van Phuc Care CRM'
  }
})

// Log app info
console.log('🎉 CRM Portal initialized!')
console.log('📡 API Host:', apiHost)
console.log('🌍 Environment:', isDevelopment ? 'Development' : 'Production')
</script>
