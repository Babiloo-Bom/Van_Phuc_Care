/**
 * ====================================
 * Banners API Composable
 * ====================================
 * All banner-related API calls
 */

export interface Banner {
  _id?: string
  page: 'all-courses' | 'my-courses'
  title: string
  image: string
  url?: string
  status: 'active' | 'inactive'
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface BannerQueryParams {
  page?: number
  limit?: number
  pageType?: 'all-courses' | 'my-courses'
  status?: 'active' | 'inactive'
}

export interface PaginatedBannerResponse {
  banners: Banner[]
  pagination: {
    total: number
    page: number
    limit: number
  }
}

export const useBannersApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get banners list with pagination
     */
    async getBanners(params?: BannerQueryParams) {
      return apiClient.get<PaginatedBannerResponse>('/api/a/banners', {
        params,
        showError: false
      })
    },

    /**
     * Get banner by ID
     */
    async getBanner(id: string) {
      return apiClient.get<{ banner: Banner }>(`/api/a/banners/${id}`)
    },

    /**
     * Create new banner
     */
    async createBanner(data: Omit<Banner, '_id' | 'createdAt' | 'updatedAt'>) {
      return apiClient.post<{ banner: Banner }>('/api/a/banners', data, {
        errorMessage: 'Không thể tạo banner'
      })
    },

    /**
     * Update banner
     */
    async updateBanner(id: string, data: Partial<Banner>) {
      return apiClient.patch<{ banner: Banner }>(`/api/a/banners/${id}`, data, {
        errorMessage: 'Không thể cập nhật banner'
      })
    },

    /**
     * Delete banner
     */
    async deleteBanner(id: string) {
      return apiClient.delete(`/api/a/banners/${id}`, {
        errorMessage: 'Không thể xóa banner'
      })
    }
  }
}

