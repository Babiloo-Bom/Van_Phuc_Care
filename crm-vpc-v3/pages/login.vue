<template>
  <div class="flex flex-col items-center">
    <!-- Error Alert -->
    <a-alert
      v-if="error"
      class="!mt-3 w-full"
      :message="error"
      type="warning"
      show-icon
      closable
      @close="error = ''"
    />

    <!-- Login Form -->
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      class="!mt-3 min-w-[200px] max-w-md w-full space-y-4"
      @finish="handleLogin"
    >
      <a-form-item name="username">
        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
          Tài khoản
        </label>
        <a-input
          id="username"
          v-model:value="form.username"
          size="large"
          placeholder="Email hoặc Số điện thoại"
          @pressEnter="handleLogin"
        />
      </a-form-item>

      <a-form-item name="password">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Mật khẩu
        </label>
        <a-input-password
          id="password"
          v-model:value="form.password"
          size="large"
          placeholder="Nhập mật khẩu"
          @pressEnter="handleLogin"
        />
      </a-form-item>

      <div class="flex items-center justify-between">
        <a-checkbox v-model:checked="form.remindAccount">
          <span class="text-sm text-gray-600">Nhớ tài khoản</span>
        </a-checkbox>
        
        <span 
          class="text-sm text-primary-500 hover:text-primary-600 cursor-pointer underline"
          @click="showForgotPasswordDialog = true"
        >
          Quên mật khẩu?
        </span>
      </div>

      <a-button 
        type="primary" 
        html-type="submit"
        size="large"
        class="w-full"
        :loading="loading"
      >
        Đăng nhập
      </a-button>
    </a-form>

    <!-- Divider -->
    <div class="relative w-full max-w-md my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">Hoặc</span>
      </div>
    </div>

    <!-- Google Login Button -->
    <GoogleLoginButton 
      class="w-full max-w-md"
      @success="handleGoogleSuccess"
      @error="handleGoogleError"
    />

    <!-- Register Link -->
    <div class="mt-6 text-center">
      <span class="text-sm text-gray-600">Chưa có tài khoản? </span>
      <NuxtLink 
        to="/register" 
        class="text-sm text-primary-500 hover:text-primary-600 font-medium underline"
      >
        Đăng ký ngay
      </NuxtLink>
    </div>

    <!-- Forgot Password Dialog -->
    <a-modal
      v-model:open="showForgotPasswordDialog"
      title="Quên mật khẩu"
      :footer="null"
    >
      <div class="text-center py-4">
        <h2 class="text-center mb-3">
          Để được cấp lại mật khẩu vui lòng liên hệ số điện thoại
        </h2>
        <a class="text-3xl text-primary-500 font-bold" href="tel:0963395763">
          0963395763
        </a>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import GoogleLoginButton from '~/components/auth/GoogleLoginButton.vue'

// Page setup
definePageMeta({
  layout: 'auth',
  middleware: 'guest' // Only accessible for guests
})

useHead({
  title: 'Đăng nhập - Van Phuc Care Admin'
})

// Store
const authStore = useAuthStore()

// Form state
const formRef = ref()
const form = reactive({
  username: '',
  password: '',
  remindAccount: false
})

const loading = ref(false)
const error = ref('')
const showForgotPasswordDialog = ref(false)

// Validation rules
const rules = {
  username: [
    {
      required: true,
      message: 'Vui lòng nhập tên đăng nhập',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: 'Vui lòng nhập mật khẩu',
      trigger: 'blur'
    }
  ]
}

// Handle login
const handleLogin = async () => {
  try {
    // Validate form
    await formRef.value.validate()
    
    loading.value = true
    error.value = ''

    // Call login action
    const result = await authStore.login(
      form.username,
      form.password,
      form.remindAccount
    )

    if (result.success) {
      message.success('Đăng nhập thành công')
      
      // Redirect to dashboard
      navigateTo('/')
    } else {
      error.value = result.error || 'Tên đăng nhập hoặc mật khẩu không chính xác'
    }
  } catch (validationError) {
    console.error('Validation error:', validationError)
  } finally {
    loading.value = false
  }
}

// Handle Google login success
const handleGoogleSuccess = (result: any) => {
  message.success('Đăng nhập Google thành công')
  navigateTo('/')
}

// Handle Google login error
const handleGoogleError = (errorMessage: string) => {
  error.value = errorMessage || 'Đăng nhập Google thất bại'
  message.error(error.value)
}

// Load saved credentials if "Remember Account" was checked
onMounted(() => {
  if (process.client) {
    const authDataStr = localStorage.getItem('auth_data')
    if (authDataStr) {
      try {
        const authData = JSON.parse(authDataStr)
        if (authData.remindAccount) {
          form.username = authData.username || ''
          form.remindAccount = true
        }
      } catch (e) {
        console.error('Failed to load saved credentials:', e)
      }
    }
  }
})
</script>

<style scoped>
/* Custom styles for auth page */
</style>

