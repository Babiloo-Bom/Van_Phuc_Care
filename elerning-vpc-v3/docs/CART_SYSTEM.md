# Hệ Thống Quản Lý Giỏ Hàng

## Tổng Quan

Hệ thống quản lý giỏ hàng được xây dựng với kiến trúc modular, sử dụng Pinia store và Vue composables để quản lý state và logic một cách hiệu quả.

## Kiến Trúc

### 1. Types & Interfaces (`types/cart.ts`)
- Định nghĩa các interface cho Cart, CartItem, CartCoupon
- Cung cấp type safety cho toàn bộ hệ thống

### 2. API Layer (`composables/useCartApi.ts`)
- Xử lý tất cả API calls liên quan đến giỏ hàng
- Tách biệt logic API khỏi business logic

### 3. Utility Functions (`utils/cart.ts`)
- Các hàm tiện ích cho tính toán và xử lý dữ liệu giỏ hàng
- Validation và formatting functions

### 4. Pinia Store (`stores/cart.ts`)
- Quản lý state toàn cục của giỏ hàng
- Cung cấp actions và getters cho các operations

### 5. Composable (`composables/useCart.ts`)
- Cung cấp reactive state và actions
- Tích hợp với Pinia store
- Cung cấp utility functions

### 6. Components
- `CartManager.vue`: Component chính quản lý giỏ hàng
- `CartItem.vue`: Component hiển thị item trong giỏ
- `AddToCartButton.vue`: Button thêm/xóa khỏi giỏ

## Sử Dụng

### 1. Cơ Bản

```vue
<template>
  <div>
    <!-- Sử dụng AddToCartButton -->
    <AddToCartButton 
      :course="course" 
      @added="handleAdded"
      @removed="handleRemoved"
    />
    
    <!-- Sử dụng CartManager -->
    <CartManager />
  </div>
</template>

<script setup>
const { 
  items, 
  totalPrice, 
  addCourseToCart, 
  removeCourseFromCart 
} = useCart()

const handleAdded = (course) => {
  console.log('Course added:', course)
}

const handleRemoved = (courseId) => {
  console.log('Course removed:', courseId)
}
</script>
```

### 2. Quản Lý State

```vue
<script setup>
const { 
  // State
  cart,
  items,
  isLoading,
  error,
  summary,
  
  // Computed
  itemCount,
  subtotal,
  totalPrice,
  hasCoupon,
  isEmpty,
  
  // Actions
  fetchCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  
  // Utilities
  isItemInCart,
  getItemQuantity,
  formatPrice
} = useCart()

// Initialize cart
onMounted(() => {
  initializeCart()
})
</script>
```

### 3. Validation

```vue
<script setup>
const { validateCart, canProceedToCheckout } = useCartValidation()

const handleCheckout = () => {
  const validation = validateCart()
  
  if (!validation.isValid) {
    console.error('Cart validation failed:', validation.errors)
    return
  }
  
  // Proceed to checkout
}
</script>
```

### 4. Cart Item Management

```vue
<script setup>
const { item, updateItemQuantity, removeItem } = useCartItem(itemId)

const handleQuantityChange = (newQuantity) => {
  updateItemQuantity(newQuantity)
}
</script>
```

## API Endpoints

### Cart Operations
- `GET /api/a/carts` - Lấy giỏ hàng
- `POST /api/a/carts/add` - Thêm item vào giỏ
- `DELETE /api/a/carts/remove` - Xóa item khỏi giỏ
- `PUT /api/a/carts/update` - Cập nhật số lượng
- `DELETE /api/a/carts/clear` - Xóa toàn bộ giỏ

### Coupon Operations
- `POST /api/a/carts/apply-coupon` - Áp dụng mã giảm giá
- `DELETE /api/a/carts/remove-coupon` - Xóa mã giảm giá

## Tính Năng

### 1. Quản Lý Items
- ✅ Thêm/xóa items
- ✅ Cập nhật số lượng
- ✅ Validation items
- ✅ Cache management

### 2. Coupon System
- ✅ Áp dụng mã giảm giá
- ✅ Tính toán discount
- ✅ Validation coupon

### 3. State Management
- ✅ Reactive state
- ✅ Loading states
- ✅ Error handling
- ✅ Cache persistence

### 4. UI Components
- ✅ Cart sidebar
- ✅ Item management
- ✅ Quantity controls
- ✅ Responsive design

## Cấu Hình

### Environment Variables
```env
NUXT_PUBLIC_API_BASE=http://localhost:3000/api/a
```

### Cache Settings
- Cache duration: 5 minutes
- Cache key format: `cart_{userId}`
- Auto-clear expired cache

## Best Practices

### 1. Error Handling
```typescript
try {
  await addToCart({ courseId: '123' })
} catch (error) {
  console.error('Failed to add to cart:', error)
  // Show user-friendly error message
}
```

### 2. Loading States
```vue
<template>
  <button :disabled="isLoading">
    <Icon v-if="isLoading" name="loader" class="animate-spin" />
    <span v-else>Add to Cart</span>
  </button>
</template>
```

### 3. Validation
```typescript
const { validateCart } = useCartValidation()

const handleCheckout = async () => {
  const validation = validateCart()
  if (!validation.isValid) {
    // Handle validation errors
    return
  }
  // Proceed with checkout
}
```

## Troubleshooting

### 1. Cart Not Loading
- Kiểm tra authentication state
- Kiểm tra API endpoint
- Kiểm tra network connection

### 2. Items Not Adding
- Kiểm tra course data format
- Kiểm tra API response
- Kiểm tra error messages

### 3. State Not Updating
- Kiểm tra Pinia store
- Kiểm tra reactive dependencies
- Kiểm tra component lifecycle

## Migration Guide

### Từ Cart Store Cũ
1. Thay thế `cartStore.addToCart(course)` bằng `addCourseToCart(course)`
2. Thay thế `cartStore.removeFromCart(courseId)` bằng `removeCourseFromCart(courseId)`
3. Sử dụng `useCart()` composable thay vì trực tiếp access store

### Cập Nhật Components
1. Import `useCart` composable
2. Sử dụng reactive state từ composable
3. Cập nhật event handlers

## Performance

### 1. Caching
- Cart data được cache trong localStorage
- Auto-refresh khi cần thiết
- Optimistic updates

### 2. Bundle Size
- Tree-shaking friendly
- Lazy loading components
- Minimal dependencies

### 3. Network
- Batch operations
- Error retry logic
- Request deduplication
