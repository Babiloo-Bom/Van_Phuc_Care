<template>
  <header class="lg:hidden block fixed top-0 left-0 right-0 z-[100]">
    <!-- Main Header Bar -->
    <div class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <!-- Logo -->
      <div class="flex-1">
        <img 
          src="/images/logo-vanphuc-new-mobile.png" 
          alt="Vạn Phúc Care" 
          class="h-9 w-auto object-contain"
          width="120"
          height="36"
        />
      </div>

      <!-- Menu Toggle Button -->
      <button class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center active:bg-blue-600 transition-all" @click="toggleMenu">
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.27271 6.54599C3.27271 5.9435 3.76113 5.45508 4.36361 5.45508H21.8182C22.4207 5.45508 22.9091 5.9435 22.9091 6.54599C22.9091 7.14847 22.4207 7.6369 21.8182 7.6369H4.36361C3.76113 7.6369 3.27271 7.14847 3.27271 6.54599ZM3.27271 13.0914C3.27271 12.4889 3.76113 12.0005 4.36361 12.0005H21.8182C22.4207 12.0005 22.9091 12.4889 22.9091 13.0914C22.9091 13.694 22.4207 14.1824 21.8182 14.1824H4.36361C3.76113 14.1824 3.27271 13.694 3.27271 13.0914ZM3.27271 19.6369C3.27271 19.0344 3.76113 18.546 4.36361 18.546H21.8182C22.4207 18.546 22.9091 19.0344 22.9091 19.6369C22.9091 20.2394 22.4207 20.7278 21.8182 20.7278H4.36361C3.76113 20.7278 3.27271 20.2394 3.27271 19.6369Z" fill="white"/>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition name="menu-overlay">
      <div v-if="isMenuOpen" class="fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-[110]" @click="closeMenu"></div>
    </transition>

    <!-- Mobile Menu Drawer -->
    <transition name="menu-drawer">
      <div v-if="isMenuOpen" class="fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[120] flex flex-col overflow-y-auto">
        <!-- User Profile Section -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 px-5 py-6 flex items-center gap-3 relative">
          <img 
            :src="userAvatar" 
            :alt="userName" 
            class="w-12 h-12 rounded-full object-cover border-2 border-white"
            @error="(e) => (e.target as HTMLImageElement).src = '/images/avatar-fallback.png'"
          />
          <div class="flex-1 min-w-0">
            <div class="text-[15px] font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">{{ userName }}</div>
            <div class="text-[13px] text-white/80 whitespace-nowrap overflow-hidden text-ellipsis">{{ userEmail }}</div>
          </div>
          <button class="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white" @click="closeMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Menu Items -->
        <nav class="flex-1 py-4 overflow-y-auto">
          <template v-for="item in menuItems" :key="item.path">
            <!-- External Link -->
            <a
              v-if="isExternalLink(item.path)"
              :href="item.path"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 px-5 py-3.5 text-gray-700 text-[15px] font-medium transition-all active:bg-gray-50"
              :class="isActive(item.path) ? 'bg-blue-50 text-blue-500 border-l-4 border-blue-500 pl-4' : ''"
              @click.prevent="handleElearningLinkClick(item.path)"
            >
              <div v-html="item.icon" />
              <span>{{ item.label }}</span>
            </a>
            <!-- Internal Link -->
            <NuxtLink
              v-else
              :to="item.path"
              class="flex items-center gap-3 px-5 py-3.5 text-gray-700 text-[15px] font-medium transition-all active:bg-gray-50"
              :class="isActive(item.path) ? 'bg-blue-50 text-blue-500 border-l-4 border-blue-500 pl-4' : ''"
              @click="closeMenu"
            >
              <div v-html="item.icon" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </template>
        </nav>

        <!-- Logout Button -->
        <div class="px-5 py-4 border-t border-gray-200">
          <button class="w-full flex items-center justify-center gap-3 px-3 py-3 bg-red-50 text-red-500 rounded-xl text-[15px] font-semibold active:bg-red-100 transition-all" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M8.9 7.56C9.21 3.96 11.06 2.49 15.11 2.49H15.24C19.71 2.49 21.5 4.28 21.5 8.75V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24 20.08 8.91 16.54" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 12H3.62" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5.85 8.65L2.5 12L5.85 15.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useRuntimeConfig } from '#app';
import { MENU_ITEMS } from '~/constants/menu';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const config = useRuntimeConfig();

// State
const isMenuOpen = ref(false);
const menuItems = MENU_ITEMS;

// Elearning Base URL
const elearningBaseUrl = computed(() => config.public.baseUrlElearning || 'https://edu.vanphuccare.vn');

// User data
const userName = computed(() => authStore.user?.fullname || authStore.user?.name || 'User');
const userEmail = computed(() => authStore.user?.email || 'user@example.com');
const userAvatar = computed(() => authStore.user?.avatar || '/images/avatar-fallback.png');

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

  // Monitor logout sync cookie from Elearning site
  if (process.client) {
    const { startLogoutSyncMonitor } = await import('~/utils/authSync');
      stopLogoutMonitor = startLogoutSyncMonitor(async () => {
        // Logout if sync cookie detected, but not immediately after SSO login
        if (authStore.isAuthenticated) {
          const timeSinceLogin = authStore.loginTimestamp 
            ? Date.now() - authStore.loginTimestamp 
            : Infinity;
          // Only skip logout if login was VERY recent (within 2 seconds) - this protects against SSO race conditions
          // But allow logout sync for normal logouts from other site
          if (timeSinceLogin < 2000) {
            return;
          }
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

// Methods
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
};

const isExternalLink = (path: string) => {
  return path.startsWith('http://') || path.startsWith('https://');
};

const isActive = (path: string) => {
  if (isExternalLink(path)) {
    return false;
  }
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};

// Handle Elearning link click with SSO
const handleElearningLinkClick = async (path: string) => {
  if (!isExternalLink(path)) return;
  
  closeMenu();
  
  // If it's the "Khóa học của tôi" link, add SSO token
  if (path.includes('my-learning') && authStore.isAuthenticated && authStore.token) {
    try {
      const { buildSSOUrl } = await import('~/utils/sso');
      const baseUrl = String(elearningBaseUrl.value || 'https://edu.vanphuccare.vn');
      const ssoUrl = await buildSSOUrl(baseUrl, '/my-learning');
      console.log('[SSO] Opening Elearning with SSO:', ssoUrl);
      // Wait a bit for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 200));
      window.open(ssoUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('[SSO] Error building SSO URL:', error);
      // Fallback: open without SSO
      window.open(path, '_blank', 'noopener,noreferrer');
    }
  } else {
    // Regular external link
    window.open(path, '_blank', 'noopener,noreferrer');
  }
};

const handleLogout = async () => {
  try {
    closeMenu();
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>

<style scoped>
/* Transitions */
.menu-overlay-enter-active,
.menu-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.menu-overlay-enter-from,
.menu-overlay-leave-to {
  opacity: 0;
}

.menu-drawer-enter-active,
.menu-drawer-leave-active {
  transition: transform 0.3s ease;
}

.menu-drawer-enter-from,
.menu-drawer-leave-to {
  transform: translateX(100%);
}
</style>
