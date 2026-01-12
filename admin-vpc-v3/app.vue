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
    return titleChunk ? `${titleChunk} - Van Phuc Care Admin` : 'Van Phuc Care Admin'
  }
})

// App initialized
</script>
