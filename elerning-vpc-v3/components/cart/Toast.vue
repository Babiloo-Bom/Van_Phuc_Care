<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="cartStore.toast?.status"
        class="fixed top-20 right-4 z-50 bg-white shadow-lg rounded-lg p-4 max-w-sm w-full border-l-4"
        :class="borderClass"
      >
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <svg
              v-if="cartStore.toast?.type === 'success'"
              class="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg
              v-else-if="cartStore.toast?.type === 'error'"
              class="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg
              v-else
              class="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 mb-1">
              {{ toastTitle }}
            </h4>
            <p v-if="cartStore.toast.course?.title" class="text-sm text-gray-600">
              {{ cartStore.toast.course.title }}
            </p>
          </div>

          <!-- Close button -->
          <button
            @click="cartStore.toast && (cartStore.toast.status = false)"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Action buttons -->
        <div v-if="cartStore.toast?.type === 'success'" class="mt-3 flex gap-2">
          <NuxtLink
            to="/cart"
            class="flex-1 text-center px-3 py-2 bg-primary-100 text-white text-sm rounded hover:bg-primary-110 transition-colors"
          >
            Xem giỏ hàng
          </NuxtLink>
          <button
            @click="cartStore.toast && (cartStore.toast.status = false)"
            class="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
          >
            Tiếp tục mua
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

const toastTitle = computed(() => {
  switch (cartStore.toast?.type) {
    case 'success':
      return 'Đã thêm vào giỏ hàng!'
    case 'error':
      return 'Có lỗi xảy ra!'
    case 'info':
      return 'Đã xóa khỏi giỏ hàng!'
    default:
      return ''
  }
})

const borderClass = computed(() => {
  switch (cartStore.toast?.type) {
    case 'success':
      return 'border-green-500'
    case 'error':
      return 'border-red-500'
    case 'info':
      return 'border-blue-500'
    default:
      return 'border-gray-500'
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

