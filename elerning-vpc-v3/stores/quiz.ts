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
  percentage: number
  attemptsLeft: number
}

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    anwsers: {} as Record<string, string>, 
    
    currentQuiz: null as IQuiz | null,
    // Loading states
    loading: false,
    submitLoading: false,
    quizResult: null as IQuizResult | null
  }),

  getters: {
    currentQuiz: state => state.currentQuiz,

    loading: state => state.loading,

    submitLoading: state => state.submitLoading,

    quizResult: state => state.quizResult,

    anwsers: state => state.anwsers,
  },

  actions: {
    setCurrentQuiz(quiz: IQuiz) {
      this.currentQuiz = quiz;
    },
    setAnwsers(questionId: string, answerId: string){
      this.answers[questionId] = answerId;
    },
    async fetchQuiz(params?: any) {
      this.loading = true;
      try {
        const quizApi = useQuizApi()
        const response: any = await quizApi.getQuizz(params)
        if (response.data && response.data.quiz) {
          this.currentQuiz = response.data.quiz ||  null
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
        const quizApi = useQuizApi()
        const response: any = await quizApi.submitQuiz({
          quizId: this.currentQuiz._id,
          ...params
        })
        if (response.data) {
          this.quizResult = {
            quizCompleted: true,
            passed: response.data.quizAttempt?.passed,
            score: response.data.quizAttempt?.score,
            percentage: response.data.quizAttempt?.percentage,
            attemptsLeft: this.currentQuiz.attempts - (response.data.quizAttempt?.attemptNumber || 1)
          }
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
      this.anwsers = {}
      this.quizResult = null;
    },
  },
});

