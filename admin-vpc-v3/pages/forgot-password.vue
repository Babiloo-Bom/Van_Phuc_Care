<template>
  <div class="flex flex-col items-center max-w-md mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 text-center mb-2">
      Quên mật khẩu
    </h2>
    <p class="text-sm text-gray-600 text-center mb-6">
      {{ !showOtpInput ? 'Nhập email để nhận mã xác thực' : 'Nhập mã xác thực đã được gửi đến email của bạn' }}
    </p>

    <!-- Success Alert -->
    <a-alert
      v-if="success"
      class="!mb-4 w-full"
      :message="success"
      type="success"
      show-icon
      closable
      @close="success = ''"
    />

    <!-- Error Alert -->
    <a-alert
      v-if="error"
      class="!mb-4 w-full"
      :message="error"
      type="error"
      show-icon
      closable
      @close="error = ''"
    />

    <!-- Step 1: Email Form -->
    <a-form
      v-if="!showOtpInput"
      ref="emailFormRef"
      :model="emailForm"
      :rules="emailRules"
      class="w-full"
      @finish="handleSendOtp"
    >
      <a-form-item name="email">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <a-input
          id="email"
          v-model:value="emailForm.email"
          size="large"
          type="email"
          placeholder="example@email.com"
          @pressEnter="handleSendOtp"
        />
      </a-form-item>

      <a-button
        type="primary"
        html-type="submit"
        size="large"
        class="w-full"
        :loading="loading"
      >
        Gửi mã xác thực
      </a-button>
    </a-form>

    <!-- Step 2: OTP Form -->
    <a-form
      v-else
      ref="otpFormRef"
      :model="otpForm"
      :rules="otpRules"
      class="w-full"
      @finish="handleVerifyOtp"
    >
      <a-form-item name="otp">
        <label for="otp" class="block text-sm font-medium text-gray-700 mb-2">
          Mã xác thực (OTP)
        </label>
        <div class="text-sm text-gray-600 mb-3">
          Mã đã được gửi đến: <strong>{{ emailForm.email }}</strong>
        </div>
        <a-input
          id="otp"
          v-model:value="otpForm.otp"
          size="large"
          placeholder="Nhập mã 6 số"
          maxlength="6"
          @pressEnter="handleVerifyOtp"
        />
      </a-form-item>

      <a-button
        type="primary"
        html-type="submit"
        size="large"
        class="w-full"
        :loading="loading"
        :disabled="!otpForm.otp || otpForm.otp.length < 6"
      >
        Xác thực
      </a-button>

      <a-button
        type="link"
        class="w-full mt-2"
        @click="showOtpInput = false"
      >
        Quay lại
      </a-button>
    </a-form>

    <!-- Back to Login -->
    <div class="mt-6 text-center w-full">
      <nuxt-link
        to="/login"
        class="text-sm text-gray-600 hover:text-gray-800 underline"
      >
        ← Quay lại đăng nhập
      </nuxt-link>
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

useHead({
  title: 'Quên mật khẩu - Van Phuc Care'
})

// Store
const authStore = useAuthStore()
const router = useRouter()

// Form refs
const emailFormRef = ref()
const otpFormRef = ref()

// Form state
const emailForm = reactive({
  email: ''
})

const otpForm = reactive({
  otp: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')
const showOtpInput = ref(false)

// Validation rules
const emailRules = {
  email: [
    {
      required: true,
      message: 'Vui lòng nhập email',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: 'Email không hợp lệ',
      trigger: 'blur'
    }
  ]
}

const otpRules = {
  otp: [
    {
      required: true,
      message: 'Vui lòng nhập mã OTP',
      trigger: 'blur'
    },
    {
      len: 6,
      message: 'Mã OTP phải có 6 số',
      trigger: 'blur'
    }
  ]
}

// Handle send OTP
const handleSendOtp = async () => {
  try {
    await emailFormRef.value.validate()

    loading.value = true
    error.value = ''

    // Send OTP to email
    const result = await authStore.forgotPassword(emailForm.email)

    if (result.success) {
      success.value = 'Mã xác thực đã được gửi vào email của bạn'
      message.success('Đã gửi OTP vào email')
      showOtpInput.value = true
    } else {
      error.value = result.error || 'Gửi OTP thất bại'
    }
  } catch (validationError) {
    console.error('Validation error:', validationError)
  } finally {
    loading.value = false
  }
}

// Handle verify OTP
const handleVerifyOtp = async () => {
  try {
    await otpFormRef.value.validate()

    loading.value = true
    error.value = ''

    // Verify OTP and get token
    const result = await authStore.verifyOtpForPassword(
      emailForm.email,
      otpForm.otp
    )

    if (result.success && result.token) {
      message.success('Xác thực OTP thành công!')

      // Redirect to reset password page with email and token
      router.push({
        path: '/reset-password',
        query: {
          email: emailForm.email,
          token: result.token
        }
      })
    } else {
      error.value = result.error || 'Mã OTP không chính xác'
    }
  } catch (validationError) {
    console.error('Validation error:', validationError)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Custom styles */
</style>

