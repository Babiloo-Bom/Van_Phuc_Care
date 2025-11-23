import { defineStore } from 'pinia';

export interface Quiz {
  _id: string
  title: string
  description: string
  questions: Array<{
    question: string
    options: Array<{
      id: string
      text: string
      isCorrect: boolean
    }>
    correctAnswer: string
    explanation: string
    points: number
  }>
  passingScore: number
  timeLimit: number
  attempts: number
}

export const useQuizzesStore = defineStore('quizzes', {
  state: () => ({
    // Chi tiết quiz hiện tại
    quiz: null as Quiz | null,

    // Loading states
    loading: false,

    answers: {} as Record<string, string>, // Lưu trữ câu trả lời của người dùng
  }),

  getters: {
    totalQuestions(state): number {
      return state.quiz ? state.quiz.questions.length : 0;
    },
    quiz: (state) => state.quiz,
    answers: (state) => state.answers,
  },

  actions: {
    setQuiz(quiz: Quiz) {
      this.quiz = quiz;
    },
    // Lấy chi tiết khóa học
    async fetchDetail(courseId: string, chapterId: string, lessonId: string) {
      this.loading = true;
      try {
        const quizApi = useQuizApi()
        const response: any = await quizApi.getQuizz(courseId, chapterId, lessonId)
        this.quiz = response.data?.quiz || response.data || response.quiz || response
      } catch (error) {
        throw error
      } finally {
        this.loading = false;
      }
    },

    // Lấy đánh giá
    async submitQuiz(params: { courseId: string; chapterId: string; lessonId: string; answers: Record<string, string> }) {
      try {
        const quizApi = useQuizApi()
        const response: any = await quizApi.submitQuiz(params.courseId, params.chapterId, params.lessonId, params.answers)
        this.quiz = response.data?.quiz || response.data || response.quiz || response
      } catch (error) {
        throw error
      }
    },
    // Reset state
    resetState() {
      this.quiz = null;
      this.loading = false;
      this.answers = {};
    },
  },
});

