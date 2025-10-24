<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <a-spin size="large" />
      <p class="mt-4 text-gray-600">{{ statusMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'

// Page setup
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

// Store
const authStore = useAuthStore()

// Composables
const { completeGoogleLogin } = useGoogleAuth()
const route = useRoute()
const router = useRouter()

// State
const statusMessage = ref('Đang xử lý đăng nhập Google...')

// ===== HANDLE OAUTH CALLBACK =====
onMounted(async () => {
  try {
    // Get authorization code from URL
    const code = route.query.code as string
    const state = route.query.state as string

    if (!code) {
      throw new Error('Không tìm thấy mã xác thực từ Google')
    }

    console.log('✅ Received authorization code from Google')
    statusMessage.value = 'Đang xác thực với server...'

    // Complete Google login via backend
    const result = await completeGoogleLogin(code)

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Đăng nhập Google thất bại')
    }

    console.log('✅ Google login successful')
    statusMessage.value = 'Đăng nhập thành công! Đang chuyển hướng...'

    // Store authentication data using the new method
    await authStore.completeGoogleLogin(
      result.data.accessToken,
      result.data.tokenExpireAt,
      result.data.user
    )

    message.success('Đăng nhập Google thành công!')

    // Redirect to dashboard
    setTimeout(() => {
      router.push('/')
    }, 1000)

  } catch (error: any) {
    console.error('❌ Google OAuth callback error:', error)
    statusMessage.value = 'Đăng nhập thất bại'
    message.error(error.message || 'Đăng nhập Google thất bại')

    // Redirect to login page after 2 seconds
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
})
</script>

<style scoped>
/* Optional: Add any custom styles */
</style>

