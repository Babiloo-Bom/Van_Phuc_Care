/**
 * ====================================
 * HealthBooks API Composable
 * ====================================
 * All health book-related API calls
 */

export interface HealthBook {
  _id?: string
  userId?: string
  customerId?: string
  customerEmail?: string
  name?: string
  dob?: string
  avatar?: string
  weight?: string
  height?: string
  gender?: string
  skinConditions?: string
  tooth?: {
    count?: string
    descriptions?: string
  }
  nutrition?: {
    count?: string
    descriptions?: string
  }
  sleep?: {
    time?: string
    descriptions?: string
  }
  frequencyOfDefecation?: string
  fecalCondition?: string
  digestiveProblems?: string
  healthCondition?: string
  vaccination?: string
  vaccinationDate?: string
  vaccinationContent?: string
  note?: string
  method?: {
    status?: string
    descriptions?: string
  }
  exerciseAndSkills?: string
  domain?: string
  recordedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface BaseQueryParams {
  page?: number
  limit?: number
  searchKey?: string
  category?: string
  date?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
  }
}

export const useHealthBooksApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get health books list
     */
    async getHealthBooks(params?: BaseQueryParams) {
      return apiClient.get<{ healthBooks: HealthBook[], pagination: { total: number, page: number, limit: number } }>('/api/a/health-book/all', {
        params,
        showError: false
      })
    },

    /**
     * Get health book by ID
     */
    async getHealthBook(id: string, date?: string) {
      return apiClient.get<{ data: HealthBook }>(`/api/a/health-book/${id}`, {
        params: date ? { date } : undefined
      })
    },

    /**
     * Create new health book
     */
    async createHealthBook(data: Partial<HealthBook>) {
      return apiClient.post<{ status: boolean }>('/api/a/health-book', data, {
        errorMessage: 'Không thể tạo sổ SKĐT'
      })
    },

    /**
     * Update health book
     */
    async updateHealthBook(id: string, data: Partial<HealthBook>) {
      return apiClient.patch<{ healthBookCheck: HealthBook }>(`/api/a/health-book/${id}`, data, {
        errorMessage: 'Không thể cập nhật sổ SKĐT'
      })
    },

    /**
     * Delete health book
     */
    async deleteHealthBook(id: string) {
      return apiClient.delete(`/api/a/health-book/${id}`, {
        errorMessage: 'Không thể xóa sổ SKĐT'
      })
    }
  }
}

