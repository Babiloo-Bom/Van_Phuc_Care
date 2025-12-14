<template>
  <header :class="['bg-prim-100 text-white shadow-lg', props.className]">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <img
            src="/images/logo-small.png"
            alt="Van Phuc Care"
            class="h-8 w-auto md:hidden"
          />
          <img
            src="/images/logo-large.png"
            alt="Van Phuc Care"
            class="h-8 w-auto hidden md:block"
          />
        </div>

        <div class="flex justify-end">
          <!-- Navigation -->
          <nav class="hidden lg:flex items-center gap-4">
            <NuxtLink
              to="/courses"
              class="hover:text-gray-200 transition-colors rounded p-2 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clip-path="url(#clip0_644_765)">
                  <path
                    d="M14 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2L0 16H16V2C16 1.46957 15.7893 0.960859 15.4142 0.585786C15.0391 0.210714 14.5304 0 14 0V0ZM14.6667 2V3.33333H10V1.33333H14C14.1768 1.33333 14.3464 1.40357 14.4714 1.5286C14.5964 1.65362 14.6667 1.82319 14.6667 2ZM7.33333 1.33333H8.66667V5.33333H7.33333V1.33333ZM2 1.33333H6V3.33333H1.33333V2C1.33333 1.82319 1.40357 1.65362 1.5286 1.5286C1.65362 1.40357 1.82319 1.33333 2 1.33333ZM1.33333 14.6667V4.66667H6V6.66667H10V4.66667H14.6667V14.6667H1.33333ZM10 12H13.3333V13.3333H10V12Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_644_765">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Tất cả khóa học
            </NuxtLink>
            <NuxtLink
              to="/my-learning"
              class="hover:text-gray-200 transition-colors rounded p-2 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clip-path="url(#clip0_644_769)">
                  <path
                    d="M15.2813 1.13336C15.0568 0.945176 14.7935 0.808883 14.5103 0.734207C14.227 0.659531 13.9308 0.648314 13.6427 0.701356L9.52267 1.45002C8.9331 1.55632 8.39663 1.85838 8 2.30736C7.60367 1.85764 7.06716 1.55486 6.47733 1.44802L2.35733 0.699356C2.06918 0.647031 1.77305 0.658628 1.48987 0.733328C1.20669 0.808028 0.943372 0.944008 0.718521 1.13166C0.49367 1.31931 0.312775 1.55405 0.188618 1.8193C0.0644604 2.08455 7.11635e-05 2.37382 0 2.66669L0 13.8894L8 15.3447L16 13.8894V2.66669C16 2.37404 15.9357 2.08496 15.8115 1.81997C15.6873 1.55498 15.5063 1.32057 15.2813 1.13336ZM7.33333 13.8667L1.33333 12.7774V2.66669C1.33342 2.56908 1.35493 2.47268 1.39636 2.3843C1.43779 2.29593 1.49811 2.21772 1.57308 2.15521C1.64805 2.09271 1.73583 2.04743 1.83022 2.02257C1.92461 1.99771 2.0233 1.99388 2.11933 2.01136L6.23867 2.76002C6.54588 2.81592 6.82374 2.97786 7.02378 3.21763C7.22383 3.45739 7.33338 3.75976 7.33333 4.07202V13.8667ZM14.6667 12.776L8.66667 13.8667V4.07202C8.66662 3.75976 8.77617 3.45739 8.97622 3.21763C9.17626 2.97786 9.45412 2.81592 9.76133 2.76002L13.8807 2.01136C13.9767 1.99388 14.0754 1.99771 14.1698 2.02257C14.2642 2.04743 14.352 2.09271 14.4269 2.15521C14.5019 2.21772 14.5622 2.29593 14.6036 2.3843C14.6451 2.47268 14.6666 2.56908 14.6667 2.66669V12.776Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_644_769">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Khóa học của tôi
            </NuxtLink>
            <span class="w-[1px] h-3 bg-white"></span>
            <!-- User Info Banner (only show when logged in) -->
            <div
              v-if="isLoggedIn"
              class="flex items-center gap-4 px-4 py-2"
            >
              <!-- Avatar -->
              <img
                :src="userAvatar || '/images/avatar-fallback.png'"
                :alt="userName"
                class="w-12 h-12 rounded-full object-cover border-2 border-white"
                @error="(e) => (e.target as HTMLImageElement).src = '/images/avatar-fallback.png'"
              />
              <!-- User Info -->
              <div class="flex flex-col">
                <div class="text-white font-semibold text-base leading-tight">
                  {{ userName }}
                </div>
                <div class="text-white text-sm opacity-90 leading-tight">
                  {{ userEmail }}
                </div>
              </div>
            </div>
            <!-- Login Link (only show when not logged in) -->
            <NuxtLink
              v-else
              to="/login"
              class="hover:text-gray-200 transition-colors rounded p-2 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clip-path="url(#clip0_644_1855)">
                  <path
                    d="M1.33333 14V2C1.33333 1.82319 1.40357 1.65362 1.5286 1.5286C1.65362 1.40357 1.82319 1.33333 2 1.33333H5.33333V0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2L0 14C0 14.5304 0.210714 15.0391 0.585786 15.4142C0.960859 15.7893 1.46957 16 2 16H5.33333V14.6667H2C1.82319 14.6667 1.65362 14.5964 1.5286 14.4714C1.40357 14.3464 1.33333 14.1768 1.33333 14Z"
                    fill="white"
                  />
                  <path
                    d="M16 8.66626V7.33293L5.0373 7.35359L7.9193 4.47093L6.9753 3.52826L3.91797 6.58559C3.54303 6.96065 3.3324 7.46926 3.3324 7.99959C3.3324 8.52992 3.54303 9.03854 3.91797 9.41359L6.9753 12.4709L7.91797 11.5283L5.07597 8.68626L16 8.66626Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_644_1855">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Đăng nhập
            </NuxtLink>
            <!-- Cart Icon -->
            <NuxtLink
              to="/cart"
              class="relative hover:bg-white/10 rounded-lg transition-colors shrink-0 p-2 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="24"
                viewBox="0 0 22 19"
                fill="none"
              >
                <g clip-path="url(#clip0_644_784)">
                  <path
                    d="M16 5H2.828L2.8 4.766C2.7427 4.27961 2.50892 3.83115 2.14299 3.50565C1.77706 3.18015 1.30442 3.00023 0.814667 3L0 3V4.33333H0.814667C0.977956 4.33335 1.13556 4.3933 1.25758 4.50181C1.3796 4.61032 1.45756 4.75983 1.47667 4.922L2.53333 13.9007C2.59063 14.3871 2.82441 14.8355 3.19034 15.161C3.55627 15.4865 4.02891 15.6664 4.51867 15.6667H13.3333V14.3333H4.51867C4.35528 14.3333 4.19759 14.2733 4.07555 14.1646C3.95351 14.056 3.87562 13.9063 3.85667 13.744L3.76933 13H14.5573L16 5ZM13.4427 11.6667H3.61267L2.98533 6.33333H14.4047L13.4427 11.6667Z"
                    fill="white"
                  />
                  <path
                    d="M4.66683 19.0004C5.40321 19.0004 6.00016 18.4034 6.00016 17.6671C6.00016 16.9307 5.40321 16.3337 4.66683 16.3337C3.93045 16.3337 3.3335 16.9307 3.3335 17.6671C3.3335 18.4034 3.93045 19.0004 4.66683 19.0004Z"
                    fill="white"
                  />
                  <path
                    d="M11.3333 19.0004C12.0697 19.0004 12.6667 18.4034 12.6667 17.6671C12.6667 16.9307 12.0697 16.3337 11.3333 16.3337C10.597 16.3337 10 16.9307 10 17.6671C10 18.4034 10.597 19.0004 11.3333 19.0004Z"
                    fill="white"
                  />
                </g>

                <path
                  d="M17.2124 7.484C16.9244 7.88 16.5224 8.078 16.0004 8.078C15.4784 8.078 15.0764 7.88 14.7824 7.484C14.4944 7.088 14.3504 6.56 14.3504 5.9C14.3504 5.24 14.4944 4.712 14.7824 4.316C15.0764 3.92 15.4784 3.722 16.0004 3.722C16.5224 3.722 16.9244 3.92 17.2124 4.316C17.5064 4.712 17.6504 5.24 17.6504 5.9C17.6504 6.56 17.5064 7.088 17.2124 7.484ZM16.0004 7.406C16.6244 7.406 16.9604 6.866 16.9604 5.9C16.9604 4.934 16.6244 4.394 16.0004 4.394C15.3824 4.394 15.0404 4.934 15.0404 5.9C15.0404 6.866 15.3824 7.406 16.0004 7.406Z"
                  fill="white"
                />
                <defs>
                  <clipPath id="clip0_644_784">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0 3)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <span
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
              >
                {{ cartCount }}
              </span>
            </NuxtLink>
          </nav>
          <!-- Right Side -->
          <div class="flex items-center gap-2 sm:gap-4">
            <!-- Mobile Menu Button -->
            <button
              class="lg:hidden w-9 h-9 p-2 bg-white hover:bg-white/70 rounded-lg transition-colors"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.45456 4.90894C2.45456 4.45708 2.82088 4.09076 3.27274 4.09076H16.3637C16.8155 4.09076 17.1818 4.45708 17.1818 4.90894C17.1818 5.36081 16.8155 5.72712 16.3637 5.72712H3.27274C2.82088 5.72712 2.45456 5.36081 2.45456 4.90894ZM2.45456 9.81803C2.45456 9.36615 2.82088 8.99985 3.27274 8.99985H16.3637C16.8155 8.99985 17.1818 9.36615 17.1818 9.81803C17.1818 10.2699 16.8155 10.6362 16.3637 10.6362H3.27274C2.82088 10.6362 2.45456 10.2699 2.45456 9.81803ZM2.45456 14.7271C2.45456 14.2752 2.82088 13.9089 3.27274 13.9089H16.3637C16.8155 13.9089 17.1818 14.2752 17.1818 14.7271C17.1818 15.179 16.8155 15.5453 16.3637 15.5453H3.27274C2.82088 15.5453 2.45456 15.179 2.45456 14.7271Z"
                  fill="#317BC4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <Teleport to="body">
        <Transition name="fade">
          <div 
            v-if="mobileMenuOpen" 
            class="lg:hidden fixed inset-0 bg-black/50 z-[99]"
            @click="mobileMenuOpen = false"
          />
        </Transition>
        <Transition name="slide">
          <Sidebar 
            v-if="mobileMenuOpen"
            :is-mobile="true"
            @close="mobileMenuOpen = false"
          />
        </Transition>
      </Teleport>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";
import Sidebar from "~/components/layout/Sidebar.vue";

const props = defineProps<{
  className: string
}>()

const cartStore = useCartStore();
const authStore = useAuthStore();

// Reactive data
const mobileMenuOpen = ref(false);

// Computed properties
const cartCount = computed(() => cartStore.cartCount);
const isLoggedIn = computed(() => authStore.isLoggedIn);
const user = computed(() => authStore.user);
const userName = computed(() => authStore.userName || 'User');
const userEmail = computed(() => authStore.userEmail || 'user@example.com');
const userAvatar = computed(() => authStore.user?.avatar || '/images/avatar-fallback.png');

// Watch for user changes
watch(() => authStore.user, (newUser) => {
}, { immediate: true })

// Auto refresh user data on mount and window focus
const handleFocus = async () => {
  if (authStore.isAuthenticated && authStore.token) {
    await authStore.refreshUserData();
  }
};

onMounted(async () => {
  // Refresh user data on component mount if authenticated
  if (authStore.isAuthenticated && authStore.token) {
    await authStore.refreshUserData();
  }

  // Refresh user data when window gains focus (user switches back to this tab)
  window.addEventListener('focus', handleFocus);
});

onUnmounted(() => {
  window.removeEventListener('focus', handleFocus);
});

// Methods
const handleLogout = async () => {
  try {
    await authStore.logout();
    navigateTo("/");
  } catch (error) {
    console.error("❌ Logout failed:", error);
  }
};
</script>

<style scoped>
/* Custom colors to match design */
.bg-prim-100 {
  background-color: #2176ff;
}

.text-primary-100 {
  color: #2176ff;
}

/* Ensure buttons are visible and properly styled */
.ant-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 4px 8px !important;
  font-size: 14px !important;
}

/* Override any conflicting styles */
.ant-btn-primary {
  background-color: white !important;
  border-color: white !important;
  color: #2176ff !important;
}

.ant-btn-primary:hover {
  background-color: #f9fafb !important;
  border-color: #f9fafb !important;
  color: #2176ff !important;
}

@media screen and (min-width: 768px) {
  .ant-btn {
    padding: 8px 24px !important;
    font-size: 16px !important;
  }
}

/* Mobile menu transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
