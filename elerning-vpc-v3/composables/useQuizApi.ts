/**
 * Course API Composable
 * Handles course-related API calls
 */

export const useQuizApi = () => {
  const apiBase = 'http://localhost:3000/api/a'

  /**
   * Get quiz detail by id
   */
  const getQuizz = async (courseId: string, chapterId: string, lessonId: string) => {
    try {
      const response = await $fetch(`${apiBase}/quizzes/course/${courseId}/chapter/${chapterId}/lesson/${lessonId}`)
      return response
    } catch (error: any) {
      throw error
    }
  };

  /**
   * Submit quiz answers
   */
  const submitQuiz = async (courseId: string, chapterId: string, lessonId: string, answers: any) => {
    try {
      const response = await $fetch(`${apiBase}/quizzes/submit`, {
        method: 'POST',
        body: {
          courseId,
          chapterId,
          lessonId,
          answers
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