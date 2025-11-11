/**
 * Course API Composable
 * Handles course-related API calls
 */

export const useCourseApi = () => {
  const apiBase = 'http://localhost:3000/api/a'

  /**
   * Get all courses
   */
  const getAllCourses = async (params?: any) => {
    try {
      const response = await $fetch(`${apiBase}/courses`, {
        params
      })
      return response
    } catch (error: any) {
      throw error
    }
  };

  /**
   * Get course detail by slug
   */
  const getDetail = async (slug: string) => {
    try {
      const response = await $fetch(`${apiBase}/courses/${slug}`)
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
    getDetail,
    getCourseBySlug,
    getById,
  };
};