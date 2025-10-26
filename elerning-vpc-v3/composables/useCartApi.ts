import type { 
  Cart, 
  AddToCartData, 
  UpdateCartItemData, 
  ApplyCouponData,
  CartItem 
} from '~/types/cart'

export const useCartApi = () => {
  const config = useRuntimeConfig()
  // Hardcode localhost for testing
  const apiBase = 'http://localhost:3000/api/a'
  
  console.log('🔍 Cart API Base URL:', apiBase)
  console.log('🔍 Config public.apiBase:', config.public.apiBase)

  // Fetch user's cart
  const fetchCart = async (): Promise<Cart> => {
    try {
      console.log('🛒 Fetching cart...')
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/google-user-1761474076029`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('✅ Cart fetched:', response)
      return response.data.cart
    } catch (error) {
      console.error('❌ Error fetching cart:', error)
      throw error
    }
  }

  // Add item to cart
  const addToCart = async (data: AddToCartData): Promise<Cart> => {
    try {
      console.log('🛒 Adding to cart:', data)
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/google-user-1761474076029/add`, {
        method: 'POST',
        body: data
      })

      console.log('✅ Item added to cart:', response)
      return response.data.cart
    } catch (error) {
      console.error('❌ Error adding to cart:', error)
      throw error
    }
  }

  // Remove item from cart
  const removeFromCart = async (courseId: string): Promise<Cart> => {
    try {
      console.log('🛒 Removing from cart:', courseId)
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/google-user-1761474076029/remove/${courseId}`, {
        method: 'DELETE'
      })

      console.log('✅ Item removed from cart:', response)
      return response.data.cart
    } catch (error) {
      console.error('❌ Error removing from cart:', error)
      throw error
    }
  }

  // Update item quantity
  const updateCartItem = async (data: UpdateCartItemData): Promise<Cart> => {
    try {
      console.log('🛒 Updating cart item:', data)
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/google-user-1761474076029/update`, {
        method: 'PUT',
        body: data
      })

      console.log('✅ Cart item updated:', response)
      return response.data.cart
    } catch (error) {
      console.error('❌ Error updating cart item:', error)
      throw error
    }
  }

  // Clear entire cart
  const clearCart = async (): Promise<void> => {
    try {
      console.log('🛒 Clearing cart...')
      
      await $fetch(`${apiBase}/cart/google-user-1761474076029/clear`, {
        method: 'DELETE'
      })

      console.log('✅ Cart cleared')
    } catch (error) {
      console.error('❌ Error clearing cart:', error)
      throw error
    }
  }

  // Apply coupon
  const applyCoupon = async (data: ApplyCouponData): Promise<Cart> => {
    try {
      console.log('🛒 Applying coupon:', data)
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/google-user-1761474076029/apply-coupon`, {
        method: 'POST',
        body: data
      })

      console.log('✅ Coupon applied:', response)
      return response.data.cart
    } catch (error) {
      console.error('❌ Error applying coupon:', error)
      throw error
    }
  }

  // Remove coupon
  const removeCoupon = async (): Promise<Cart> => {
    try {
      console.log('🛒 Removing coupon...')
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/google-user-1761474076029/remove-coupon`, {
        method: 'DELETE'
      })

      console.log('✅ Coupon removed:', response)
      return response.data.cart
    } catch (error) {
      console.error('❌ Error removing coupon:', error)
      throw error
    }
  }

  return {
    fetchCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    applyCoupon,
    removeCoupon
  }
}