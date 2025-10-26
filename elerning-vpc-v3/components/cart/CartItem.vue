<template>
  <div class="cart-item">
    <div class="item-image">
      <img 
        :src="item.course.thumbnail" 
        :alt="item.course.title"
        @error="handleImageError"
      />
    </div>

    <div class="item-content">
      <div class="item-header">
        <h4 class="item-title">{{ item.course.title }}</h4>
        <button 
          @click="handleRemove"
          class="remove-btn"
          :disabled="isRemoving"
        >
          <Icon name="x" />
        </button>
      </div>

      <div class="item-meta">
        <div class="instructor">
          <Icon name="user" />
          <span>{{ item.course.instructor.name }}</span>
        </div>
        <div class="duration">
          <Icon name="clock" />
          <span>{{ formatDuration(item.course.duration) }}</span>
        </div>
        <div class="lessons">
          <Icon name="play" />
          <span>{{ item.course.lessons }} bài học</span>
        </div>
      </div>

      <div class="item-footer">
        <div class="quantity-controls">
          <button 
            @click="decrementQuantity"
            :disabled="isUpdating || item.quantity <= 1"
            class="quantity-btn"
          >
            <Icon name="minus" />
          </button>
          <span class="quantity">{{ item.quantity }}</span>
          <button 
            @click="incrementQuantity"
            :disabled="isUpdating"
            class="quantity-btn"
          >
            <Icon name="plus" />
          </button>
        </div>

        <div class="item-price">
          <span class="price">{{ formatPrice(item.course.price * item.quantity) }}</span>
          <span v-if="item.course.originalPrice && item.course.originalPrice > item.course.price" 
                class="original-price">
            {{ formatPrice(item.course.originalPrice * item.quantity) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '~/types/cart'

interface Props {
  item: CartItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-quantity': [itemId: string, quantity: number]
  'remove': [itemId: string]
}>()

const { formatPrice } = useCart()

const isUpdating = ref(false)
const isRemoving = ref(false)

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/placeholder-course.jpg'
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

const incrementQuantity = async () => {
  if (isUpdating.value) return
  
  isUpdating.value = true
  try {
    emit('update-quantity', props.item._id, props.item.quantity + 1)
  } finally {
    isUpdating.value = false
  }
}

const decrementQuantity = async () => {
  if (isUpdating.value || props.item.quantity <= 1) return
  
  isUpdating.value = true
  try {
    emit('update-quantity', props.item._id, props.item.quantity - 1)
  } finally {
    isUpdating.value = false
  }
}

const handleRemove = async () => {
  if (isRemoving.value) return
  
  isRemoving.value = true
  try {
    emit('remove', props.item._id)
  } finally {
    isRemoving.value = false
  }
}
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.cart-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.item-image {
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  margin: 0;
  flex: 1;
}

.remove-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-btn:hover:not(:disabled) {
  background: #ef4444;
  color: white;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}

.instructor,
.duration,
.lessons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f9fafb;
  border-radius: 8px;
  padding: 4px;
}

.quantity-btn {
  width: 28px;
  height: 28px;
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
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  min-width: 20px;
  text-align: center;
}

.item-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.price {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.original-price {
  font-size: 12px;
  color: #9ca3af;
  text-decoration: line-through;
}

@media (max-width: 640px) {
  .cart-item {
    padding: 12px;
  }
  
  .item-image {
    width: 60px;
    height: 45px;
  }
  
  .item-title {
    font-size: 13px;
  }
  
  .item-meta {
    gap: 8px;
  }
  
  .item-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .quantity-controls {
    justify-content: center;
  }
  
  .item-price {
    align-items: center;
  }
}
</style>
