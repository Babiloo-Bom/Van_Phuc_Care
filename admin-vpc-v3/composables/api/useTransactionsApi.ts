/**
 * ====================================
 * Transactions API Composable
 * ====================================
 * All transaction-related API calls
 */

import type { Transaction, BaseQueryParams, PaginatedResponse } from '~/types/api'

export const useTransactionsApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get transactions list
     */
    async getTransactions(params?: BaseQueryParams) {
      return apiClient.get<PaginatedResponse<Transaction>>('/api/a/transactions', {
        params,
        showError: false
      })
    },

    /**
     * Get transaction by ID
     */
    async getTransaction(id: string) {
      return apiClient.get<{ transaction: Transaction }>(`/api/a/transactions/${id}`)
    },

    /**
     * Create new transaction
     */
    async createTransaction(data: Partial<Transaction>) {
      return apiClient.post<{ transaction: Transaction }>('/api/a/transactions', data, {
        errorMessage: 'Không thể tạo giao dịch'
      })
    },

    /**
     * Update transaction
     */
    async updateTransaction(id: string, data: Partial<Transaction>) {
      return apiClient.patch<{ transaction: Transaction }>(`/api/a/transactions/${id}`, data, {
        errorMessage: 'Không thể cập nhật giao dịch'
      })
    },

    /**
     * Delete transaction
     */
    async deleteTransaction(id: string) {
      return apiClient.delete(`/api/a/transactions/${id}`, {
        errorMessage: 'Không thể xóa giao dịch'
      })
    },

    /**
     * Get transaction statistics
     */
    async getTransactionStats(params?: { from?: string; to?: string }) {
      return apiClient.get('/api/a/transactions/statistics', { params })
    }
  }
}

