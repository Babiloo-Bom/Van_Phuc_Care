import type { 
  Cart, 
  CartItem, 
  CartSummary, 
  AddToCartData,
  UpdateCartItemData,
  ApplyCouponData,
} from '~/types/cart';

/**
 * Composable for cart management
 * Provides reactive cart state and actions
 */
export const useCart = () => {
  const cartStore = useCartStore();
  const authStore = useAuthStore();

  // Reactive state
  const cart = computed(() => cartStore.cart);
  const items = computed(() => cartStore.items);
  const isLoading = computed(() => cartStore.isLoading);
  const error = computed(() => cartStore.error);
  const lastUpdated = computed(() => cartStore.lastUpdated);

  // Cart summary
  const summary = computed((): CartSummary => {
    return cartStore.summary;
  });

  // Individual computed properties
  const itemCount = computed(() => cartStore.itemCount);
  const subtotal = computed(() => cartStore.subtotal);
  const discountAmount = computed(() => cartStore.discountAmount);
  const totalPrice = computed(() => cartStore.totalPrice);
  const hasCoupon = computed(() => cartStore.hasCoupon);
  const couponCode = computed(() => cartStore.couponCode);

  // Actions
  const fetchCart = async () => {
    await cartStore.fetchCart();
  };

  const addToCart = async (data: AddToCartData) => {
    await cartStore.addToCart(data);
  };

  const removeFromCart = async (itemId: string) => {
    await cartStore.removeFromCart(itemId);
  };

  const updateQuantity = async (data: UpdateCartItemData) => {
    await cartStore.updateQuantity(data);
  };

  const clearCart = async () => {
    await cartStore.clearCart();
  };

  const applyCoupon = async (data: ApplyCouponData) => {
    await cartStore.applyCoupon(data);
  };

  const removeCoupon = async () => {
    await cartStore.removeCoupon();
  };

  const refreshCart = async () => {
    await cartStore.refreshCart();
  };

  // Utility functions
  const isItemInCart = (courseId: string): boolean => {
    return cartStore.isItemInCart(courseId);
  };

  const getItemQuantity = (courseId: string): number => {
    return cartStore.getItemQuantity(courseId);
  };

  const getCartSummary = (): CartSummary => {
    return cartStore.getCartSummary();
  };

  // Toggle item in cart (add if not present, remove if present)
  const toggleItem = async (courseId: string) => {
    if (isItemInCart(courseId)) {
      // Find the item to remove
      const item = items.value.find(item => item.course._id === courseId);
      if (item) {
        await removeFromCart(item._id);
      }
    } else {
      await addToCart({ courseId });
    }
  };

  // Add course to cart (convenience method)
  const addCourseToCart = async (course: any) => {
    await addToCart({
      courseId: course._id,
      quantity: 1,
    });
  };

  // Remove course from cart (convenience method)
  const removeCourseFromCart = async (courseId: string) => {
    const item = items.value.find(item => item.course._id === courseId);
    if (item) {
      await removeFromCart(item._id);
    }
  };

  // Check if user can add to cart
  const canAddToCart = computed(() => {
    return authStore.isLoggedIn && !isLoading.value;
  });

  // Check if cart is empty
  const isEmpty = computed(() => {
    return items.value.length === 0;
  });

  // Check if cart has items
  const hasItems = computed(() => {
    return items.value.length > 0;
  });

  // Format price for display
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Initialize cart on mount
  const initializeCart = async () => {
    if (authStore.isLoggedIn) {
      await fetchCart();
    }
  };

  // Watch for auth changes and update cart accordingly
  watch(() => authStore.isLoggedIn, isLoggedIn => {
    if (isLoggedIn) {
      fetchCart();
    } else {
      cartStore.resetState();
    }
  });

  return {
    // State
    cart,
    items,
    isLoading,
    error,
    lastUpdated,
    summary,
    itemCount,
    subtotal,
    discountAmount,
    totalPrice,
    hasCoupon,
    couponCode,
    canAddToCart,
    isEmpty,
    hasItems,

    // Actions
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    refreshCart,
    initializeCart,

    // Utility functions
    isItemInCart,
    getItemQuantity,
    getCartSummary,
    toggleItem,
    addCourseToCart,
    removeCourseFromCart,
    formatPrice,
  };
};

/**
 * Composable for cart item management
 * Provides specific actions for individual cart items
 */
export const useCartItem = (itemId: string) => {
  const cartStore = useCartStore();
  const { updateQuantity, removeFromCart } = useCart();

  const item = computed(() => {
    return cartStore.items.find(item => item._id === itemId);
  });

  const exists = computed(() => {
    return !!item.value;
  });

  const updateItemQuantity = async (quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity({ itemId, quantity });
    }
  };

  const removeItem = async () => {
    await removeFromCart(itemId);
  };

  const incrementQuantity = async () => {
    if (item.value) {
      await updateItemQuantity(item.value.quantity + 1);
    }
  };

  const decrementQuantity = async () => {
    if (item.value) {
      await updateItemQuantity(item.value.quantity - 1);
    }
  };

  return {
    item,
    exists,
    updateItemQuantity,
    removeItem,
    incrementQuantity,
    decrementQuantity,
  };
};

/**
 * Composable for cart validation
 * Provides validation functions for cart operations
 */
export const useCartValidation = () => {
  const { items, summary } = useCart();

  const validateCart = () => {
    const errors: string[] = [];

    if (items.value.length === 0) {
      errors.push('Giỏ hàng trống');
    }

    if (summary.value.totalPrice <= 0) {
      errors.push('Tổng tiền không hợp lệ');
    }

    // Check for invalid items
    for (const item of items.value) {
      if (!item.course || !item.course._id) {
        errors.push(`Khóa học "${item.course?.title || 'Không xác định'}" không còn tồn tại`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const canProceedToCheckout = computed(() => {
    const validation = validateCart();
    return validation.isValid;
  });

  return {
    validateCart,
    canProceedToCheckout,
  };
};
