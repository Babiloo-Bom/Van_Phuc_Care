import type { Cart, CartItem, CartSummary, CartCoupon } from '~/types/cart'

/**
 * Calculate cart summary including totals and discounts
 */
export const calculateCartSummary = (cart: Cart | null): CartSummary => {
  if (!cart || !cart.items || cart.items.length === 0) {
    return {
      itemCount: 0,
      subtotal: 0,
      discountAmount: 0,
      totalPrice: 0,
      hasCoupon: false
    }
  }

  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.course.price * item.quantity)
  }, 0)

  const discountAmount = cart.discountAmount || 0
  const totalPrice = subtotal - discountAmount

  return {
    itemCount: cart.items.length,
    subtotal,
    discountAmount,
    totalPrice: Math.max(0, totalPrice),
    hasCoupon: !!cart.coupon,
    couponCode: cart.coupon?.code
  }
}

/**
 * Check if a course is already in the cart
 */
export const isCourseInCart = (cart: Cart | null, courseId: string): boolean => {
  if (!cart || !cart.items) return false
  return cart.items.some(item => item.course._id === courseId)
}

/**
 * Get quantity of a specific course in cart
 */
export const getCourseQuantityInCart = (cart: Cart | null, courseId: string): number => {
  if (!cart || !cart.items) return 0
  const item = cart.items.find(item => item.course._id === courseId)
  return item ? item.quantity : 0
}

/**
 * Get cart item by course ID
 */
export const getCartItemByCourseId = (cart: Cart | null, courseId: string): CartItem | null => {
  if (!cart || !cart.items) return null
  return cart.items.find(item => item.course._id === courseId) || null
}

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

/**
 * Calculate discount amount based on coupon
 */
export const calculateDiscountAmount = (
  subtotal: number, 
  coupon: CartCoupon | null
): number => {
  if (!coupon || !coupon.isActive) return 0

  // Check if coupon is still valid
  const now = new Date()
  const validFrom = new Date(coupon.validFrom)
  const validTo = new Date(coupon.validTo)

  if (now < validFrom || now > validTo) return 0

  // Check minimum order amount
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) return 0

  let discountAmount = 0

  if (coupon.type === 'percentage') {
    discountAmount = (subtotal * coupon.value) / 100
  } else if (coupon.type === 'fixed') {
    discountAmount = coupon.value
  }

  // Apply maximum discount limit
  if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
    discountAmount = coupon.maxDiscountAmount
  }

  return Math.min(discountAmount, subtotal)
}

/**
 * Validate cart before checkout
 */
export const validateCartForCheckout = (cart: Cart | null): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!cart) {
    errors.push('Giỏ hàng không tồn tại')
    return { isValid: false, errors }
  }

  if (!cart.items || cart.items.length === 0) {
    errors.push('Giỏ hàng trống')
    return { isValid: false, errors }
  }

  // Check if all items are still available
  for (const item of cart.items) {
    if (!item.course || !item.course._id) {
      errors.push(`Khóa học "${item.course?.title || 'Không xác định'}" không còn tồn tại`)
    }
  }

  // Check if total price is valid
  const summary = calculateCartSummary(cart)
  if (summary.totalPrice <= 0) {
    errors.push('Tổng tiền không hợp lệ')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Generate cart cache key for localStorage
 */
export const getCartCacheKey = (userId: string): string => {
  return `cart_${userId}`
}

/**
 * Save cart to localStorage cache
 */
export const saveCartToCache = (userId: string, cart: Cart): void => {
  if (process.client) {
    try {
      const cacheKey = getCartCacheKey(userId)
      const cacheData = {
        cart,
        timestamp: Date.now()
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    } catch (error) {
    }
  }
}

/**
 * Load cart from localStorage cache
 */
export const loadCartFromCache = (userId: string): Cart | null => {
  if (!process.client) return null

  try {
    const cacheKey = getCartCacheKey(userId)
    const cached = localStorage.getItem(cacheKey)
    
    if (!cached) return null

    const cacheData = JSON.parse(cached)
    const cacheAge = Date.now() - cacheData.timestamp
    const maxAge = 5 * 60 * 1000 // 5 minutes

    if (cacheAge > maxAge) {
      localStorage.removeItem(cacheKey)
      return null
    }

    return cacheData.cart
  } catch (error) {
    return null
  }
}

/**
 * Clear cart cache
 */
export const clearCartCache = (userId: string): void => {
  if (process.client) {
    try {
      const cacheKey = getCartCacheKey(userId)
      localStorage.removeItem(cacheKey)
    } catch (error) {
    }
  }
}
