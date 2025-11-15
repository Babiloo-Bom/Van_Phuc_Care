<template>
  <div class="login-form">
    <a-form
      :model="formData"
      :rules="rules"
      layout="vertical"
      @finish="handleLogin"
      class="w-full"
    >
      <!-- Email/Username Field -->
      <a-form-item label="Email hoặc tên đăng nhập" name="username" class="mb-4">
        <a-input
          v-model:value="formData.username"
          placeholder="Nhập email hoặc tên đăng nhập"
          size="large"
          class="!rounded-lg !border-gray-300 hover:!border-prim-100 focus:!border-prim-100"
        />
      </a-form-item>

      <!-- Password Field -->
      <a-form-item label="Mật khẩu" name="password" class="mb-4">
        <a-input-password
          v-model:value="formData.password"
          placeholder="Nhập mật khẩu"
          size="large"
          class="!rounded-lg !border-gray-300 hover:!border-prim-100 focus:!border-prim-100"
        />
      </a-form-item>

      <!-- Remember Account -->
      <a-form-item class="mb-4">
        <a-checkbox v-model:checked="formData.rememberAccount">
          Ghi nhớ tài khoản
        </a-checkbox>
      </a-form-item>

      <!-- Login Button -->
      <a-form-item class="mb-4">
        <a-button
          type="primary"
          html-type="submit"
          size="large"
          class="w-full !bg-prim-100 !py-3 !h-[50px] !text-white !border-prim-100 !text-lg !font-semibold !rounded-lg !shadow-lg hover:!shadow-xl transition-all duration-300"
          :loading="loading"
        >
          <span v-if="!loading">Đăng nhập</span>
          <span v-else>Đang đăng nhập...</span>
        </a-button>
      </a-form-item>

      <!-- Forgot Password Link -->
      <div class="text-center">
        <a-button type="link" class="!p-0 !text-primary-100" @click="handleForgotPassword">
          Quên mật khẩu?
        </a-button>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Form data
const formData = reactive({
  username: '',
  password: '',
  rememberAccount: false
})

// Loading state
const loading = ref(false)

// Form validation rules
const rules = {
  username: [
    { required: true, message: 'Vui lòng nhập email hoặc tên đăng nhập', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' }
  ]
}

// Handle login
const handleLogin = async () => {
  try {
    loading.value = true

    const result = await authStore.login(
      formData.username,
      formData.password,
      formData.rememberAccount
    )

    if (result.success) {
      
      // Show success message
      // You can add a notification here if needed
      
      // Redirect to home page
      await navigateTo('/')
    } else {
      
      // Show error message
      // You can add error notification here
      alert(result.error || 'Đăng nhập thất bại')
    }
  } catch (error) {
    alert('Có lỗi xảy ra khi đăng nhập')
  } finally {
    loading.value = false
  }
}

// Handle forgot password
const handleForgotPassword = () => {
  // Navigate to forgot password page or show modal
  // navigateTo('/forgot-password')
}
</script>

<style scoped>
/* Custom colors to match design */
.text-primary-100 {
  color: #2176FF;
}

.border-prim-100 {
  border-color: #2176FF;
}

.bg-prim-100 {
  background-color: #2176FF;
}

/* Form styling */
.login-form {
  width: 100%;
}

/* Ant Design overrides */
:deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #374151;
}

:deep(.ant-input) {
  border-radius: 8px;
}

:deep(.ant-input:focus) {
  border-color: #2176FF;
  box-shadow: 0 0 0 2px rgba(33, 118, 255, 0.1);
}

:deep(.ant-btn-primary) {
  background-color: #2176FF;
  border-color: #2176FF;
}

:deep(.ant-btn-primary:hover) {
  background-color: #1d6ae5;
  border-color: #1d6ae5;
}
</style>
