<template>
  <div class="mb-20 mt-20">
    <main class="container py-10 lg:pt-0">
      <div class="mb-6 md:mb-12">
        <h2 class="block text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary-100">
          Giỏ hàng của bạn
        </h2>
      </div>
      <hr class="border-gray-50/70 my-4 md:my-10 xl:my-12">
      
      <div class="flex flex-col lg:flex-row">
        <!-- Left Section: Cart Items -->
        <div class="w-full lg:w-[60%] xl:w-[55%]">
          <template v-if="cartItems.length > 0">
            <div class="space-y-4">
              <div 
                v-for="(course, index) in cartItems" 
                :key="`items_cart_${index}`" 
                class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:border-prim-100 hover:-translate-y-1 relative overflow-hidden"
              >
                <!-- Decorative gradient overlay -->
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-prim-100/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div class="flex gap-6 relative z-10">
                  <!-- Course Thumbnail -->
                  <div class="w-[150px] h-[110px] flex-shrink-0">
                    <div class="relative overflow-hidden rounded-xl shadow-lg group">
                      <img
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        :src="(course as any).course?.thumbnail || (course as any).thumbnail || '/images/courses/python-course.jpg'"
                        :alt="(course as any).course?.title || (course as any).title"
                      >
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  
                  <!-- Course Info -->
                  <div class="flex-1 min-w-0">
                    <h3 class="mb-3 font-semibold text-xl text-gray-800 hover:text-primary-100 cursor-pointer transition-colors" 
                        @click="navigateTo(`/courses/${(course as any).course?.slug || (course as any).slug}`)">
                      {{ (course as any).course?.title || (course as any).title }}
                    </h3>
                    
                    <!-- Rating -->
                    <div class="flex items-center gap-3 mb-3">
                      <a-rate
                        :style="{ fontSize: '16px', color: '#FFD74B', marginRight: '0px' }"
                        :value="(course as any).course?.rating?.average || (course as any).rating?.average || 5"
                        disabled
                      />
                      <span class="text-sm text-gray-500 font-medium">
                        ({{ ((course as any).course?.rating?.count || (course as any).rating?.count || 0)?.toLocaleString('en-US') }} lượt đánh giá)
                      </span>
                    </div>
                    
                    <!-- Course Details -->
                    <div class="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <span v-if="(course as any).course?.duration || (course as any).duration" class="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current text-primary-100">
                          <path d="M9.1 12v-1.48c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73V12Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ (course as any).course?.duration || (course as any).duration }} phút
                      </span>
                      <span v-if="(course as any).course?.lessons || (course as any).lessons" class="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current text-primary-100">
                          <path d="m21.67 14.3-.4 5c-.15 1.53-.27 2.7-2.98 2.7H5.71C3 22 2.88 20.83 2.73 19.3l-.4-5c-.08-.83.18-1.6.65-2.19l.02-.02C3.55 11.42 4.38 11 5.31 11h13.38c.93 0 1.75.42 2.29 1.07.01.01.02.02.02.03.49.59.76 1.36.67 2.2Z" stroke-width="1.5" stroke-miterlimit="10"/>
                          <path d="M3.5 11.43V6.28c0-3.4.85-4.25 4.25-4.25h1.27c1.27 0 1.56.38 2.04 1.02l1.27 1.7c.32.42.51.68 1.36.68h2.55c3.4 0 4.25.85 4.25 4.25v1.79M9.43 17h5.14" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ (course as any).course?.lessons || (course as any).lessons }} bài học
                      </span>
                    </div>
                  </div>
                  
                  <!-- Price and Actions -->
                  <div class="text-right flex-shrink-0">
                    <div class="mb-4">
                      <div v-if="(course as any).course?.price || (course as any).price" class="text-2xl font-bold text-primary-100 mb-1">
                        {{ Number((course as any).course?.price || (course as any).price).toLocaleString('vi-VN') }}đ
                      </div>
                      <div v-else class="text-2xl font-bold text-green-600 mb-1">
                        Miễn phí
                      </div>
                      <div v-if="(course as any).course?.originalPrice || (course as any).originalPrice" class="text-lg line-through text-gray-400">
                        {{ Number((course as any).course?.originalPrice || (course as any).originalPrice).toLocaleString('vi-VN') }}đ
                      </div>
                    </div>
                    
                    <a-button 
                      type="text" 
                      danger
                      class="!px-6 !py-3 !h-auto !text-red-500 hover:!text-red-700 hover:!bg-red-50 !rounded-lg !font-semibold !flex !items-center !justify-center !gap-3 transition-all duration-200 hover:!shadow-sm !min-w-[100px]"
                      @click="handleRemoveFromCart(course)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>Xóa</span>
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          
          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
              <div class="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" class="fill-none stroke-gray-400">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6m8 0V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4.01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-700 mb-3">Giỏ hàng của bạn đang trống</h3>
              <p class="text-gray-500 mb-8 text-lg">Hãy thêm một số khóa học để bắt đầu hành trình học tập của bạn!</p>
              <div class="flex justify-center">
                <a-button 
                  type="primary" 
                  size="large" 
                  class="!bg-prim-100 !py-4 !h-[60px] !text-white !border-prim-100 !text-xl !font-bold !rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 !flex !items-center !justify-center !gap-4 !px-8"
                  @click="navigateTo('/')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Khám phá khóa học</span>
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t lg:border-t-0 lg:border-l border-gray-50/70 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0" />
        
        <!-- Right Section: Order Summary -->
        <div class="flex-1">
          <div class="inherit md:sticky top-28">
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <!-- Header -->
              <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg">
              <h3 class="text-2xl font-bold mb-3 text-white drop-shadow-sm">
                Chi tiết đơn hàng
              </h3>
              <p class="text-white text-lg font-semibold drop-shadow-sm">Xem lại thông tin đơn hàng của bạn</p>
              </div>
              
              <!-- Content -->
              <div class="p-6">
                <!-- Coupon Input -->
                <CouponInput />
                
                <div class="space-y-4">
                  <div class="flex justify-between items-center py-3 border-b border-gray-100">
                    <span class="text-gray-600 text-lg">Số sản phẩm</span>
                    <span class="text-gray-800 text-lg font-semibold">{{ cartItems.length }} sản phẩm</span>
                  </div>
                  
                  <div class="flex justify-between items-center py-3 border-b border-gray-100">
                    <span class="text-gray-600 text-lg">Tạm tính</span>
                    <span class="text-gray-800 text-lg font-semibold">{{ subtotalPrice.toLocaleString('vi-VN') }}đ</span>
                  </div>
                  
                  <!-- Coupon discount -->
                  <div v-if="appliedCoupon" class="flex justify-between items-center py-3 border-b border-gray-100">
                    <span class="text-gray-600 text-lg">Giảm giá ({{ appliedCoupon.code }})</span>
                    <span class="text-green-600 text-lg font-semibold">
                      -{{ discountAmount.toLocaleString('vi-VN') }}đ
                    </span>
                  </div>
                  
                  <div class="flex justify-between items-center py-3 border-b border-gray-100">
                    <span class="text-gray-600 text-lg">Phí vận chuyển</span>
                    <span class="text-lg text-green-600 font-semibold flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                        <path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Miễn phí vận chuyển
                    </span>
                  </div>
                  
                  <div class="flex justify-between items-center py-4 bg-gray-50 rounded-lg px-4">
                    <span class="text-gray-800 text-xl font-bold">Thành tiền</span>
                    <span class="text-2xl font-bold text-primary-100">{{ totalPrice.toLocaleString('vi-VN') }}đ</span>
                  </div>
                </div>
              
                <!-- Action Buttons -->
                <div class="mt-6 space-y-4">
                  <a-button 
                    type="primary"
                    size="large"
                    class="w-full !bg-prim-100 !py-5 !h-[70px] !text-white !border-prim-100 !text-xl !font-bold !rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:!bg-blue-600 !flex !items-center !justify-center !gap-4"
                    :disabled="cartItems.length === 0"
                    @click="handleCheckout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" class="fill-none stroke-current">
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6m8 0V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4.01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ cartItems.length === 0 ? 'Giỏ hàng trống' : 'Thanh toán ngay' }}</span>
                  </a-button>
                  
                  <a-button 
                    size="large"
                    class="w-full !py-4 !h-[60px] !text-primary-100 !border-2 !border-prim-100 hover:!bg-prim-100 hover:!text-white transition-all duration-300 !rounded-xl !font-bold !text-lg !flex !items-center !justify-center !gap-4"
                    @click="navigateTo('/')"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Tiếp tục mua sắm</span>
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Cart Toast -->
    <CartToast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import CartToast from '~/components/cart/Toast.vue'
import CouponInput from '~/components/cart/CouponInput.vue'

const cartStore = useCartStore()

// Reactive data
const cartItems = computed(() => {
  console.log('🛒 cartItems computed - items:', cartStore.items)
  console.log('🛒 cartItems computed - items length:', cartStore.items?.length)
  if (cartStore.items?.length > 0) {
    const firstItem = cartStore.items[0] as any
    console.log('🛒 cartItems computed - first item:', firstItem)
    console.log('🛒 cartItems computed - first item title:', firstItem?.title)
    console.log('🛒 cartItems computed - first item courseId:', firstItem?.courseId)
    console.log('🛒 cartItems computed - first item course:', firstItem?.course)
    console.log('🛒 cartItems computed - first item course.title:', firstItem?.course?.title)
  }
  return cartStore.items || []
})

// Computed properties
const subtotalPrice = computed(() => {
  return cartItems.value.reduce((total, course: any) => {
    return total + (course.course?.price || course.price || 0)
  }, 0)
})

const appliedCoupon = computed(() => {
  return cartStore.cart?.coupon || null
})

const discountAmount = computed(() => {
  return appliedCoupon.value?.discountAmount || 0
})

const finalPrice = computed(() => {
  return subtotalPrice.value - discountAmount.value
})

// Keep totalPrice for backward compatibility
const totalPrice = computed(() => finalPrice.value)

// Methods
const handleRemoveFromCart = async (course: any) => {
  try {
    console.log('🗑️ Removing from cart:', course.course?.title || course.title)
    console.log('🔍 Course object:', course)
    console.log('🔍 Course ID type:', typeof course._id)
    console.log('🔍 Course ID value:', course._id)
    console.log('🔍 Course courseId:', course.courseId)
    console.log('🔍 Course id:', course.id)
    
    // Use courseId field (not _id which is cart item ID)
    const courseId = course.courseId
    console.log('🔍 Using courseId:', courseId)
    
    await cartStore.removeFromCart(courseId)
    console.log('✅ Removed from cart successfully')
  } catch (error) {
    console.error('❌ Error removing from cart:', error)
  }
}

const handleCheckout = () => {
  if (cartItems.value.length === 0) return
  console.log('💳 Proceeding to checkout')
  navigateTo('/checkout')
}


// Middleware để yêu cầu đăng nhập
definePageMeta({
  middleware: 'auth'
})

// Lifecycle
onMounted(async () => {
  console.log('🛒 Cart page mounted')
  console.log('🛒 Cart items before fetch:', cartStore.items.length)
  
  // Force clear any old cart data first
  cartStore.forceClearCart()
  
  // Then fetch fresh data from backend
  await cartStore.fetchCart()
  console.log('🛒 Cart items after fetch:', cartStore.items.length)
  console.log('🛒 Cart items:', cartStore.items)
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
