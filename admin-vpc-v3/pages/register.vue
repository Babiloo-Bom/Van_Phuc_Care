<template>
  <div class="flex flex-col items-center max-w-md mx-auto">
    <!-- Success Message -->
    <a-alert
      v-if="success"
      class="!mt-3 w-full"
      :message="success"
      type="success"
      show-icon
      closable
      @close="success = ''"
    />

    <!-- Error Alert -->
    <a-alert
      v-if="error"
      class="!mt-3 w-full"
      :message="error"
      type="error"
      show-icon
      closable
      @close="error = ''"
    />

    <!-- Register Form -->
    <a-form
      v-if="!showVerification"
      ref="formRef"
      :model="form"
      :rules="rules"
      class="!mt-3 w-full"
      @finish="handleRegister"
    >
      <a-form-item name="email">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Địa chỉ Email
        </label>
        <a-input
          id="email"
          v-model:value="form.email"
          size="large"
          type="email"
          placeholder="example@email.com"
          @pressEnter="handleRegister"
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
          placeholder="Tối thiểu 8 ký tự"
          @pressEnter="handleRegister"
        />
      </a-form-item>

      <a-form-item name="repeat_password">
        <label for="repeat_password" class="block text-sm font-medium text-gray-700 mb-2">
          Nhập lại mật khẩu
        </label>
        <a-input-password
          id="repeat_password"
          v-model:value="form.repeat_password"
          size="large"
          placeholder="Nhập lại mật khẩu"
          @pressEnter="handleRegister"
        />
      </a-form-item>

      <a-button
        type="primary"
        html-type="submit"
        size="large"
        class="w-full"
        :loading="loading"
      >
        Đăng ký tài khoản
      </a-button>
    </a-form>

    <!-- OTP Verification Form -->
    <a-form
      v-else
      ref="formVerifyRef"
      :model="formVerify"
      :rules="rulesVerify"
      class="!mt-3 w-full"
      @finish="handleVerifyEmail"
    >
      <a-form-item name="otp">
        <label for="otp" class="block text-sm font-medium text-gray-700 mb-2">
          Mã xác thực
        </label>
        <div class="text-sm text-gray-600 mb-3">
          Mã xác thực đã được gửi đến email: <strong>{{ form.email }}</strong>
        </div>
        <a-input
          id="otp"
          v-model:value="formVerify.otp"
          size="large"
          placeholder="Nhập mã 6 số"
          maxlength="6"
          @pressEnter="handleVerifyEmail"
        />
      </a-form-item>

      <a-button
        type="primary"
        html-type="submit"
        size="large"
        class="w-full"
        :loading="loading"
        :disabled="!formVerify.otp || formVerify.otp.length < 6"
      >
        Xác thực
      </a-button>

      <a-button
        type="link"
        class="w-full mt-2"
        @click="showVerification = false"
      >
        Quay lại
      </a-button>
    </a-form>

    <!-- Login Link -->
    <div class="mt-6 text-center">
      <span class="text-sm text-gray-600">
        Đã có tài khoản?
      </span>
      <nuxt-link to="/login" class="text-sm text-primary-500 hover:text-primary-600 ml-1 underline">
        Đăng nhập ngay
      </nuxt-link>
    </div>

    <!-- Home Link -->
    <div class="mt-4 text-center">
      <a
        href="https://vanphuccare.vn"
        target="_blank"
        class="text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Về trang chủ →
      </a>
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
  title: 'Đăng ký - Van Phuc Care'
})

// Store
const authStore = useAuthStore()

// Form state
const formRef = ref()
const formVerifyRef = ref()

const form = reactive({
  email: '',
  password: '',
  repeat_password: ''
})

const formVerify = reactive({
  otp: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')
const showVerification = ref(false)

// Validation rules
const rules = {
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
  ],
  password: [
    {
      required: true,
      message: 'Vui lòng nhập mật khẩu',
      trigger: 'blur'
    },
    {
      min: 8,
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
      trigger: 'blur'
    }
  ],
  repeat_password: [
    {
      required: true,
      message: 'Vui lòng nhập lại mật khẩu',
      trigger: 'blur'
    },
    {
      validator: (_rule: any, value: string) => {
        if (value !== form.password) {
          return Promise.reject('Mật khẩu không khớp')
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ]
}

const rulesVerify = {
  otp: [
    {
      required: true,
      message: 'Vui lòng nhập mã xác thực',
      trigger: 'blur'
    },
    {
      len: 6,
      message: 'Mã xác thực phải có 6 số',
      trigger: 'blur'
    }
  ]
}

// Handle register
const handleRegister = async () => {
  try {
    await formRef.value.validate()

    loading.value = true
    error.value = ''

    // Call register action
    const result = await authStore.register(
      form.email,
      form.password,
      form.repeat_password
    )

    if (result.success) {
      success.value = 'Đăng ký thành công! Vui lòng kiểm tra email để nhận mã xác thực.'
      showVerification.value = true
    } else {
      error.value = result.error || 'Email đã được sử dụng, vui lòng nhập email khác!'
    }
  } catch (validationError) {
    console.error('Validation error:', validationError)
  } finally {
    loading.value = false
  }
}

// Handle verify email
const handleVerifyEmail = async () => {
  try {
    await formVerifyRef.value.validate()

    loading.value = true
    error.value = ''

    // Step 1: Verify OTP
    const verifyResult = await authStore.verifyEmail(form.email, formVerify.otp)

    if (verifyResult.success) {
      message.success('Xác thực thành công!')

      // Step 2: Auto login
      const loginResult = await authStore.loginAfterRegister(
        form.email,
        form.password
      )

      if (loginResult.success) {
        message.success('Đăng nhập thành công!')

        // Redirect to dashboard
        navigateTo('/')
      } else {
        error.value = 'Xác thực thành công nhưng đăng nhập thất bại. Vui lòng đăng nhập thủ công.'
        setTimeout(() => {
          navigateTo('/login')
        }, 2000)
      }
    } else {
      error.value = verifyResult.error || 'Mã xác thực không chính xác!'
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

