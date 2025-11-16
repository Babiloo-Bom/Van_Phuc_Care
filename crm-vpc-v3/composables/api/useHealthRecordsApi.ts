import { useApiClient } from '~/composables/useApiClient';

export const useHealthRecordsApi = () => {
  const apiClient = useApiClient();

  return {
    /**
     * Create new health record
     * POST /api/a/health-records
     */
    async createHealthRecord(data) {
      return apiClient.post('/api/a/health-records', data, {
        errorMessage: 'Không thể tạo phiếu sức khỏe',
      });
    },

    /**
     * Get health records list
     * GET /api/a/health-records
     */
    async getHealthRecords(params) {
      return apiClient.get('/api/a/health-records', {
        params,
        showError: false,
      });
    },
  };
};
