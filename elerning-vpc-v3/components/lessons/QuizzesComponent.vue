<template>
  <div class="quiz-container">
    <template v-if="!quizResult?.quizCompleted">
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
              :loading="submitLoading"
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
    <template v-if="quizResult?.quizCompleted && isShowQuizResult">
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
                  :class="['border border-[#798894] text-[#798894] font-medium rounded-md flex items-center md:gap-4 gap-3 md:px-8 py-2 px-4 cursor-pointer',
                    {'text-[#DE4841] border-[#DE4841]': getOptionStatus(question.id, option) == 'incorrect'},
                    {'!text-[#34C759] !border-[#34C759]': getOptionStatus(question.id, option) == 'correct'}

                  ]"
                >
                  <svg class="w-[16px]" v-if="getOptionStatus(question.id, option) == 'correct'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="5.5" fill="#34C759" stroke="#34C759"/>
                    <circle cx="10" cy="10" r="9.5" stroke="#34C759"/>
                  </svg>
                  <svg class="w-[16px]" v-else-if="getOptionStatus(question.id, option) == 'incorrect'" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.5" stroke="#DE4841"/>
                  <circle cx="10" cy="10" r="6" fill="#DE4841"/>
                  </svg>

                  <svg class="w-[16px]" v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="9.5" stroke="#798894"/>
                  </svg>

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
                src="../../public/images/awesome_quiz.png"
                alt="store-icon"
                class="w-[128px] h-[128px]"
              />
            </div>
            <div class="text-center text-base font-bold text-black">
              Bạn đã làm rất tốt, cố gắng hơn trong những bài tiếp theo nhé
            </div>
          </div>
          <div class="text-center mt-6">
            <a-button
              type="primary"
              @click="handleCloseModal"
              class="bg-[#317BC4] border-none hover:bg-blue-600 rounded-[62px] h-10 font-semibold px-8 text-white"
            >
              Quay lại bài học
            </a-button>
          </div>
        </div>
      </div>
    </template>
    <!-- Chỉ hiển thị thông báo "đã hoàn thành" khi không ở chế độ review -->
    <div v-if="quizComplete && !props.isReviewMode" class="text-center py-8 w-full bg-white rounded-lg">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="fill-none stroke-gray-400">
          <path d="M9 12l2 2 4-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-600 mb-2">Bài kiểm tra đã hoàn thành</h3>
    </div>
  </div>
  <QuizFinishModal :visible="isVisibleModal" 
    :title="quizResult?.passed ? 'Xin chúc mừng, bạn đã vượt qua bài kiểm tra!!!': 'Rất tiếc, bạn chưa vượt qua bài kiểm tra!!!'"
    :description="quizResult?.passed ? 'Làm tốt lắm, hãy tiếp tục phát huy lần sau nhé!': 'Hãy cố gắng ôn tập kỹ hơn trong lần sau nhé!'"
    :quiz-result="(quizResult as IQuizResult)"
    :on-close="handleCloseModal"
    :on-submit="handleSubmitModal"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import QuizFinishModal from './QuizFinishModal.vue'
import { useQuizStore, type IQuiz, type IQuizResult } from '~/stores/quiz';

const props = defineProps<{
  courseId: string
  chapterId: string
  lessonId: string
  quizComplete: boolean
  isReviewMode?: boolean
}>()
const quizStore = useQuizStore(); 

const emit = defineEmits<{
  close: []
  completed: [result: boolean]
}>()

const quiz = computed<IQuiz | null>(() => quizStore.currentQuiz);
const quizAttempt = computed<any>(() => quizStore.quizAttempt);
const isShowQuizResult = ref<boolean>(false)
const loading = computed<Boolean>(() => quizStore.loading || false);
const submitLoading = computed<Boolean>(() => quizStore.submitLoading || false);
const isVisibleModal = ref<boolean>(false)

const quizResult = computed<IQuizResult | null>(() => quizStore.quizResult);

const answers = computed<Record<string, string>>(() => quizStore.answers);


const startTime = ref<Date | null>(null)
const timeLeft = ref(0)
const timer = ref<any>(null)

const handleCloseModal = () => {
  isVisibleModal.value = false;
  emit('completed', true)
}
const handleSubmitModal = () => {
  isVisibleModal.value = false;
  isShowQuizResult.value = true;
}
const getOptionStatus = (questionId: string, option: any) =>{
  const userAns = quizAttempt?.value?.answers.find((a: any) => a.questionId === questionId);
  if (option.isCorrect) return 'correct'
  if (userAns && userAns.answer ==option.id  && !option.isCorrect) {
    return 'incorrect'
  }
  return ''
}
// Methods
const init = async () => {
  quizStore.resetState()
  await quizStore.fetchQuiz({
    courseId: props.courseId,
    chapterId: props.chapterId,
    lessonId: props.lessonId,
  })
  
  // Ở chế độ review, nếu quiz đã hoàn thành thì tự động hiển thị kết quả
  // Đợi một chút để đảm bảo quizResult đã được set
  await nextTick()
  if (props.isReviewMode && props.quizComplete && quizResult.value?.quizCompleted) {
    isShowQuizResult.value = true
  }
}

const handleChoose = (questionId: string, answerId: string) => {
  quizStore.setAnswers(questionId, answerId)
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
  stopTimer()
  const timeSpent = startTime.value ? Math.floor((new Date().getTime() - startTime.value.getTime()) / 1000) : 0
  await quizStore.submitQuiz({
    courseId: props.courseId,
    chapterId: props.chapterId,
    lessonId: props.lessonId,
    answers: answers.value,
    timeSpent
  })
}
watch(quizResult,
  (value) => {
    if(!value) return;
    if (value.quizCompleted) {
      // Ở chế độ review, tự động hiển thị kết quả thay vì hiển thị modal
      if (props.isReviewMode) {
        isShowQuizResult.value = true;
      } else {
        isVisibleModal.value = true;
      }
    }
  } 
)
watch(
  quiz,
  (cQuiz: any) => {
    if (
      !cQuiz ||
      !cQuiz._id ||
      timer.value !== null
    )
      return;

    startTime.value = new Date()
    if (quiz?.value && quiz?.value?.timeLimit > 0) {
      timeLeft.value = quiz.value.timeLimit
      startTimer()
    }
  },
  { immediate: false }
);

// Lifecycle
onMounted(() => {
  init()
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
