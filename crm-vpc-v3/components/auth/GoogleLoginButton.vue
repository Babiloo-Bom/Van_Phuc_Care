<template>
  <div class="google-login-container">
    <!-- Google Login Button -->
    <a-button
      :loading="isLoading"
      :disabled="!isGoogleConfigured"
      @click="handleGoogleLogin"
      class="google-login-btn"
      size="large"
      block
    >
      <template #icon>
        <GoogleOutlined />
      </template>
      {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập bằng Google' }}
    </a-button>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      <a-alert
        :message="errorMessage"
        type="error"
        show-icon
        closable
        @close="errorMessage = ''"
      />
    </div>

    <!-- Configuration Error -->
    <div v-if="!isGoogleConfigured" class="config-error">
      <a-alert
        message="Google OAuth chưa được cấu hình"
        description="Vui lòng liên hệ quản trị viên để cấu hình Google OAuth"
        type="warning"
        show-icon
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { GoogleOutlined } from '@ant-design/icons-vue'

// ===== PROPS & EMITS =====
interface Props {
  redirectAfterLogin?: string
  showError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  redirectAfterLogin: '/',
  showError: true
})

const emit = defineEmits<{
  success: [data: any]
  error: [error: string]
}>()

// ===== COMPOSABLES =====
const { googleLogin, isGoogleConfigured } = useGoogleAuth()
const router = useRouter()
const config = useRuntimeConfig()

// ===== STATE =====
const isLoading = ref(false)
const errorMessage = ref('')

// ===== GOOGLE LOGIN HANDLER =====
const handleGoogleLogin = async () => {
  if (!isGoogleConfigured.value) {
    errorMessage.value = 'Google OAuth chưa được cấu hình'
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    // Generate Google OAuth URL
    const authUrl = getGoogleLoginUrl()
    
    // Redirect to Google OAuth
    window.location.href = authUrl
    
  } catch (error: any) {
    errorMessage.value = error.message || 'Đăng nhập Google thất bại'
    
    if (props.showError) {
      emit('error', errorMessage.value)
    }
  } finally {
    isLoading.value = false
  }
}

// ===== GOOGLE OAUTH URL GENERATION =====
const getGoogleLoginUrl = (): string => {
  const params = new URLSearchParams({
    client_id: config.public.googleClientId,
    redirect_uri: `${config.public.baseUrl}/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state: btoa(JSON.stringify({
      redirect: props.redirectAfterLogin,
      timestamp: Date.now()
    }))
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}
</script>

<style scoped>
.google-login-container {
  width: 100%;
}

.google-login-btn {
  height: 48px;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #d9d9d9;
  color: #333;
  transition: all 0.3s ease;
}

.google-login-btn:hover {
  border-color: #4285f4;
  color: #4285f4;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.2);
}

.google-login-btn:disabled {
  background: #f5f5f5;
  border-color: #d9d9d9;
  color: #bfbfbf;
  cursor: not-allowed;
}

.error-message {
  margin-top: 16px;
}

.config-error {
  margin-top: 16px;
}

/* Google Brand Colors */
.google-login-btn .anticon {
  color: #4285f4;
  font-size: 18px;
}

/* Loading state */
.google-login-btn.ant-btn-loading {
  background: #f5f5f5;
  border-color: #d9d9d9;
}
</style>
