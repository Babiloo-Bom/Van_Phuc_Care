import { useApiClient } from '~/composables/useApiClient';
import type { BaseQueryParams } from '~/types/api';

export const useServicesApi = () => {
  const apiClient = useApiClient();

  return {
    /**
     * Get all services
     * GET /api/a/services
     */
    async getServices(params: Partial<BaseQueryParams> = {}) {
      return apiClient.get('/api/a/services', {
        params,
        showError: false,
      });
    },
    /**
     * Đăng ký dịch vụ
     * POST /api/a/services
     */
    async createService(data: any) {
      return apiClient.post('/api/a/services', data, {
        errorMessage: 'Không thể đăng ký dịch vụ',
      });
    },
  };
};
