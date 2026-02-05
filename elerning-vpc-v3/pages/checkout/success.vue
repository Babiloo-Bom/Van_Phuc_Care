<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12">
    <!-- Debug info -->
    <div class="fixed top-4 right-4 bg-red-500 text-white p-2 rounded text-xs z-50">
      SUCCESS PAGE LOADED - Route: {{ $route.path }}
    </div>
    <div class="max-w-2xl w-full mx-auto px-4">
      <!-- Success Card -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <!-- Header with gradient -->
        <div class="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
          <!-- Success Icon with animation -->
          <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
            <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          
          <!-- Success Message -->
          <h1 class="text-3xl font-bold text-white mb-3">
            Thanh toán thành công!
          </h1>
          
          <p class="text-green-100 text-lg">
            Cảm ơn bạn đã tin tưởng và mua khóa học tại Van Phuc Care
          </p>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-prim-100 mx-auto mb-4"></div>
            <p class="text-gray-600">Đang tải thông tin đơn hàng...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
            <p class="text-gray-600 mb-6">{{ error }}</p>
            <a-button type="primary" @click="fetchOrderDetails">
              Thử lại
            </a-button>
          </div>

          <!-- Order Info Card -->
          <div v-else class="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-prim-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-white">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6m8 0V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4.01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800">Thông tin đơn hàng</h3>
            </div>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center py-3 border-b border-gray-200">
                <span class="text-gray-600 font-medium">Mã đơn hàng:</span>
                <span class="font-mono font-semibold text-primary-100 bg-prim-100/10 px-3 py-1 rounded-lg">#{{ orderId }}</span>
              </div>
              
              <div class="flex justify-between items-center py-3 border-b border-gray-200">
                <span class="text-gray-600 font-medium">Tổng tiền:</span>
                <span class="text-2xl font-bold text-primary-100">{{ totalPrice.toLocaleString('vi-VN') }}đ</span>
              </div>
              
              <div class="flex justify-between items-center py-3">
                <span class="text-gray-600 font-medium">Thời gian:</span>
                <span class="font-semibold text-gray-800">{{ new Date().toLocaleString('vi-VN') }}</span>
              </div>
            </div>
          </div>
          
          <!-- Course Preview -->
          <div v-if="purchasedCourses.length > 0" class="mb-8">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Khóa học đã mua</h4>
            <div class="space-y-3">
              <div 
                v-for="(course, index) in purchasedCourses" 
                :key="`purchased_${index}`"
                class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <img
                  class="w-16 h-12 object-cover rounded-lg shadow-sm"
                  :src="course.thumbnail || '/images/courses/python-course.jpg'"
                  :alt="course.title"
                >
                <div class="flex-1 min-w-0">
                  <h5 class="font-semibold text-gray-800 truncate">{{ course.title }}</h5>
                  <p class="text-sm text-gray-600">{{ course.lessons }} bài học</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Đã mua
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Next Steps -->
          <div class="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-200">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-blue-800 mb-2">Bước tiếp theo</h4>
                <ul class="text-sm text-blue-700 space-y-1">
                  <li>• Chúng tôi đã gửi thông tin chi tiết đến email của bạn</li>
                  <li>• Bạn có thể bắt đầu học ngay trong "Khóa học của tôi"</li>
                  <li>• Hỗ trợ 24/7 qua hotline: (024) 6329 6698</li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="space-y-4">
            <a-button 
              type="primary" 
              size="large" 
              class="w-full !bg-prim-100 !py-4 !h-[60px] !text-white !border-prim-100 !text-xl !font-bold !rounded-xl !shadow-lg hover:!shadow-xl transition-all duration-300 !flex !items-center !justify-center !gap-3"
              @click="navigateTo('/my-learning')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Xem khóa học của tôi</span>
            </a-button>
            
            <a-button 
              size="large" 
              class="w-full !py-4 !h-[55px] !text-primary-100 !border-2 !border-prim-100 hover:!bg-prim-100 hover:!text-white transition-all duration-300 !rounded-xl !font-semibold !text-lg !flex !items-center !justify-center !gap-3"
              @click="navigateTo('/')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" class="fill-none stroke-current">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6m8 0V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4.01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Tiếp tục mua sắm</span>
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

const cartStore = useCartStore()
const authStore = useAuthStore()

// Get order ID from URL params
const route = useRoute()
const orderId = ref(route.query.orderId as string || '')

// Order data
const order = ref(null)
const loading = ref(true)
const error = ref('')

// Computed properties
const purchasedCourses = computed(() => order.value?.items || [])
const totalPrice = computed(() => order.value?.totalAmount || 0)
const paymentMethod = computed(() => {
  if (!order.value?.paymentMethod) return 'Bypass thanh toán'
  
  const methods = {
    'bypass': 'Bypass thanh toán',
    'vnpay': 'VNPay',
    'momo': 'MoMo',
    'qr': 'QR Code',
    'bank_transfer': 'Chuyển khoản ngân hàng'
  }
  return methods[order.value.paymentMethod] || order.value.paymentMethod
})

// Update user's courseRegister with purchased courses
const updateUserCourseRegister = async () => {
  if (!order.value?.items || !authStore.user) {
    return
  }

  try {
    
    // Get course IDs from order
    const courseIds = order.value.items.map((item: any) => item.courseId || item._id)
    
    // Call API to update courseRegister
    const authApi = useAuthApi()
    const response = await authApi.updateCourseRegister(courseIds, 'add') as any
    
    
    if (response.data?.user) {
      // Update local user data
      authStore.user.courseRegister = response.data.user.courseRegister
      authStore.saveAuth()
    } else {
    }
    
  } catch (error) {
  }
}

// Refresh authStore to ensure data is synced
const refreshAuthStore = async () => {
  try {
    // Re-initialize authStore to pick up latest data from localStorage
    authStore.initAuth()
  } catch (error) {
  }
}

// Fetch order details
const fetchOrderDetails = async () => {
  if (!orderId.value) {
    error.value = 'Không tìm thấy mã đơn hàng'
    loading.value = false
    return
  }

  try {
    const { apiUser } = useApiBase()
    const response: any = await $fetch(`${apiUser}/orders/${orderId.value}`)
    
    if (response.data && response.data.order) {
      order.value = response.data.order
      
      // Update user's courseRegister after successful payment
      await updateUserCourseRegister()
      
      // Refresh authStore to ensure data is synced
      await refreshAuthStore()

      // Sau khi đồng bộ xong, chuyển về trang "Khóa học của tôi"
      await navigateTo('/my-learning')
    } else {
      error.value = 'Không tìm thấy thông tin đơn hàng'
    }
  } catch (err: any) {
    error.value = 'Có lỗi xảy ra khi tải thông tin đơn hàng'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrderDetails()
})
</script>

<style scoped>
/* Custom colors to match design */
.text-primary-100 {
  color: #2176FF;
}

.bg-prim-100 {
  background-color: #2176FF;
}

.border-prim-100 {
  border-color: #2176FF;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.animate-pulse-slow {
  animation: pulse 2s ease-in-out infinite;
}

/* Success card entrance animation */
.bg-white {
  animation: fadeInUp 0.8s ease-out;
}

/* Button hover effects */
.ant-btn:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Card hover effects */
.hover\:shadow-md:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
</style>
