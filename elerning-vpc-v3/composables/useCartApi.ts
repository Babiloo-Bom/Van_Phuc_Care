import type { 
  Cart, 
  AddToCartData, 
  UpdateCartItemData, 
  ApplyCouponData,
  CartItem, 
} from '~/types/cart';

export const useCartApi = () => {
  const { apiAdmin } = useApiBase()
  const apiBase = apiAdmin
  

  // Fetch user's cart
  const fetchCart = async (userId: string): Promise<Cart> => {
    try {
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data.cart
    } catch (error) {
      throw error
    }
  };

  // Add item to cart
  const addToCart = async (data: AddToCartData): Promise<Cart> => {
    try {
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/${data.userId}/add`, {
        method: 'POST',
        body: data,
      });

      return response.data.cart
    } catch (error) {
      throw error
    }
  };

  // Remove item from cart
  const removeFromCart = async (courseId: string, userId: string): Promise<Cart> => {
    try {
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/${userId}/remove/${courseId}`, {
        method: 'DELETE',
      });

      return response.data.cart
    } catch (error) {
      throw error
    }
  };

  // Update item quantity
  const updateCartItem = async (data: UpdateCartItemData, userId: string): Promise<Cart> => {
    try {
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/${userId}/update`, {
        method: 'PUT',
        body: data,
      });

      return response.data.cart
    } catch (error) {
      throw error
    }
  };

  // Clear entire cart
  const clearCart = async (userId: string): Promise<void> => {
    try {
      
      await $fetch(`${apiBase}/cart/${userId}/clear`, {
        method: 'DELETE',
      });

    } catch (error) {
      throw error
    }
  };

  // Apply coupon
  const applyCoupon = async (data: ApplyCouponData, userId: string): Promise<Cart> => {
    try {
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/${userId}/apply-coupon`, {
        method: 'POST',
        body: data,
      });

      return response.data.cart
    } catch (error) {
      throw error
    }
  };

  // Remove coupon
  const removeCoupon = async (userId: string): Promise<Cart> => {
    try {
      
      const response = await $fetch<{ message: string; data: { cart: Cart } }>(`${apiBase}/cart/${userId}/remove-coupon`, {
        method: 'DELETE',
      });

      return response.data.cart
    } catch (error) {
      throw error
    }
  };

  return {
    fetchCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  };
};