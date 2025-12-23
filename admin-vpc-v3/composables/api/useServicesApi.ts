/**
 * ====================================
 * Services API Composable
 * ====================================
 * All service-related API calls
 */

export interface Service {
  _id?: string
  origin?: string
  title?: string
  thumbnail?: string
  descriptions?: string
  shortDescriptions?: string
  usageTimeUnit?: string
  implementer?: {
    fullname?: string
    avatar?: string
    position?: string
  }
  slug?: string
  reviews?: number
  status?: 'active' | 'inactive'
  link?: string
  createdAt?: string
  updatedAt?: string
}

export interface BaseQueryParams {
  page?: number
  limit?: number
  searchKey?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export const useServicesApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get services list
     */
    async getServices(params?: BaseQueryParams) {
      return apiClient.get<PaginatedResponse<Service>>('/api/a/services', {
        params,
        showError: false
      })
    },

    /**
     * Get service by ID
     */
    async getService(id: string) {
      return apiClient.get<{ service: Service }>(`/api/a/services/${id}`)
    },

    /**
     * Create new service
     */
    async createService(data: Partial<Service>) {
      return apiClient.post<{ service: Service }>('/api/a/services', data, {
        errorMessage: 'Không thể tạo dịch vụ'
      })
    },

    /**
     * Update service
     */
    async updateService(id: string, data: Partial<Service>) {
      return apiClient.patch<{ service: Service }>(`/api/a/services/${id}`, data, {
        errorMessage: 'Không thể cập nhật dịch vụ'
      })
    },

    /**
     * Delete services (bulk)
     */
    async deleteServices(ids: string[]) {
      return apiClient.post('/api/a/services/bulk-delete', { ids }, {
        errorMessage: 'Không thể xóa dịch vụ'
      })
    },

    /**
     * Get service statistics
     */
    async getServiceStats(params?: { range?: string; groupBy?: string; from?: string; to?: string }) {
      return apiClient.get('/api/a/services/statistics', {
        params,
        showError: false
      })
    }
  }
}

