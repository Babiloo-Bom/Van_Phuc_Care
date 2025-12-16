<template>
  <div class="nav-course">
    <a-collapse
      v-model:activeKey="activeKey"
      expand-icon-position="right"
      :bordered="false"
    >
      <template #expandIcon="{ isActive }">
        <div class="expand-icon-container absolute top-1 right-4 w-3 h-3">
          <!-- Plus icon khi collapsed -->
          <img 
            v-if="!isActive" 
            src="../../public/images/svg/plus.svg" 
            alt="plus" 
            class="expand-icon"
            width="12"
            height="12"
          />
          <!-- X icon khi expanded -->
          <img 
            v-if="isActive" 
            src="../../public/images/svg/close.svg" 
            alt="close" 
            width="12"
            height="12"
            class="expand-icon"
          />
        </div>
      </template>
      <a-collapse-panel
        v-for="(chapter, chapterIndex) in chapters"
        :key="`chapter_${chapterIndex}`"
        class="nav-chapter-panel !rounded-lg shadow-lg p-4 md:p-8"
      >
        <template #header>
          <div class="chapter-header border-b border-[#ACD7F9] pb-2" @click.stop="handlePanelClick(chapterIndex, $event)">
            <div class="chapter-title">
             Bài {{ chapterIndex + 1 }}: {{ chapter.title }}
            </div>
            <div class="chapter-lesson-count">
              {{ getTotalLessons(chapter) }} Lesson
            </div>
          </div>
        </template>
        <div class="flex flex-col">
          <template v-for="(lesson, lessonIndex) in chapter.lessons" :key="`lesson_${chapterIndex}_${lessonIndex}`">
            <!-- Lesson Item -->
            <div 
              class="flex items-center gap-3 py-3 lesson-item border-b border-dotted border-gray-300"
            >
              <!-- Icon section -->
              <div class="lesson-icon-container">
                <template v-if="!hasQuiz(lesson)">
                  <!-- Checkmark icon nếu đã hoàn thành -->
                  <svg
                    v-if="lesson.isCompleted"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 14 14"
                    fill="none"
                    class="lesson-icon lesson-icon-completed"
                  >
                    <circle
                      cx="7"
                      cy="7"
                      r="7"
                      fill="#15CF74"
                    />
                    <path
                      d="M4 7.005L5.892 8.9L9.79 5"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="square"
                    />
                  </svg>
                  <!-- Radio button nếu chưa hoàn thành -->
                  <div 
                    v-else 
                    class="lesson-icon lesson-icon-pending"
                  ></div>
                </template>
                <template v-else>
                  <div class="quiz-icon-container">
                    <svg v-if="!lesson?.isCompleted" width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.1628 13.5H2.38759C1.3451 13.5 0.499993 12.7725 0.5 11.875L0.500073 2.125C0.50008 1.22753 1.34519 0.5 2.38767 0.5H10.8821C11.9246 0.5 12.7697 1.22754 12.7697 2.125V6.59377M8.9945 11.1979L10.7248 12.6875L14.5 9.43739M3.8036 3.75001H9.4664M3.8036 6.18752H9.4664M3.8036 8.62502H6.635" stroke="#798894" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.1628 13.5H2.38759C1.3451 13.5 0.499993 12.7725 0.5 11.875L0.500073 2.125C0.50008 1.22753 1.34519 0.5 2.38767 0.5H10.8821C11.9246 0.5 12.7697 1.22754 12.7697 2.125V6.59377M8.9945 11.1979L10.7248 12.6875L14.5 9.43739M3.8036 3.75001H9.4664M3.8036 6.18752H9.4664M3.8036 8.62502H6.635" stroke="#15CF74" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </template>
              </div>
              
              <!-- Content section -->
              <div class="flex-1 min-w-0">
                <h3 
                  v-if="!hasQuiz(lesson)"
                  :class="`lesson-title ${
                    lesson.isCompleted ? 'lesson-title-completed' : 'lesson-title-pending hover:!text-[#155a8f]'
                  }`"
                  @click="handleLessonClick(chapterIndex, lessonIndex)"
                  style="cursor: pointer"
                >
                  {{ lesson.title }}
                </h3>
                <h3
                  v-else
                  :class="['lesson-title', { 'lesson-title-completed': lesson.isCompleted, 'lesson-title-pending hover:!text-[#155a8f]': !lesson.isCompleted }]"
                  @click="handleQuizClick(chapterIndex, lessonIndex, lesson)"
                  style="cursor: pointer"
                >
                  {{ getQuizTitle(lesson) }}
                </h3>
              </div>
            </div>
          </template>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '~/stores/courses'
import { message } from 'ant-design-vue'

interface Lesson {
  title: string
  descriptions: string
  index: number
  [key: string]: any
}

interface Chapter {
  title: string
  lessons: Lesson[]
  [key: string]: any
}

interface Props {
  chapters?: Chapter[]
}

withDefaults(defineProps<Props>(), {
  chapters: () => [],
})

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()

const activeKey = ref<string | string[]>('chapter_0')

// Computed
const course = computed(() => coursesStore.course)

// Chế độ Review: cho phép xem lại tất cả bài mà không cần check locked
const isReviewMode = computed(() => route.query.review === "true")

// My-learning chỉ dành cho user đã mua nên luôn cho phép nhảy cóc, không lock bài nào
const isLessonLocked = (_chapterIndex: number, _lessonIndex: number) => {
  return false
}

const hasQuiz = (lesson: any) => {
  return lesson.type === 'quiz' || lesson.quizId || lesson.quiz
}

const getQuizTitle = (lesson: any) => {
  let title = 'Trắc nghiệm'
  
  if (lesson.type === 'quiz') {
    title = lesson.title
  } else if (lesson.quiz && typeof lesson.quiz === 'object') {
    title = lesson.quiz.title || 'Trắc nghiệm'
  }
  
  // Nếu title chưa có prefix "Trắc nghiệm:" thì thêm vào
  if (!title.toLowerCase().includes('trắc nghiệm')) {
    return `Trắc nghiệm: ${title}`
  }
  
  return title
}

const getTotalLessons = (chapter: any) => {
  if (!chapter.lessons) return 0
  let count = chapter.lessons.length
  // Đếm thêm quiz nếu có (quiz không phải là lesson type riêng)
  chapter.lessons.forEach((lesson: any) => {
    if (hasQuiz(lesson) && lesson.type !== 'quiz') {
      count++
    }
  })
  return count
}

const handlePanelClick = (chapter: number, event?: Event) => {
  // Stop event propagation để không trigger collapse
  if (event) {
    event.stopPropagation()
  }
  
  // Get the current query parameters
  const queryParams = { ...route.query, chapter: chapter.toString() }
  
  // Navigate with updated query
  router.push({
    path: route.path,
    query: queryParams,
  })
}

const handleLessonClick = (chapterIndex: number, lessonIndex: number) => {
  // Tự động expand chapter khi click vào lesson
  const chapterKey = `chapter_${chapterIndex}`
  if (Array.isArray(activeKey.value)) {
    if (!activeKey.value.includes(chapterKey)) {
      activeKey.value = [...activeKey.value, chapterKey]
    }
  } else {
    if (activeKey.value !== chapterKey) {
      activeKey.value = chapterKey
    }
  }
  
  const slug = route.params.slug
  
  // Nếu URL hiện tại đang ở chế độ review (đi vào từ nút Review / Xem lại)
  // thì giữ lại review=true. Còn lại (đang học bình thường) thì KHÔNG set review,
  // để hệ thống vẫn tính tiến độ như bình thường khi nhảy cóc.
  const queryParams: any = {
    chapter: chapterIndex.toString(),
    lesson: lessonIndex.toString()
  }
  if (route.query.review === 'true') {
    queryParams.review = 'true'
  }
  
  // Navigate với query params
  router.push({
    path: `/my-learning/${slug}`,
    query: queryParams
  })
}

const handleQuizClick = (chapterIndex: number, lessonIndex: number, lesson: any) => {
  // Tự động expand chapter khi click vào quiz
  const chapterKey = `chapter_${chapterIndex}`
  if (Array.isArray(activeKey.value)) {
    if (!activeKey.value.includes(chapterKey)) {
      activeKey.value = [...activeKey.value, chapterKey]
    }
  } else {
    if (activeKey.value !== chapterKey) {
      activeKey.value = chapterKey
    }
  }
  
  const slug = route.params.slug
  
  // Tương tự lesson: chỉ giữ review=true nếu đang ở chế độ review sẵn
  const queryParams: any = {
    chapter: chapterIndex.toString(),
    lesson: lessonIndex.toString(),
    quiz: 'true'
  }
  if (route.query.review === 'true') {
    queryParams.review = 'true'
  }
  
  // Navigate với query params
  router.push({
    path: `/my-learning/${slug}`,
    query: queryParams
  })
}

// Watch route query changes
watch(
  () => route.query,
  (query) => {
    if (query.chapter !== undefined) {
      activeKey.value = `chapter_${query.chapter}`
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.nav-course {
  :deep(.ant-collapse-borderless) {
    background-color: transparent;
  }
  :deep(.ant-collapse-borderless > .ant-collapse-item) {
    border: 0;
  }
  :deep(.ant-collapse-expand-icon) {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Smooth collapse animation */
  :deep(.ant-collapse-content) {
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  :deep(.ant-collapse-content-active) {
    animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Expand icon transition */
.expand-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  z-index: 10;
}

.expand-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  animation: fadeIn 0.3s ease-in-out;
}

.expand-icon:hover {
  transform: scale(1.1) rotate(90deg);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 1000px;
    transform: translateY(0);
  }
}

/* Chapter Panel */
.nav-chapter-panel {
  position: relative;
  background-color: white;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 0;
}

@media (min-width: 768px) {
  .nav-chapter-panel {
    padding-left: 32px;
  }
}

.nav-chapter-panel:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.nav-chapter-panel :deep(.ant-collapse-header) {
  position: relative;
  flex-direction: row-reverse;
  padding: 0.75rem 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-chapter-panel :deep(.ant-collapse-header:hover) {
  background-color: rgba(0, 0, 0, 0.02);
}

.nav-chapter-panel :deep(.ant-collapse-content-box) {
  padding: 0.5rem 1rem 0.75rem 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Chapter Header */
.chapter-header {
  width: 100%;
  padding-right: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.chapter-title {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 700;
  color: #1a75bb;
  margin-bottom: 0.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 768px) {
  .chapter-title {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
}

.chapter-header:hover .chapter-title {
  color: #155a8f;
  transform: translateX(2px);
}

.chapter-lesson-count {
  font-weight: 400;
  color: #818a90;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 768px) {
  .chapter-lesson-count {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

/* Lesson Item */
.lesson-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0.375rem;
  position: relative;
}

.lesson-item:hover {
  background-color: #f9fafb;
  transform: translateX(4px);
  padding-left: 0.5rem;
}

.lesson-icon-container {
  flex-shrink: 0;
  margin-top: 0.125rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lesson-icon {
  width: 1rem;
  height: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lesson-icon-completed {
  animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lesson-icon-pending {
  width: 1rem;
  height: 1rem;
  border: 2px solid #d1d5db;
  border-radius: 9999px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lesson-item:hover .lesson-icon-pending {
  border-color: #1a75bb;
  transform: scale(1.1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.lesson-title {
  font-size: 1rem;
  line-height: 1.5rem;
  margin-bottom: 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 768px) {
  .lesson-title {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}

.lesson-title-completed {
  color: #15CF74;
}

.lesson-title-pending {
  color: #1f2937;
}

.lesson-title-locked {
  color: #9ca3af;
  cursor: not-allowed;
}

.lesson-item:hover .lesson-title {
  text-decoration: underline;
  transform: translateX(4px);
}

/* Quiz Item */
.quiz-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  margin-left: 1.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0.375rem;
}

.quiz-item:hover {
  background-color: #f9fafb;
  transform: translateX(4px);
  padding-left: 0.5rem;
}

.quiz-icon-container {
  flex-shrink: 0;
  margin-top: 0.125rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.quiz-icon {
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: #818a90;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.quiz-item:hover .quiz-icon {
  stroke: #1a75bb;
  transform: scale(1.1);
}

.quiz-title {
  color: #818a90;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 768px) {
  .quiz-title {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

.quiz-item:hover .quiz-title {
  color: #1a75bb;
  text-decoration: underline;
  transform: translateX(4px);
}
</style>

