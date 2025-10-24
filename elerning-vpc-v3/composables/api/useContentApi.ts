/**
 * ====================================
 * Content API Composable
 * ====================================
 * FAQs, Feedbacks, and other content-related APIs
 */

import type { FAQ, Feedback, BaseQueryParams, PaginatedResponse } from '~/types/api'

export const useContentApi = () => {
  const apiClient = useApiClient()

  return {
    // ============================================
    // FAQs
    // ============================================

    /**
     * Get FAQs list
     */
    async getFAQs(params?: BaseQueryParams) {
      return apiClient.get<PaginatedResponse<FAQ>>('/api/a/faqs', {
        params,
        showError: false
      })
    },

    /**
     * Get FAQ by ID
     */
    async getFAQ(id: string) {
      return apiClient.get<{ faq: FAQ }>(`/api/a/faqs/${id}`)
    },

    /**
     * Create new FAQ
     */
    async createFAQ(data: Partial<FAQ>) {
      return apiClient.post<{ faq: FAQ }>('/api/a/faqs', data, {
        errorMessage: 'Không thể tạo câu hỏi'
      })
    },

    /**
     * Update FAQ
     */
    async updateFAQ(id: string, data: Partial<FAQ>) {
      return apiClient.patch<{ faq: FAQ }>(`/api/a/faqs/${id}`, data, {
        errorMessage: 'Không thể cập nhật câu hỏi'
      })
    },

    /**
     * Delete FAQ
     */
    async deleteFAQ(id: string) {
      return apiClient.delete(`/api/a/faqs/${id}`, {
        errorMessage: 'Không thể xóa câu hỏi'
      })
    },

    // ============================================
    // Feedbacks
    // ============================================

    /**
     * Get feedbacks list
     */
    async getFeedbacks(params?: BaseQueryParams & { createdBy?: 'admin' | 'customer' }) {
      return apiClient.get<PaginatedResponse<Feedback>>('/api/a/feedbacks', {
        params,
        showError: false
      })
    },

    /**
     * Get feedback by ID
     */
    async getFeedback(id: string) {
      return apiClient.get<{ feedback: Feedback }>(`/api/a/feedbacks/${id}`)
    },

    /**
     * Create new feedback
     */
    async createFeedback(data: Partial<Feedback>) {
      return apiClient.post<{ feedback: Feedback }>('/api/a/feedbacks', data, {
        errorMessage: 'Không thể tạo phản hồi'
      })
    },

    /**
     * Update feedback
     */
    async updateFeedback(id: string, data: Partial<Feedback>) {
      return apiClient.patch<{ feedback: Feedback }>(`/api/a/feedbacks/${id}`, data, {
        errorMessage: 'Không thể cập nhật phản hồi'
      })
    },

    /**
     * Set feedback active
     */
    async setFeedbackActive(id: string) {
      return apiClient.patch(`/api/a/feedbacks/${id}/active`, {}, {
        errorMessage: 'Không thể kích hoạt phản hồi'
      })
    },

    /**
     * Set feedback inactive
     */
    async setFeedbackInactive(id: string) {
      return apiClient.patch(`/api/a/feedbacks/${id}/inactive`, {}, {
        errorMessage: 'Không thể vô hiệu hóa phản hồi'
      })
    },

    /**
     * Delete feedback
     */
    async deleteFeedback(id: string) {
      return apiClient.delete(`/api/a/feedbacks/${id}`, {
        errorMessage: 'Không thể xóa phản hồi'
      })
    }
  }
}

