/**
 * ====================================
 * Orders API Composable
 * ====================================
 * All order-related API calls
 */

import type { Order, OrderQueryParams, PaginatedResponse } from '~/types/api'

export const useOrdersApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get orders list
     */
    async getOrders(params?: OrderQueryParams) {
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
     * Create new order
     */
    async createOrder(data: Partial<Order>) {
      return apiClient.post<{ order: Order }>('/api/a/orders', data, {
        errorMessage: 'Không thể tạo đơn hàng'
      })
    },

    /**
     * Update order
     */
    async updateOrder(id: string, data: Partial<Order>) {
      return apiClient.patch<{ order: Order }>(`/api/a/orders/${id}`, data, {
        errorMessage: 'Không thể cập nhật đơn hàng'
      })
    },

    /**
     * Update order status
     */
    async updateOrderStatus(id: string, status: Order['status']) {
      return apiClient.patch(`/api/a/orders/${id}/status`, { status }, {
        errorMessage: 'Không thể cập nhật trạng thái đơn hàng'
      })
    },

    /**
     * Update payment status
     */
    async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']) {
      return apiClient.patch(`/api/a/orders/${id}/payment-status`, { paymentStatus }, {
        errorMessage: 'Không thể cập nhật trạng thái thanh toán'
      })
    },

    /**
     * Cancel order
     */
    async cancelOrder(id: string, reason?: string) {
      return apiClient.post(`/api/a/orders/${id}/cancel`, { reason }, {
        errorMessage: 'Không thể hủy đơn hàng'
      })
    },

    /**
     * Get order statistics
     */
    async getOrderStats(params?: { from?: string; to?: string }) {
      return apiClient.get('/api/a/orders/statistics', { params })
    },

    /**
     * Export orders
     */
    async exportOrders(params?: OrderQueryParams) {
      return apiClient.get('/api/a/orders/export', {
        params,
        errorMessage: 'Không thể export đơn hàng'
      })
    }
  }
}

