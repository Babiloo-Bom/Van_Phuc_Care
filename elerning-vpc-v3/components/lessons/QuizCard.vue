<template>
  <div 
    v-if="hasQuiz"
    class="bg-white rounded-lg border border-gray-200 p-4 md:p-6 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
  >
    <!-- Left: Icon and Info -->
    <div class="flex items-center gap-4 flex-1 min-w-0">
      <!-- Icon -->
      <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#15CF74" stroke-width="2" fill="none"/>
          <path d="M12 6V12L16 14" stroke="#15CF74" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <!-- Text Info -->
      <div class="flex-1 min-w-0">
        <h3 class="text-base md:text-lg font-bold text-gray-900 mb-1">
          Trắc nghiệm
        </h3>
        <p class="text-sm text-gray-600">
          {{ quizInfo }}
        </p>
      </div>
    </div>
    
    <!-- Right: Button -->
    <div class="flex-shrink-0">
      <a-button
        @click="handleStartQuiz"
        :disabled="isLocked"
        :type="isLocked ? 'default' : 'primary'"
        class="!flex items-center gap-2"
      >
        <svg 
          v-if="!isLocked"
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          class="flex-shrink-0"
        >
          <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
        </svg>
        <span>Làm bài ngay</span>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '~/stores/courses'
import { useAuthStore } from '~/stores/auth'

interface Props {
  lesson: any
  chapterIndex: number
  lessonIndex: number
  courseSlug: string
}

const props = defineProps<Props>()

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()
const authStore = useAuthStore()

const course = computed(() => coursesStore.course)

// Kiểm tra xem user đã mua hoặc đã hoàn thành khóa học chưa
const isPurchasedOrCompleted = computed(() => {
  if (!course.value) return false
  const courseId = course.value._id?.toString()
  
  return (
    course.value.isPurchased === true ||
    course.value.progress?.isCompleted === true ||
    (courseId && authStore.user?.courseRegister?.includes(courseId)) ||
    (courseId && authStore.user?.courseCompleted?.includes(courseId))
  )
})

// Kiểm tra bài có bị lock không (kiểm tra lesson đầu tiên của chapter)
const isLocked = computed(() => {
  if (!course.value) return true
  
  // Nếu đã mua hoặc đã hoàn thành, không lock
  if (isPurchasedOrCompleted.value) return false
  
  // Kiểm tra lesson hiện tại
  if (!props.lesson) return true

  // Nếu chưa mua, chỉ cho phép bài preview
  return !props.lesson?.isPreview || props.lesson?.isLocked || false
})

// Kiểm tra lesson hiện tại có quiz không
const hasQuiz = computed(() => {
  // Kiểm tra lesson có showQuiz=true và có quiz data
  return props.lesson?.showQuiz === true && !!props.lesson?.quiz
})

// Lấy quiz trực tiếp từ lesson hiện tại
const lessonQuiz = computed(() => {
  return props.lesson?.quiz || null
})

// Lesson index của quiz chính là lesson hiện tại
const quizLessonIndex = computed(() => {
  return props.lessonIndex
})

// Lấy thông tin quiz
const quizInfo = computed(() => {
  const quiz = lessonQuiz.value
  if (quiz && typeof quiz === 'object') {
    const questionCount = quiz.questions?.length || 0
    // Tính tổng điểm từ các câu hỏi
    const totalPoints = quiz.questions?.reduce((sum: number, q: any) => {
      return sum + (q.points || 0)
    }, 0) || 0
    return `${questionCount} câu / ${totalPoints} điểm`
  }
  return '0 câu / 0 điểm'
})

// Xử lý click nút "Làm bài ngay"
const handleStartQuiz = async () => {
  // Nếu chưa mua/hoàn thành và bài bị lock → redirect về trang chi tiết
  if (!isPurchasedOrCompleted.value && isLocked.value) {
    await router.push(`/courses/${props.courseSlug}?showPurchaseModal=true`)
    nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
    return
  }
  
  // Navigate đến quiz với query params (dùng lesson index có quiz)
  const queryParams: any = {
    chapter: props.chapterIndex.toString(),
    lesson: quizLessonIndex.value.toString(),
    quiz: 'true'
  }
  
  // Giữ lại review nếu đang ở chế độ review
  if (route.query.review === 'true') {
    queryParams.review = 'true'
  }
  
  await router.push({
    path: `/my-learning/${props.courseSlug}`,
    query: queryParams
  })
  // Cuộn lên đầu trang (cả mobile và desktop) sau khi chuyển sang màn hình quiz
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}
</script>

<style scoped>
/* Additional styles if needed */
</style>

