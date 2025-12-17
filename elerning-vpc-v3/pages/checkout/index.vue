<template>
  <div class="mb-20 mt-20">
    <!-- Debug info -->
    <div class="fixed top-4 right-4 bg-blue-500 text-white p-2 rounded text-xs z-50">
      CHECKOUT PAGE - Route: {{ $route.path }}
    </div>
    <main class="container py-10 lg:pt-0">
      <div class="mb-6 md:mb-12">
        <h2 class="block text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-100">
          Thanh toán
        </h2>
        <p class="text-gray-600 mt-2">Hoàn tất đơn hàng của bạn một cách an toàn và nhanh chóng</p>
      </div>
      <hr class="border-gray-50/70 my-4 md:my-10 xl:my-12">
      
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Left Section: Checkout Form -->
        <div class="w-full lg:w-[60%] xl:w-[55%]">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-10 h-10 bg-prim-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-white">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M22 11h-6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-800">Thông tin thanh toán</h3>
            </div>
            
            <a-form
              :model="checkoutForm"
              :rules="formRules"
              layout="vertical"
              @finish="handleSubmit"
            >
              <!-- Personal Information -->
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <a-form-item label="Họ và tên" name="fullName" class="mb-0">
                    <template #label>
                      <span class="text-gray-700 font-semibold">
                        Họ và tên <span class="text-red-500">*</span>
                      </span>
                    </template>
                    <a-input 
                      v-model:value="checkoutForm.fullName" 
                      placeholder="Nhập họ và tên"
                      size="large"
                      class="!rounded-lg !border-gray-300 hover:!border-prim-100 focus:!border-prim-100"
                    />
                  </a-form-item>
                  
                  <a-form-item label="Số điện thoại" name="phone" class="mb-0">
                    <template #label>
                      <span class="text-gray-700 font-semibold">
                        Số điện thoại <span class="text-red-500">*</span>
                      </span>
                    </template>
                    <a-input 
                      v-model:value="checkoutForm.phone" 
                      placeholder="Nhập số điện thoại"
                      size="large"
                      class="!rounded-lg !border-gray-300 hover:!border-prim-100 focus:!border-prim-100"
                    />
                  </a-form-item>
                </div>
                
                <a-form-item label="Email" name="email" class="mb-0">
                  <template #label>
                    <span class="text-gray-700 font-semibold">
                      Email <span class="text-red-500">*</span>
                    </span>
                  </template>
                  <a-input 
                    v-model:value="checkoutForm.email" 
                    placeholder="Nhập email"
                    size="large"
                    class="!rounded-lg !border-gray-300 hover:!border-prim-100 focus:!border-prim-100"
                  />
                </a-form-item>
                
                <a-form-item label="Ghi chú" name="note" class="mb-0">
                  <template #label>
                    <span class="text-gray-700 font-semibold">Ghi chú thêm (không bắt buộc)</span>
                  </template>
                  <a-textarea 
                    v-model:value="checkoutForm.note" 
                    placeholder="Ghi chú thêm (không bắt buộc)"
                    :rows="4"
                    class="!rounded-lg !border-gray-300 hover:!border-prim-100 focus:!border-prim-100"
                  />
                </a-form-item>
              </div>
              
              <!-- Payment Method -->
              <div class="mt-10">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-8 h-8 bg-prim-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-white">
                      <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h4 class="text-xl font-bold text-gray-800">Phương thức thanh toán</h4>
                </div>
                
                <PaymentMethodSelector
                  v-model="checkoutForm.paymentMethod"
                  :amount="totalAmount"
                  @method-selected="onPaymentMethodSelected"
                />
                
                <!-- QR Code Section (SePay MB Bank) -->
                <div
                  v-if="checkoutForm.paymentMethod === 'qr' && qrInfo"
                  class="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div class="text-center">
                    <h5 class="text-lg font-semibold text-gray-800 mb-4">
                      Quét mã QR MB Bank để thanh toán
                    </h5>
                    <div class="bg-white p-4 rounded-lg shadow-sm inline-block">
                      <!-- SePay /img trả về ảnh QR nên có thể nhúng trực tiếp -->
                      <img
                        :src="qrInfo.qrCode"
                        alt="QR thanh toán MB Bank"
                        class="w-64 h-64 mx-auto rounded-lg object-contain"
                      >
                    </div>
                    <p class="text-sm text-gray-600 mt-4">
                      Mở ứng dụng ngân hàng / ví điện tử, chọn quét QR và xác nhận thanh toán.
                    </p>

                    <div class="mt-4 text-sm text-gray-700 space-y-1">
                      <p>
                        <span class="font-semibold">Ngân hàng:</span>
                        <span class="ml-1">MB Bank</span>
                      </p>
                      <p>
                        <span class="font-semibold">Số tài khoản:</span>
                        <span class="ml-1">{{ qrInfo.accountNo }}</span>
                      </p>
                      <p>
                        <span class="font-semibold">Chủ tài khoản:</span>
                        <span class="ml-1">{{ qrInfo.accountName }}</span>
                      </p>
                      <p>
                        <span class="font-semibold">Số tiền:</span>
                        <span class="ml-1 text-primary-100 font-bold">
                          {{ Number(qrInfo.amount).toLocaleString('vi-VN') }}đ
                        </span>
                      </p>
                      <p>
                        <span class="font-semibold">Nội dung chuyển khoản:</span>
                        <span class="ml-1 text-gray-900">{{ qrInfo.content }}</span>
                      </p>
                    </div>

                    <div class="mt-4 flex items-center justify-center gap-2 text-sm text-primary-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 12l2 2 4-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>
                        Đơn hàng sẽ được kích hoạt tự động sau khi thanh toán thành công.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Submit Button -->
              <div class="mt-10">
                <a-button 
                  type="primary" 
                  size="large" 
                  @click="handleSubmit"
                  class="w-full !bg-prim-100 !py-4 !h-[60px] !text-white !border-prim-100 !text-xl !font-bold !rounded-xl !shadow-lg hover:!shadow-xl transition-all duration-300 hover:!bg-blue-600 !flex !items-center !justify-center !gap-3"
                  :loading="loading"
                  :disabled="isSubmitting"
                >
                  <template v-if="!loading">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6m8 0V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4.01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Xác nhận thanh toán</span>
                  </template>
                  <span v-else>Đang xử lý...</span>
                </a-button>
              </div>
            </a-form>
          </div>
        </div>
        
        <!-- Right Section: Order Summary -->
        <div class="w-full lg:w-[40%] xl:w-[45%]">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-28">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-10 h-10 bg-prim-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-white">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6m8 0V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4.01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-800">Đơn hàng của bạn</h3>
            </div>
            
            <!-- Cart Items -->
            <div class="space-y-4 mb-8">
              <div 
                v-for="(course, index) in cartItems" 
                :key="`checkout_item_${index}`" 
                class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div class="w-20 h-16 flex-shrink-0">
                  <img
                    class="w-full h-full object-cover rounded-lg shadow-sm"
                    :src="(course as any).course?.thumbnail || (course as any).thumbnail || '/images/courses/python-course.jpg'"
                    :alt="(course as any).course?.title || (course as any).title || 'Course'"
                  >
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-semibold text-gray-800 truncate text-lg">
                    {{ (course as any).course?.title || (course as any).title || 'Khóa học' }}
                  </h4>
                  <div class="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" class="fill-none stroke-current">
                        <path d="m21.67 14.3-.4 5c-.15 1.53-.27 2.7-2.98 2.7H5.71C3 22 2.88 20.83 2.73 19.3l-.4-5c-.08-.83.18-1.6.65-2.19l.02-.02C3.55 11.42 4.38 11 5.31 11h13.38c.93 0 1.75.42 2.29 1.07.01.01.02.02.02.03.49.59.76 1.36.67 2.2Z" stroke-width="1.5" stroke-miterlimit="10"/>
                        <path d="M3.5 11.43V6.28c0-3.4.85-4.25 4.25-4.25h1.27c1.27 0 1.56.38 2.04 1.02l1.27 1.7c.32.42.51.68 1.36.68h2.55c3.4 0 4.25.85 4.25 4.25v1.79M9.43 17h5.14" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      {{ (course as any).course?.lessons || (course as any).lessons || 0 }} bài học
                    </span>
                    <span v-if="(course as any).course?.duration || (course as any).duration" class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" class="fill-none stroke-current">
                        <path d="M9.1 12v-1.48c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73V12Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      {{ (course as any).course?.duration || (course as any).duration || 0 }} phút
                    </span>
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-xl font-bold text-primary-100">
                    {{ Number((course as any).course?.price || (course as any).price || 0).toLocaleString('vi-VN') }}đ
                  </p>
                  <p v-if="(course as any).course?.originalPrice || (course as any).originalPrice" class="text-sm text-gray-400 line-through">
                    {{ Number((course as any).course?.originalPrice || (course as any).originalPrice || 0).toLocaleString('vi-VN') }}đ
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Order Summary -->
            <div class="bg-gray-50 rounded-xl p-6 space-y-4">
              <h4 class="text-lg font-semibold text-gray-800 mb-4">Tóm tắt đơn hàng</h4>
              
              <div class="space-y-3">
                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-600 font-medium">Số sản phẩm</span>
                  <span class="font-semibold text-gray-800">{{ cartItems.length }} sản phẩm</span>
                </div>
                
                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-600 font-medium">Phí vận chuyển</span>
                  <span class="text-green-600 font-semibold flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                      <path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Miễn phí
                  </span>
                </div>
                
                <div class="border-t border-gray-200 pt-4">
                  <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-gray-800">Tổng cộng</span>
                    <span class="text-2xl font-bold text-primary-100">{{ totalPrice.toLocaleString('vi-VN') }}đ</span>
                  </div>
                </div>
              </div>
              
              <!-- Security Badge -->
              <div class="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-white">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9 12l2 2 4-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-green-800">Thanh toán an toàn</p>
                    <p class="text-xs text-green-600">Dữ liệu của bạn được mã hóa và bảo mật</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { usePayment } from '~/composables/usePayment'
import { useApiBase } from '~/composables/useApiBase'
import PaymentMethodSelector from '~/components/payment/PaymentMethodSelector.vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const { 
  selectedMethod, 
  amount, 
  fees, 
  totalAmount, 
  processPayment, 
  setAmount 
} = usePayment()

// Reactive data
const loading = ref(false)
const isSubmitting = ref(false)
const checkoutForm = ref({
  fullName: '',
  phone: '',
  email: '',
  note: '',
  paymentMethod: 'vnpay'
})

// QR Code state (dùng QR thật từ backend SePay)
const qrInfo = ref<any | null>(null)
const qrPaymentStatus = ref<'pending' | 'completed'>('pending')
let qrStatusInterval: any = null

// Form validation rules - only validate for non-bypass payments
const formRules = computed(() => {
  if (checkoutForm.value.paymentMethod === 'bypass') {
    return {
      paymentMethod: [
        { required: true, message: 'Vui lòng chọn phương thức thanh toán', trigger: 'change' }
      ]
    }
  }
  
  return {
    fullName: [
      { required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
      { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ', trigger: 'blur' }
    ],
    email: [
      { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
      { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
    ],
    paymentMethod: [
      { required: true, message: 'Vui lòng chọn phương thức thanh toán', trigger: 'change' }
    ]
  }
})

// Computed properties
const cartItems = computed(() => cartStore.items)

const subtotalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = (item as any).course?.price || (item as any).price || 0
    return sum + Number(price)
  }, 0)
})

const appliedCoupon = computed(() => {
  return cartStore.cart?.coupon || null
})

const discountAmount = computed(() => {
  return appliedCoupon.value?.discountAmount || 0
})

const totalPrice = computed(() => {
  return subtotalPrice.value - discountAmount.value
})

// Sync amount with cart total
watch(() => cartStore.totalPrice, (newPrice) => {
  setAmount(newPrice)
}, { immediate: true })

// Methods
const onPaymentMethodSelected = (method: any) => {
  checkoutForm.value.paymentMethod = method.id
}

const handlePaymentMethodChange = () => {
  // Giữ placeholder để tương thích, hiện tại không làm gì thêm
}

const clearQRInterval = () => {
  if (qrStatusInterval) {
    clearInterval(qrStatusInterval)
    qrStatusInterval = null
  }
}

const startQRStatusPolling = (orderId: string) => {
  if (!process.client) return

  clearQRInterval()
  const { apiUser } = useApiBase()

  qrStatusInterval = setInterval(async () => {
    try {
      const res: any = await $fetch(`${apiUser}/orders/payment/qr/status/${orderId}?t=${Date.now()}`)
      if (res?.data?.paid) {
        qrPaymentStatus.value = 'completed'
        clearQRInterval()
        await cartStore.clearCart()

        // Lấy thông tin khóa học từ order để chuyển thẳng sang trang học
        const order = res.data.order as any
        const firstItem = order?.items?.[0]
        const courseSlug =
          firstItem?.course?.slug ||
          firstItem?.course?.seoUrl ||
          firstItem?.course?.slugify ||
          null

        if (courseSlug) {
          await navigateTo(`/my-learning/${courseSlug}`)
        } else {
          await navigateTo('/my-learning')
        }
      }
    } catch (error) {
      console.error('❌ Check QR payment status failed:', error)
    }
  }, 5000)
}

const handleSubmit = async (e?: Event) => {
  // Prevent form submission
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  
  if (cartItems.value.length === 0) {
    return
  }
  
  // Prevent multiple submissions
  if (isSubmitting.value) {
    return
  }
  
  try {
    isSubmitting.value = true
    loading.value = true
    const { apiUser } = useApiBase()
    // Create order first
    const orderData = {
      userId: authStore.user?.id,
      customerInfo: {
        fullName: checkoutForm.value.fullName,
        phone: checkoutForm.value.phone,
        email: checkoutForm.value.email
      },
      items: cartItems.value.map((item: any) => ({
        courseId: item.courseId || item._id,
        course: item.course || item,
        price: item.course?.price || item.price || 0
      })),
      subtotal: subtotalPrice.value,
      discount: appliedCoupon.value ? {
        type: appliedCoupon.value.type,
        value: appliedCoupon.value.value,
        amount: appliedCoupon.value.discountAmount,
        couponCode: appliedCoupon.value.code
      } : null,
      totalAmount: totalPrice.value,
      paymentMethod: checkoutForm.value.paymentMethod,
      notes: checkoutForm.value.note || ''
    }

    // Create order
    const orderResponse: any = await $fetch(`${apiUser}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: orderData
    })

    if (!orderResponse.data) {
      throw new Error('Failed to create order')
    }

    const order = orderResponse.data.order

    // Thanh toán bằng QR (SePay) - tạo QR động MB Bank + poll trạng thái
    if (checkoutForm.value.paymentMethod === 'qr') {
      try {
        const qrResponse: any = await $fetch(`${apiUser}/orders/payment/qr/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            orderId: order.orderId
          }
        })

        qrInfo.value = qrResponse?.data?.qrData || null
        qrPaymentStatus.value = 'pending'

        // Bắt đầu kiểm tra trạng thái thanh toán định kỳ
        startQRStatusPolling(order.orderId)
      } catch (error) {
        console.error('❌ Create QR code failed:', error)
      } finally {
        loading.value = false
        isSubmitting.value = false
      }

      // Không gọi processPayment / không redirect ngay, đợi webhook + polling
      return
    }

    // Handle bypass payment for demo - skip validation
    if (checkoutForm.value.paymentMethod === 'bypass') {
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { apiUser } = useApiBase()
      // Update order status
      await $fetch(`${apiUser}/orders/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          orderId: order.orderId,
          paymentMethod: 'bypass',
          paymentData: {}
        }
      })
      
      // Clear cart after successful payment
      await cartStore.clearCart()
      
      // Redirect to success page
      loading.value = false
      
      await nextTick()
      
      await navigateTo(`/checkout/success?orderId=${order.orderId}`)
      return
    }
    
    // Use new payment system for other methods
    
    const paymentResult = await processPayment({
      orderId: order.orderId,
      paymentMethod: checkoutForm.value.paymentMethod,
      amount: totalPrice.value
    })
    
    if (paymentResult.success) {
      const { apiUser } = useApiBase()
      // Update order status
      await $fetch(`${apiUser}/orders/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          orderId: order.orderId,
          paymentMethod: checkoutForm.value.paymentMethod,
          paymentData: paymentResult
        }
      })

      // Clear cart after successful payment
      await cartStore.clearCart()

      // Redirect to success page
      await navigateTo(`/checkout/success?orderId=${order.orderId}`)
    } else {
      // Handle payment error (show error message, etc.)
    }
    
  } catch (error) {
    console.error('❌ Checkout failed:', error)
  } finally {
    loading.value = false
    isSubmitting.value = false
  }
}

// Middleware để yêu cầu đăng nhập
definePageMeta({
  middleware: 'auth'
})

// Lifecycle
onMounted(async () => {
  const route = useRoute()

  // Nếu có query ?method=qr (hoặc method khác) thì set sẵn phương thức thanh toán
  const methodFromQuery = route.query.method as string | undefined
  if (methodFromQuery) {
    checkoutForm.value.paymentMethod = methodFromQuery
  }

  // Redirect if cart is empty
  if (cartItems.value.length === 0) {
    await cartStore.fetchCart()
    if (cartItems.value.length === 0) {
      navigateTo('/cart')
      return
    }
  }
  
  // Pre-fill form with user data if logged in
  if (authStore.user) {
    checkoutForm.value.fullName = authStore.user.fullname || authStore.user.name || ''
    checkoutForm.value.email = authStore.user.email || ''
    checkoutForm.value.phone = authStore.user.phone || ''
  }

  // Nếu tới từ link /checkout?method=qr thì tự động tạo đơn + hiển thị QR luôn
  if (checkoutForm.value.paymentMethod === 'qr') {
    await handleSubmit()
  }
})

onUnmounted(() => {
  clearQRInterval()
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

.text-gray-50 {
  color: #F5F5F5;
}

.border-gray-50 {
  border-color: #F5F5F5;
}

.text-gray-60 {
  color: #E5E5E5;
}

.text-gray-70 {
  color: #CCCCCC;
}

.text-gray-80 {
  color: #999999;
}

.text-gray-100 {
  color: #666666;
}

.bg-gray-50 {
  background-color: #F9FAFB;
}

.border-gray-200 {
  border-color: #E5E7EB;
}
</style>
