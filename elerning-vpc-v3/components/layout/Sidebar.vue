<template>
  <aside 
    :class="[
      'flex flex-col bg-white shadow-lg z-[100]',
      isMobile 
        ? 'fixed left-0 top-0 w-[280px] h-[100dvh] max-h-[100dvh]' 
        : 'hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:w-[280px] lg:h-screen lg:max-h-screen'
    ]"
  >
    <!-- User Profile Section -->
    <div class="px-6 pt-8 pb-6">
      <!-- Avatar -->
      <div class="flex justify-start mb-4">
        <div v-if="isLoggedIn && userAvatar" class="w-20 h-20 rounded-full overflow-hidden">
          <img 
            :src="userAvatar" 
            :alt="userName"
            class="w-full h-full object-cover"
          />
        </div>
        <div v-else class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      </div>
      
      <!-- User Info -->
      <div class="text-start">
        <h3 class="text-base font-semibold text-gray-900">
          {{ isLoggedIn ? userName : 'N/I' }}
        </h3>
        <p class="text-md text-gray-500 mt-1">
          {{ isLoggedIn ? userEmail : 'Chưa có thông tin' }}
        </p>
      </div>
    </div>

    <!-- Divider -->
    <div class="mx-6 border-t border-gray-200"></div>

    <!-- Menu Items Group 1 -->
    <nav class="flex-1 py-4 overflow-y-auto min-h-0 overscroll-contain">
      <div class="space-y-1">
        <NuxtLink 
          v-for="item in menuGroup1"
          :key="item.path"
          :to="item.path" 
          class="flex items-center gap-3 px-6 py-3 text-md font-normal transition-all duration-200"
          :class="getMenuItemClass(item)"
          @click="handleMenuClick"
        >
          <div 
            v-html="item.icon" 
            class="flex-shrink-0"
            :class="getIconClass(item)"
          />
          <span class="flex-1">{{ item.label }}</span>
          <!-- Cart Badge -->
          <span 
            v-if="item.path === '/cart' && cartItemCount > 0"
            class="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center"
          >
            {{ cartItemCount > 99 ? '99+' : cartItemCount }}
          </span>
        </NuxtLink>
      </div>

      <!-- Divider -->
      <div class="mx-6 my-4 border-t border-gray-200"></div>

      <!-- Menu Items Group 2 -->
      <div class="space-y-1">
        <template v-for="item in menuGroup2" :key="item.path">
          <!-- External Link -->
          <a 
            v-if="item.isExternal"
            :href="getExternalUrl(item.path)"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 px-6 py-3 text-md font-normal transition-all duration-200"
            :class="getMenuItemClass(item)"
            @click="handleMenuClick"
          >
            <div 
              v-html="item.icon" 
              class="flex-shrink-0"
              :class="getIconClass(item)"
            />
            <span>{{ item.label }}</span>
          </a>
          <!-- Internal Link -->
          <NuxtLink 
            v-else
            :to="item.path" 
            class="flex items-center gap-3 px-6 py-3 text-md font-normal transition-all duration-200"
            :class="getMenuItemClass(item)"
            @click="handleMenuClick"
          >
            <div 
              v-html="item.icon" 
              class="flex-shrink-0"
              :class="getIconClass(item)"
            />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </template>
      </div>
    </nav>

    <!-- Auth Buttons - Always visible at bottom, outside scrollable area -->
    <div class="px-6 pb-4 pt-4 flex-shrink-0 border-t border-gray-200 bg-white">
      <button 
        v-if="isLoggedIn"
        @click="handleLogout"
        class="w-full py-3 px-4 bg-[#1A75BB] hover:bg-[#2568B0] text-white text-md font-bold rounded-lg transition-colors duration-200"
      >
        Đăng xuất
      </button>
      <template v-else>
        <NuxtLink 
          to="/register"
          class="block w-full py-3 px-4 bg-[#1A75BB] hover:bg-[#2568B0] text-white text-md font-bold rounded-lg transition-colors duration-200 text-center mb-3"
          @click="handleMenuClick"
        >
          Đăng ký
        </NuxtLink>
        <NuxtLink 
          to="/login"
          class="block w-full py-3 px-4 bg-white border-2 border-[#1A75BB] text-[#1A75BB] hover:bg-[#f0f7ff] text-md font-bold rounded-lg transition-colors duration-200 text-center"
          @click="handleMenuClick"
        >
          Đăng nhập
        </NuxtLink>
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';
import { MENU_GROUP_1, MENU_GROUP_2, MENU_GROUP_2_PATHS } from '~/constants/menu';
import type { MenuItem } from '~/constants/menu';

const props = withDefaults(defineProps<{
  isMobile?: boolean;
}>(), {
  isMobile: false
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const config = useRuntimeConfig();

const menuGroup1 = MENU_GROUP_1;
const menuGroup2 = MENU_GROUP_2;

// CRM Base URL
const crmBaseUrl = computed(() => config.public.baseUrlCrm || 'http://localhost:3101');
console.log('CRM Base URL_:', crmBaseUrl.value);
// Get external URL for CRM links
const getExternalUrl = (path: string) => {
  if (path.startsWith('/crm')) {
    const relativePath = path.replace('/crm', '');
    return `${crmBaseUrl.value}${relativePath}`;
  }
  return path;
};

// User info
const isLoggedIn = computed(() => authStore.isLoggedIn);
const userName = computed(() => authStore.userName || 'N/I');
const userEmail = computed(() => authStore.userEmail || 'Chưa có thông tin');
const userAvatar = computed(() => authStore.currentUser?.avatar);

// Cart badge
const cartItemCount = computed(() => cartStore.itemCount);

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};

const getMenuItemClass = (item: MenuItem) => {
  const active = isActive(item.path);
  
  if (!isLoggedIn.value && item.requireAuth) {
    return 'text-[#C4C4C4] cursor-not-allowed pointer-events-none';
  }
  
  if (active) {
    return 'text-gray-900 font-semibold';
  }
  
  return 'text-[#020618] hover:text-gray-600 hover:bg-gray-50';
};

const getIconClass = (item: MenuItem) => {
  if (!isLoggedIn.value && item.requireAuth) {
    return '[&_svg]:fill-[#C4C4C4] [&_svg_path]:fill-[#C4C4C4]';
  }
  return '[&_svg]:fill-[#020618] [&_svg_path]:fill-[#020618]';
};

const handleMenuClick = () => {
  if (props.isMobile) {
    emit('close');
  }
};

const handleLogout = async () => {
  if (props.isMobile) {
    emit('close');
  }
  await authStore.logout();
  router.push('/login');
};

// Auto refresh user data on mount and window focus
const handleFocus = async () => {
  if (authStore.isAuthenticated && authStore.token) {
    await authStore.refreshUserData();
  }
};

let stopLogoutMonitor: (() => void) | null = null;

onMounted(async () => {
  // Refresh user data on component mount if authenticated
  if (authStore.isAuthenticated && authStore.token) {
    await authStore.refreshUserData();
  }

  // Refresh user data when window gains focus (user switches back to this tab)
  window.addEventListener('focus', handleFocus);

  // Monitor logout sync cookie from CRM site
  if (process.client) {
    const { startLogoutSyncMonitor } = await import('~/utils/authSync');
    stopLogoutMonitor = startLogoutSyncMonitor(async () => {
      // Logout if sync cookie detected
      if (authStore.isAuthenticated) {
        await authStore.logout();
      }
    });
  }
});

onUnmounted(() => {
  window.removeEventListener('focus', handleFocus);
  if (stopLogoutMonitor) {
    stopLogoutMonitor();
  }
});
</script>
