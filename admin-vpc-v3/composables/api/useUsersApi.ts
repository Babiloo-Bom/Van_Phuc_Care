/**
 * ====================================
 * Users API Composable
 * ====================================
 * All user-related API calls
 */

export const useUsersApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get users list with pagination
     */
    async getUsers(params?: { page?: number; limit?: number; searchKey?: string; role?: string }) {
      return apiClient.get('/api/a/users-management', {
        params,
        showError: false
      })
    },

    /**
     * Get user by ID
     */
    async getUser(id: string) {
      return apiClient.get(`/api/a/users-management/${id}`)
    },

    /**
     * Create new user
     */
    async createUser(data: any) {
      return apiClient.post('/api/a/users-management', data, {
        errorMessage: 'Không thể tạo người dùng'
      })
    },

    /**
     * Update user
     */
    async updateUser(id: string, data: any) {
      return apiClient.put(`/api/a/users-management/${id}`, data, {
        errorMessage: 'Không thể cập nhật người dùng'
      })
    },

    /**
     * Delete user
     */
    async deleteUser(id: string) {
      return apiClient.delete(`/api/a/users-management/${id}`, {
        errorMessage: 'Không thể xóa người dùng'
      })
    },

    /**
     * Toggle user status
     */
    async toggleUserStatus(id: string) {
      return apiClient.patch(`/api/a/users-management/${id}/status`, {}, {
        errorMessage: 'Không thể thay đổi trạng thái người dùng'
      })
    },

    /**
     * Get user statistics
     */
    async getUserStats() {
      return apiClient.get('/api/a/users-management/stats')
    }
  }
}

