<template>
  <header class="hidden lg:flex lg:items-center lg:fixed lg:top-0 lg:left-[225px] lg:right-0 lg:h-[72px] lg:bg-white lg:border-b lg:border-gray-200 lg:z-[90]">
    <div class="flex items-center justify-between px-8 w-full">
      <!-- Search Bar -->
      <div class="relative w-full max-w-[400px]">
        <svg 
          class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <path 
            d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" 
            stroke="#9CA3AF" 
            stroke-width="1.5" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
          <path 
            d="M22 22L20 20" 
            stroke="#9CA3AF" 
            stroke-width="1.5" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tìm kiếm" 
          class="w-full h-11 pl-12 pr-4 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          @input="handleSearch"
        />
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-4 relative">
        <!-- Notification Icon -->
        <button class="relative w-11 h-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500 transition-all" @click="toggleNotifications">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path 
              d="M12.02 2.91C8.71 2.91 6.02 5.6 6.02 8.91V11.8C6.02 12.41 5.76 13.34 5.45 13.86L4.3 15.77C3.59 16.95 4.08 18.26 5.38 18.7C9.69 20.14 14.34 20.14 18.65 18.7C19.86 18.3 20.39 16.87 19.73 15.77L18.58 13.86C18.28 13.34 18.02 12.41 18.02 11.8V8.91C18.02 5.61 15.32 2.91 12.02 2.91Z" 
              stroke="currentColor" 
              stroke-width="1.5" 
              stroke-miterlimit="10" 
              stroke-linecap="round"
            />
            <path 
              d="M13.87 3.2C13.56 3.11 13.24 3.04 12.91 3C11.95 2.88 11.03 2.95 10.17 3.2C10.46 2.46 11.18 1.94 12.02 1.94C12.86 1.94 13.58 2.46 13.87 3.2Z" 
              stroke="currentColor" 
              stroke-width="1.5" 
              stroke-miterlimit="10" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            />
            <path 
              d="M15.02 19.06C15.02 20.71 13.67 22.06 12.02 22.06C11.2 22.06 10.44 21.72 9.9 21.18C9.36 20.64 9.02 19.88 9.02 19.06" 
              stroke="currentColor" 
              stroke-width="1.5" 
              stroke-miterlimit="10"
            />
          </svg>
          <span v-if="unreadNotifications > 0" class="absolute -top-1 -right-1 w-[18px] h-[18px] bg-red-500 text-white rounded-full text-[10px] font-semibold flex items-center justify-center border-2 border-white">{{ unreadNotifications }}</span>
        </button>

        <!-- User Profile -->
        <div class="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-all" @click="toggleUserMenu">
          <img 
            :src="userAvatar" 
            :alt="userName" 
            class="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            @error="(e) => (e.target as HTMLImageElement).src = '/images/avatar-fallback.png'"
          />
          <div class="flex flex-col gap-0.5">
            <div class="text-sm font-semibold text-gray-900 whitespace-nowrap">{{ userName }}</div>
            <div class="text-xs text-gray-500 whitespace-nowrap">{{ userEmail }}</div>
          </div>
          <svg 
            class="text-gray-400 transition-transform" 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path 
              d="M19.92 8.95L13.4 15.47C12.63 16.24 11.37 16.24 10.6 15.47L4.08 8.95" 
              stroke="currentColor" 
              stroke-width="1.5" 
              stroke-miterlimit="10" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <!-- User Dropdown Menu -->
        <div v-if="showUserMenu" class="absolute top-[calc(100%+8px)] right-0 min-w-[220px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-[100]">
          <NuxtLink to="/profile" class="flex items-center gap-3 px-4 py-3 text-gray-700 text-sm transition-all hover:bg-gray-50 hover:text-blue-500 no-underline cursor-pointer" @click="closeUserMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Thông tin cá nhân</span>
          </NuxtLink>
          <NuxtLink to="/settings" class="flex items-center gap-3 px-4 py-3 text-gray-700 text-sm transition-all hover:bg-gray-50 hover:text-blue-500 no-underline cursor-pointer" @click="closeUserMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12.88V11.12C2 10.08 2.85 9.22 3.9 9.22C5.71 9.22 6.45 7.94 5.54 6.37C5.02 5.47 5.33 4.3 6.24 3.78L7.97 2.79C8.76 2.32 9.78 2.6 10.25 3.39L10.36 3.58C11.26 5.15 12.74 5.15 13.65 3.58L13.76 3.39C14.23 2.6 15.25 2.32 16.04 2.79L17.77 3.78C18.68 4.3 18.99 5.47 18.47 6.37C17.56 7.94 18.3 9.22 20.11 9.22C21.15 9.22 22.01 10.07 22.01 11.12V12.88C22.01 13.92 21.16 14.78 20.11 14.78C18.3 14.78 17.56 16.06 18.47 17.63C18.99 18.54 18.68 19.7 17.77 20.22L16.04 21.21C15.25 21.68 14.23 21.4 13.76 20.61L13.65 20.42C12.75 18.85 11.27 18.85 10.36 20.42L10.25 20.61C9.78 21.4 8.76 21.68 7.97 21.21L6.24 20.22C5.33 19.7 5.02 18.53 5.54 17.63C6.45 16.06 5.71 14.78 3.9 14.78C2.85 14.78 2 13.92 2 12.88Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Cài đặt</span>
          </NuxtLink>
          <div class="h-px bg-gray-200 my-1"></div>
          <button class="flex items-center gap-3 px-4 py-3 text-gray-700 text-sm transition-all hover:bg-red-50 hover:text-red-500 border-none bg-transparent w-full text-left cursor-pointer" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M8.9 7.56C9.21 3.96 11.06 2.49 15.11 2.49H15.24C19.71 2.49 21.5 4.28 21.5 8.75V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24 20.08 8.91 16.54" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 12H3.62" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5.85 8.65L2.5 12L5.85 15.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

// State
const searchQuery = ref('');
const showUserMenu = ref(false);
const unreadNotifications = ref(3);

// User data
const userName = computed(() => authStore.user?.fullname || authStore.user?.name || 'User');
const userEmail = computed(() => authStore.user?.email || 'user@example.com');
const userAvatar = computed(() => authStore.user?.avatar || '/images/avatar-fallback.png');

// Methods
const handleSearch = () => {
  // TODO: Implement search logic
  console.log('Search:', searchQuery.value);
};

const toggleNotifications = () => {
  // TODO: Implement notifications
  console.log('Toggle notifications');
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Click outside to close dropdown
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.user-profile') && !target.closest('.user-dropdown')) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
