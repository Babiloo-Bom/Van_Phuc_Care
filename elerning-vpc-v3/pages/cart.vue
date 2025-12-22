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
                  <CouponInput @coupon-applied="handleCouponApplied" />
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
                      <span class="text-sm sm:text-base font-semibold text-gray-900">
                        {{ discountAmount > 0 ? '-' + discountAmount.toLocaleString('vi-VN') : '0' }} Đ
                      </span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                      <span class="text-sm sm:text-base text-gray-600">VAT</span>
                      <span class="text-sm sm:text-base font-semibold text-gray-900">{{ vatPrice.toLocaleString('vi-VN') }} Đ</span>
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
                    :disabled="cartItems.length === 0 || isProcessingOrderQr"
                    :loading="isProcessingOrderQr"
                    @click="handlePayment('qr')"
                  >
                    Thanh toán bằng QR Banking
                  </a-button>
                  
                  <a-button 
                    type="primary"
                    size="large"
                    class="w-full flex items-center justify-center gap-2 !bg-[#2579F2] !h-12 sm:!h-14 !text-white !border-prim-100 !text-base sm:!text-base !font-semibold !rounded-lg"
                    :disabled="cartItems.length === 0 || isProcessingOrderVnpay"
                    :loading="isProcessingOrderVnpay"
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
                    :disabled="cartItems.length === 0 || isProcessingOrder"
                    :loading="isProcessingOrder"
                    @click="handlePayment('bypass')"
                  >
                    <span v-if="!isProcessingOrder">By Pass</span>
                    <span v-else>Đang xử lý...</span>
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

    <!-- QR Payment Modal -->
    <a-modal
      v-model:open="showQrModal"
      :footer="null"
      :closable="true"
      :maskClosable="false"
      centered
      width="520px"
    >
      <div class="py-4 px-4 sm:px-6">
        <h3 class="text-lg sm:text-xl font-bold text-center text-gray-800 mb-4">
          Quét mã QR để thanh toán
        </h3>

        <div v-if="qrInfo" class="text-center">
          <div class="inline-block bg-white p-4 rounded-xl shadow-sm border border-gray-100">
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

          <div class="mt-4 text-sm text-gray-700 space-y-1 text-left max-w-sm mx-auto">
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
              <span class="ml-1 text-gray-900 break-words">{{ qrInfo.content }}</span>
            </p>
          </div>

          <p class="mt-4 text-xs text-gray-500">
            Sau khi thanh toán thành công, hệ thống sẽ tự động kích hoạt khóa học và chuyển bạn đến trang học.
          </p>

          <div class="mt-4 text-sm text-center">
            <div v-if="qrError" class="text-red-500 font-semibold">{{ qrError }}</div>
            <div v-else class="text-gray-600">Hết hạn sau: <span class="font-semibold">{{ formatSeconds(qrCountdown) }}</span></div>
            <div class="mt-3 flex justify-center gap-3">
              <a-button v-if="qrError" type="primary" :loading="isProcessingOrderQr" @click="retryQr">Tạo mã QR mới</a-button>
              <a-button type="default" @click="closeQrModal">Đóng</a-button>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-gray-500 py-8">
          Đang chuẩn bị mã QR thanh toán...
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { useCoursesStore } from '~/stores/courses'
import { useApiBase } from '~/composables/useApiBase'
import CartToast from '~/components/cart/Toast.vue'
import CouponInput from '~/components/cart/CouponInput.vue'
import Rating from '~/components/courses/Rating.vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const coursesStore = useCoursesStore()

// Loading state for payments
const isProcessingOrder = ref(false)
const isProcessingOrderVnpay = ref(false)
const isProcessingOrderQr = ref(false)

// QR payment state (SePay)
const showQrModal = ref(false)
const qrInfo = ref<any | null>(null)
const qrPaymentStatus = ref<'pending' | 'completed' | 'expired'>('pending')
let qrStatusInterval: any = null
let qrPollingActive = ref(false)

// Polling / TTL control
const QR_POLL_INTERVAL_MS = 10000
const QR_TTL_SECONDS = 15 * 60 // 15 minutes
const MAX_POLLING_ATTEMPTS = Math.ceil(QR_TTL_SECONDS / (QR_POLL_INTERVAL_MS / 1000))

const qrExpiresAt = ref<number | null>(null) // timestamp ms when QR expires
const qrPollingAttempts = ref(0)
const qrError = ref<string | null>(null)

const now = ref(Date.now())
let qrTickInterval: any = null

const qrCountdown = computed(() => {
  if (!qrExpiresAt.value) return 0
  return Math.max(0, Math.floor((qrExpiresAt.value - now.value) / 1000))
})

const clearQrTick = () => {
  if (qrTickInterval) {
    clearInterval(qrTickInterval)
    qrTickInterval = null
  }
}

// Reactive data
const cartItems = computed(() => {
  return cartStore.items || []
})

// Trạng thái: người dùng có vừa áp dụng mã giảm giá trong phiên hiện tại không
const hasAppliedCoupon = ref(false)

// Computed properties
const subtotalPrice = computed(() => {
  return cartItems.value.reduce((total, course: any) => {
    return total + (course.course?.price || course.price || 0)
  }, 0)
})

// Chỉ hiển thị/áp dụng mã ưu đãi nếu user vừa apply ở phiên hiện tại
const appliedCoupon = computed(() => {
  if (!hasAppliedCoupon.value) return null
  return cartStore.cart?.coupon || null
})

// Chỉ trừ tiền khi THỰC SỰ có mã ưu đãi được áp dụng,
// và không cho giảm quá số tiền sản phẩm (tránh tổng tiền âm)
const discountAmount = computed(() => {
  if (!appliedCoupon.value) return 0
  const rawDiscount = appliedCoupon.value.discountAmount || 0
  if (rawDiscount <= 0) return 0
  return Math.min(rawDiscount, subtotalPrice.value)
})

const vatPrice = computed(() => {
  const taxableAmount = Math.max(subtotalPrice.value - discountAmount.value, 0)
  return Math.round(taxableAmount * 0.08) // Làm tròn VAT
})

const finalPrice = computed(() => {
  return Math.max(subtotalPrice.value - discountAmount.value, 0)
})

// Keep totalPrice for backward compatibility - làm tròn để không có số thập phân
const totalPrice = computed(() => Math.round(finalPrice.value + vatPrice.value))

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
const handleCouponApplied = () => {
  hasAppliedCoupon.value = true
}
const handleRemoveFromCart = async (course: any) => {
  try {
    // Use courseId field (not _id which is cart item ID)
    const courseId = course.courseId || course.course?._id || course._id
    await cartStore.removeFromCart(courseId)
  } catch (error) {
    console.error('Error removing from cart:', error)
  }
}

const handlePayment = async (method: string) => {
  if (cartItems.value.length === 0) return
  
  // If bypass, process order directly without checkout
  if (method === 'bypass') {
    await processBypassOrder()
    return
  }

  if (method === 'vnpay') {
    await processVnPay()
    return
  }

  if (method === 'qr') {
    await processQrOrder()
    return
  }

  // Các phương thức khác (nếu có) có thể điều hướng sang checkout
  navigateTo(`/checkout?method=${method}`)
}

const clearQrInterval = () => {
  // disable scheduling
  qrPollingActive.value = false

  if (qrStatusInterval) {
    clearTimeout(qrStatusInterval)
    qrStatusInterval = null
  }
  // reset client-side tracking
  qrExpiresAt.value = null
  qrPollingAttempts.value = 0
  // also clear the tick used for countdown
  clearQrTick()
}

const startQrStatusPolling = (orderId: string) => {
  if (!process.client) return

  clearQrInterval()
  qrPollingAttempts.value = 0
  qrError.value = null
  // set expiry from now
  qrExpiresAt.value = Date.now() + QR_TTL_SECONDS * 1000

  // start tick to update countdown every second
  clearQrTick()
  now.value = Date.now()
  qrTickInterval = setInterval(() => {
    now.value = Date.now()
  }, 1000)

  const { apiUser } = useApiBase()

  // Adaptive polling with exponential backoff + jitter
  let baseInterval = QR_POLL_INTERVAL_MS
  let currentInterval = baseInterval
  let consecutiveFailures = 0
  const maxInterval = 60 * 1000 // 1 minute cap

  const poll = async () => {
    try {
      qrPollingAttempts.value++

      // Stop if expired or reached max attempts
      if (qrExpiresAt.value && Date.now() > qrExpiresAt.value) {
        clearQrInterval()
        qrPaymentStatus.value = 'pending'
        qrError.value = 'Mã QR đã hết hạn. Vui lòng tạo mã mới.'
        isProcessingOrderQr.value = false
        return
      }

      if (qrPollingAttempts.value > MAX_POLLING_ATTEMPTS) {
        clearQrInterval()
        qrError.value = 'Mã QR đã hết hạn. Vui lòng tạo mã mới.'
        isProcessingOrderQr.value = false
        return
      }

      const res: any = await $fetch(`${apiUser}/orders/payment/qr/status/${orderId}?t=${Date.now()}`)
      // success path
      consecutiveFailures = 0
      currentInterval = baseInterval

      if (res?.data?.paid) {
        qrPaymentStatus.value = 'completed'
        clearQrInterval()

        // Clear cart sau khi thanh toán thành công
        await cartStore.clearCart()

        // Refresh "Khóa học của tôi"
        try {
          await coursesStore.fetchMyCourses()
        } catch (e) {
          console.warn('Không thể tải danh sách khóa học sau thanh toán QR:', e)
        }

        // Lấy thông tin khóa học từ order để chuyển thẳng sang trang học
        const order = res.data.order as any
        const firstItem = order?.items?.[0]
        const courseSlug =
          firstItem?.course?.slug ||
          firstItem?.course?.seoUrl ||
          firstItem?.course?.slugify ||
          null

        showQrModal.value = false

        if (courseSlug) {
          await navigateTo(`/my-learning/${courseSlug}`)
        } else {
          await navigateTo('/my-learning')
        }
        return
      }
    } catch (error) {
      console.error('❌ Check QR payment status failed (cart):', error)
      consecutiveFailures++
      // increase interval with exponential backoff and jitter
      currentInterval = Math.min(maxInterval, Math.pow(2, consecutiveFailures) * baseInterval)
      currentInterval = currentInterval + Math.floor(Math.random() * 1000) // jitter up to 1s

      // If too many consecutive failures, show error and stop
      if (consecutiveFailures >= 6) {
        clearQrInterval()
        qrError.value = 'Không thể kiểm tra trạng thái. Vui lòng thử lại sau.'
        isProcessingOrderQr.value = false
        return
      }
    } finally {
      // schedule next poll only if polling is still active
      if (qrPollingActive.value) {
        if (qrStatusInterval) clearTimeout(qrStatusInterval)
        qrStatusInterval = setTimeout(poll, currentInterval)
      } else {
        // ensure we clean up any stray timeout
        if (qrStatusInterval) {
          clearTimeout(qrStatusInterval)
          qrStatusInterval = null
        }
      }
    }
  }

  // mark active then start first poll immediately
  qrPollingActive.value = true
  poll()
}

// Clean up interval on unmount and when modal closed
onUnmounted(() => {
  clearQrInterval()
  clearQrTick()
})

watch(showQrModal, (val) => {
  if (!val) {
    // If user closes modal manually, stop polling and reset transient state
    clearQrInterval()
    clearQrTick()
    qrError.value = null
    qrInfo.value = null
    isProcessingOrderQr.value = false
  }
})

// Utility to format seconds to mm:ss
const formatSeconds = (s: number) => {
  const mm = Math.floor(s / 60).toString().padStart(2, '0')
  const ss = (s % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
}

const closeQrModal = () => {
  showQrModal.value = false
  qrInfo.value = null
  qrError.value = null
  qrPaymentStatus.value = 'pending'
  isProcessingOrderQr.value = false
  clearQrInterval()
}

const retryQr = async () => {
  if (isProcessingOrderQr.value) return
  qrError.value = null
  qrInfo.value = null
  qrPaymentStatus.value = 'pending'
  await processQrOrder()
}

const processQrOrder = async () => {
  if (cartItems.value.length === 0) return
  const { apiUser } = useApiBase()

  try {
    isProcessingOrderQr.value = true

    // Yêu cầu đăng nhập
    if (!authStore.user || !authStore.user.id) {
      await navigateTo('/login')
      return
    }

    // Chuẩn bị dữ liệu đơn hàng
    const orderData = {
      userId: authStore.user.id,
      customerInfo: {
        fullName: authStore.user.fullname || authStore.user.name || '',
        phone: authStore.user.phone || '',
        email: authStore.user.email || ''
      },
      items: cartItems.value.map((item: any) => ({
        courseId: item.courseId || item.course?._id || item._id,
        course: item.course || item,
        price: item.course?.price || item.price || 0
      })),
      subtotal: Math.round(subtotalPrice.value),
      discount: appliedCoupon.value ? {
        type: appliedCoupon.value.type,
        value: appliedCoupon.value.value,
        amount: Math.round(discountAmount.value),
        couponCode: appliedCoupon.value.code
      } : null,
      totalAmount: totalPrice.value, // Đã được làm tròn trong computed
      paymentMethod: 'qr',
      notes: ''
    }

    // Tạo đơn hàng
    const orderResponse: any = await $fetch(`${apiUser}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: orderData
    })

    if (!orderResponse.data || !orderResponse.data.order) {
      throw new Error('Failed to create order')
    }

    const order = orderResponse.data.order

    // Gọi API tạo QR SePay
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

    if (!qrInfo.value) {
      throw new Error('Không tạo được mã QR thanh toán')
    }

    // Hiện popup QR ngay trên trang giỏ hàng
    showQrModal.value = true

    // Bắt đầu kiểm tra trạng thái thanh toán
    startQrStatusPolling(order.orderId)

  } catch (error: any) {
    console.error('❌ Error processing QR order:', error)
    const errorMsg = error.data?.message || error.message || 'Có lỗi xảy ra khi tạo thanh toán QR'
    message.error({
      content: errorMsg,
      duration: 5,
      style: {
        marginTop: '80px',
      },
    })
  } finally {
    isProcessingOrderQr.value = false
  }
}

const processBypassOrder = async () => {
  if (cartItems.value.length === 0) return
  const { apiUser } = useApiBase()
  try {
    isProcessingOrder.value = true
    
    // Get user info from authStore
    if (!authStore.user || !authStore.user.id) {
      await navigateTo('/login')
      return
    }
    
    // Prepare order data
    const orderData = {
      userId: authStore.user.id,
      customerInfo: {
        fullName: authStore.user.fullname || authStore.user.name || '',
        phone: authStore.user.phone || '',
        email: authStore.user.email || ''
      },
      items: cartItems.value.map((item: any) => ({
        courseId: item.courseId || item.course?._id || item._id,
        course: item.course || item,
        price: item.course?.price || item.price || 0
      })),
      subtotal: Math.round(subtotalPrice.value),
      discount: appliedCoupon.value ? {
        type: appliedCoupon.value.type,
        value: appliedCoupon.value.value,
        amount: Math.round(discountAmount.value),
        couponCode: appliedCoupon.value.code
      } : null,
      totalAmount: totalPrice.value, // Đã được làm tròn trong computed
      paymentMethod: 'bypass',
      notes: ''
    }
    
    // Create order
    const orderResponse: any = await $fetch(`${apiUser}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: orderData
    })
    
    if (!orderResponse.data || !orderResponse.data.order) {
      throw new Error('Failed to create order')
    }
    
    const order = orderResponse.data.order
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Process payment
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
    // Refresh "Khóa học của tôi" ngay sau thanh toán bypass
    try {
      await coursesStore.fetchMyCourses()
    } catch (e) {
      console.warn('Không thể tải danh sách khóa học sau thanh toán:', e)
    }
    
    // Show success message
    message.success({
      content: `Bạn đã mua khoá học thành công!`,
      duration: 4,
      style: {
        marginTop: '80px',
      },
    })
    
    // Redirect to my-learning page
    await navigateTo(`/my-learning/`)
    
  } catch (error: any) {
    console.error('❌ Error processing bypass order:', error)
    // Show error message to user
    const errorMsg = error.data?.message || error.message || 'Có lỗi xảy ra khi xử lý đơn hàng'
    message.error({
      content: errorMsg,
      duration: 5,
      style: {
        marginTop: '80px',
      },
    })
  } finally {
    isProcessingOrder.value = false
  }
}

const processVnPay = async () => {
  if (cartItems.value.length === 0) return
  const { apiUser } = useApiBase()
  try {
    isProcessingOrderVnpay.value = true
    
    // Get user info from authStore
    if (!authStore.user || !authStore.user.id) {
      await navigateTo('/login')
      return
    }
    
    // Prepare order data
    const orderData = {
      userId: authStore.user.id,
      customerInfo: {
        fullName: authStore.user.fullname || authStore.user.name || '',
        phone: authStore.user.phone || '',
        email: authStore.user.email || ''
      },
      items: cartItems.value.map((item: any) => ({
        courseId: item.courseId || item.course?._id || item._id,
        course: item.course || item,
        price: item.course?.price || item.price || 0
      })),
      subtotal: Math.round(subtotalPrice.value),
      discount: appliedCoupon.value ? {
        type: appliedCoupon.value.type,
        value: appliedCoupon.value.value,
        amount: Math.round(discountAmount.value),
        couponCode: appliedCoupon.value.code
      } : null,
      totalAmount: totalPrice.value, // Đã được làm tròn trong computed
      paymentMethod: 'vnpay',
      notes: ''
    }
    
    // Create order
    const orderResponse: any = await $fetch(`${apiUser}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: orderData
    })
    
    if (!orderResponse.data || !orderResponse.data.order) {
      throw new Error('Failed to create order')
    }
    
    const order = orderResponse.data.order
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Process payment
    const paymentRes: any = await $fetch(`${apiUser}/orders/payment/vnpay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        orderId: order.orderId,
        paymentData: {
          ...orderData
        }
      }
    })
    if (paymentRes?.data?.paymentUrl) {
      // Sử dụng window.location.href thay vì window.open để tránh popup blocker
      // và để payment gateway hoạt động đúng cách
      window.location.href = paymentRes.data.paymentUrl
      return true
    } else {
      throw new Error('Không nhận được URL thanh toán từ VNPAY')
    }
    
  } catch (error: any) {
    console.error('❌ Error processing bypass order:', error)
    // Show error message to user
    const errorMsg = error.data?.message || error.message || 'Có lỗi xảy ra khi xử lý đơn hàng'
    message.error({
      content: errorMsg,
      duration: 5,
      style: {
        marginTop: '80px',
      },
    })
  } finally {
    isProcessingOrderVnpay.value = false
  }
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

