<template>
  <div class="cart-manager">
    <!-- Cart Toggle Button -->
    <button
      @click="toggleCart"
      class="cart-toggle-btn"
      :class="{ 'has-items': hasItems }"
    >
      <Icon name="shopping-cart" class="cart-icon" />
      <span v-if="itemCount > 0" class="cart-count">{{ itemCount }}</span>
    </button>

    <!-- Cart Sidebar -->
    <div
      v-if="isOpen"
      class="cart-sidebar"
      :class="{ 'is-open': isOpen }"
    >
      <div class="cart-header">
        <h3>Giỏ hàng</h3>
        <button @click="closeCart" class="close-btn">
          <Icon name="x" />
        </button>
      </div>

      <div class="cart-content">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <Icon name="loader" class="animate-spin" />
          <p>Đang tải giỏ hàng...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <Icon name="alert-circle" />
          <p>{{ error }}</p>
          <button @click="refreshCart" class="retry-btn">
            Thử lại
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="isEmpty" class="empty-state">
          <Icon name="shopping-cart" />
          <p>Giỏ hàng trống</p>
          <NuxtLink to="/courses" @click="closeCart" class="browse-btn">
            Khám phá khóa học
          </NuxtLink>
        </div>

        <!-- Cart Items -->
        <div v-else class="cart-items">
          <CartItem
            v-for="item in items"
            :key="item._id"
            :item="item"
            @update-quantity="handleUpdateQuantity"
            @remove="handleRemoveItem"
          />
        </div>
      </div>

      <!-- Cart Footer -->
      <div v-if="hasItems" class="cart-footer">
        <div class="cart-summary">
          <div class="summary-row">
            <span>Tạm tính:</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          <div v-if="hasCoupon" class="summary-row discount">
            <span>Giảm giá ({{ couponCode }}):</span>
            <span>-{{ formatPrice(discountAmount) }}</span>
          </div>
          <div class="summary-row total">
            <span>Tổng cộng:</span>
            <span>{{ formatPrice(totalPrice) }}</span>
          </div>
        </div>

        <div class="cart-actions">
          <button @click="goToCart" class="view-cart-btn">
            Xem giỏ hàng
          </button>
          <button @click="goToCheckout" class="checkout-btn">
            Thanh toán
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div
      v-if="isOpen"
      class="cart-overlay"
      @click="closeCart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { 
  items, 
  isLoading, 
  error, 
  itemCount, 
  subtotal, 
  discountAmount, 
  totalPrice, 
  hasCoupon, 
  couponCode, 
  isEmpty, 
  hasItems,
  formatPrice,
  updateQuantity,
  removeFromCart,
  refreshCart
} = useCart()

const isOpen = ref(false)

const toggleCart = () => {
  isOpen.value = !isOpen.value
}

const closeCart = () => {
  isOpen.value = false
}

const handleUpdateQuantity = async (itemId: string, quantity: number) => {
  try {
    await updateQuantity({ itemId, quantity })
  } catch (error) {
  }
}

const handleRemoveItem = async (itemId: string) => {
  try {
    await removeFromCart(itemId)
  } catch (error) {
  }
}

const goToCart = () => {
  closeCart()
  navigateTo('/cart')
}

const goToCheckout = () => {
  closeCart()
  navigateTo('/checkout')
}

// Close cart when route changes
watch(() => useRoute().path, () => {
  closeCart()
})
</script>

<style scoped>
.cart-manager {
  position: relative;
}

.cart-toggle-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cart-toggle-btn:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.cart-toggle-btn.has-items {
  border-color: #3b82f6;
  background: #eff6ff;
}

.cart-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.cart-sidebar.is-open {
  right: 0;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.cart-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  color: #6b7280;
}

.loading-state .animate-spin {
  animation: spin 1s linear infinite;
}

.error-state {
  color: #ef4444;
}

.retry-btn {
  margin-top: 12px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #2563eb;
}

.browse-btn {
  margin-top: 12px;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background 0.2s ease;
}

.browse-btn:hover {
  background: #2563eb;
}

.cart-items {
  space-y: 16px;
}

.cart-footer {
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.cart-summary {
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.summary-row.discount {
  color: #059669;
}

.summary-row.total {
  font-weight: 600;
  font-size: 16px;
  color: #111827;
  border-top: 1px solid #e5e7eb;
  padding-top: 8px;
}

.cart-actions {
  display: flex;
  gap: 12px;
}

.view-cart-btn,
.checkout-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-cart-btn {
  background: #f3f4f6;
  color: #374151;
}

.view-cart-btn:hover {
  background: #e5e7eb;
}

.checkout-btn {
  background: #3b82f6;
  color: white;
}

.checkout-btn:hover {
  background: #2563eb;
}

.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .cart-sidebar {
    width: 100vw;
    right: -100vw;
  }
}
</style>
