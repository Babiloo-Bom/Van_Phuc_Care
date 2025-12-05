import { useApiClient } from "~/composables/useApiClient";
import type { HealthRecordResponse } from "~/types/api";

export const useHealthRecordsApi = () => {
  const apiClient = useApiClient();

  return {
    /**
     * Get health records for a specific healthbook
     * GET /api/healthbooks/:id/records -> backend /api/u/healthbooks/:id/records
     */
    async getHealthRecords(
      healthBookId: string,
      params?: {
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
      }
    ) {
      return apiClient.get(`/api/healthbooks/${healthBookId}/records`, {
        params,
        showError: false,
      });
    },

    /**
     * Get health record by specific date
     * GET /api/healthbooks/:id/records?date=YYYY-MM-DD -> backend /api/u/healthbooks/:id/records
     */
    async getHealthRecordByDate(healthBookId: string, date: string) {
      return apiClient.get<HealthRecordResponse>(`/api/healthbooks/${healthBookId}/records`, {
        params: { date },
        showError: false,
      });
    },

    /**
     * Create or update health record (upsert by date)
     * POST /api/healthbooks/:id/records -> backend /api/u/healthbooks/:id/records
     */
    async upsertHealthRecord(healthBookId: string, data: any) {
      return apiClient.post(`/api/healthbooks/${healthBookId}/records`, data, {
        errorMessage: "Không thể lưu dữ liệu sức khỏe",
      });
    },

    /**
     * Delete health record
     * DELETE /api/healthbooks/:id/records/:recordId -> backend /api/u/healthbooks/:id/records/:recordId
     */
    async deleteHealthRecord(healthBookId: string, recordId: string) {
      return apiClient.delete(`/api/healthbooks/${healthBookId}/records/${recordId}`, {
        errorMessage: "Không thể xóa bản ghi",
      });
    },
  };
};
