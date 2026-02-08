<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header: on my-learning-slug, only mount on mobile (<768px) -->
    <TheHeader v-if="showHeader" :class-name="headerClass" />

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import TheHeader from '~/components/layout/TheHeader.vue'
import Footer from '~/components/shared/NewFooter.vue'

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()

const isLearningPage = computed(() => route.name === 'my-learning-slug')

// Track desktop state for conditional header unmounting
const isDesktop = ref(false)
let mql: MediaQueryList | null = null

const showHeader = computed(() => {
  if (!isLearningPage.value) return true
  // On learning page: unmount header on desktop (saves JS/DOM)
  return !isDesktop.value
})

// SSR fallback: use CSS md:hidden until client takes over
const headerClass = computed(() => {
  if (!isLearningPage.value) return ''
  return 'md:hidden'
})

const handleMediaChange = (e: MediaQueryListEvent) => {
  isDesktop.value = e.matches
}

// Initialize auth and load cart from localStorage on mount
onMounted(() => {
  // Setup media query for conditional header rendering
  mql = window.matchMedia('(min-width: 768px)')
  isDesktop.value = mql.matches
  mql.addEventListener('change', handleMediaChange)

  // Initialize authentication first
  authStore.initAuth()

  // Then load cart if user is logged in
  if (authStore.isLoggedIn) {
    cartStore.fetchCart()
  }
})

onBeforeUnmount(() => {
  mql?.removeEventListener('change', handleMediaChange)
})
</script>
