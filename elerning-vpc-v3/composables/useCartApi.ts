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
  

  // Fetch user's cart
  const fetchCart = async (): Promise<Cart> => {
    try {
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/google-user-1761474076029`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return response.data.cart
    } catch (error) {
      throw error
    }
  }

  // Add item to cart
  const addToCart = async (data: AddToCartData): Promise<Cart> => {
    try {
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/google-user-1761474076029/add`, {
        method: 'POST',
        body: data
      })

      return response.data.cart
    } catch (error) {
      throw error
    }
  }

  // Remove item from cart
  const removeFromCart = async (courseId: string): Promise<Cart> => {
    try {
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/google-user-1761474076029/remove/${courseId}`, {
        method: 'DELETE'
      })

      return response.data.cart
    } catch (error) {
      throw error
    }
  }

  // Update item quantity
  const updateCartItem = async (data: UpdateCartItemData): Promise<Cart> => {
    try {
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/google-user-1761474076029/update`, {
        method: 'PUT',
        body: data
      })

      return response.data.cart
    } catch (error) {
      throw error
    }
  }

  // Clear entire cart
  const clearCart = async (): Promise<void> => {
    try {
      
      await $fetch(`${apiBase}/cart/google-user-1761474076029/clear`, {
        method: 'DELETE'
      })

    } catch (error) {
      throw error
    }
  }

  // Apply coupon
  const applyCoupon = async (data: ApplyCouponData): Promise<Cart> => {
    try {
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/google-user-1761474076029/apply-coupon`, {
        method: 'POST',
        body: data
      })

      return response.data.cart
    } catch (error) {
      throw error
    }
  }

  // Remove coupon
  const removeCoupon = async (): Promise<Cart> => {
    try {
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/google-user-1761474076029/remove-coupon`, {
        method: 'DELETE'
      })

      return response.data.cart
    } catch (error) {
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