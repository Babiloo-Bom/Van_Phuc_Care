<template>
  <div class="health-book-page">
    <!-- Redirecting State -->
    <div class="flex items-center justify-center min-h-screen">
      <a-spin size="large" tip="Đang chuyển hướng..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Auth
const authStore = useAuthStore()

// Redirect to user's health book detail page
onMounted(() => {
  const userId = authStore.user?.id
  
  if (userId) {
    // Redirect to [id].vue with current user's ID
    navigateTo(`/health-book/${userId}`)
  } else {
    // If no user, redirect to login
    navigateTo('/login')
  }
})
</script>

<style scoped>
.health-book-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.min-h-screen {
  min-height: 100vh;
}
</style>
