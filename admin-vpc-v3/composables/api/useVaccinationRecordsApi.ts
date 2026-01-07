/**
 * ====================================
 * Vaccination Records API Composable
 * ====================================
 * All vaccination record-related API calls
 */

export interface VaccinationRecord {
  _id?: string
  customerId?: string
  healthBookId?: string
  vaccineId?: string | any
  scheduledDate?: string
  injectionDate?: string
  status?: 'pending' | 'completed' | 'cancelled' | 'missed'
  location?: string
  notes?: string
  injectionNumber?: number
  sideEffects?: string
  nextDoseDate?: string
  domain?: string
  createdAt?: string
  updatedAt?: string
}

export interface VaccinationScheduleItem {
  _id?: string
  title?: string
  name?: string
  age?: string
  ageInMonths?: number
  numberOfInjections?: string
  status?: string
  scheduledDate?: string
  injectionDate?: string
  injectionStatus?: 'pending' | 'completed' | 'cancelled' | 'missed'
  vaccinationRecord?: VaccinationRecord | null
  location?: string
  notes?: string
}

export const useVaccinationRecordsApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get vaccination schedule by healthBookId (merged with records)
     * GET /api/u/schedule-vaccins?healthBookId=xxx
     */
    async getVaccinationSchedule(params: { healthBookId?: string; customerId?: string }) {
      return apiClient.get<{ scheduleVaccin: VaccinationScheduleItem[] }>('/api/u/schedule-vaccins', {
        params,
        showError: false
      })
    },

    /**
     * Get vaccination records by customerId
     * GET /api/u/vaccination-records/:customerId
     */
    async getVaccinationRecords(customerId: string) {
      return apiClient.get<{ vaccinationRecords: VaccinationRecord[] }>(`/api/u/vaccination-records/${customerId}`, {
        showError: false
      })
    },

    /**
     * Create vaccination record (mark as completed)
     * POST /api/u/vaccination-records
     */
    async createVaccinationRecord(data: Partial<VaccinationRecord>) {
      return apiClient.post<{ vaccinationRecord: VaccinationRecord }>('/api/u/vaccination-records', data, {
        errorMessage: 'Không thể tạo bản ghi tiêm chủng'
      })
    },

    /**
     * Update vaccination record
     * PUT /api/u/vaccination-records/:id
     */
    async updateVaccinationRecord(id: string, data: Partial<VaccinationRecord>) {
      return apiClient.put<{ vaccinationRecord: VaccinationRecord }>(`/api/u/vaccination-records/${id}`, data, {
        errorMessage: 'Không thể cập nhật bản ghi tiêm chủng'
      })
    },

    /**
     * Delete vaccination record
     * DELETE /api/u/vaccination-records/:id
     */
    async deleteVaccinationRecord(id: string) {
      return apiClient.delete(`/api/u/vaccination-records/${id}`, {
        errorMessage: 'Không thể xóa bản ghi tiêm chủng'
      })
    }
  }
}

