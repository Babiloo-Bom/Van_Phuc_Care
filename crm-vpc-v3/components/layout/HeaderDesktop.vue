<template>
  <header
    class="hidden lg:flex lg:items-center lg:fixed lg:top-0 lg:left-[225px] lg:right-0 lg:h-[72px] lg:bg-white lg:border-b lg:border-gray-200 lg:z-[90]"
  >
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
          <path d="M22 22L20 20" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm"
          class="w-full h-11 pl-12 pr-4 border border-gray-200 rounded-full text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          @input="handleSearch"
        />
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-4 relative">
        <!-- Notification Icon -->
        <button
          class="relative w-11 h-11 rounded-xl bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500 transition-all"
          @click="toggleNotifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="26" viewBox="0 0 24 26" fill="none">
            <path
              d="M22.5 13.5C23.3284 13.5 24 14.1716 24 15V16.5C24 17.3284 23.3284 18 22.5 18H1.5C0.671573 18 2.41598e-08 17.3284 0 16.5V15C0 14.1716 0.671573 13.5 1.5 13.5H4.5L5.55566 4.00293C5.80895 1.72419 7.73459 0.000174713 10.0273 0H13.9727C16.2654 0.000174713 18.1911 1.72419 18.4443 4.00293L19.5 13.5H22.5Z"
              fill="#4880FF"
            />
            <rect opacity="0.3" x="9" y="19.5" width="6" height="6" rx="2.25" fill="#FF0000" />
          </svg>
          <span
            v-if="unreadNotifications > 0"
            class="absolute top-0.5 right-0.5 w-[18px] h-[18px] bg-red-500 text-white rounded-full text-[10px] font-semibold flex items-center justify-center border-2 border-white"
            >{{ unreadNotifications }}</span
          >
        </button>

        <!-- User Profile -->
        <div
          class="user-profile flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-all"
          @click.stop="toggleUserMenu"
        >
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
        <div
          v-if="showUserMenu"
          class="user-dropdown absolute top-[calc(100%+8px)] right-0 min-w-[160px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-[100]"
        >
          <button
            class="flex items-center gap-3 px-4 py-3 text-gray-700 text-sm transition-all hover:bg-gray-50 hover:text-blue-500 border-none bg-transparent w-full text-left cursor-pointer"
            @click="handleLogout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M8.9 7.56C9.21 3.96 11.06 2.49 15.11 2.49H15.24C19.71 2.49 21.5 4.28 21.5 8.75V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24 20.08 8.91 16.54"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15 12H3.62"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.85 8.65L2.5 12L5.85 15.35"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

// State
const searchQuery = ref("");
const showUserMenu = ref(false);
const unreadNotifications = ref(3);

// User data
const userName = computed(() => authStore.user?.fullname || authStore.user?.name || "User");
const userEmail = computed(() => authStore.user?.email || "user@example.com");
const userAvatar = computed(() => authStore.user?.avatar || "/images/avatar-fallback.png");

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
      // Logout if sync cookie detected, but not immediately after login
      if (authStore.isAuthenticated && !authStore.justLoggedIn) {
        const timeSinceLogin = authStore.loginTimestamp 
          ? Date.now() - authStore.loginTimestamp 
          : Infinity;
        if (timeSinceLogin >= 15000) {
          console.log('[Logout Sync] Detected logout sync cookie, logging out');
          await authStore.logout();
        } else {
          console.log('[Logout Sync] Detected logout sync cookie but login was recent (', timeSinceLogin, 'ms ago), skipping logout');
        }
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
const handleSearch = () => {
  // TODO: Implement search logic
  console.log("Search:", searchQuery.value);
};

const toggleNotifications = () => {
  // TODO: Implement notifications
  console.log("Toggle notifications");
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
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// Click outside to close dropdown
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".user-profile") && !target.closest(".user-dropdown")) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
