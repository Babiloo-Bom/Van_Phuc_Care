/**
 * Course API Composable
 * Handles course-related API calls
 */

import { useApiBase } from "./useApiBase";
import { useAuthStore } from "~/stores/auth";

export const useQuizApi = () => {
  const { apiAdmin, apiUser } = useApiBase()
  const apiBase = apiAdmin
  const apiBaseUser = apiUser

  /**
   * Get quiz detail by id
   */
  const getQuizz = async ({
    courseId,
    chapterId,
    lessonId
  }: {courseId: string, chapterId: string, lessonId: string}) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.token && process.client) {
        await authStore.initAuth()
      }
      const response = await $fetch(`${apiBase}/quizzes/course/${courseId}/chapter/${chapterId}/lesson/${lessonId}`, {
        headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : undefined,
      })
      return response
    } catch (error: any) {
      throw error
    }
  };

  /**
   * Submit quiz answers
   */
  const submitQuiz = async ({
    quizId,
    courseId,
    chapterId,
    lessonId,
    answers,
    timeSpent
  }: {quizId: string, courseId: string, chapterId: string, lessonId: string, answers: any, timeSpent: number}) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.token && process.client) {
        await authStore.initAuth()
      }
      const response = await $fetch(`${apiBaseUser}/quizzes/submit`, {
        method: 'POST',
        headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : undefined,
        body: {
          quizId,
          courseId,
          chapterId,
          lessonId,
          answers,
          timeSpent
        }
      })
      return response
    } catch (error: any) {
      throw error
    }
  }

  return {
    getQuizz,
    submitQuiz
  };
};