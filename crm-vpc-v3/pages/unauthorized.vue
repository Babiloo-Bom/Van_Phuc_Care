<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div class="mb-6">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
          <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Không có quyền truy cập</h1>
        <p class="text-gray-600">
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>
      </div>

      <div class="bg-gray-50 rounded p-4 mb-6">
        <p class="text-sm text-gray-600 mb-2"><strong>Thông tin:</strong></p>
        <ul class="text-sm text-left text-gray-700 space-y-1">
          <li v-if="user">• Tài khoản: {{ user.email }}</li>
          <li v-if="user?.role">• Vai trò: {{ user.role }}</li>
          <li v-if="requiredRole">• Yêu cầu: {{ requiredRole }}</li>
          <li v-if="requiredPermissions?.length">• Quyền yêu cầu: {{ requiredPermissions.join(', ') }}</li>
        </ul>
      </div>

      <div class="space-y-3">
        <button 
          @click="goBack" 
          class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          ← Quay lại
        </button>
        <button 
          @click="goHome" 
          class="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition"
        >
          🏠 Về trang chủ
        </button>
        <button 
          @click="logout" 
          class="w-full bg-red-100 text-red-600 py-2 px-4 rounded hover:bg-red-200 transition text-sm"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
const router = useRouter()
const route = useRoute()

// Get required role/permissions from previous route
const requiredRole = ref<string | undefined>()
const requiredPermissions = ref<string[] | undefined>()

onMounted(() => {
  // Try to get from route query or previous route meta
  const from = router.options.history.state.back as string
  if (from) {
    const fromRoute = router.getRoutes().find(r => r.path === from)
    if (fromRoute) {
      requiredRole.value = fromRoute.meta.requiredRole as string | undefined
      requiredPermissions.value = fromRoute.meta.requiredPermissions as string[] | undefined
    }
  }
})

const goBack = () => {
  router.back()
}

const goHome = () => {
  navigateTo('/dashboard')
}

const logout = async () => {
  const { logout: logoutFn } = useAuth()
  await logoutFn()
}

definePageMeta({
  layout: false
})

useHead({
  title: 'Unauthorized - Van Phuc Care'
})
</script>

