<template>
  <a-form
    v-if="!showVerification"
    ref="formRef"
    :model="form"
    :rules="rules"
    class="w-full custom-form mb-6"
  >
    <div class="grid grid-cols-1 gap-4">
      <a-form-item prop="fullname">
        <a-input
          v-model:value="form.fullname"
          size="large"
          placeholder="Họ và tên"
          @keyup.enter="handleSubmit"
        />
      </a-form-item>
      <a-form-item prop="email">
        <a-input
          v-model:value="form.email"
          size="large"
          placeholder="Địa chỉ Email"
          @keyup.enter="handleSubmit"
        />
      </a-form-item>
      <a-form-item prop="phone">
        <a-input
          v-model:value="form.phone"
          size="large"
          placeholder="Số điện thoại (không bắt buộc)"
          @keyup.enter="handleSubmit"
        />
      </a-form-item>
      <a-form-item prop="password">
        <a-input-password
          v-model:value="form.password"
          size="large"
          placeholder="Mật khẩu"
          @keyup.enter="handleSubmit"
        />
      </a-form-item>
      <a-form-item prop="repeat_password">
        <a-input-password
          v-model:value="form.repeat_password"
          size="large"
          placeholder="Lặp lại Mật khẩu"
          @keyup.enter="handleSubmit"
        />
      </a-form-item>
      <a-button
        :loading="loading"
        type="primary"
        size="large"
        class="w-full"
        @click="handleSubmit"
      >
        Đăng ký tài khoản
      </a-button>
    </div>
  </a-form>
  
  <a-form
    v-else
    ref="formVerifyRef"
    :model="formVerify"
    :rules="rulesVerify"
    class="space-y-6 w-full mb-6"
  >
    <a-form-item label="Mã xác thực" prop="otp">
      <a-input
        v-model:value="formVerify.otp"
        size="large"
        placeholder="Nhập mã xác thực"
        @keyup.enter="handleSubmitVerify"
      />
    </a-form-item>
    <a-button
      :loading="loading"
      type="primary"
      size="large"
      class="w-full"
      :disabled="formVerify.otp === ''"
      @click="handleSubmitVerify"
    >
      Xác thực
    </a-button>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const showVerification = ref(false)
const formRef = ref()
const formVerifyRef = ref()

const form = reactive({
  email: '',
  password: '',
  repeat_password: '',
  fullname: '',
  phone: '',
  domain: 'vanphuccare.gensi.vn',
  origin: 'vanphuccare.gensi.vn'
})

const formVerify = reactive({
  otp: '',
})

const rules = {
  fullname: [
    {
      required: true,
      message: 'Vui lòng nhập họ và tên',
      trigger: 'blur',
    },
    {
      min: 2,
      message: 'Họ tên phải có ít nhất 2 ký tự',
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: 'Vui lòng nhập email',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: 'Vui lòng nhập email hợp lệ',
      trigger: 'blur',
    },
  ],
  phone: [
    {
      pattern: /^(0|\+84)[0-9]{9,10}$/,
      message: 'Số điện thoại không hợp lệ',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: 'Vui lòng nhập mật khẩu',
      trigger: 'blur',
    },
    {
      min: 6,
      message: 'Mật khẩu phải có ít nhất 6 ký tự',
      trigger: 'blur',
    },
  ],
  repeat_password: [
    {
      required: true,
      message: 'Vui lòng không để trống',
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: string) => {
        if (value !== form.password) {
          return Promise.reject('Mật khẩu không khớp')
        }
        return Promise.resolve()
      },
      trigger: 'blur',
    },
  ],
}

const rulesVerify = {
  otp: [
    {
      required: true,
      message: 'Vui lòng nhập mã xác thực',
      trigger: 'blur',
    },
  ],
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      loading.value = true
      
      // Use auth store register method
      const result = await authStore.register(
        form.email,
        form.password,
        form.repeat_password,
        form.fullname
      )
      
      if (result.success) {
        showVerification.value = true
        message.success('Vui lòng kiểm tra email để lấy mã xác thực')
      } else {
        message.error(result.error || 'Đăng ký thất bại')
      }
    }
  } catch (error: any) {
    message.error('Đăng ký thất bại')
  } finally {
    loading.value = false
  }
}

const handleSubmitVerify = async () => {
  try {
    const valid = await formVerifyRef.value.validate()
    if (valid) {
      loading.value = true
      
      // Use auth store verifyEmail method
      const result = await authStore.verifyEmail(form.email, formVerify.otp)
      
      if (result.success) {
        message.success('Xác thực thành công! Đang đăng nhập...')
        
        // Auto login after successful verification
        const loginResult = await authStore.loginAfterRegister(form.email, form.password)
        if (loginResult.success) {
          setTimeout(() => {
            navigateTo('/')
          }, 1500)
        } else {
          setTimeout(() => {
            navigateTo('/login')
          }, 1500)
        }
      } else {
        message.error(result.error || 'Mã xác thực không chính xác!')
      }
    }
  } catch (error: any) {
    message.error('Xác thực thất bại!')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
::placeholder {
  color: #999;
  font-style: italic;
}

:-webkit-input-placeholder {
  color: #999;
  font-style: italic;
}

::-moz-placeholder {
  color: #999;
  font-style: italic;
}

:-ms-input-placeholder {
  color: #999;
  font-style: italic;
}

.custom-form {
  .ant-form-explain {
    @apply absolute;
  }
}
</style>
