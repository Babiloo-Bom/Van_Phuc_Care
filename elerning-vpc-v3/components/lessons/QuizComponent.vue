<template>
  <div class="quiz-container">
    <!-- Quiz Header -->
    <div class="quiz-header bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-2xl font-bold text-gray-800">{{ quiz?.title }}</h3>
        <div class="flex items-center gap-4">
          <div v-if="quiz?.timeLimit > 0" class="flex items-center gap-2 text-orange-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
              <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
              <path d="M12 6v6l4 2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-semibold">{{ timeLeft }} phút</span>
          </div>
          <div class="text-sm text-gray-600">
            Câu {{ currentQuestionIndex + 1 }} / {{ quiz?.questions?.length }}
          </div>
        </div>
      </div>
      
      <p class="text-gray-600 mb-4">{{ quiz?.description }}</p>
      
      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-primary-100 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${((currentQuestionIndex + 1) / quiz?.questions?.length) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Quiz Content -->
    <div v-if="quiz && !quizCompleted" class="quiz-content">
      <!-- Question -->
      <div class="question-card bg-white rounded-lg shadow-sm p-6 mb-6">
        <h4 class="text-xl font-semibold text-gray-800 mb-4">
          {{ currentQuestion.question }}
        </h4>
        
        <!-- Multiple Choice -->
        <div v-if="currentQuestion.type === 'multiple-choice'" class="space-y-3">
          <label 
            v-for="option in currentQuestion.options" 
            :key="option.id"
            class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            :class="{ 'border-primary-100 bg-primary-50': answers[currentQuestion.id] === option.id }"
          >
            <input 
              type="radio" 
              :name="`question_${currentQuestion.id}`"
              :value="option.id"
              v-model="answers[currentQuestion.id]"
              class="mr-3 text-primary-100"
            />
            <span class="text-gray-700">{{ option.text }}</span>
          </label>
        </div>

        <!-- True/False -->
        <div v-else-if="currentQuestion.type === 'true-false'" class="space-y-3">
          <label 
            v-for="option in currentQuestion.options" 
            :key="option.id"
            class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            :class="{ 'border-primary-100 bg-primary-50': answers[currentQuestion.id] === option.id }"
          >
            <input 
              type="radio" 
              :name="`question_${currentQuestion.id}`"
              :value="option.id"
              v-model="answers[currentQuestion.id]"
              class="mr-3 text-primary-100"
            />
            <span class="text-gray-700">{{ option.text }}</span>
          </label>
        </div>

        <!-- Fill in the blank -->
        <div v-else-if="currentQuestion.type === 'fill-in-blank'" class="space-y-3">
          <a-input
            v-model:value="answers[currentQuestion.id]"
            placeholder="Nhập câu trả lời của bạn..."
            class="w-full"
          />
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between items-center">
        <a-button 
          v-if="currentQuestionIndex > 0"
          @click="previousQuestion"
          class="!border-gray-300 !text-gray-700"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
              <path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
          Câu trước
        </a-button>
        
        <div v-else></div>

        <a-button 
          v-if="currentQuestionIndex < quiz.questions.length - 1"
          type="primary"
          @click="nextQuestion"
          :disabled="!answers[currentQuestion.id]"
        >
          Câu tiếp
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
              <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
        </a-button>

        <a-button 
          v-else
          type="primary"
          @click="submitQuiz"
          :disabled="!answers[currentQuestion.id]"
          :loading="submitting"
        >
          Nộp bài
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
              <path d="M9 12l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
        </a-button>
      </div>
    </div>

    <!-- Quiz Results -->
    <div v-if="quizCompleted" class="quiz-results bg-white rounded-lg shadow-sm p-6">
      <div class="text-center mb-6">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
             :class="quizResult.passed ? 'bg-green-100' : 'bg-red-100'">
          <svg v-if="quizResult.passed" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" class="fill-none stroke-green-600">
            <path d="M9 12l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" class="fill-none stroke-red-600">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <path d="M15 9l-6 6M9 9l6 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <h3 class="text-2xl font-bold mb-2"
            :class="quizResult.passed ? 'text-green-600' : 'text-red-600'">
          {{ quizResult.passed ? 'Chúc mừng! Bạn đã vượt qua bài quiz!' : 'Bạn cần làm lại để vượt qua!' }}
        </h3>
        
        <div class="text-lg text-gray-600 mb-4">
          Điểm số: {{ quizResult.score }}/{{ quizResult.totalPoints }} ({{ quizResult.percentage }}%)
        </div>
        
        <div class="text-sm text-gray-500">
          Thời gian hoàn thành: {{ formatTime(quizResult.timeSpent) }}
        </div>
      </div>

      <!-- Question Review -->
      <div class="space-y-4">
        <h4 class="text-lg font-semibold text-gray-800 mb-4">Xem lại câu trả lời:</h4>
        
        <div v-for="(question, index) in quiz.questions" :key="question.id" 
             class="border border-gray-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold"
                 :class="questionResults[question.id]?.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
              {{ index + 1 }}
            </div>
            
            <div class="flex-1">
              <p class="font-medium text-gray-800 mb-2">{{ question.question }}</p>
              
              <div class="space-y-2">
                <div class="text-sm">
                  <span class="font-medium text-gray-600">Câu trả lời của bạn: </span>
                  <span :class="questionResults[question.id]?.isCorrect ? 'text-green-600' : 'text-red-600'">
                    {{ getAnswerText(question, answers[question.id]) }}
                  </span>
                </div>
                
                <div v-if="!questionResults[question.id]?.isCorrect" class="text-sm">
                  <span class="font-medium text-gray-600">Đáp án đúng: </span>
                  <span class="text-green-600">{{ getAnswerText(question, question.correctAnswer) }}</span>
                </div>
                
                <div v-if="question.explanation" class="text-sm text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                  <span class="font-medium">Giải thích: </span>{{ question.explanation }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center gap-4 mt-6">
        <a-button 
          v-if="!quizResult.passed && quizResult.attemptsLeft > 0"
          type="primary"
          @click="retakeQuiz"
          :loading="loading"
        >
          Làm lại ({{ quizResult.attemptsLeft }} lần còn lại)
        </a-button>
        
        <a-button @click="closeQuiz" class="!border-gray-300 !text-gray-700">
          Đóng
        </a-button>
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
  chapterIndex: number
  lessonIndex: number
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
  chapterIndex: number
  lessonIndex: number
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
    
    const response = await $fetch(`/api/quizzes/course/${props.courseId}/chapter/${props.chapterIndex}/lesson/${props.lessonIndex}`)
    
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
        chapterIndex: props.chapterIndex,
        lessonIndex: props.lessonIndex,
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
