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
   * Get all courses (user API - includes isPurchased)
   */
  const getAllCourses = async (params?: any) => {
    try {
      const response = await $fetch(`${apiUserBase}/courses`, {
        params
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
      const response = await $fetch(`${apiUserBase}/courses/my-courses`, {
        params
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
      const response = await $fetch(`${apiUserBase}/courses/my-courses/${slug}`)
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
      const response = await $fetch(`${apiUserBase}/courses/${slug}`)
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