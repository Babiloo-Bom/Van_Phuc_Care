/**
 * Course API Composable
 * Handles course-related API calls
 */

import { useApiBase } from "./useApiBase";

export const useCourseApi = () => {
  const { apiAdmin, apiUser } = useApiBase()
  const apiBase = apiAdmin
  const apiUserBase = apiUser

  /**
   * Get all courses (user API - includes isPurchased when authenticated)
   * On client, ensures auth is inited so token is sent and backend returns isPurchased.
   */
  const getAllCourses = async (params?: any) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.token && process.client) {
        await authStore.initAuth()
      }
      const response = await $fetch(`${apiUserBase}/courses`, {
        params,
        headers: authStore.token
          ? { Authorization: `Bearer ${authStore.token}` }
          : undefined,
      })
      return response
    } catch (error: any) {
      throw error
    }
  };

  /**
   * Get all courses
   */
  const getMyCourses = async (params?: any) => {
    try {
      const authStore = useAuthStore()
      // Đảm bảo token đã được init (client-side)
      if (!authStore.token && process.client) {
        await authStore.initAuth()
      }

      const response = await $fetch(`${apiUserBase}/courses/my-courses`, {
        params,
        headers: authStore.token
          ? { Authorization: `Bearer ${authStore.token}` }
          : undefined,
      })
      return response
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Get my course by slug
   */
  const getMyCourseBySlug = async (slug: string) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.token && process.client) {
        await authStore.initAuth()
      }

      const response = await $fetch(`${apiUserBase}/courses/my-courses/${slug}`, {
        headers: authStore.token
          ? { Authorization: `Bearer ${authStore.token}` }
          : undefined,
      })
      return response
    } catch (error: any) {
      throw error
    }
  }


  /**
   * Get course detail by slug (user API - includes isPurchased)
   */
  const getDetail = async (slug: string) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.token && process.client) {
        await authStore.initAuth()
      }
      const response = await $fetch(`${apiUserBase}/courses/${slug}`, {
        headers: authStore.token
          ? { Authorization: `Bearer ${authStore.token}` }
          : undefined,
      })
      return response
    } catch (error: any) {
      throw error
    }
  };

  /**
   * Get course by slug
   */
  const getCourseBySlug = async (slug: string) => {
    try {
      const response = await $fetch(`${apiBase}/courses/${slug}`)
      return response
    } catch (error: any) {
      throw error
    }
  };

  /**
   * Get course by ID
   */
  const getById = async (id: string) => {
    try {
      const response: any = await $fetch(`${apiBase}/courses/id/${id}`)
      return response.data.course
    } catch (error: any) {
      throw error
    }
  };

  return {
    getAllCourses,
    getMyCourses,
    getMyCourseBySlug,
    getDetail,
    getCourseBySlug,
    getById,
  };
};