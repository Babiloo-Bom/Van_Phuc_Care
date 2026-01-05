/**
 * ====================================
 * Coupons API Composable
 * ====================================
 * All coupon-related API calls
 */

export const useCouponsApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get all coupons with pagination and filters
     */
    async getCoupons(params?: { 
      page?: number
      limit?: number
      search?: string
      status?: 'all' | 'active' | 'expired' | 'inactive'
    }) {
      return apiClient.get('/api/a/coupons', {
        params,
        showError: false
      })
    },

    /**
     * Get coupon by ID
     */
    async getCoupon(id: string) {
      return apiClient.get(`/api/a/coupons/${id}`)
    },

    /**
     * Create new coupon
     */
    async createCoupon(data: any) {
      return apiClient.post('/api/a/coupons', data, {
        errorMessage: 'Không thể tạo mã giảm giá'
      })
    },

    /**
     * Update coupon
     */
    async updateCoupon(id: string, data: any) {
      return apiClient.put(`/api/a/coupons/${id}`, data, {
        errorMessage: 'Không thể cập nhật mã giảm giá'
      })
    },

    /**
     * Delete coupon
     */
    async deleteCoupon(id: string) {
      return apiClient.delete(`/api/a/coupons/${id}`, {
        errorMessage: 'Không thể xóa mã giảm giá'
      })
    },

    /**
     * Validate coupon code
     */
    async validateCoupon(code: string, cartItems: any[], userId?: string) {
      return apiClient.post('/api/a/coupons/validate', {
        code,
        cartItems,
        userId
      })
    }
  }
}

