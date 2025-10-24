<template>
  <div class="flex flex-col items-center max-w-md mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 text-center mb-2">
      Đặt lại mật khẩu
    </h2>
    <p class="text-sm text-gray-600 text-center mb-6">
      Nhập mật khẩu mới cho tài khoản của bạn
    </p>

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

    <!-- Reset Password Form -->
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      class="w-full"
      @finish="handleResetPassword"
    >
      <a-form-item name="newPassword">
        <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
          Mật khẩu mới
        </label>
        <a-input-password
          id="newPassword"
          v-model:value="form.newPassword"
          size="large"
          placeholder="Tối thiểu 8 ký tự"
          @pressEnter="handleResetPassword"
        />
      </a-form-item>

      <a-form-item name="confirmPassword">
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
          Xác nhận mật khẩu mới
        </label>
        <a-input-password
          id="confirmPassword"
          v-model:value="form.confirmPassword"
          size="large"
          placeholder="Nhập lại mật khẩu mới"
          @pressEnter="handleResetPassword"
        />
      </a-form-item>

      <a-button
        type="primary"
        html-type="submit"
        size="large"
        class="w-full"
        :loading="loading"
      >
        Đặt lại mật khẩu
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
  title: 'Đặt lại mật khẩu - Van Phuc Care'
})

// Store & Router
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// Get email and token from query params
const email = ref(route.query.email as string || '')
const token = ref(route.query.token as string || '')

// Form refs
const formRef = ref()

// Form state
const form = reactive({
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

// Validation rules
const rules = {
  newPassword: [
    {
      required: true,
      message: 'Vui lòng nhập mật khẩu mới',
      trigger: 'blur'
    },
    {
      min: 8,
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: 'Vui lòng xác nhận mật khẩu',
      trigger: 'blur'
    },
    {
      validator: (_rule: any, value: string) => {
        if (value !== form.newPassword) {
          return Promise.reject('Mật khẩu không khớp')
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ]
}

// Check if email and token exist
onMounted(() => {
  if (!email.value || !token.value) {
    message.error('Thiếu thông tin xác thực. Vui lòng thực hiện lại quá trình quên mật khẩu.')
    router.push('/forgot-password')
  }
})

// Handle reset password
const handleResetPassword = async () => {
  try {
    await formRef.value.validate()

    loading.value = true
    error.value = ''

    // Reset password with token
    const result = await authStore.resetPassword(
      email.value,
      token.value,
      form.newPassword
    )

    if (result.success) {
      message.success('Đổi mật khẩu thành công!')

      // Redirect to login after 1 second
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    } else {
      error.value = result.error || 'Đổi mật khẩu thất bại. Token có thể đã hết hạn.'
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

