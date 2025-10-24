/**
 * ====================================
 * Courses API Composable
 * ====================================
 * All course-related API calls
 */

import type { Course, BaseQueryParams, PaginatedResponse } from '~/types/api'

export const useCoursesApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get courses list
     */
    async getCourses(params?: BaseQueryParams) {
      return apiClient.get<PaginatedResponse<Course>>('/api/a/courses', {
        params,
        showError: false
      })
    },

    /**
     * Get course by ID
     */
    async getCourse(id: string) {
      return apiClient.get<{ course: Course }>(`/api/a/courses/${id}`)
    },

    /**
     * Create new course
     */
    async createCourse(data: Partial<Course>) {
      return apiClient.post<{ course: Course }>('/api/a/courses', data, {
        errorMessage: 'Không thể tạo khóa học'
      })
    },

    /**
     * Update course
     */
    async updateCourse(id: string, data: Partial<Course>) {
      return apiClient.patch<{ course: Course }>(`/api/a/courses/${id}`, data, {
        errorMessage: 'Không thể cập nhật khóa học'
      })
    },

    /**
     * Delete course
     */
    async deleteCourse(id: string) {
      return apiClient.delete(`/api/a/courses/${id}`, {
        errorMessage: 'Không thể xóa khóa học'
      })
    },

    /**
     * Update course order
     */
    async updateCourseOrder(id: string, order: number) {
      return apiClient.patch(`/api/a/courses/${id}`, { order }, {
        errorMessage: 'Không thể cập nhật thứ tự khóa học'
      })
    },

    /**
     * Toggle course status
     */
    async toggleCourseStatus(id: string) {
      return apiClient.patch(`/api/a/courses/${id}/toggle-status`, {}, {
        errorMessage: 'Không thể thay đổi trạng thái khóa học'
      })
    }
  }
}

