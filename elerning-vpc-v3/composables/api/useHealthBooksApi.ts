/**
 * ====================================
 * Health Books API Composable
 * ====================================
 * All health book-related API calls
 */

import type { HealthBook, BaseQueryParams, PaginatedResponse } from '~/types/api'

export const useHealthBooksApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get health books list
     */
    async getHealthBooks(params?: BaseQueryParams) {
      return apiClient.get<PaginatedResponse<HealthBook>>('/api/a/health-book/all', {
        params,
        showError: false
      })
    },

    /**
     * Get health book by ID
     */
    async getHealthBook(id: string) {
      return apiClient.get<{ healthBook: HealthBook }>(`/api/a/health-book/${id}`)
    },

    /**
     * Get health book by customer and date
     */
    async getHealthBookByDate(customerId: string, date: string) {
      return apiClient.get<{ healthBook: HealthBook }>(`/api/a/health-book/byDate/${customerId}`, {
        params: { date }
      })
    },

    /**
     * Create new health book
     */
    async createHealthBook(data: Partial<HealthBook>) {
      return apiClient.post<{ healthBook: HealthBook }>('/api/a/health-book', data, {
        errorMessage: 'Không thể tạo sổ sức khỏe'
      })
    },

    /**
     * Update health book
     */
    async updateHealthBook(id: string, data: Partial<HealthBook>) {
      return apiClient.patch<{ healthBook: HealthBook }>(`/api/a/health-book/${id}`, data, {
        errorMessage: 'Không thể cập nhật sổ sức khỏe'
      })
    },

    /**
     * Delete health book
     */
    async deleteHealthBook(id: string) {
      return apiClient.delete(`/api/a/health-book/${id}`, {
        errorMessage: 'Không thể xóa sổ sức khỏe'
      })
    },

    /**
     * Get health book comments
     */
    async getComments(healthBookId: string) {
      return apiClient.get('/api/a/comments', {
        params: { healthBookId }
      })
    },

    /**
     * Add comment to health book
     */
    async addComment(healthBookId: string, content: string) {
      return apiClient.post('/api/a/comments', { healthBookId, content }, {
        errorMessage: 'Không thể thêm ghi chú'
      })
    },

    /**
     * Delete comment
     */
    async deleteComment(id: string) {
      return apiClient.delete(`/api/a/comments/${id}`, {
        errorMessage: 'Không thể xóa ghi chú'
      })
    }
  }
}

