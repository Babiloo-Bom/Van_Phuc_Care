import { useApiClient } from '~/composables/useApiClient';
import type { BaseQueryParams } from '~/types/api';

export const useServicesApi = () => {
  const apiClient = useApiClient();

  return {
    /**
     * Get all services (public)
     * GET /api/u/services
     */
    async getServices(params: Partial<BaseQueryParams> = {}) {
      return apiClient.get('/api/u/services', {
        params,
        showError: false,
      });
    },

    /**
     * Get service detail by ID
     * GET /api/u/services/:id
     */
    async getServiceDetail(id: string) {
      return apiClient.get(`/api/u/services/${id}`, {
        showError: false,
      });
    },

    /**
     * Get user's registered services (requires auth)
     * GET /api/u/services/my-services
     */
    async getMyServices(params: Partial<BaseQueryParams> = {}) {
      return apiClient.get('/api/u/services/my-services', {
        params,
        showError: false,
      });
    },

    /**
     * Đăng ký dịch vụ (requires auth)
     * POST /api/u/services/register
     */
    async registerService(data: {
      serviceId: string;
      notes?: string;
      preferredDate?: string;
    }) {
      return apiClient.post('/api/u/services/register', data, {
        errorMessage: 'Không thể đăng ký dịch vụ',
      });
    },
  };
};
