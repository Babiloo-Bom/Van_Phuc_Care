<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
        
        <div class="mb-6">
          <p class="text-gray-600">Chào mừng, <strong>{{ authStore.user?.fullname || authStore.user?.email }}</strong>!</p>
          <p class="text-sm text-gray-500 mt-2">Email: {{ authStore.user?.email }}</p>
        </div>

        <div class="space-y-4">
          <a-button type="primary" size="large" @click="handleLogout" :loading="loading">
            Đăng xuất
          </a-button>

          <div v-if="error" class="mt-4">
            <a-alert :message="error" type="error" show-icon closable @close="error = ''" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'

definePageMeta({
  middleware: 'auth',
  layout: false
})

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const error = ref('')

const handleLogout = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.logout()
    message.success('Đăng xuất thành công!')
    router.push('/login')
  } catch (err: any) {
    error.value = err.message || 'Có lỗi xảy ra khi đăng xuất'
  } finally {
    loading.value = false
  }
}
</script>

