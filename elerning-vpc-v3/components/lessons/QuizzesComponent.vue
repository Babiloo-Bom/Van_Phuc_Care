<template>
  <div class="quiz-container">
    <!-- Quiz Content -->
    <div v-if="quiz" class="quiz-content">
      <div class="w-full mx-auto lg:w-[723px]">
        <div class="grid grid-cols-1 gap-5">
          <div class="w-full text-[#798894] rounded-lg border bg-white border-[#317BC4] lg:px-16 lg:py-8 p-4">
            <div class="flex text-sm font-semibold justify-between items-center mb-1">
              <div>
                Câu hỏi 1
              </div>
              <span>0/10</span>
            </div>
            <div class="mb-4 leading-6 text-sm font-semibold">
              Lorem ipsum dolor sit amet consectetur. Quis pretium fermentum enim varius facilisis feugiat feugiat. Faucibus viverra scelerisque metus scelerisque at. Amet at semper nulla tortor aliquam eget. Nulla nisi quam fermentum ac fermentum. Laoreet nisi lobortis venenatis maecenas et imperdiet. 
            </div>
            <div class="grid grid-cols-1 gap-3 md:gap-[15px]">
              <div
                :class="['border border-[#798894] text-[#798894] font-medium rounded-md flex items-center gap-4 md:px-8 py-2 px-4 cursor-pointer', {'active': false}]"
              >
                <a-radio
                    :value="1"
                    @change="() => {}"
                    class="custom-radio"
                />
                <span class="text-[11px] word-spacing-4 leading-4">
                    Nulla nisi quam fermentum ac fermentum. Laoreet nisi lobortis venenatis maecenas et imperdiet.. Faucibus viverra scelerisque metus scelerisque at. Amet at semper nulla tortor aliquam eget. Nulla nisi quam fermentum ac fermentum. Laoreet nisi lobortis venenatis maecenas et imperdiet. Massa massa est ultrices at odio tempor. 
                </span>
              </div>
              <div
                :class="['border border-[#798894] text-[#798894] font-medium rounded-md flex items-center gap-4 md:px-8 py-2 px-4 cursor-pointer', {'active': false}]"
              >
                <a-radio
                    :value="1"
                    @change="() => {}"
                    class="custom-radio"
                />
                <span class="text-[11px] word-spacing-4 leading-4">
                    Nulla nisi quam fermentum ac fermentum. Laoreet nisi lobortis venenatis maecenas et imperdiet.. Faucibus viverra scelerisque metus scelerisque at. Amet at semper nulla tortor aliquam eget. Nulla nisi quam fermentum ac fermentum. Laoreet nisi lobortis venenatis maecenas et imperdiet. Massa massa est ultrices at odio tempor. 
                </span>
              </div>
              <div
                :class="['border border-[#798894] text-[#798894] font-medium rounded-md flex items-center gap-4 md:px-8 py-2 px-4 cursor-pointer', {'active': false}]"
              >
                <a-radio
                    :value="1"
                    @change="() => {}"
                    class="custom-radio"
                />
                <span class="text-[11px] word-spacing-4 leading-4">
                    Nulla nisi quam fermentum ac fermentum. Laoreet nisi lobortis venenatis maecenas et imperdiet.. Faucibus viverra scelerisque metus scelerisque at. Amet at semper nulla tortor aliquam eget. Nulla nisi quam fermentum ac fermentum. Laoreet nisi lobortis venenatis maecenas et imperdiet. Massa massa est ultrices at odio tempor. 
                </span>
              </div>
              <div
                :class="['border border-[#798894] text-[#798894] font-medium rounded-md flex items-center gap-4 md:px-8 py-2 px-4 cursor-pointer', {'active': true}]"
              >
                <a-radio
                    :value="1"
                    @change="() => {}"
                    class="custom-radio"
                />
                <span class="text-[11px] word-spacing-4 leading-4">
                    Nulla nisi quam fermentum ac fermentum. Laoreet nisi lobortis venenatis maecenas et imperdiet.. Faucibus viverra scelerisque metus scelerisque at. Amet at semper nulla tortor aliquam eget. Nulla nisi quam fermentum ac fermentum. Laoreet nisi lobortis venenatis maecenas et imperdiet. Massa massa est ultrices at odio tempor. 
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <a-spin size="large" />
      <p class="text-gray-600 mt-4">Đang tải quiz...</p>
    </div>

    <!-- No Quiz State -->
    <div v-if="!quiz && !loading" class="text-center py-8">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="fill-none stroke-gray-400">
          <path d="M9 12l2 2 4-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-600 mb-2">Không có quiz</h3>
      <p class="text-gray-500">Bài học này không có quiz để làm.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface QuizQuestion {
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

interface Quiz {
  _id: string
  courseId: string
  chapterId: string
  lessonId: string
  title: string
  description: string
  questions: QuizQuestion[]
  passingScore: number
  timeLimit: number
  attempts: number
}

interface QuizResult {
  passed: boolean
  score: number
  totalPoints: number
  percentage: number
  timeSpent: number
  attemptsLeft: number
}

const props = defineProps<{
  courseId: string
  chapterId: string
  lessonId: string
}>()

const emit = defineEmits<{
  close: []
  completed: [result: QuizResult]
}>()

// State
const quiz = ref<Quiz | null>(null)
const loading = ref(false)
const submitting = ref(false)
const quizCompleted = ref(false)
const quizResult = ref<QuizResult | null>(null)
const questionResults = ref<Record<string, { isCorrect: boolean; points: number }>>({})

// Quiz state
const currentQuestionIndex = ref(0)
const answers = ref<Record<string, string>>({})
const startTime = ref<Date | null>(null)
const timeLeft = ref(0)
const timer = ref<NodeJS.Timeout | null>(null)

// Computed
const currentQuestion = computed(() => {
  return quiz.value?.questions[currentQuestionIndex.value]
})

// Methods
const fetchQuiz = async () => {
  try {
    loading.value = true
    
    const response = await $fetch(`/api/quizzes/course/${props.courseId}/chapter/${props.chapterId}/lesson/${props.lessonId}`)
    
    if (response.success && response.data.quiz) {
      quiz.value = response.data.quiz
      startTime.value = new Date()
      
      // Start timer if time limit exists
      if (quiz.value.timeLimit > 0) {
        timeLeft.value = quiz.value.timeLimit
        startTimer()
      }
    }
  } catch (error) {
    console.error('Error fetching quiz:', error)
  } finally {
    loading.value = false
  }
}

const startTimer = () => {
  timer.value = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      submitQuiz()
    }
  }, 60000) // Update every minute
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < quiz.value!.questions.length - 1) {
    currentQuestionIndex.value++
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const submitQuiz = async () => {
  try {
    submitting.value = true
    stopTimer()
    
    const timeSpent = startTime.value ? Math.floor((new Date().getTime() - startTime.value.getTime()) / 1000) : 0
    
    // Calculate results
    let score = 0
    let totalPoints = 0
    
    quiz.value!.questions.forEach(question => {
      totalPoints += question.points
      const isCorrect = answers.value[question.id] === question.correctAnswer
      const points = isCorrect ? question.points : 0
      score += points
      
      questionResults.value[question.id] = {
        isCorrect,
        points
      }
    })
    
    const percentage = Math.round((score / totalPoints) * 100)
    const passed = percentage >= quiz.value!.passingScore
    
    // Submit to backend
    const response = await $fetch('/api/quizzes/submit', {
      method: 'POST',
      body: {
        quizId: quiz.value!._id,
        courseId: props.courseId,
        chapterId: props.chapterId,
        lessonId: props.lessonId,
        answers: Object.entries(answers.value).map(([questionId, answer]) => ({
          questionId,
          answer
        })),
        timeSpent
      }
    })
    
    if (response.success) {
      quizResult.value = {
        passed,
        score,
        totalPoints,
        percentage,
        timeSpent,
        attemptsLeft: quiz.value!.attempts - (response.data.quizAttempt?.attemptNumber || 1)
      }
      
      quizCompleted.value = true
      emit('completed', quizResult.value)
    }
  } catch (error) {
    console.error('Error submitting quiz:', error)
  } finally {
    submitting.value = false
  }
}

const retakeQuiz = () => {
  // Reset quiz state
  currentQuestionIndex.value = 0
  answers.value = {}
  questionResults.value = {}
  quizCompleted.value = false
  quizResult.value = null
  
  // Restart timer
  startTime.value = new Date()
  if (quiz.value!.timeLimit > 0) {
    timeLeft.value = quiz.value!.timeLimit
    startTimer()
  }
}

const closeQuiz = () => {
  stopTimer()
  emit('close')
}

const getAnswerText = (question: QuizQuestion, answerId: string) => {
  if (question.type === 'fill-in-blank') {
    return answerId || 'Chưa trả lời'
  }
  
  const option = question.options?.find(opt => opt.id === answerId)
  return option?.text || 'Chưa trả lời'
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Lifecycle
onMounted(() => {
  fetchQuiz()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
