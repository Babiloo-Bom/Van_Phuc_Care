/**
 * Course API Composable
 * Handles course-related API calls
 */

export const useCourseApi = () => {
  const config = useRuntimeConfig();
  const apiBase = 'http://localhost:3000/api/a'; // Hardcode for testing
  
  console.log('🔍 Course API Base URL:', apiBase);

  /**
   * Get all courses
   */
  const getAllCourses = async () => {
    try {
      console.log('🔍 Fetching all courses...');
      const response = await $fetch(`${apiBase}/courses`);
      console.log('✅ Courses fetched:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Get courses error:', error);
      throw error;
    }
  };

  /**
   * Get course detail by slug
   */
  const getDetail = async (slug: string) => {
    try {
      console.log('🔍 Fetching course detail for slug:', slug);
      const response = await $fetch(`${apiBase}/courses/${slug}`);
      console.log('✅ Course detail fetched:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Get course detail error:', error);
      throw error;
    }
  };

  /**
   * Get course by slug
   */
  const getCourseBySlug = async (slug: string) => {
    try {
      console.log('🔍 Fetching course by slug:', slug);
      const response = await $fetch(`${apiBase}/courses/${slug}`);
      console.log('✅ Course fetched:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Get course error:', error);
      throw error;
    }
  };

  /**
   * Get course by ID
   */
  const getById = async (id: string) => {
    try {
      console.log('🔍 Fetching course by ID:', id);
      const response = await $fetch(`${apiBase}/courses/id/${id}`);
      console.log('✅ Course fetched by ID:', response);
      return response.data.course;
    } catch (error: any) {
      console.error('❌ Get course by ID error:', error);
      throw error;
    }
  };

  return {
    getAllCourses,
    getDetail,
    getCourseBySlug,
    getById,
  };
};