<template>
  <header class="bg-prim-100 text-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <img src="/images/logo-white.png" alt="Van Phuc Care" class="h-8 w-auto" />
          <span class="text-xl font-bold">VAN PHUC Academy</span>
        </div>
        
        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink to="/" class="hover:text-gray-200 transition-colors">
            Trang chủ
          </NuxtLink>
          <NuxtLink to="/courses" class="hover:text-gray-200 transition-colors">
            Tất cả khóa học
          </NuxtLink>
          <NuxtLink to="/my-learning" class="hover:text-gray-200 transition-colors">
            Khóa học của tôi
          </NuxtLink>
        </nav>
        
        <!-- Right Section -->
        <div class="flex items-center gap-4">
          <!-- Cart Icon -->
          <NuxtLink to="/cart" class="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6m8 0V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4.01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span 
              v-if="cartCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
            >
              {{ cartCount }}
            </span>
          </NuxtLink>
          
          <!-- User Menu -->
          <div v-if="isLoggedIn" class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <img 
                :src="user?.avatar || '/images/avatar-demo.png'" 
                :alt="user?.name"
                class="w-8 h-8 rounded-full object-cover"
              />
              <span class="hidden sm:block">{{ user?.name || 'User' }}</span>
            </div>
            <a-button type="text" class="!text-white" @click="handleLogout">
              Đăng xuất
            </a-button>
          </div>
          
          <div v-else class="flex items-center gap-4">
            <a-button 
              type="text" 
              class="!text-white hover:!bg-white/10 !px-4 !py-2 !h-auto !font-medium !text-base !rounded-lg"
              @click="navigateTo('/login')"
            >
              Đăng nhập
            </a-button>
            <a-button 
              type="primary" 
              class="!bg-white !text-primary-100 hover:!bg-gray-50 !px-8 !py-3 !h-auto !font-bold !text-base !rounded-xl !shadow-lg hover:!shadow-xl !border-0 !min-w-[120px] !flex !items-center !justify-center !gap-2 transition-all duration-300"
              @click="navigateTo('/register')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M22 11h-6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Đăng ký</span>
            </a-button>
          </div>
          
          <!-- Mobile Menu Button -->
          <button 
            class="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
              <path d="M3 12h18M3 6h18M3 18h18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-white/20 py-6">
        <nav class="flex flex-col gap-4 mb-6">
          <NuxtLink to="/" class="hover:text-gray-200 transition-colors py-2">
            Trang chủ
          </NuxtLink>
          <NuxtLink to="/courses" class="hover:text-gray-200 transition-colors py-2">
            Tất cả khóa học
          </NuxtLink>
          <NuxtLink to="/my-learning" class="hover:text-gray-200 transition-colors py-2">
            Khóa học của tôi
          </NuxtLink>
        </nav>
        
        <!-- Mobile Auth Buttons -->
        <div v-if="!isLoggedIn" class="flex flex-col gap-3">
          <a-button 
            type="text" 
            class="!text-white hover:!bg-white/10 !px-4 !py-3 !h-auto !font-medium !text-base !rounded-lg !w-full !justify-start"
            @click="navigateTo('/login')"
          >
            Đăng nhập
          </a-button>
          <a-button 
            type="primary" 
            class="!bg-white !text-primary-100 hover:!bg-gray-50 !px-6 !py-3 !h-auto !font-bold !text-base !rounded-xl !shadow-lg !w-full !flex !items-center !justify-center !gap-2"
            @click="navigateTo('/register')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M22 11h-6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Đăng ký</span>
          </a-button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

const cartStore = useCartStore()
const authStore = useAuthStore()

// Reactive data
const mobileMenuOpen = ref(false)

// Computed properties
const cartCount = computed(() => cartStore.cartCount)
const isLoggedIn = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)

// Watch for auth changes


// Watch for user changes
watch(() => authStore.user, (newUser) => {
}, { immediate: true })

// Methods
const handleLogout = async () => {
  try {
    await authStore.logout()
    navigateTo('/')
  } catch (error) {
  }
}
</script>

<style scoped>
/* Custom colors to match design */
.bg-prim-100 {
  background-color: #2176FF;
}

.text-primary-100 {
  color: #2176FF;
}

/* Ensure buttons are visible and properly styled */
.ant-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Override any conflicting styles */
.ant-btn-primary {
  background-color: white !important;
  border-color: white !important;
  color: #2176FF !important;
}

.ant-btn-primary:hover {
  background-color: #f9fafb !important;
  border-color: #f9fafb !important;
  color: #2176FF !important;
}
</style>
