import { useApiClient } from '~/composables/useApiClient';
import type { BaseQueryParams } from '~/types/api';

export const useServicesApi = () => {
  const apiClient = useApiClient();

  return {
    /**
     * Get all services (public)
     * Uses Nuxt server proxy: /api/services -> backend /api/u/services
     */
    async getServices(params: Partial<BaseQueryParams> = {}) {
      return apiClient.get('/api/services', {
        params,
        showError: false,
      });
    },

    /**
     * Get service detail by ID
     * Uses Nuxt server proxy: /api/services/:id -> backend /api/u/services/:id
     */
    async getServiceDetail(id: string) {
      return apiClient.get(`/api/services/${id}`, {
        showError: false,
      });
    },

    /**
     * Get user's registered services (requires auth)
     * Uses Nuxt server proxy: /api/services/my-services -> backend /api/u/services/my-services
     */
    async getMyServices(params: Partial<BaseQueryParams> = {}) {
      return apiClient.get('/api/services/my-services', {
        params,
        showError: false,
      });
    },

    /**
     * Đăng ký dịch vụ (requires auth)
     * Uses Nuxt server proxy: /api/services/register -> backend /api/u/services/register
     */
    async registerService(data: {
      serviceId: string;
      notes?: string;
      preferredDate?: string;
    }) {
      return apiClient.post('/api/services/register', data, {
        errorMessage: 'Không thể đăng ký dịch vụ',
      });
    },
  };
};
