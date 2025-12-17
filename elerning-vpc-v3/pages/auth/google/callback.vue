<template>
  <div class="google-callback-page">
    <div class="callback-container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <a-spin size="large" />
        <h3>Đang xử lý đăng nhập Google...</h3>
        <p>Vui lòng đợi trong giây lát</p>
      </div>
        
      <!-- Success State -->
      <div v-else-if="isSuccess" class="success-state">
        <a-result
          status="success"
          title="Đăng nhập thành công!"
          sub-title="Bạn đã đăng nhập bằng Google thành công"
        >
          <template #extra>
            <a-button type="primary" @click="redirectToHome">
              Vào trang chủ
            </a-button>
          </template>
        </a-result>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="error-state">
        <a-result
          status="error"
          title="Đăng nhập thất bại"
          :sub-title="errorMessage"
        >
          <template #extra>
            <a-button type="primary" @click="retryLogin"> Thử lại </a-button>
            <a-button @click="goToLogin"> Về trang đăng nhập </a-button>
          </template>
        </a-result>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import { message } from "ant-design-vue";

// ===== COMPOSABLES =====
const { completeGoogleLogin } = useGoogleAuth();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// ===== STATE =====
const isLoading = ref(true);
const isSuccess = ref(false);
const errorMessage = ref("");
//
// ===== GOOGLE OAUTH CALLBACK HANDLER =====
const handleGoogleCallback = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    // Check for error parameter first (from backend redirect)
    // If there's an error, redirect to login page instead of showing here
    const errorParam = route.query.error as string;
    const googleError = route.query.google_error as string;
    
    if (errorParam || googleError) {
      const errorMsg = decodeURIComponent(errorParam || googleError || 'Đăng nhập Google thất bại');
      // Redirect to login page with error message
      const errorParamEncoded = encodeURIComponent(errorMsg);
      router.push(`/login?google_error=${errorParamEncoded}`);
      return;
    }

    // Get authorization code from URL
    const code = route.query.code as string;
    const state = route.query.state as string;

    if (!code) {
      throw new Error("Không nhận được mã xác thực từ Google");
    }

    // Complete Google login flow
    const response = await completeGoogleLogin(code, state);


    if (response && response.success && response.data) {

      // Convert tokenExpireAt to number if it's a string
      let tokenExpireAtNum: number;
      if (typeof response.data.tokenExpireAt === "string") {
        // If it's a duration string like "7d", convert to timestamp
        // For now, use current time + 7 days as default
        tokenExpireAtNum = Date.now() + 7 * 24 * 60 * 60 * 1000;
      } else {
        tokenExpireAtNum =
          response.data.tokenExpireAt || Date.now() + 7 * 24 * 60 * 60 * 1000;
      }

      // Create user data with proper ID
      const userInfo = response.data.user || {};
      const userData = {
        id: userInfo._id || `google-user-${Date.now()}`,
        email: userInfo.email || "user@google.com",
        name: userInfo.fullname || "Google User",
        fullname: userInfo.fullname || "Google User",
        username: userInfo.email || `google-user-${Date.now()}`,
        role: userInfo.role || "user",
        verified: true,
        avatar: userInfo.avatar,
        provider: userInfo.provider,
        googleId: userInfo.googleId,
      };


      // Store auth data directly in auth store
      await authStore.completeGoogleLogin(
        response.data.accessToken,
        tokenExpireAtNum,
        userData
      );


      isSuccess.value = true;

      // Redirect immediately after success
      await nextTick(); // Wait for DOM update
      redirectToHome();
    } else {
      throw new Error(response.error || "Đăng nhập Google thất bại");
    }
  } catch (error: any) {
    console.error("❌ Google callback failed:", error);
    // Extract detailed error message
    const detailedError = error?.data?.message || error?.data?.error || error?.message || "Đăng nhập Google thất bại";
    
    // Redirect to login page with error message instead of showing on callback page
    const errorParam = encodeURIComponent(detailedError);
    router.push(`/login?google_error=${errorParam}`);
  } finally {
    isLoading.value = false;
  }
};

// ===== REDIRECT HANDLERS =====
const redirectToHome = () => {
  const redirectPath = getRedirectPath();

  // Force refresh to ensure auth state is properly loaded
  window.location.href = redirectPath;
};

const retryLogin = () => {
  router.push("/login");
};

const goToLogin = () => {
  router.push("/login");
};

// ===== GET REDIRECT PATH =====
const getRedirectPath = (): string => {
  try {
    const state = route.query.state as string;
    if (state && state.length > 0) {
      // Try to decode state
      const decoded = atob(state);
      const stateData = JSON.parse(decoded);
      if (stateData && stateData.redirect) {
        return stateData.redirect;
      }
    }
  } catch (error) {
    console.warn("⚠️ Invalid state parameter:", error);
  }

  return "/";
};

// ===== LIFECYCLE =====
onMounted(() => {
  handleGoogleCallback();
});

// ===== SEO =====
useHead({
  title: "Google OAuth Callback - Van Phuc Care",
  meta: [
    { name: "description", content: "Xử lý đăng nhập Google OAuth" },
    { name: "robots", content: "noindex, nofollow" },
  ],
});
</script>

<style scoped>
.google-callback-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.callback-container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.loading-state {
  padding: 40px 20px;
}

.loading-state h3 {
  margin: 20px 0 10px;
  color: #333;
  font-size: 18px;
}

.loading-state p {
  color: #666;
  margin: 0;
}

.success-state,
.error-state {
  padding: 20px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .callback-container {
    padding: 20px;
    margin: 10px;
  }
}
</style>
