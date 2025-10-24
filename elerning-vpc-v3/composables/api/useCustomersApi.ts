/**
 * ====================================
 * Customers API Composable
 * ====================================
 * All customer-related API calls
 */

import type { Customer, CustomerQueryParams, PaginatedResponse } from '~/types/api'

export const useCustomersApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get customers list with pagination
     */
    async getCustomers(params?: CustomerQueryParams) {
      return apiClient.get<PaginatedResponse<Customer>>('/api/a/customers', {
        params,
        showError: false
      })
    },

    /**
     * Get customer by ID
     */
    async getCustomer(id: string) {
      return apiClient.get<{ customer: Customer }>(`/api/a/customers/${id}`)
    },

    /**
     * Create new customer
     */
    async createCustomer(data: Partial<Customer>) {
      return apiClient.post<{ customer: Customer }>('/api/a/customers', data, {
        errorMessage: 'Không thể tạo khách hàng'
      })
    },

    /**
     * Update customer
     */
    async updateCustomer(id: string, data: Partial<Customer>) {
      return apiClient.patch<{ customer: Customer }>(`/api/a/customers/${id}`, data, {
        errorMessage: 'Không thể cập nhật khách hàng'
      })
    },

    /**
     * Delete customer
     */
    async deleteCustomer(id: string) {
      return apiClient.delete(`/api/a/customers/${id}`, {
        errorMessage: 'Không thể xóa khách hàng'
      })
    },

    /**
     * Delete multiple customers
     */
    async deleteCustomers(ids: string[]) {
      return apiClient.post('/api/a/customers/deleteMany', { ids }, {
        errorMessage: 'Không thể xóa khách hàng'
      })
    },

    /**
     * Import customers from file
     */
    async importCustomers(file: File) {
      const formData = new FormData()
      formData.append('file', file)
      
      return apiClient.upload('/api/a/customers/import', formData, {
        errorMessage: 'Không thể import khách hàng',
        timeout: 120000 // 2 minutes
      })
    },

    /**
     * Export customers to Excel
     */
    async exportCustomers(params?: CustomerQueryParams) {
      return apiClient.get('/api/a/customers/export', {
        params,
        errorMessage: 'Không thể export khách hàng'
      })
    },

    /**
     * Get customer statistics
     */
    async getCustomerStats() {
      return apiClient.get('/api/a/customers/statistics')
    }
  }
}

