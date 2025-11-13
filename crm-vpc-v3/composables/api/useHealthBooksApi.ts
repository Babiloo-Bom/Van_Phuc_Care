/**
 * ====================================
 * Health Books API Composable
 * ====================================
 * All health book-related API calls
 */

import type {
  HealthBook,
  HealthBookResponse,
  HealthBooksListResponse,
  TemperatureHistoryResponse,
  HealthBookQueryParams,
} from '~/types/api';

export const useHealthBooksApi = () => {
  const apiClient = useApiClient();

  return {
    /**
     * Get health books list with pagination
     * GET /api/a/health-book/all
     */
    async getHealthBooks(params?: HealthBookQueryParams) {
      return apiClient.get<HealthBooksListResponse>('/api/a/health-book/all', {
        params,
        showError: false,
      });
    },

    /**
     * Get health book by ID
     * GET /api/a/health-book/:id
     */
    async getHealthBook(id: string, date?: string) {
      return apiClient.get<HealthBookResponse>(`/api/a/health-book/${id}`, {
        params: date ? { date } : undefined,
      });
    },

    /**
     * Get health book by customer ID/email and date
     * GET /api/a/health-book/by-date/:customerId
     */
    async getHealthBookByDate(customerId: string, date: string) {
      return apiClient.get<HealthBookResponse>(`/api/a/health-book/by-date/${customerId}`, {
        params: { date },
      });
    },

    /**
     * Get current user's health book (show endpoint)
     * GET /api/a/health-book/show
     */
    async getCurrentHealthBook(date?: string) {
      return apiClient.get<HealthBookResponse>('/api/a/health-book/show', {
        params: date ? { date } : undefined,
      });
    },

    /**
     * Get temperature history (last 30 records before date)
     * GET /api/a/health-book/temperature
     */
    async getTemperatureHistory(date: string) {
      return apiClient.get<TemperatureHistoryResponse>('/api/a/health-book/temperature', {
        params: { date },
      });
    },

    /**
     * Create new health book
     * POST /api/a/health-book
     */
    async createHealthBook(data: Partial<HealthBook> & { 
      customerEmail: string
      recordedAt: string 
    }) {
      return apiClient.post<{ status: boolean }>('/api/a/health-book', data, {
        errorMessage: 'Không thể tạo sổ sức khỏe',
      });
    },

    /**
     * Update health book
     * PATCH /api/a/health-book/:id
     */
    async updateHealthBook(id: string, data: Partial<HealthBook>) {
      return apiClient.patch<{ healthBookCheck: HealthBook }>(`/api/a/health-book/${id}`, data, {
        errorMessage: 'Không thể cập nhật sổ sức khỏe',
      });
    },

    /**
     * Delete health book
     * DELETE /api/a/health-book/:id
     */
    async deleteHealthBook(id: string) {
      return apiClient.delete<{ status: boolean }>(`/api/a/health-book/${id}`, {
        errorMessage: 'Không thể xóa sổ sức khỏe',
      });
    },

    /**
     * Add comment to health book
     * POST /api/a/health-book/comment
     */
    async addComment(data: { healthBookId: string; content: string }) {
      return apiClient.post<{ status: boolean }>('/api/a/health-book/comment', data, {
        errorMessage: 'Không thể thêm ghi chú',
      });
    },
  };
};

