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
                class="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div class="flex">
                  <!-- Course Thumbnail - Left Section (40%) -->
                  <div class="w-[40%] flex-shrink-0">
                    <div class="relative w-full h-full min-h-[200px] sm:min-h-[240px]">
                      <img
                        class="w-full h-full object-cover"
                        :src="(course as any).course?.thumbnail || (course as any).thumbnail || '/images/courses/python-course.jpg'"
                        :alt="(course as any).course?.title || (course as any).title"
                      >
                    </div>
                  </div>
                  
                  <!-- Course Info - Right Section (60%) -->
                  <div class="flex-1 min-w-0 p-4 sm:p-6 relative">
                    <!-- Title -->
                    <h3 class="mb-3 font-bold text-lg sm:text-xl text-primary-100 cursor-pointer line-clamp-2 pr-32 sm:pr-40" 
                        @click="navigateTo(`/courses/${(course as any).course?.slug || (course as any).slug}`)">
                      {{ (course as any).course?.title || (course as any).title }}
                    </h3>
                    
                    <!-- Rating and Reviews -->
                    <div class="flex items-center gap-2 mb-3">
                      <Rating
                        :value="(course as any).course?.rating?.average || (course as any).rating?.average || 0"
                        :size="16"
                        active-color="#FFD74B"
                        inactive-color="#E5E7EB"
                        :disabled="true"
                        :allow-half="false"
                      />
                      <span class="text-sm text-gray-500">
                        ({{ ((course as any).course?.rating?.count || (course as any).rating?.count || 0)?.toLocaleString('en-US') }} lượt đánh giá)
                      </span>
                    </div>
                    
                    <!-- Course Content: Video, Documents, Quizzes -->
                    <div class="flex items-center gap-4 sm:gap-6 text-sm text-[#393939] pb-4 border-b border-[#D9D9D9]">
                      <span v-if="course.course?.videoCount || course.course?.videoCount === 0" class="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 9 9"
                          fill="none"
                        >
                          <path
                            d="M5.86759 4.70128L5.67654 4.4078L5.66699 4.41447L5.86759 4.70128ZM5.86759 4.12602L5.66006 4.40786L5.67567 4.41936L5.69246 4.42906L5.86759 4.12602ZM3.56207 2.42835L3.7696 2.14651L3.75973 2.13924L3.74937 2.13268L3.56207 2.42835ZM3.07874 2.68192L3.42879 2.6809L3.42866 2.67478L3.07874 2.68192ZM3.0884 6.01671L2.73841 6.01773L2.73843 6.02763L2.73902 6.03751L3.0884 6.01671ZM3.58946 6.29461L3.75894 6.60084L3.77501 6.59195L3.79006 6.58142L3.58946 6.29461ZM4.36303 8.37586V8.02586C2.34005 8.02586 0.700098 6.38591 0.700098 4.36293H0.350098H9.76622e-05C9.76622e-05 6.77251 1.95345 8.72586 4.36303 8.72586V8.37586ZM8.37596 4.36293H8.02596C8.02596 6.38591 6.38601 8.02586 4.36303 8.02586V8.37586V8.72586C6.77261 8.72586 8.72596 6.77251 8.72596 4.36293H8.37596ZM4.36303 0.35V0.7C6.38601 0.7 8.02596 2.33995 8.02596 4.36293H8.37596H8.72596C8.72596 1.95335 6.77261 3.8743e-07 4.36303 3.8743e-07V0.35ZM4.36303 0.35V3.8743e-07C1.95345 3.8743e-07 9.76622e-05 1.95335 9.76622e-05 4.36293H0.350098H0.700098C0.700098 2.33995 2.34005 0.7 4.36303 0.7V0.35ZM5.86759 4.70128L6.05854 4.99461C6.23456 4.88002 6.4387 4.68699 6.43831 4.40486C6.43792 4.11489 6.2239 3.92769 6.04272 3.82299L5.86759 4.12602L5.69246 4.42906C5.71573 4.4425 5.73205 4.45407 5.74294 4.46295C5.7539 4.47188 5.75777 4.47678 5.75765 4.47663C5.7574 4.4763 5.75239 4.46982 5.74742 4.4568C5.74223 4.4432 5.73834 4.42565 5.73831 4.40582C5.73829 4.3861 5.74208 4.36984 5.74622 4.3586C5.75016 4.34792 5.75363 4.34382 5.75199 4.34604C5.75028 4.34835 5.74447 4.35554 5.73179 4.3668C5.71918 4.37801 5.70126 4.39194 5.67664 4.40796L5.86759 4.70128ZM5.86759 4.12602L6.07512 3.84419L3.7696 2.14651L3.56207 2.42835L3.35454 2.71019L5.66006 4.40786L5.86759 4.12602ZM3.56207 2.42835L3.74937 2.13268C3.56521 2.01602 3.31398 1.95371 3.0803 2.06283C2.82728 2.18096 2.72366 2.43692 2.72881 2.68906L3.07874 2.68192L3.42866 2.67478C3.42798 2.64144 3.4346 2.63752 3.42813 2.64992C3.42481 2.65625 3.41885 2.66521 3.40923 2.67452C3.39957 2.68387 3.38829 2.69156 3.37645 2.69709C3.35227 2.70838 3.33601 2.70628 3.33625 2.70631C3.33695 2.70641 3.35073 2.70879 3.37478 2.72402L3.56207 2.42835ZM3.07874 2.68192L2.72874 2.68293L2.73841 6.01773L3.0884 6.01671L3.4384 6.0157L3.42874 2.6809L3.07874 2.68192ZM3.0884 6.01671L2.73902 6.03751C2.75182 6.2524 2.82557 6.51946 3.07436 6.65234C3.31954 6.78328 3.57963 6.70008 3.75894 6.60084L3.58946 6.29461L3.41999 5.98838C3.3977 6.00071 3.37996 6.00855 3.36676 6.01336C3.35349 6.0182 3.34648 6.01936 3.34522 6.01954C3.3441 6.01969 3.35002 6.01873 3.36127 6.02038C3.37303 6.0221 3.38816 6.02635 3.40413 6.03488C3.42015 6.04344 3.43252 6.0539 3.44106 6.06343C3.44926 6.07258 3.45211 6.07879 3.45191 6.07836C3.45163 6.07775 3.4488 6.07144 3.44564 6.05728C3.44249 6.04318 3.4394 6.02306 3.43779 5.99591L3.0884 6.01671ZM3.58946 6.29461L3.79006 6.58142L6.06819 4.9881L5.86759 4.70128L5.66699 4.41447L3.38887 6.0078L3.58946 6.29461Z"
                            fill="#393939"
                          />
                        </svg>
                        <span>{{ course.course?.videoCount }} video</span>
                      </span>
                      <span v-if="course.course?.documentCount || course.course?.documentCount === 0" class="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 9 8"
                          fill="none"
                        >
                          <path
                            d="M7.53101 3.15905V1.28635H4.1517L3.30687 0.35H0.349976V7.37263H1.61722V6.90445L2.88446 3.15905H8.37584L7.1086 7.37263H1.1948"
                            stroke="#393939"
                            stroke-width="0.7"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <span>{{ course.course?.documentCount }} Tài liệu</span>
                      </span>
                      <span v-if="course.course?.quizCount || course.course?.quizCount === 0" class="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 9 9"
                          fill="none"
                        >
                          <path
                            d="M3.59632 8.37586H1.43209C0.83445 8.37586 0.349972 7.92669 0.349976 7.37262L0.350017 1.35323C0.350021 0.799161 0.8345 0.35 1.43213 0.35H6.30177C6.89941 0.35 7.38389 0.799164 7.38389 1.35324V4.11213M5.21967 6.95463L6.21161 7.87427L8.37584 5.86771M2.24385 2.35647H5.49019M2.24385 3.86132H5.49019M2.24385 5.36618H3.86702"
                            stroke="#393939"
                            stroke-width="0.7"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <span>{{ course.course?.quizCount }} bài trắc nghiệm</span>
                      </span>
                    </div>
                    
                    <!-- Price - Top Right Corner -->
                    <div class="absolute top-4 sm:top-6 right-4 sm:right-6 text-right">
                      <div v-if="(course as any).course?.price || (course as any).price" class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                        {{ Number((course as any).course?.price || (course as any).price).toLocaleString('vi-VN') }} Đ
                      </div>
                      <div v-else class="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                        Miễn phí
                      </div>
                      <div v-if="(course as any).course?.originalPrice || (course as any).originalPrice" class="text-sm sm:text-base line-through text-gray-400">
                        {{ Number((course as any).course?.originalPrice || (course as any).originalPrice).toLocaleString('vi-VN') }} Đ
                      </div>
                    </div>
                    
                    <!-- Remove Button - Bottom Right Corner -->
                    <div class="absolute bottom-4 sm:bottom-6 right-4 sm:right-6">
                      <button
                        class="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                        @click="handleRemoveFromCart(course)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-white">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
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
                  <a-button 
                    type="primary"
                    size="large"
                    class="w-full !bg-[#00CF6A] hover:!bg-green-600 !h-12 sm:!h-14 !text-white !border-green-500 !text-base sm:!text-base !font-semibold !rounded-lg !flex !items-center !justify-center !gap-2"
                    :disabled="cartItems.length === 0"
                    :loading="false"
                    @click="handlePayment('bypass')"
                  >
                    By Pass
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
import { useAuthStore } from '~/stores/auth'
import CartToast from '~/components/cart/Toast.vue'
import CouponInput from '~/components/cart/CouponInput.vue'
import Rating from '~/components/courses/Rating.vue'

const cartStore = useCartStore()
const authStore = useAuthStore()

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

