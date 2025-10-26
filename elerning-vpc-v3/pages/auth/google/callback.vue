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
            <a-button type="primary" @click="retryLogin">
              Thử lại
            </a-button>
            <a-button @click="goToLogin">
              Về trang đăng nhập
            </a-button>
          </template>
        </a-result>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'

// ===== COMPOSABLES =====
const { completeGoogleLogin } = useGoogleAuth()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// ===== STATE =====
const isLoading = ref(true)
const isSuccess = ref(false)
const errorMessage = ref('')

// ===== GOOGLE OAUTH CALLBACK HANDLER =====
const handleGoogleCallback = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    // Get authorization code from URL
    const code = route.query.code as string
    const state = route.query.state as string

    if (!code) {
      throw new Error('Không nhận được mã xác thực từ Google')
    }

    // Complete Google login flow
    const response = await completeGoogleLogin(code, state)

    console.log('🔍 Google login response:', response)

    if (response && response.success && response.data) {
      console.log('🔐 Google callback success, storing auth data...', response.data)
      console.log('🔍 Google user data:', response.data.user)
      console.log('🔍 Google user ID:', response.data.user?.id)
      
      // Calculate proper token expiry time (7 days from now)
      const tokenExpireAt = Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
      
      // Create user data with proper ID
      const userData = {
        id: response.data.user?.id || `google-user-${Date.now()}`,
        email: response.data.user?.email || 'user@google.com',
        name: response.data.user?.name || 'Google User',
        fullname: response.data.user?.fullname || response.data.user?.name || 'Google User',
        username: response.data.user?.username || `google-user-${Date.now()}`,
        role: 'user',
        verified: true,
        ...response.data.user
      }
      
      console.log('🔍 Created user data:', userData)
      
      // Store auth data directly in auth store
      const result = await authStore.completeGoogleLogin(
        response.data.accessToken, 
        tokenExpireAt, 
        userData
      )
      
      console.log('✅ Auth store updated:', result)
      console.log('🔍 Auth state after Google login:', {
        isAuthenticated: authStore.isAuthenticated,
        user: authStore.user,
        token: authStore.token
      })

      isSuccess.value = true
      
      // Redirect immediately after success
      console.log('🚀 Redirecting to home immediately...')
      await nextTick() // Wait for DOM update
      redirectToHome()
      
    } else {
      throw new Error(response.error || 'Đăng nhập Google thất bại')
    }

  } catch (error: any) {
    console.error('❌ Google callback failed:', error)
    errorMessage.value = error.message || 'Đăng nhập Google thất bại'
  } finally {
    isLoading.value = false
  }
}

// ===== REDIRECT HANDLERS =====
const redirectToHome = () => {
  const redirectPath = getRedirectPath()
  console.log('🔄 Redirecting to:', redirectPath)
  
  // Force refresh to ensure auth state is properly loaded
  window.location.href = redirectPath
}

const retryLogin = () => {
  router.push('/login')
}

const goToLogin = () => {
  router.push('/login')
}

// ===== GET REDIRECT PATH =====
const getRedirectPath = (): string => {
  try {
    const state = route.query.state as string
    if (state) {
      const stateData = JSON.parse(atob(state))
      return stateData.redirect || '/'
    }
  } catch (error) {
    console.warn('⚠️ Invalid state parameter:', error)
  }
  
  return '/'
}

// ===== LIFECYCLE =====
onMounted(() => {
  handleGoogleCallback()
})

// ===== SEO =====
useHead({
  title: 'Google OAuth Callback - Van Phuc Care',
  meta: [
    { name: 'description', content: 'Xử lý đăng nhập Google OAuth' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
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
