<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <TheHeader v-if="!checkPath" />

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import TheHeader from '~/components/layout/TheHeader.vue'
import Footer from '~/components/shared/Footer.vue'
const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()
const checkPath = computed(() => route.name === 'my-learning-slug')
// Initialize auth and load cart from localStorage on mount
onMounted(() => {
  // Initialize authentication first
  authStore.initAuth()
  
  
  // Then load cart if user is logged in
  if (authStore.isLoggedIn) {
    cartStore.fetchCart()
  } else {
  }
})
</script>
