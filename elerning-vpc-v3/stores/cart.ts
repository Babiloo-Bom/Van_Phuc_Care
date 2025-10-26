import { defineStore } from 'pinia'
import type { 
  Cart, 
  CartItem, 
  CartSummary, 
  CartState, 
  CartActions,
  AddToCartData,
  UpdateCartItemData,
  ApplyCouponData
} from '~/types/cart'
import { 
  calculateCartSummary, 
  isCourseInCart, 
  getCourseQuantityInCart,
  saveCartToCache,
  loadCartFromCache,
  clearCartCache
} from '~/utils/cart'

export interface CartToast {
  status: boolean
  type: 'success' | 'error' | 'info'
  course: CartItem | null
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    cart: null,
    items: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
    toast: {
      status: false,
      type: 'success',
      course: null,
    },
  }),

  getters: {
    // Cart summary with all calculations
    summary: (state): CartSummary => {
      return calculateCartSummary(state.cart)
    },

    // Individual cart properties for easy access
    itemCount: (state) => state.items.length,
    subtotal: (state) => calculateCartSummary(state.cart).subtotal,
    discountAmount: (state) => calculateCartSummary(state.cart).discountAmount,
    totalPrice: (state) => calculateCartSummary(state.cart).totalPrice,
    hasCoupon: (state) => !!state.cart?.coupon,
    couponCode: (state) => state.cart?.coupon?.code,

    // Legacy getters for compatibility
    cartItems: (state) => state.items,
    cartCount: (state) => state.items.length,

    // Check if course is in cart
    isInCart: (state) => (courseId: string) => {
      return isCourseInCart(state.cart, courseId)
    },

    // Get course quantity in cart
    getCourseQuantity: (state) => (courseId: string) => {
      return getCourseQuantityInCart(state.cart, courseId)
    },

    // Dashboard data (legacy compatibility)
    dashboard: (state) => ({
      cart: state.items,
      sumPrice: calculateCartSummary(state.cart).totalPrice,
      countCart: state.items.length,
    }),
  },

  actions: {
    // Set loading state
    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    // Set error state
    setError(error: string | null) {
      this.error = error
    },

    // Update cart data
    updateCart(cart: Cart | null) {
      this.cart = cart
      this.items = cart?.items || []
      this.lastUpdated = new Date().toISOString()
      this.error = null
    },

    // Load cart from cache
    loadCartFromCache() {
      if (!process.client) return

      const authStore = useAuthStore()
      if (!authStore.user?._id) return

      const userId = String(authStore.user._id)
      const cachedCart = loadCartFromCache(userId)
      
      if (cachedCart) {
        this.updateCart(cachedCart)
        console.log('💾 Cart loaded from cache')
      }
    },

    // Save cart to cache
    saveCartToCache() {
      if (!process.client) return

      const authStore = useAuthStore()
      if (!authStore.user?._id || !this.cart) return

      const userId = String(authStore.user._id)
      saveCartToCache(userId, this.cart)
    },

    // Fetch cart from backend
    async fetchCart() {
      try {
        this.setLoading(true)
        this.setError(null)

        const authStore = useAuthStore()
        
        if (!authStore.isLoggedIn || !authStore.user?._id) {
          console.log('❌ User not logged in, cannot fetch cart')
          this.updateCart(null)
          return
        }
        
        const userId = String(authStore.user._id)
        
        // Try cache first
        this.loadCartFromCache()
        
        console.log('🛒 Fetching cart for user:', userId)
        const cartApi = useCartApi()
        const cart = await cartApi.fetchCart()
        
        this.updateCart(cart)
        this.saveCartToCache()
        
        console.log('✅ Cart fetched from backend:', this.items.length, 'items')
      } catch (error) {
        console.error('❌ Error fetching cart from backend:', error)
        this.setError('Không thể tải giỏ hàng')
        
        // Fallback to cache
        this.loadCartFromCache()
      } finally {
        this.setLoading(false)
      }
    },

    // Add item to cart (new format)
    async addToCart(data: AddToCartData) {
      try {
        this.setLoading(true)
        this.setError(null)

        const authStore = useAuthStore()
        
        if (!authStore.isLoggedIn || !authStore.user?._id) {
          console.log('❌ User not logged in, redirecting to login')
          await navigateTo('/login')
          return
        }
        
        console.log('🛒 Adding to cart:', data)
        
        // Validate courseId
        if (!data.courseId) {
          throw new Error('Course ID is required')
        }
        
        // Get course data first
        const courseApi = useCourseApi()
        const course = await (courseApi as any).getById(data.courseId)
        
        console.log('🔍 Course data from API:', course)
        console.log('🔍 Course ID:', data.courseId)
        
        // Prepare data for backend
        const cartData = {
          courseId: data.courseId,
          course: course
        }
        
        console.log('🔍 Cart data to send:', cartData)
        
        const cartApi = useCartApi()
        const cart = await cartApi.addToCart(cartData)
        
        this.updateCart(cart)
        this.saveCartToCache()
        
        // Show success toast
        this.showToast({
          status: true,
          type: 'success',
          course: null, // We don't have course info in the new API
        })
        
        console.log('✅ Item added to cart successfully')
      } catch (error) {
        console.error('❌ Error adding to cart:', error)
        this.setError('Không thể thêm vào giỏ hàng')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Legacy addToCart method (for backward compatibility)
    async addToCartLegacy(course: any) {
      console.warn('⚠️ addToCartLegacy() is deprecated, use addToCart({ courseId, quantity }) instead')
      return this.addToCart({
        courseId: course._id,
        quantity: 1
      })
    },

    // Remove item from cart
    async removeFromCart(courseId: string) {
      try {
        this.setLoading(true)
        this.setError(null)

        const authStore = useAuthStore()
        if (!authStore.isLoggedIn || !authStore.user?._id) {
          console.log('❌ User not logged in, cannot remove from cart')
          return
        }
        
        console.log('🛒 Removing from cart:', courseId)
        const cartApi = useCartApi()
        const cart = await cartApi.removeFromCart(courseId)
        
        this.updateCart(cart)
        this.saveCartToCache()
        
        // Show info toast
        this.showToast({
          status: true,
          type: 'info',
          course: null, // We don't have course info in the new API
        })
        
        console.log('✅ Item removed from cart successfully')
      } catch (error) {
        console.error('❌ Error removing from cart:', error)
        this.setError('Không thể xóa khỏi giỏ hàng')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Update item quantity
    async updateQuantity(data: UpdateCartItemData) {
      try {
        this.setLoading(true)
        this.setError(null)

        const authStore = useAuthStore()
        if (!authStore.isLoggedIn || !authStore.user?._id) {
          console.log('❌ User not logged in, cannot update cart')
          return
        }
        
        console.log('🛒 Updating quantity:', data)
        const cartApi = useCartApi()
        const cart = await cartApi.updateCartItem(data)
        
        this.updateCart(cart)
        this.saveCartToCache()
        
        console.log('✅ Quantity updated successfully')
      } catch (error) {
        console.error('❌ Error updating quantity:', error)
        this.setError('Không thể cập nhật số lượng')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Clear entire cart
    async clearCart() {
      try {
        this.setLoading(true)
        this.setError(null)

        const authStore = useAuthStore()
        if (!authStore.isLoggedIn || !authStore.user?._id) {
          console.log('❌ User not logged in, cannot clear cart')
          return
        }
        
        console.log('🛒 Clearing cart...')
        const cartApi = useCartApi()
        await cartApi.clearCart()
        
        this.updateCart(null)
        this.clearCartCache()
        
        console.log('✅ Cart cleared successfully')
      } catch (error) {
        console.error('❌ Error clearing cart:', error)
        this.setError('Không thể xóa giỏ hàng')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Force clear cart (local only, no API call)
    forceClearCart() {
      console.log('🛒 Force clearing cart locally...')
      this.cart = null
      this.items = []
      this.lastUpdated = new Date().toISOString()
      this.saveCartToCache()
      console.log('✅ Cart force cleared locally')
    },

    // Apply coupon
    async applyCoupon(data: ApplyCouponData) {
      try {
        this.setLoading(true)
        this.setError(null)

        const authStore = useAuthStore()
        if (!authStore.isLoggedIn || !authStore.user?._id) {
          console.log('❌ User not logged in, cannot apply coupon')
          return
        }
        
        console.log('🛒 Applying coupon:', data)
        const cartApi = useCartApi()
        const cart = await cartApi.applyCoupon(data)
        
        this.updateCart(cart)
        this.saveCartToCache()
        
        console.log('✅ Coupon applied successfully')
      } catch (error) {
        console.error('❌ Error applying coupon:', error)
        this.setError('Không thể áp dụng mã giảm giá')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Remove coupon
    async removeCoupon() {
      try {
        this.setLoading(true)
        this.setError(null)

        const authStore = useAuthStore()
        if (!authStore.isLoggedIn || !authStore.user?._id) {
          console.log('❌ User not logged in, cannot remove coupon')
          return
        }
        
        console.log('🛒 Removing coupon...')
        const cartApi = useCartApi()
        const cart = await cartApi.removeCoupon()
        
        this.updateCart(cart)
        this.saveCartToCache()
        
        console.log('✅ Coupon removed successfully')
      } catch (error) {
        console.error('❌ Error removing coupon:', error)
        this.setError('Không thể xóa mã giảm giá')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Refresh cart data
    async refreshCart() {
      await this.fetchCart()
    },

    // Get cart summary
    getCartSummary(): CartSummary {
      return calculateCartSummary(this.cart)
    },

    // Check if item is in cart
    isItemInCart(courseId: string): boolean {
      return isCourseInCart(this.cart, courseId)
    },

    // Get item quantity
    getItemQuantity(courseId: string): number {
      return getCourseQuantityInCart(this.cart, courseId)
    },

    // Clear cart cache
    clearCartCache() {
      if (!process.client) return

      const authStore = useAuthStore()
      if (!authStore.user?._id) return

      const userId = String(authStore.user._id)
      clearCartCache(userId)
    },

    // Show toast notification
    showToast(toast: CartToast) {
      this.toast = toast
      
      // Auto hide after 2 seconds
      setTimeout(() => {
        if (this.toast) {
          this.toast.status = false
        }
      }, 2000)
    },

    // Toggle course in cart (legacy compatibility)
    async toggleCourse(course: any) {
      const existingItem = this.items.find(item => item.course._id === course._id)
      
      if (existingItem) {
        await this.removeFromCart(existingItem._id)
      } else {
        await this.addToCart({ courseId: course._id })
      }
    },

    // Legacy compatibility method
    loadCart() {
      console.warn('⚠️ loadCart() is deprecated, use fetchCart() instead')
      this.loadCartFromCache()
    },

    // Reset store state
    resetState() {
      this.cart = null
      this.items = []
      this.isLoading = false
      this.error = null
      this.lastUpdated = null
      this.toast = {
        status: false,
        type: 'success',
        course: null,
      }
      this.clearCartCache()
    },
  },
})

