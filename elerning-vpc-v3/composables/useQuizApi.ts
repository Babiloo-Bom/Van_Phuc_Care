/**
 * Course API Composable
 * Handles course-related API calls
 */

export const useQuizApi = () => {
  const apiBase = 'http://localhost:3000/api/a'
  const apiBaseUser = 'http://localhost:3000/api/u'

  /**
   * Get quiz detail by id
   */
  const getQuizz = async ({
    courseId,
    chapterId,
    lessonId
  }: {courseId: string, chapterId: string, lessonId: string}) => {
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
  const submitQuiz = async ({
    quizId,
    courseId,
    chapterId,
    lessonId,
    answers,
    timeSpent
  }: {quizId: string, courseId: string, chapterId: string, lessonId: string, answers: any, timeSpent: number}) => {
    try {
      const response = await $fetch(`${apiBaseUser}/quizzes/submit`, {
        method: 'POST',
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