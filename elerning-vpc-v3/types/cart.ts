export interface CartItem {
  _id: string
  course: {
    _id: string
    title: string
    slug: string
    thumbnail: string
    price: number
    originalPrice?: number
    discount?: number
    duration: number
    lessons: number
    instructor: {
      name: string
      avatar: string
    }
    videoCount: number
    documentCount: number
    quizCount: number
    rating: {
      average: number
      count: number
    }
    reviewsCount: number
  }
  quantity: number
  addedAt: string
}

export interface CartCoupon {
  _id: string
  code: string
  name: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderAmount?: number
  maxDiscountAmount?: number
  isActive: boolean
  validFrom: string
  validTo: string
}

export interface Cart {
  _id: string
  userId: string
  items: CartItem[]
  coupon?: CartCoupon
  subtotal: number
  discountAmount: number
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export interface AddToCartData {
  courseId: string
  quantity?: number
  userId: string
}

export interface UpdateCartItemData {
  itemId: string
  quantity: number
}

export interface ApplyCouponData {
  code: string
}

export interface CartSummary {
  itemCount: number
  subtotal: number
  discountAmount: number
  totalPrice: number
  hasCoupon: boolean
  couponCode?: string
}

export interface CartState {
  cart: Cart | null
  items: CartItem[]
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
  toast?: {
    status: boolean
    type: 'success' | 'error' | 'info'
    course: CartItem | null
  }
}

export interface CartActions {
  // Basic cart operations
  fetchCart: () => Promise<void>
  addToCart: (data: AddToCartData) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (data: UpdateCartItemData) => Promise<void>
  clearCart: () => Promise<void>
  
  // Coupon operations
  applyCoupon: (data: ApplyCouponData) => Promise<void>
  removeCoupon: () => Promise<void>
  
  // Utility operations
  refreshCart: () => Promise<void>
  getCartSummary: () => CartSummary
  isItemInCart: (courseId: string) => boolean
  getItemQuantity: (courseId: string) => number
}
