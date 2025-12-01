/**
 * Course API Composable
 * Handles course-related API calls
 */

export const useCouponApi = () => {
  const { apiUser } = useApiBase()
  const apiUserBase = apiUser

  const getCouponValid = async (courseId: string) => {
    try {
      const response = await $fetch(`${apiUserBase}/coupons/valid`, {
        method: 'POST',
        params: {
          courseId
        }
      })
      return response
    } catch (error: any) {
      throw error
    }
  };

  
  return {
    getCouponValid
  };
};