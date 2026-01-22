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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '~/stores/courses'
import { useAuthStore } from '~/stores/auth'

interface Props {
  chapter: any
  chapterIndex: number
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
  
  // Kiểm tra lesson đầu tiên của chapter
  const firstLesson = props.chapter?.lessons?.[0]
  if (!firstLesson) return true
  
  // Nếu chưa mua, chỉ cho phép bài preview
  return !firstLesson?.isPreview || firstLesson?.isLocked || false
})

// Kiểm tra chapter có quiz không (chỉ tìm lesson có type='quiz')
const hasQuiz = computed(() => {
  if (!props.chapter?.lessons) return false
  
  // Chỉ tìm lesson có type='quiz'
  return props.chapter.lessons.some((lesson: any) => lesson?.type === 'quiz')
})

// Tìm quiz trong chapter từ quiz lesson gần nhất sau lesson hiện tại
const chapterQuiz = computed(() => {
  if (!props.chapter?.lessons) return null
  
  // Lấy lesson index hiện tại từ route query
  const currentLessonIndex = parseInt(route.query.lesson as string) || 0
  
  // Tìm quiz lesson đầu tiên sau lesson hiện tại
  for (let i = currentLessonIndex + 1; i < props.chapter.lessons.length; i++) {
    if (props.chapter.lessons[i]?.type === 'quiz') {
      return props.chapter.lessons[i].quiz || null
    }
  }
  
  // Nếu không tìm thấy quiz sau lesson hiện tại, tìm quiz đầu tiên trong chapter
  const firstQuizLesson = props.chapter.lessons.find((lesson: any) => lesson?.type === 'quiz')
  
  if (!firstQuizLesson) return null
  
  // Trả về quiz object từ lesson
  return firstQuizLesson.quiz || null
})

// Tìm lesson index có quiz gần nhất ngay sau lesson hiện tại trong cùng chapter
const quizLessonIndex = computed(() => {
  if (!props.chapter?.lessons) return 0
  
  // Lấy lesson index hiện tại từ route query
  const currentLessonIndex = parseInt(route.query.lesson as string) || 0
  
  // Tìm quiz lesson đầu tiên sau lesson hiện tại
  for (let i = currentLessonIndex + 1; i < props.chapter.lessons.length; i++) {
    if (props.chapter.lessons[i]?.type === 'quiz') {
      return i
    }
  }
  
  // Nếu không tìm thấy quiz sau lesson hiện tại, tìm quiz đầu tiên trong chapter
  const firstQuizIndex = props.chapter.lessons.findIndex((lesson: any) => lesson?.type === 'quiz')
  
  return firstQuizIndex >= 0 ? firstQuizIndex : 0
})

// Lấy thông tin quiz
const quizInfo = computed(() => {
  const quiz = chapterQuiz.value
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
const handleStartQuiz = () => {
  // Nếu chưa mua/hoàn thành và bài bị lock → redirect về trang chi tiết
  if (!isPurchasedOrCompleted.value && isLocked.value) {
    router.push(`/courses/${props.courseSlug}?showPurchaseModal=true`)
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
  
  router.push({
    path: `/my-learning/${props.courseSlug}`,
    query: queryParams
  })
}
</script>

<style scoped>
/* Additional styles if needed */
</style>

