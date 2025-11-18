<template>
  <div>
    <!-- Loading State -->
    <div v-if="isCheckingAuth || isLoading" class="fixed top-0 left-0 right-0 bottom-0 bg-white/95 flex items-center justify-center z-[9999]">
      <div class="text-center p-8">
        <a-spin size="large" />
        <h3 class="mt-4 text-lg font-semibold text-gray-900">{{ isLoading ? 'Đang xử lý đăng nhập Google...' : 'Đang kiểm tra xác thực...' }}</h3>
        <p class="mt-2 text-gray-500">Vui lòng đợi trong giây lát</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8 flex items-center justify-center min-h-[400px]">
      <a-result
        status="error"
        title="Đăng nhập Google thất bại"
        :sub-title="error"
      >
        <template #extra>
          <a-button type="primary" @click="goToLogin">
            Quay lại đăng nhập
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
      <p class="text-gray-600 mt-2">Customer Relationship Management</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl p-6 shadow-sm bg-gradient-to-br from-teal-500 to-teal-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-teal-100 text-sm font-medium">Total Customers</p>
            <p class="text-3xl font-bold mt-2">2,547</p>
          </div>
          <div
            class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>
        <p class="text-teal-100 text-sm mt-4">↑ 18% from last month</p>
      </div>

      <div
        class="bg-white rounded-xl p-6 shadow-sm bg-gradient-to-br from-green-500 to-green-600 text-white"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">Active Tickets</p>
            <p class="text-3xl font-bold mt-2">156</p>
          </div>
          <div
            class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
        </div>
        <p class="text-green-100 text-sm mt-4">24 pending resolution</p>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Services</p>
            <p class="text-3xl font-bold mt-2">48</p>
          </div>
          <div
            class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <p class="text-blue-100 text-sm mt-4">12 active campaigns</p>
      </div>

      <div
        class="bg-white rounded-xl p-6 shadow-sm bg-gradient-to-br from-purple-500 to-purple-600 text-white"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">Satisfaction</p>
            <p class="text-3xl font-bold mt-2">94%</p>
          </div>
          <div
            class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <p class="text-purple-100 text-sm mt-4">↑ 3% from last month</p>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Tickets -->
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Tickets</h3>
        <div class="space-y-4">
          <div
            v-for="i in 5"
            :key="i"
            class="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0"
          >
            <div
              class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0"
            >
              <span class="text-teal-500 font-semibold">#{{ i }}</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">
                Ticket #TK-{{ 2000 + i }}
              </p>
              <p class="text-sm text-gray-500">Customer support request</p>
              <p class="text-xs text-gray-400 mt-1">{{ i * 5 }} minutes ago</p>
            </div>
            <span
              class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800"
              >Pending</span
            >
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink
            to="/customers"
            class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-teal-50 transition-all text-center"
          >
            <div class="text-3xl mb-2">👥</div>
            <p class="font-medium text-gray-900">Customers</p>
          </NuxtLink>
          <NuxtLink
            to="/tickets"
            class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-teal-50 transition-all text-center"
          >
            <div class="text-3xl mb-2">🎫</div>
            <p class="font-medium text-gray-900">Tickets</p>
          </NuxtLink>
          <NuxtLink
            to="/services"
            class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-teal-50 transition-all text-center"
          >
            <div class="text-3xl mb-2">💼</div>
            <p class="font-medium text-gray-900">Services</p>
          </NuxtLink>
          <button
            class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-teal-50 transition-all text-center"
          >
            <div class="text-3xl mb-2">📊</div>
            <p class="font-medium text-gray-900">Reports</p>
          </button>
        </div>
      </div>
    </div>

    <!-- API Config -->
    <div class="rounded-xl p-6 shadow-sm mt-6 bg-teal-50 border-2 border-teal-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        🔌 API Configuration
      </h3>
      <div class="space-y-2 font-mono text-sm">
        <p><strong>API Host:</strong> {{ apiHost }}</p>
        <p><strong>API Base:</strong> {{ apiBase }}</p>
        <p>
          <strong>Environment:</strong>
          <span
            class="px-2 py-1 rounded text-white text-xs"
            :class="isDevelopment ? 'bg-yellow-500' : 'bg-green-500'"
          >
            {{ isDevelopment ? "Development" : "Production" }}
          </span>
        </p>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";

definePageMeta({
  layout: "default",
  middleware: [], // No middleware - handle auth in component
});

useHead({
  title: "Dashboard",
});

const { apiHost, apiBase, isDevelopment } = useEnvConfig();

// Composables
const { completeGoogleLogin } = useGoogleAuth();
const authStore = useAuthStore();
const router = useRouter();

// State
const isLoading = ref(false);
const error = ref("");
const isCheckingAuth = ref(true);

// Navigate to login
const goToLogin = () => {
  router.push("/login");
};

// Check authentication and handle Google OAuth
onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  // Case 1: Google OAuth callback
  if (code) {
    console.log("🔐 Google OAuth Callback:", { code: !!code, state });
    isLoading.value = true;
    error.value = "";

    try {
      console.log("🔄 Completing Google login...");
      const response = await completeGoogleLogin(code, state || undefined);

      if (!response || !response.success || !response.data) {
        throw new Error(response?.error || "Đăng nhập Google thất bại");
      }

      console.log("✅ Google login successful:", response);

      // Calculate token expiry time
      let tokenExpireAtNum: number;
      if (typeof response.data.tokenExpireAt === "string") {
        tokenExpireAtNum = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      } else {
        tokenExpireAtNum =
          response.data.tokenExpireAt || Date.now() + 7 * 24 * 60 * 60 * 1000;
      }

      // Prepare user data
      const userData = {
        ...response.data.user,
        id: (response.data.user as any)?._id || response.data.user?.id || `google-user-${Date.now()}`,
        email: response.data.user?.email || "user@google.com",
        fullname: (response.data.user as any)?.fullname || response.data.user?.name || "Google User",
        avatar: response.data.user?.avatar || "",
        role: (response.data.user as any)?.role || "user",
        verified: true,
      };

      console.log("💾 Saving auth data to store...");

      // Save to auth store
      await authStore.completeGoogleLogin(
        response.data.accessToken,
        tokenExpireAtNum,
        userData
      );

      console.log("✅ Auth data saved successfully");

      // Show success message
      message.success("Đăng nhập Google thành công!");

      // Clean URL (remove query params)
      window.history.replaceState({}, document.title, "/");

      // Allow UI to render
      isLoading.value = false;
      isCheckingAuth.value = false;
    } catch (err: any) {
      console.error("❌ Google login error:", err);

      error.value = err.message || "Đăng nhập Google thất bại. Vui lòng thử lại.";
      isLoading.value = false;
      isCheckingAuth.value = false;

      // Show error message
      message.error(error.value);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
    return;
  }

  // Case 2: Normal page visit - check authentication
  if (!authStore.isAuthenticated) {
    console.log("⚠️ User not authenticated, redirecting to login");
    // Save intended destination
    localStorage.setItem("redirect_after_login", "/");
    router.push("/login");
    return;
  }

  // User is authenticated, show dashboard
  isCheckingAuth.value = false;
});
</script>
