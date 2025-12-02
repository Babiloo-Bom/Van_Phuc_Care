<template>
  <div class="coupon-input">
    <div>
      <div class="flex gap-3">
        <div class="flex-1">
          <a-input
            v-model:value="couponCode"
            placeholder="Mã ưu đãi"
            size="large"
            class="!rounded-lg !border-gray-300 focus:!border-prim-100 !h-14"
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
          class="!bg-[#1A75BB] !text-white !border-prim-100 hover:!bg-blue-600 !rounded-lg !px-6 w-20 !h-14 flex items-center justify-center"
          @click="applyCoupon"
        >
          Nhập
        </a-button>
      </div>
      
      <!-- Error message -->
      <div v-if="errorMessage && !successMessage" class="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
        <span class="text-red-700 text-xs sm:text-sm">{{ errorMessage }}</span>
      </div>
      
      <!-- Success message -->
      <div v-if="successMessage && !errorMessage" class="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
        <span class="text-green-700 text-xs sm:text-sm">{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

const cartStore = useCartStore()
const authStore = useAuthStore()

const couponCode = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const applyCoupon = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!couponCode.value.trim()) {
    errorMessage.value = 'Vui lòng nhập mã giảm giá'
    return
  }
  
  if (!authStore.isLoggedIn || !authStore.user?.id || !authStore.token) {
    errorMessage.value = 'Vui lòng đăng nhập để sử dụng mã giảm giá'
    return
  }
  
  isLoading.value = true
  const { apiUser } = useApiBase()
  try {
    const response: any = await $fetch(`${apiUser}/coupons/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: {
        couponCode: couponCode.value.trim()
      }
    })
    
    if (response && response.data) {
      
      errorMessage.value = ''
      await cartStore.fetchCart()
      await nextTick()
      
      successMessage.value = `Áp dụng mã "${cartStore.cart?.coupon?.name || couponCode.value}" thành công!`
      couponCode.value = ''
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      errorMessage.value = response.message || response.data?.message || response?.error || 'Có lỗi xảy ra khi áp dụng mã giảm giá'
    }
  } catch (error: any) {
    errorMessage.value = error.data?.message || error?.error || 'Có lỗi xảy ra khi áp dụng mã giảm giá'
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
