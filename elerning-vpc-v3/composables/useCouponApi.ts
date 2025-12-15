/**
 * Course API Composable
 * Handles course-related API calls
 */

import { useApiBase } from "./useApiBase";
import { useAuthStore } from "~/stores/auth";

export const useCouponApi = () => {
  const { apiUser } = useApiBase()
  const apiUserBase = apiUser

  const getCouponValid = async (courseId: string) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.token && process.client) {
        await authStore.initAuth()
      }
      const response = await $fetch(`${apiUserBase}/coupons/valid`, {
        method: 'POST',
        headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : undefined,
        params: { courseId }
      })
      return response
    } catch (error: any) {
      throw error
    }
  };

  const createCompletionCoupon = async (courseId: string) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.token && process.client) {
        await authStore.initAuth()
      }
      const response = await $fetch(`${apiUserBase}/coupons/completion`, {
        method: 'POST',
        headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : undefined,
        body: { courseId }
      })
      return response
    } catch (error: any) {
      throw error
    }
  };
 
  return {
    getCouponValid,
    createCompletionCoupon
  };
};