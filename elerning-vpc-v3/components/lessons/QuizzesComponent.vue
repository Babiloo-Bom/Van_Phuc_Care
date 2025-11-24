<template>
  <div class="quiz-container">
    <template v-if="!quizComplete">
      <!-- Quiz Content -->
      <div v-if="quiz && quiz?.questions.length > 0" class="quiz-content">
        <div class="w-full mx-auto lg:w-[723px]">
          <div class="grid grid-cols-1 gap-5">
            <div v-for="(question, index) in quiz.questions" class="w-full text-[#798894] rounded-lg border bg-white border-[#317BC4] lg:px-16 lg:py-8 p-4">
              <div class="flex text-sm font-semibold justify-between items-center mb-1">
                <div>
                  Câu hỏi {{ index + 1 }}
                </div>
                <span>{{ index + 1 }}/{{ quiz.questions.length }}</span>
              </div>
              <div class="mb-4 leading-6 text-sm font-semibold">
                {{ question.question }}
              </div>
              <div v-if="question.options && question.options.length > 0" class="grid grid-cols-1 gap-3 md:gap-[15px]">
                <div
                  v-for="option in question.options"
                  :key="option.id"
                  @click="() => handleChoose(question.id, option.id)"
                  :class="['border border-[#798894] text-[#798894] font-medium rounded-md flex items-center md:gap-4 gap-3 md:px-8 py-2 px-4 cursor-pointer', {'active': answers[question.id] === option.id}]"
                >
                  <a-radio
                    :value="option.id"
                    :checked="answers[question.id] === option.id"
                    @change="() => handleChoose(question.id, option.id)"
                    class="custom-radio"
                  />
                  <span class="text-[11px] word-spacing-4 leading-4">
                    {{ option.text }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col mt-7 gap-3">
            <div class="flex justify-center">
              <img
                src="../../public/images/good-job1.png"
                alt="store-icon"
                class="w-[128px] h-[128px]"
              />
            </div>
            <div class="text-center text-base font-bold text-black">
              Bài kiểm tra đã hoàn thành, kiểm tra kết quả ngay chứ?
            </div>
          </div>
          <div class="text-center mt-6">
            <a-button
              type="primary"
              :loading="submitting"
              :disabled="Object.keys(answers).length < quiz.questions.length"
              @click="submitQuiz"
              class="bg-[#317BC4] border-none hover:bg-blue-600 rounded-[62px] h-10 font-semibold px-8 text-white"
            >
              Gửi bài kiểm tra
            </a-button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <a-spin size="large" />
        <p class="text-gray-600 mt-4">Đang tải quiz...</p>
      </div>

      <!-- No Quiz State -->
      <div v-if="!quiz && !loading" class="text-center py-8 w-full mx-auto lg:w-[723px] bg-white rounded-lg">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="fill-none stroke-gray-400">
            <path d="M9 12l2 2 4-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-600 mb-2">Không có quiz</h3>
        <p class="text-gray-500">Bài học này không có quiz để làm.</p>
      </div>
    </template>
    <div v-if="quizComplete" class="text-center py-8 w-full bg-white rounded-lg">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="fill-none stroke-gray-400">
          <path d="M9 12l2 2 4-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-600 mb-2">Bài kiểm tra đã hoàn thành</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'

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
  percentage: number
  timeSpent: number
  attemptsLeft: number
}

const props = defineProps<{
  courseId: string
  chapterId: string
  lessonId: string
  quizComplete: boolean
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

// Quiz state
const answers = ref<Record<string, string>>({})
const startTime = ref<Date | null>(null)
const timeLeft = ref(0)
const timer = ref<NodeJS.Timeout | null>(null)

// Methods
const fetchQuiz = async () => {
  try {
    loading.value = true
    const quizApi = useQuizApi()
    const response = await quizApi.getQuizz(props.courseId, props.chapterId, props.lessonId)
    console.log('Quiz fetch response:', response)

    if (response.data && response.data.quiz) {
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
const handleChoose = (questionId: string, answerId: string) => {
  answers.value[questionId] = answerId
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

const submitQuiz = async () => {
  try {
    submitting.value = true
    stopTimer()
    const quizApi = useQuizApi()
    const timeSpent = startTime.value ? Math.floor((new Date().getTime() - startTime.value.getTime()) / 1000) : 0
    // Submit to backend
    const response = await quizApi.submitQuiz(
      quiz.value!._id,
      props.courseId,
      props.chapterId,
      props.lessonId,
      Object.entries(answers.value).map(([questionId, answer]) => ({
        questionId,
        answer
      })),
      timeSpent
    )
    
    if (response.data) {
      console.log(response.data)
      quizResult.value = {
        passed: response.data.quizAttempt?.passed,
        score: response.data.quizAttempt?.score,
        percentage: response.data.quizAttempt?.percentage,
        timeSpent,
        attemptsLeft: quiz.value!.attempts - (response.data.quizAttempt?.attemptNumber || 1)
      }
      console.log(quizResult.value)
      quizCompleted.value = true
      if (quizResult.value.passed) {
        message.success('Bạn đã vượt qua bài kiểm tra!')
      } else {
        message.error('Bạn chưa vượt qua bài kiểm tra.')
      }
      emit('completed', quizResult.value)
    }
  } catch (error) {
    message.error(error.message || 'Có lỗi xảy ra khi nộp bài')
  } finally {
    submitting.value = false
  }
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
  margin: 0 auto;
}
.active {
  border-color: #1890FF;
  color: #1890FF;
}
.custom-radio {
  margin-right: 0 !important;
}
</style>
