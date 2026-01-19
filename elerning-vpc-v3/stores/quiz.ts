import { defineStore } from 'pinia';

export interface IQuizQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank'
  options?: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
  correctAnswer: string
  explanation: string
  points: number
}

export interface IQuiz {
  _id: string
  courseId: string
  chapterId: string
  lessonId: string
  title: string
  description: string
  questions: IQuizQuestion[]
  passingScore: number
  timeLimit: number
  attempts: number
}

export interface IQuizResult {
  quizCompleted: boolean
  passed: boolean
  score: number
  totalPoints: number
  percentage: number
  attemptsLeft: number
}

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    answers: {} as Record<string, string>, 
    
    currentQuiz: null as IQuiz | null,
    // Loading states
    loading: false,
    submitLoading: false,
    quizResult: null as IQuizResult | null,
    quizAttempt: null as any
  }),

  getters: {
    getCurrentQuiz: state => state.currentQuiz,

    getLoading: state => state.loading,

    getSubmitLoading: state => state.submitLoading,

    getQuizResult: state => state.quizResult,
    
    getQuizAttempt: state => state.quizAttempt,

    getAnswers: state => state.answers,
  },

  actions: {
    setCurrentQuiz(quiz: IQuiz) {
      this.currentQuiz = quiz;
    },
    setAnswers(questionId: string, answerId: string){
      this.answers[questionId] = answerId;
    },
    async fetchQuiz(params?: any) {
      this.loading = true;
      // Reset currentQuiz trước khi fetch để tránh hiển thị quiz cũ
      this.currentQuiz = null
      try {
        const quizApi = useQuizApi()
        const response: any = await quizApi.getQuizz(params)
        if (response.data && response.data.quiz) {
          const quizData = response.data.quiz
          // Kiểm tra nếu quiz không có câu hỏi hoặc câu hỏi rỗng, set currentQuiz = null
          if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
            this.currentQuiz = null
          } else {
            this.currentQuiz = quizData
          }
        } else {
          this.currentQuiz = null
        }
      } catch (error) {
        this.currentQuiz = null
      } finally {
        this.loading = false;
      }
    },

    async submitQuiz(params?: any) {
      this.submitLoading = true;
      try {
        if (!this.currentQuiz?._id) return
        const quizApi = useQuizApi()
        const response: any = await quizApi.submitQuiz({
          quizId: this.currentQuiz._id,
          ...params,
          answers: Object.entries(params?.answers).map(([questionId, answer]) => ({
            questionId,
            answer
          }))
        })
        if (response.data) {
          this.quizAttempt = response?.data?.quizAttempt
          // Tính totalPoints từ số câu hỏi trong quiz hoặc từ response
          const totalPoints = this.currentQuiz?.questions?.length || 
                            response?.data?.quizAttempt?.totalPoints || 
                            response?.data?.quizAttempt?.answers?.length || 
                            0
          const quizResultData = {
            quizCompleted: true,
            totalPoints: totalPoints,
            passed: response.data.quizAttempt?.passed || false,
            score: response.data.quizAttempt?.score || 0,
            percentage: response.data.quizAttempt?.percentage || 0,
            attemptsLeft: this.currentQuiz.attempts - (response.data.quizAttempt?.attemptNumber || 1)
          }
          this.quizResult = quizResultData
          return this.quizResult;
        }
      } catch (error) {
        this.quizResult = null
      } finally {
        this.submitLoading = false;
      }
    },
    // Reset state
    resetState() {
      this.submitLoading = false;
      this.loading = false;
      this.currentQuiz = null;
      this.quizAttempt = null;
      this.answers = {}
      this.quizResult = null;
    },
  },
});

