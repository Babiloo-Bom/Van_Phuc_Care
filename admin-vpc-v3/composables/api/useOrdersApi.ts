/**
 * ====================================
 * Orders API Composable
 * ====================================
 * All order-related API calls
 */

export interface Order {
  _id?: string
  orderId?: string
  userId?: string
  customerInfo?: {
    fullName?: string
    phone?: string
    email?: string
    address?: string
  }
  items?: Array<{
    courseId?: string
    course?: any
    price?: number
  }>
  subtotal?: number
  discount?: {
    type?: string
    value?: number
    amount?: number
    couponCode?: string
  }
  totalAmount?: number
  paymentMethod?: string
  paymentStatus?: string
  transactionId?: string
  status?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface BaseQueryParams {
  page?: number
  limit?: number
  status?: string
  paymentStatus?: string
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export const useOrdersApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get orders list
     */
    async getOrders(params?: BaseQueryParams) {
      return apiClient.get<PaginatedResponse<Order>>('/api/a/orders', {
        params,
        showError: false
      })
    },

    /**
     * Get order by ID
     */
    async getOrder(id: string) {
      return apiClient.get<{ order: Order }>(`/api/a/orders/${id}`)
    },

    /**
     * Update order status
     */
    async updateOrderStatus(id: string, data: { status?: string; paymentStatus?: string; notes?: string }) {
      return apiClient.patch<{ order: Order }>(`/api/a/orders/${id}/status`, data, {
        errorMessage: 'Không thể cập nhật trạng thái đơn hàng'
      })
    },

    /**
     * Get order statistics
     */
    async getOrderStats() {
      return apiClient.get('/api/a/orders/stats/overview')
    },

    /**
     * Get revenue by month (for chart)
     */
    async getRevenueByMonth(months?: number) {
      return apiClient.get('/api/a/orders/revenue-by-month', {
        params: { months: months || 12 }
      })
    },

    /**
     * Manual activation - Kích hoạt thủ công
     */
    async manualActivation(data: { userEmail: string; courseIds: string[]; notes?: string }) {
      return apiClient.post<{ order: Order }>('/api/a/orders/manual-activation', data, {
        errorMessage: 'Không thể kích hoạt thủ công'
      })
    }
  }
}

