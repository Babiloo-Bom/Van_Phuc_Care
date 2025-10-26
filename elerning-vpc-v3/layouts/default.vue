<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <TheHeader />

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

const cartStore = useCartStore()
const authStore = useAuthStore()

// Initialize auth and load cart from localStorage on mount
onMounted(() => {
  console.log('🚀 Layout mounted - Initializing app...')
  
  // Initialize authentication first
  authStore.initAuth()
  console.log('✅ Layout - Auth initialized:', {
    isLoggedIn: authStore.isLoggedIn,
    user: authStore.user,
    token: authStore.token ? 'exists' : 'null'
  })
  
  // Then load cart if user is logged in
  if (authStore.isLoggedIn) {
    cartStore.fetchCart()
    console.log('✅ Layout - Cart loaded, items:', cartStore.cartCount)
  } else {
    console.log('ℹ️ Layout - User not logged in, skipping cart load')
  }
})
</script>
