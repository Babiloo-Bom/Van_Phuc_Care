/**
 * Course API Composable
 * Handles course-related API calls
 */

export const useCouponApi = () => {
  const apiUserBase = 'http://localhost:3000/api/u'

  const getUserCoupons = async () => {
    try {
      const response = await $fetch(`${apiUserBase}/coupons/list`, {
        method: 'GET'
      })
      return response
    } catch (error: any) {
      throw error
    }
  };

  
  return {
    getUserCoupons
  };
};