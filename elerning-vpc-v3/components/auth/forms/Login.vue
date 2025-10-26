<template>
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    class="space-y-4 w-full custom-form"
  >
    <div class="grid grid-cols-1 gap-2.5">
      <a-form-item label="" prop="username">
        <a-input
          v-model:value="form.username"
          size="large"
          placeholder="Địa chỉ Email/ Số điện thoại"
          @keyup.enter="handleSubmit"
        />
      </a-form-item>
      <a-form-item label="" prop="password">
        <a-input-password
          v-model:value="form.password"
          size="large"
          placeholder="Mật khẩu"
          @keyup.enter="handleSubmit"
        />
      </a-form-item>
    </div>
    <div class="grid grid-cols-2 gap-4 items-center justify-between mb-3">
      <div>
        <NuxtLink to="/forgot-password" class="!text-[#F38284] text-[12px] underline">
          Quên mật khẩu?
        </NuxtLink>

        <div class="flex items-center gap-1 mt-1">
          <a-checkbox
            v-model:checked="form.remindAccount"
          />
          <p class="m-0 font-bold">
            Nhớ tài khoản
          </p>
        </div>
      </div>
      <a-button
        :loading="loading"
        type="primary"
        size="large"
        class="w-full"
        @click="handleSubmit"
      >
        Đăng nhập
      </a-button>
    </div>
    <GoogleButton />
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { message } from 'ant-design-vue'
import GoogleButton from '~/components/auth/buttons/GoogleButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const formRef = ref()

const form = reactive({
  username: '',
  password: '',
  remindAccount: true,
  origin: 'vanphuccare.gensi.vn',
})

const rules = {
  username: [
    {
      required: true,
      message: 'Vui lòng nhập địa chỉ email hoặc số điện thoại',
      trigger: ['blur', 'change'],
      min: 3,
    },
  ],
  password: [
    {
      required: true,
      message: 'Vui lòng nhập mật khẩu',
      trigger: 'blur',
    },
    {
      min: 8,
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
      trigger: 'blur',
    },
  ],
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      loading.value = true
      
      // Call login with correct parameters
      const result = await authStore.login(
        form.username,
        form.password,
        form.remindAccount
      )
      
      if (result.success) {
        message.success('Đăng nhập thành công')
        console.log('✅ Login successful, redirecting to home...')
        await navigateTo('/')
      } else {
        message.error(result.error || 'Tên đăng nhập hoặc mật khẩu không chính xác')
      }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    message.error('Tên đăng nhập hoặc mật khẩu không chính xác')
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
