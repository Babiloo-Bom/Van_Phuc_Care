<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo & Title -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Đăng ký tài khoản
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Hoặc
          <NuxtLink to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            đăng nhập nếu đã có tài khoản
          </NuxtLink>
        </p>
      </div>

      <!-- Registration Steps -->
      <div class="bg-white shadow-xl rounded-lg p-8">
        <!-- Step 1: Register Form -->
        <div v-if="registrationStep === 'register'">
          <a-form
            :model="formData"
            @finish="handleRegister"
            layout="vertical"
          >
            <!-- Email -->
            <a-form-item
              label="Email"
              :validate-status="formErrors.email ? 'error' : ''"
              :help="formErrors.email"
            >
              <a-input
                v-model:value="formData.email"
                type="email"
                size="large"
                placeholder="example@email.com"
                :disabled="isRegistering"
              />
            </a-form-item>

            <!-- Fullname -->
            <a-form-item
              label="Họ và tên"
              :validate-status="formErrors.fullname ? 'error' : ''"
              :help="formErrors.fullname"
            >
              <a-input
                v-model:value="formData.fullname"
                size="large"
                placeholder="Nguyễn Văn A"
                :disabled="isRegistering"
              />
            </a-form-item>

            <!-- Phone (Optional) -->
            <a-form-item
              label="Số điện thoại (không bắt buộc)"
              :validate-status="formErrors.phone ? 'error' : ''"
              :help="formErrors.phone"
            >
              <a-input
                v-model:value="formData.phone"
                size="large"
                placeholder="0123456789"
                :disabled="isRegistering"
              />
            </a-form-item>

            <!-- Password -->
            <a-form-item
              label="Mật khẩu"
              :validate-status="formErrors.password ? 'error' : ''"
              :help="formErrors.password"
            >
              <a-input-password
                v-model:value="formData.password"
                size="large"
                placeholder="Ít nhất 6 ký tự"
                :disabled="isRegistering"
              />
            </a-form-item>

            <!-- Repeat Password -->
            <a-form-item
              label="Nhập lại mật khẩu"
              :validate-status="formErrors.repeat_password ? 'error' : ''"
              :help="formErrors.repeat_password"
            >
              <a-input-password
                v-model:value="formData.repeat_password"
                size="large"
                placeholder="Nhập lại mật khẩu"
                :disabled="isRegistering"
              />
            </a-form-item>

            <!-- Error Alert -->
            <a-alert
              v-if="registerError"
              :message="registerError"
              type="error"
              show-icon
              closable
              class="mb-4"
              @close="registerError = ''"
            />

            <!-- Submit Button -->
            <a-form-item>
              <a-button
                type="primary"
                size="large"
                block
                :loading="isRegistering"
                html-type="submit"
              >
                {{ isRegistering ? 'Đang đăng ký...' : 'Đăng ký' }}
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <!-- Step 2: Email Verification -->
        <div v-else-if="registrationStep === 'verify'">
          <div class="text-center mb-6">
            <div class="text-4xl mb-4">📧</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Xác thực email
            </h3>
            <p class="text-gray-600">
              Chúng tôi đã gửi mã xác thực đến <strong>{{ registeredEmail }}</strong>
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Vui lòng kiểm tra hộp thư và nhập mã 6 chữ số
            </p>
          </div>

          <a-form layout="vertical">
            <a-form-item
              label="Mã xác thực"
              :validate-status="verifyError ? 'error' : ''"
              :help="verifyError"
            >
              <a-input
                v-model:value="otpCode"
                size="large"
                placeholder="Nhập mã 6 chữ số"
                maxlength="6"
                :disabled="isVerifying"
                @input="formatOtpInput"
              />
            </a-form-item>

            <!-- Verify Button -->
            <a-form-item>
              <a-button
                type="primary"
                size="large"
                block
                :loading="isVerifying"
                @click="handleVerifyEmail"
              >
                Xác thực
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <!-- Step 3: Complete -->
        <div v-else-if="registrationStep === 'complete'" class="text-center">
          <div class="text-6xl text-green-500 mb-4">✅</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Đăng ký thành công!
          </h3>
          <p class="text-gray-600 mb-6">
            Tài khoản của bạn đã được xác thực. Đang chuyển hướng...
          </p>
          <a-spin size="large" />
        </div>
      </div>

      <!-- Back to Login -->
      <div class="text-center">
        <NuxtLink to="/login" class="text-sm text-gray-600 hover:text-gray-900">
          ← Quay lại đăng nhập
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'

// Page meta
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useHead({
  title: 'Đăng ký - Van Phuc Care'
})

// Composables
const {
  isRegistering,
  isVerifying,
  registrationStep,
  registeredEmail,
  register,
  verifyEmail,
  resetRegistration
} = useRegister()

// Form data
const formData = reactive({
  email: '',
  fullname: '',
  phone: '',
  password: '',
  repeat_password: '',
  domain: 'vanphuccare.gensi.vn',
  origin: 'vanphuccare.gensi.vn'
})

const formErrors = reactive<Record<string, string>>({})
const registerError = ref('')
const verifyError = ref('')
const otpCode = ref('')

// Handle register
const handleRegister = async () => {
  // Clear previous errors
  Object.keys(formErrors).forEach(key => delete formErrors[key])
  registerError.value = ''

  const result = await register(formData)

  if (result.success) {
    message.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực.')
  } else {
    if (result.errors) {
      // Set field-specific errors
      Object.assign(formErrors, result.errors)
    } else {
      registerError.value = result.error || 'Đăng ký thất bại'
    }
  }
}

// Handle email verification
const handleVerifyEmail = async () => {
  verifyError.value = ''

  if (!otpCode.value) {
    verifyError.value = 'Vui lòng nhập mã xác thực'
    return
  }

  const result = await verifyEmail(otpCode.value)

  if (result.success) {
    message.success('Xác thực thành công! Đang đăng nhập...')
  } else {
    verifyError.value = result.error || 'Xác thực thất bại'
  }
}

// Format OTP input (only numbers)
const formatOtpInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '') // Remove non-digits
  otpCode.value = value
}

// Reset form when component unmounts
onUnmounted(() => {
  resetRegistration()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
