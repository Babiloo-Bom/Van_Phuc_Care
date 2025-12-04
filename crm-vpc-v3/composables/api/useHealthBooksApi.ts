/**
 * ====================================
 * Health Books API Composable
 * ====================================
 * All health book-related API calls
 */

import type {
  HealthBook,
  HealthBookResponse,
  HealthBooksListResponse,
  TemperatureHistoryResponse,
  HealthBookQueryParams,
} from "~/types/api";

export const useHealthBooksApi = () => {
  const apiClient = useApiClient();

  return {
    /**
     * Get user's health books list
     * GET /api/u/healthbooks
     */
    async getHealthBooks(params?: HealthBookQueryParams) {
      return apiClient.get<HealthBooksListResponse>("/api/u/healthbooks", {
        params,
        showError: false,
      });
    },

    /**
     * Get health book by ID
     * GET /api/u/healthbooks/:id
     */
    async getHealthBook(id: string) {
      return apiClient.get<HealthBookResponse>(`/api/u/healthbooks/${id}`, {
        showError: false,
      });
    },

    /**
     * Get health book by customer ID/email and date
     * GET /api/a/health-book/by-date/:customerId
     */
    async getHealthBookByDate(customerId: string, date: string) {
      return apiClient.get<HealthBookResponse>(`/api/a/health-book/by-date/${customerId}`, {
        params: { date },
      });
    },

    /**
     * Get current user's health book
     * GET /api/u/healthbooks/me
     */
    async getCurrentHealthBook() {
      return apiClient.get<HealthBookResponse>("/api/u/healthbooks/me", {
        showError: false,
      });
    },

    /**
     * Create new health book for current user
     * POST /api/u/healthbooks
     */
    async createHealthBook(data: { name: string; dob: string; gender: string; avatar?: string }) {
      return apiClient.post<HealthBookResponse>("/api/u/healthbooks", data, {
        errorMessage: "Không thể tạo hồ sơ sức khỏe",
      });
    },

    /**
     * Update user's health book (with optional avatar file)
     * PATCH /api/u/healthbooks/:id
     */
    async updateUserHealthBook(
      id: string,
      data: {
        name?: string;
        dob?: string;
        gender?: string;
        avatar?: File;
      }
    ) {
      const formData = new FormData();

      if (data.name) formData.append("name", data.name);
      if (data.dob) formData.append("dob", data.dob);
      if (data.gender) formData.append("gender", data.gender);
      if (data.avatar) formData.append("avatar", data.avatar);

      const config = useRuntimeConfig();
      const baseUrl = config.public.apiBaseUrl || "http://localhost:3000";

      // Get token from localStorage (key is 'auth_token')
      const token = localStorage.getItem("auth_token");

      const response = await fetch(`${baseUrl}/api/u/healthbooks/${id}`, {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        // Không cần credentials vì đang dùng Bearer token trong header
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Không thể cập nhật hồ sơ sức khỏe");
      }

      return response.json();
    },

    /**
     * Get temperature history (last 30 records before date)
     * GET /api/a/health-book/temperature
     */
    async getTemperatureHistory(date: string) {
      return apiClient.get<TemperatureHistoryResponse>("/api/a/health-book/temperature", {
        params: { date },
      });
    },

    /**
     * Create new health book (admin endpoint)
     * POST /api/a/health-book
     */
    async createHealthBookAdmin(
      data: Partial<HealthBook> & {
        customerEmail: string;
        recordedAt: string;
      }
    ) {
      return apiClient.post<{ status: boolean }>("/api/a/health-book", data, {
        errorMessage: "Không thể tạo sổ sức khỏe",
      });
    },

    /**
     * Update health book
     * PATCH /api/a/health-book/:id
     */
    async updateHealthBook(id: string, data: Partial<HealthBook>) {
      return apiClient.patch<{ healthBookCheck: HealthBook }>(`/api/a/health-book/${id}`, data, {
        errorMessage: "Không thể cập nhật sổ sức khỏe",
      });
    },

    /**
     * Delete health book
     * DELETE /api/a/health-book/:id
     */
    async deleteHealthBook(id: string) {
      return apiClient.delete<{ status: boolean }>(`/api/a/health-book/${id}`, {
        errorMessage: "Không thể xóa sổ sức khỏe",
      });
    },

    /**
     * Add comment to health book
     * POST /api/a/health-book/comment
     */
    async addComment(data: { healthBookId: string; content: string }) {
      return apiClient.post<{ status: boolean }>("/api/a/health-book/comment", data, {
        errorMessage: "Không thể thêm ghi chú",
      });
    },
  };
};
