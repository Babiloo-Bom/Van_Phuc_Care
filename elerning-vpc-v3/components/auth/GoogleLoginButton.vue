<template>
  <a-button
    type="default"
    size="large"
    :disabled="!isGoogleConfigured"
    :loading="loading"
    class="w-full flex items-center justify-center gap-2 hover:shadow-md transition-shadow"
    @click="handleGoogleLogin"
  >
    <GoogleOutlined class="text-lg" />
    <span>Đăng nhập với Google</span>
  </a-button>
</template>

<script setup lang="ts">
import { GoogleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// Props & Emits
const emit = defineEmits<{
  success: [result: any]
  error: [error: string]
}>()

// Composables
const { generateAuthUrl, isGoogleConfigured } = useGoogleAuth()

// State
const loading = ref(false)

// ===== HANDLE GOOGLE LOGIN =====
const handleGoogleLogin = async () => {
  try {
    if (!isGoogleConfigured.value) {
      const errorMsg = 'Google OAuth chưa được cấu hình. Vui lòng kiểm tra NUXT_PUBLIC_GOOGLE_CLIENT_ID trong .env'
      message.error(errorMsg)
      emit('error', errorMsg)
      return
    }

    loading.value = true
    
    // Generate authorization URL
    const authUrl = generateAuthUrl()
    
    if (!authUrl) {
      throw new Error('Failed to generate Google authorization URL')
    }

    // Redirect to Google OAuth
    window.location.href = authUrl

  } catch (error: any) {
    const errorMsg = error.message || 'Không thể kết nối với Google. Vui lòng thử lại sau.'
    message.error(errorMsg)
    emit('error', errorMsg)
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.anticon) {
  vertical-align: middle;
}
</style>

