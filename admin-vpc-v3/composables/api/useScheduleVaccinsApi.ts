/**
 * ====================================
 * Schedule Vaccins API Composable
 * ====================================
 * All schedule vaccination-related API calls
 */

export interface ScheduleVaccin {
  _id?: string
  customerId?: string
  thumbnail?: string
  content?: string
  title?: string
  age?: string  // Đổi từ time sang age để khớp với seed data
  ageInMonths?: number
  numberOfInjections?: string
  status?: string
  detailLink?: string
  domain?: string
  createdAt?: string
  updatedAt?: string
  description?: string
  scheduledDate?: string   // Ngày dự kiến tiêm mũi đó
}

export interface BaseQueryParams {
  page?: number
  limit?: number
  searchKey?: string
}

export interface PaginatedResponse<T> {
  scheduleVaccin: T[]
  pagination: {
    total: number
    page: number
    limit: number
  }
}

export const useScheduleVaccinsApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get schedule vaccins list
     */
    async getScheduleVaccins(params?: BaseQueryParams) {
      return apiClient.get<PaginatedResponse<ScheduleVaccin>>('/api/a/schedule-vaccin', {
        params,
        showError: false
      })
    },

    /**
     * Get schedule vaccin by ID
     */
    async getScheduleVaccin(id: string) {
      return apiClient.get<{ schedule: ScheduleVaccin }>(`/api/a/schedule-vaccin/${id}`)
    },

    /**
     * Create new schedule vaccin
     */
    async createScheduleVaccin(data: Partial<ScheduleVaccin>) {
      return apiClient.post<{ schedule: ScheduleVaccin }>('/api/a/schedule-vaccin', data, {
        errorMessage: 'Không thể tạo lịch tiêm'
      })
    },

    /**
     * Update schedule vaccin
     */
    async updateScheduleVaccin(id: string, data: Partial<ScheduleVaccin>) {
      return apiClient.patch<{ schedule: ScheduleVaccin }>(`/api/a/schedule-vaccin/${id}`, data, {
        errorMessage: 'Không thể cập nhật lịch tiêm'
      })
    },

    /**
     * Delete schedule vaccin
     */
    async deleteScheduleVaccin(id: string) {
      return apiClient.delete(`/api/a/schedule-vaccin/${id}`, {
        errorMessage: 'Không thể xóa lịch tiêm'
      })
    }
  }
}
