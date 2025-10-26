<template>
  <div class="coupon-input">
    <div class="mb-4">
      <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current text-primary-100">
          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.3 0 2.52.28 3.6.8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 12l2 2 4-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Mã giảm giá
      </h4>
      
      <div class="flex gap-3">
        <div class="flex-1">
          <a-input
            v-model:value="couponCode"
            placeholder="Nhập mã giảm giá"
            size="large"
            class="!rounded-lg !border-gray-300 focus:!border-prim-100"
            :disabled="isLoading"
            @keyup.enter="applyCoupon"
            @input="clearMessages"
          />
        </div>
        <a-button
          type="primary"
          size="large"
          :loading="isLoading"
          :disabled="!couponCode.trim()"
          class="!bg-prim-100 !border-prim-100 hover:!bg-blue-600 !rounded-lg !px-6"
          @click="applyCoupon"
        >
          Áp dụng
        </a-button>
      </div>
      
      <!-- Error message -->
      <div v-if="errorMessage && !successMessage" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-red-500">
            <path d="M12 9v4M12 17h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.3 0 2.52.28 3.6.8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-red-700 text-sm">{{ errorMessage }}</span>
        </div>
      </div>
      
      <!-- Success message -->
      <div v-if="successMessage && !errorMessage" class="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-green-500">
            <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.3 0 2.52.28 3.6.8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-green-700 text-sm">{{ successMessage }}</span>
        </div>
      </div>
    </div>
    
    <!-- Applied coupon display -->
    <div v-if="appliedCoupon" class="applied-coupon">
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-white">
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.3 0 2.52.28 3.6.8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <h5 class="font-semibold text-green-800">{{ appliedCoupon.name }}</h5>
              <p class="text-sm text-green-600">Mã: {{ appliedCoupon.code }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-green-800">
              -{{ appliedCoupon.discountAmount?.toLocaleString('vi-VN') }}đ
            </p>
            <a-button
              type="text"
              size="small"
              class="!text-red-500 hover:!text-red-700 !p-0"
              @click="removeCoupon"
            >
              Xóa
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

interface Coupon {
  code: string
  name: string
  type: string
  value: number
  discountAmount: number
}

const cartStore = useCartStore()
const authStore = useAuthStore()

// Reactive data
const couponCode = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Computed
const appliedCoupon = computed(() => {
  return cartStore.cart?.coupon || null
})

// Methods
const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const applyCoupon = async () => {
  // Clear messages first
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!couponCode.value.trim()) {
    errorMessage.value = 'Vui lòng nhập mã giảm giá'
    return
  }
  
  if (!authStore.isLoggedIn || !authStore.user?.id) {
    errorMessage.value = 'Vui lòng đăng nhập để sử dụng mã giảm giá'
    return
  }
  
  isLoading.value = true
  
  try {
    const response = await $fetch('http://localhost:3000/api/a/coupons/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        userId: authStore.user.id,
        couponCode: couponCode.value.trim()
      }
    })
    
    console.log('🎫 Coupon response:', response)
    console.log('🎫 Response data:', response.data)
    console.log('🎫 Response message:', response.message)
    
    // Check if response is successful (status 200 and has data)
    if (response && response.data && response.data.message === 'Coupon applied successfully') {
      console.log('✅ Coupon applied successfully')
      
      // Clear any existing error message immediately
      errorMessage.value = ''
      
      // Update cart store
      await cartStore.fetchCart()
      
      // Use nextTick to ensure error message is cleared before showing success
      await nextTick()
      
      successMessage.value = `Áp dụng mã "${cartStore.cart?.coupon?.name || couponCode.value}" thành công!`
      couponCode.value = ''
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      console.log('❌ Coupon application failed')
      errorMessage.value = response.message || response.data?.message || 'Có lỗi xảy ra khi áp dụng mã giảm giá'
    }
  } catch (error: any) {
    console.error('❌ Apply coupon error:', error)
    errorMessage.value = error.data?.message || 'Có lỗi xảy ra khi áp dụng mã giảm giá'
  } finally {
    isLoading.value = false
  }
}

const removeCoupon = async () => {
  if (!authStore.isLoggedIn || !authStore.user?.id) {
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const response = await $fetch(`http://localhost:3000/api/a/coupons/cart/${authStore.user.id}`, {
      method: 'DELETE'
    })
    
    if (response.data && response.data.message) {
      // Clear any existing error message
      errorMessage.value = ''
      
      // Update cart store
      await cartStore.fetchCart()
      
      successMessage.value = 'Đã xóa mã giảm giá'
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      errorMessage.value = response.message || 'Có lỗi xảy ra khi xóa mã giảm giá'
    }
  } catch (error: any) {
    console.error('❌ Remove coupon error:', error)
    errorMessage.value = error.data?.message || 'Có lỗi xảy ra khi xóa mã giảm giá'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.coupon-input {
  @apply w-full;
}

.applied-coupon {
  @apply mt-4;
}
</style>
