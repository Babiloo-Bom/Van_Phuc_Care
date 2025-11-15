<template>
  <div class="mb-12 sm:mb-16 lg:mb-20 mt-12 max-md:px-4">
    <main class="container mx-auto py-6 sm:py-8 lg:py-10 lg:pt-0">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-primary-100">
          Giỏ hàng
          <span v-if="cartItems.length > 0" class="text-base sm:text-lg font-normal text-gray-500 ml-2">
            ({{ cartItems.length }} sản phẩm)
          </span>
        </h2>
      </div>
      
      <div class="flex flex-col lg:flex-row lg:gap-8 xl:gap-12">
        <!-- Left Section: Cart Items -->
        <div class="w-full lg:w-[70%] xl:w-[60%]">
          <template v-if="cartItems.length > 0">
            <div class="space-y-4">
              <div 
                v-for="(course, index) in cartItems" 
                :key="`items_cart_${index}`" 
                class="bg-gray-50 rounded-lg border border-gray-200 p-4 sm:p-5 relative"
              >
                <div class="flex gap-4">
                  <!-- Course Thumbnail -->
                  <div class="w-24 sm:w-32 h-20 sm:h-24 flex-shrink-0">
                    <div class="relative overflow-hidden rounded-lg">
                      <img
                        class="w-full h-full object-cover"
                        :src="(course as any).course?.thumbnail || (course as any).thumbnail || '/images/courses/python-course.jpg'"
                        :alt="(course as any).course?.title || (course as any).title"
                      >
                    </div>
                  </div>
                  
                  <!-- Course Info -->
                  <div class="flex-1 min-w-0">
                    <h3 class="mb-2 font-semibold text-base sm:text-lg text-primary-100 cursor-pointer line-clamp-2" 
                        @click="navigateTo(`/courses/${(course as any).course?.slug || (course as any).slug}`)">
                      {{ (course as any).course?.title || (course as any).title }}
                    </h3>
                    
                    <!-- Rating -->
                    <div class="flex items-center gap-2 mb-2">
                      <a-rate
                        :style="{ fontSize: '14px', color: '#FFD74B', marginRight: '0px' }"
                        :value="(course as any).course?.rating?.average || (course as any).rating?.average || 5"
                        disabled
                      />
                      <span class="text-xs sm:text-sm text-gray-500">
                        ({{ ((course as any).course?.rating?.count || (course as any).rating?.count || 0)?.toLocaleString('en-US') }} lượt đánh giá)
                      </span>
                    </div>
                    
                    <!-- Course Content: Video, Documents, Quizzes -->
                    <div class="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 mb-3">
                      <span v-if="getVideoCount(course)" class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current text-primary-100">
                          <path d="M14.752 11.168l-3.197-2.132A1 1 0 0 0 10 9.87v4.263a1 1 0 0 0 1.555.832l3.197-2.132a1 1 0 0 0 0-1.664Z" stroke-width="1.5"/>
                          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.3 0 2.52.28 3.6.8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ getVideoCount(course) }} video
                      </span>
                      <span v-if="getDocumentCount(course)" class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current text-primary-100">
                          <path d="m21.67 14.3-.4 5c-.15 1.53-.27 2.7-2.98 2.7H5.71C3 22 2.88 20.83 2.73 19.3l-.4-5c-.08-.83.18-1.6.65-2.19l.02-.02C3.55 11.42 4.38 11 5.31 11h13.38c.93 0 1.75.42 2.29 1.07.01.01.02.02.02.03.49.59.76 1.36.67 2.2Z" stroke-width="1.5" stroke-miterlimit="10"/>
                          <path d="M3.5 11.43V6.28c0-3.4.85-4.25 4.25-4.25h1.27c1.27 0 1.56.38 2.04 1.02l1.27 1.7c.32.42.51.68 1.36.68h2.55c3.4 0 4.25.85 4.25 4.25v1.79M9.43 17h5.14" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ getDocumentCount(course) }} Tài liệu
                      </span>
                      <span v-if="getExamCount(course)" class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current text-primary-100">
                          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ getExamCount(course) }} bài trắc nghiệm
                      </span>
                    </div>
                    
                    <!-- Price -->
                    <div class="mb-2">
                      <div v-if="(course as any).course?.price || (course as any).price" class="text-lg sm:text-xl font-bold text-gray-900">
                        {{ Number((course as any).course?.price || (course as any).price).toLocaleString('vi-VN') }} Đ
                      </div>
                      <div v-else class="text-lg sm:text-xl font-bold text-green-600">
                        Miễn phí
                      </div>
                      <div v-if="(course as any).course?.originalPrice || (course as any).originalPrice" class="text-sm sm:text-base line-through text-gray-400 mt-1">
                        {{ Number((course as any).course?.originalPrice || (course as any).originalPrice).toLocaleString('vi-VN') }} Đ
                      </div>
                    </div>
                  </div>
                  
                  <!-- Remove Button -->
                  <div class="flex-shrink-0 self-end">
                    <button
                      class="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 hover:bg-red-600 rounded flex items-center justify-center transition-colors"
                      @click="handleRemoveFromCart(course)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-white">
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          
          <!-- Empty State -->
          <div v-else class="text-center">
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-12">
              <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" class="fill-none stroke-gray-400 sm:w-16 sm:h-16">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6m8 0V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4.01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="text-xl sm:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">Giỏ hàng của bạn đang trống</h3>
              <p class="text-sm sm:text-base md:text-lg text-gray-500 mb-6 sm:mb-8 px-4">Hãy thêm một số khóa học để bắt đầu hành trình học tập của bạn!</p>
              <div class="flex justify-center">
                <a-button 
                  type="primary" 
                  size="large" 
                  class="!bg-prim-100 !py-3 sm:!py-4 !h-auto sm:!h-[60px] !text-white !border-prim-100 !text-base sm:!text-lg md:!text-xl !font-bold !rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 !flex !items-center !justify-center !gap-3 sm:gap-4 !px-6 sm:!px-8"
                  @click="navigateTo('/')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current sm:w-6 sm:h-6">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Khám phá khóa học</span>
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Section: Order Summary -->
        <div class="w-full lg:flex-1 mt-6 lg:mt-0">
          <div class="lg:sticky lg:top-28">
            <div class=" overflow-hidden">
              <!-- Content -->
              <div class="px-4 sm:px-5 md:px-6">
                <!-- Coupon Input -->
                <div class="mb-6">
                  <h4 class="text-base sm:text-lg font-bold text-gray-800 mb-3">
                    Nhập mã ưu đãi
                  </h4>
                  <CouponInput />
                </div>
                
                <!-- Payment Summary -->
                <div class="mb-6">
                  <h4 class="text-base sm:text-lg font-bold text-gray-800 mb-4">
                    Thanh toán
                  </h4>
                  
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-sm sm:text-base text-gray-600">Tổng giá trị sản phẩm</span>
                      <span class="text-sm sm:text-base font-semibold text-gray-900">{{ subtotalPrice.toLocaleString('vi-VN') }} Đ</span>
                    </div>
                    
                    <div v-if="appliedCoupon" class="flex justify-between items-center">
                      <span class="text-sm sm:text-base text-gray-600">Mã ưu đãi</span>
                      <span class="text-sm sm:text-base font-semibold text-green-600">
                        {{ discountAmount.toLocaleString('vi-VN') }} Đ
                      </span>
                    </div>
                    
                    <div class="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span class="text-base sm:text-lg font-bold text-gray-900">Tổng số tiền</span>
                      <span class="text-lg sm:text-xl font-bold text-gray-900">{{ totalPrice.toLocaleString('vi-VN') }} Đ</span>
                    </div>
                  </div>
                </div>
              
                <!-- Payment Methods -->
                <div class="space-y-3">
                  <a-button 
                    type="primary"
                    size="large"
                    class="w-full !bg-[#1A75BB] !h-12 sm:!h-14 !text-white !border-prim-100 !text-base sm:!text-base !font-semibold !rounded-lg"
                    :disabled="cartItems.length === 0"
                    @click="handlePayment('qr')"
                  >
                    Thanh toán bằng QR Banking
                  </a-button>
                  
                  <a-button 
                    type="primary"
                    size="large"
                    class="w-full flex items-center justify-center gap-2 !bg-[#2579F2] !h-12 sm:!h-14 !text-white !border-prim-100 !text-base sm:!text-base !font-semibold !rounded-lg"
                    :disabled="cartItems.length === 0"
                    @click="handlePayment('vnpay')"
                  >
                    Thanh toán bằng 
                    <img src="../public/images/svg/vnpay.svg" alt="Zalo pay" class="w-10 h-10" />
                  </a-button>
                  
                  <a-button 
                    type="primary"
                    size="large"
                    class="w-full !bg-[#00CF6A] hover:!bg-green-600 !h-12 sm:!h-14 !text-white !border-green-500 !text-base sm:!text-base !font-semibold !rounded-lg !flex !items-center !justify-center !gap-2"
                    :disabled="cartItems.length === 0"
                    @click="handlePayment('zalopay')"
                  >
                    
                    Thanh toán bằng
                    <img src="../public/images/svg/zalopay.svg" alt="Zalo pay" class="w-6 h-6" />
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
  // Get discount amount from cart summary
  return cartStore.cart?.discountAmount || 0
})

const finalPrice = computed(() => {
  return subtotalPrice.value - discountAmount.value
})

// Keep totalPrice for backward compatibility
const totalPrice = computed(() => finalPrice.value)

// Helper functions to get course counts
// Similar to how [slug].vue handles it, but for cart items
const getVideoCount = (course: any): number => {
  const courseData = course.course || course
  
  // First try to get from course data (if API provides it)
  if (courseData?.videoCount !== undefined) {
    return courseData.videoCount
  }
  
  // If not available, try to calculate from chapters (like in coursesStore)
  if (courseData?.chapters && Array.isArray(courseData.chapters)) {
    let count = 0
    courseData.chapters.forEach((chapter: any) => {
      chapter.lessons?.forEach((lesson: any) => {
        if (lesson.type === 'video' || lesson.videoUrl) {
          count++
        }
      })
    })
    return count
  }
  
  return 0
}

const getDocumentCount = (course: any): number => {
  const courseData = course.course || course
  
  // First try to get from course data (if API provides it)
  if (courseData?.documentCount !== undefined) {
    return courseData.documentCount
  }
  
  // If not available, try to calculate from chapters
  if (courseData?.chapters && Array.isArray(courseData.chapters)) {
    let count = 0
    courseData.chapters.forEach((chapter: any) => {
      chapter.lessons?.forEach((lesson: any) => {
        if (lesson.type === 'document' || lesson.documentUrl || (lesson.documents && lesson.documents.length > 0)) {
          if (lesson.documents && Array.isArray(lesson.documents)) {
            count += lesson.documents.length
          } else {
            count++
          }
        }
      })
    })
    return count
  }
  
  return 0
}

const getExamCount = (course: any): number => {
  const courseData = course.course || course
  
  // First try to get from course data (if API provides it)
  if (courseData?.examCount !== undefined) {
    return courseData.examCount
  }
  
  // If not available, try to calculate from chapters
  if (courseData?.chapters && Array.isArray(courseData.chapters)) {
    let count = 0
    courseData.chapters.forEach((chapter: any) => {
      chapter.lessons?.forEach((lesson: any) => {
        if (lesson.type === 'exam' || lesson.type === 'quiz' || lesson.quizId || lesson.quiz) {
          count++
        }
      })
    })
    return count
  }
  
  return 0
}

// Methods
const handleRemoveFromCart = async (course: any) => {
  try {
    // Use courseId field (not _id which is cart item ID)
    const courseId = course.courseId || course.course?._id || course._id
    await cartStore.removeFromCart(courseId)
  } catch (error) {
    console.error('Error removing from cart:', error)
  }
}

const handlePayment = (method: string) => {
  if (cartItems.value.length === 0) return
  
  // Navigate to checkout with payment method
  navigateTo(`/checkout?method=${method}`)
}

// Middleware để yêu cầu đăng nhập
definePageMeta({
  middleware: 'auth'
})

// Lifecycle
onMounted(async () => {
  // Force clear any old cart data first
  cartStore.forceClearCart()
  
  // Then fetch fresh data from backend
  await cartStore.fetchCart()
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

