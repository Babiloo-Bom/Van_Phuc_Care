/**
 * Admin Settings API - Cấu hình hệ thống (VAT, ...)
 */
export const VAT_KEY = 'elearning_vat_percent'

export const useSettingsApi = () => {
  const apiClient = useApiClient()

  return {
    async getAll() {
      return apiClient.get<{ settings: Record<string, any>; list: any[] }>('/api/a/settings', { showError: false })
    },

    async getByKey(key: string) {
      return apiClient.get<{ key: string; value: any }>(`/api/a/settings/${key}`, { showError: false })
    },

    async setByKey(key: string, value: number | string | boolean) {
      return apiClient.put<{ key: string; value: any }>(`/api/a/settings/${key}`, { value }, {
        errorMessage: 'Không thể cập nhật cài đặt'
      })
    }
  }
}
