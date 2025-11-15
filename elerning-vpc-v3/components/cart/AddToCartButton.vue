<template>
  <div class="add-to-cart-container">
    <!-- Add to Cart Button -->
    <button
      v-if="!isInCart"
      @click="handleAddToCart"
      :disabled="!canAdd || isLoading"
      class="add-to-cart-btn"
      :class="{ 'loading': isLoading }"
    >
      <Icon v-if="!isLoading" name="shopping-cart" />
      <Icon v-else name="loader" class="animate-spin" />
      <span>{{ isLoading ? 'Đang thêm...' : 'Thêm vào giỏ' }}</span>
    </button>

    <!-- In Cart State -->
    <div v-else class="in-cart-state">
      <div class="in-cart-info">
        <Icon name="check-circle" />
        <span>Đã có trong giỏ</span>
      </div>
      <button
        @click="handleRemoveFromCart"
        :disabled="isRemoving"
        class="remove-btn"
      >
        <Icon v-if="!isRemoving" name="trash-2" />
        <Icon v-else name="loader" class="animate-spin" />
      </button>
    </div>

    <!-- Quantity Controls (if in cart) -->
    <div v-if="isInCart && showQuantityControls" class="quantity-controls">
      <button
        @click="decrementQuantity"
        :disabled="isUpdating || quantity <= 1"
        class="quantity-btn"
      >
        <Icon name="minus" />
      </button>
      <span class="quantity">{{ quantity }}</span>
      <button
        @click="incrementQuantity"
        :disabled="isUpdating"
        class="quantity-btn"
      >
        <Icon name="plus" />
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      <Icon name="alert-circle" />
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  course: {
    _id: string
    title: string
    price: number
    thumbnail: string
    instructor: {
      name: string
    }
    duration: number
    lessons: number
  }
  variant?: 'default' | 'large' | 'small'
  showQuantityControls?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  showQuantityControls: false,
  disabled: false
})

const emit = defineEmits<{
  'added': [course: any]
  'removed': [courseId: string]
  'updated': [courseId: string, quantity: number]
}>()

const { 
  isItemInCart, 
  getItemQuantity, 
  addCourseToCart, 
  removeCourseFromCart,
  updateQuantity,
  canAddToCart,
  isLoading: cartLoading
} = useCart()

const isLoading = ref(false)
const isRemoving = ref(false)
const isUpdating = ref(false)
const error = ref('')

const isInCart = computed(() => {
  return isItemInCart(props.course._id)
})

const quantity = computed(() => {
  return getItemQuantity(props.course._id)
})

const canAdd = computed(() => {
  return canAddToCart.value && !props.disabled
})

const handleAddToCart = async () => {
  if (!canAdd.value || isLoading.value) return

  isLoading.value = true
  error.value = ''

  try {
    await addCourseToCart(props.course)
    emit('added', props.course)
  } catch (err: any) {
    error.value = err.message || 'Không thể thêm vào giỏ hàng'
  } finally {
    isLoading.value = false
  }
}

const handleRemoveFromCart = async () => {
  if (isRemoving.value) return

  isRemoving.value = true
  error.value = ''

  try {
    await removeCourseFromCart(props.course._id)
    emit('removed', props.course._id)
  } catch (err: any) {
    error.value = err.message || 'Không thể xóa khỏi giỏ hàng'
  } finally {
    isRemoving.value = false
  }
}

const incrementQuantity = async () => {
  if (isUpdating.value) return

  isUpdating.value = true
  error.value = ''

  try {
    const newQuantity = quantity.value + 1
    await updateQuantity({
      itemId: props.course._id,
      quantity: newQuantity
    })
    emit('updated', props.course._id, newQuantity)
  } catch (err: any) {
    error.value = err.message || 'Không thể cập nhật số lượng'
  } finally {
    isUpdating.value = false
  }
}

const decrementQuantity = async () => {
  if (isUpdating.value || quantity.value <= 1) return

  isUpdating.value = true
  error.value = ''

  try {
    const newQuantity = quantity.value - 1
    if (newQuantity <= 0) {
      await removeCourseFromCart(props.course._id)
      emit('removed', props.course._id)
    } else {
      await updateQuantity({
        itemId: props.course._id,
        quantity: newQuantity
      })
      emit('updated', props.course._id, newQuantity)
    }
  } catch (err: any) {
    error.value = err.message || 'Không thể cập nhật số lượng'
  } finally {
    isUpdating.value = false
  }
}

// Clear error after 3 seconds
watch(error, (newError) => {
  if (newError) {
    setTimeout(() => {
      error.value = ''
    }, 3000)
  }
})
</script>

<style scoped>
.add-to-cart-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.add-to-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.add-to-cart-btn.loading {
  opacity: 0.8;
}

.in-cart-state {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
}

.in-cart-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #166534;
  font-weight: 500;
}

.remove-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-btn:hover:not(:disabled) {
  background: #dc2626;
  color: white;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 8px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.quantity-btn:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  min-width: 24px;
  text-align: center;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 14px;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Variant styles */
.add-to-cart-btn.large {
  padding: 16px 32px;
  font-size: 16px;
  min-height: 52px;
}

.add-to-cart-btn.small {
  padding: 8px 16px;
  font-size: 14px;
  min-height: 36px;
}
</style>
