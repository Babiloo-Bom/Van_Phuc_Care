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
             P{{ chapterIndex + 1 }}: {{ chapter.title }}
            </div>
            <div class="chapter-lesson-count">
              {{ getTotalLessons(chapter) }} Lesson
            </div>
          </div>
        </template>
        <div class="flex flex-col">
          <template v-for="(lesson, lessonIndex) in chapter.lessons" :key="`lesson_${chapterIndex}_${lessonIndex}`">
            <!-- Chỉ hiển thị lesson, không hiển thị quiz trong menu -->
            <div 
              v-if="!hasQuiz(lesson)"
              class="flex items-center gap-3 py-3 lesson-item border-b border-dotted border-gray-300"
            >
              <!-- Icon section -->
              <div class="lesson-icon-container">
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
              </div>
              
              <!-- Content section -->
              <div class="flex-1 min-w-0">
                <h3 
                  :class="`lesson-title ${
                    lesson.isCompleted ? 'lesson-title-completed' : 'lesson-title-pending hover:!text-[#155a8f]'
                  } ${!isPurchasedOrCompleted && isLessonLocked(chapterIndex, lessonIndex) ? 'lesson-title-locked' : ''}`"
                  @click="handleLessonClick(chapterIndex, lessonIndex)"
                  :style="!isPurchasedOrCompleted && isLessonLocked(chapterIndex, lessonIndex) ? { cursor: 'not-allowed', opacity: 0.6 } : { cursor: 'pointer' }"
                  class="flex items-center gap-2"
                >
                  <span>{{ lesson.title }}</span>
                  <img
                    v-if="!isPurchasedOrCompleted && isLessonLocked(chapterIndex, lessonIndex)"
                    src="/images/svg/lock.svg"
                    alt="locked"
                    class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                  />
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
import { useAuthStore } from '~/stores/auth'
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
  forceReviewMode?: boolean // Khi true, luôn thêm review=true khi navigate (dùng cho trang chứng nhận)
  courseSlug?: string // Slug của khóa học, dùng khi NavCourse không nằm trong route có slug
}

const props = withDefaults(defineProps<Props>(), {
  chapters: () => [],
  forceReviewMode: false,
  courseSlug: '',
})

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()
const authStore = useAuthStore()

const activeKey = ref<string | string[]>('chapter_0')

// Computed
const course = computed(() => coursesStore.course)

// Chế độ Review: cho phép xem lại tất cả bài mà không cần check locked
const isReviewMode = computed(() => route.query.review === "true")

// Kiểm tra xem user đã mua hoặc đã hoàn thành khóa học chưa
const isPurchasedOrCompleted = computed(() => {
  if (!course.value) return false;
  const courseId = course.value._id?.toString();
  
  return (
    course.value.isPurchased === true ||
    course.value.progress?.isCompleted === true ||
    (courseId && authStore.user?.courseRegister?.includes(courseId)) ||
    (courseId && authStore.user?.courseCompleted?.includes(courseId))
  );
});

// Kiểm tra bài có bị lock không (khi chưa mua, chỉ cho phép bài preview)
const isLessonLocked = (chapterIndex: number, lessonIndex: number) => {
  if (!course.value) return false;
  
  // Nếu đã mua hoặc đã hoàn thành, không lock bài nào
  if (isPurchasedOrCompleted.value) return false;
  
  // Nếu chưa mua, chỉ cho phép bài preview
  const lesson = course.value.chapters?.[chapterIndex]?.lessons?.[lessonIndex];
  return !lesson?.isPreview || lesson?.isLocked || false;
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
  // Chỉ đếm lesson, không đếm quiz (quiz không hiển thị trong menu nữa)
  return chapter.lessons.filter((lesson: any) => !hasQuiz(lesson)).length
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
  // Nếu chưa mua/hoàn thành và bài không phải preview → redirect về trang chi tiết với query để tự động hiện popup
  if (!isPurchasedOrCompleted.value && isLessonLocked(chapterIndex, lessonIndex)) {
    router.push(`/courses/${route.params.slug}?showPurchaseModal=true`);
    return;
  }
  
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
  
  // Ưu tiên lấy slug từ prop, nếu không có thì lấy từ route
  const slug = props.courseSlug || route.params.slug
  
  // Nếu URL hiện tại đang ở chế độ review (đi vào từ nút Review / Xem lại)
  // hoặc forceReviewMode=true (dùng trong trang chứng nhận)
  // thì giữ lại review=true. Còn lại (đang học bình thường) thì KHÔNG set review,
  // để hệ thống vẫn tính tiến độ như bình thường khi nhảy cóc.
  const queryParams: any = {
    chapter: chapterIndex.toString(),
    lesson: lessonIndex.toString()
  }
  if (route.query.review === 'true' || props.forceReviewMode) {
    queryParams.review = 'true'
  }
  
  // Navigate với query params
  router.push({
    path: `/my-learning/${slug}`,
    query: queryParams
  })
}

const handleQuizClick = (chapterIndex: number, lessonIndex: number, lesson: any) => {
  // Nếu chưa mua/hoàn thành và bài không phải preview → redirect về trang chi tiết với query để tự động hiện popup
  if (!isPurchasedOrCompleted.value && isLessonLocked(chapterIndex, lessonIndex)) {
    router.push(`/courses/${route.params.slug}?showPurchaseModal=true`);
    return;
  }
  
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
  
  // Ưu tiên lấy slug từ prop, nếu không có thì lấy từ route
  const slug = props.courseSlug || route.params.slug
  
  // Tương tự lesson: giữ review=true nếu đang ở chế độ review sẵn hoặc forceReviewMode
  const queryParams: any = {
    chapter: chapterIndex.toString(),
    lesson: lessonIndex.toString(),
    quiz: 'true'
  }
  if (route.query.review === 'true' || props.forceReviewMode) {
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
  font-weight: 700;
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
  color: #1A75BB;
}

.lesson-title-pending {
  color: #1A75BB;
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

