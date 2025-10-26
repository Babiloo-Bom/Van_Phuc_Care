<template>
  <div class="nav-course">
    <a-collapse
      v-model:activeKey="activeKey"
      expand-icon-position="right"
      :bordered="false"
    >
      <template #expandIcon="{ isActive }">
        <div class="p-4">
          <PlusOutlined v-if="!isActive" class="text-primary-100 text-lg rotate-90" />
          <CloseOutlined v-else class="text-primary-100 text-lg" />
        </div>
      </template>
      <a-collapse-panel
        v-for="(chapter, chapterIndex) in chapters"
        :key="`chapter_${chapterIndex}`"
        class="relative bg-[#f8fcff] mb-4"
      >
        <template #header>
          <div class="w-[80%]" @click="handlePanelClick(chapterIndex)">
            {{ chapter.title }}
          </div>
        </template>
        <template #extra>
          <div class="font-normal text-[#818a90] text-[14px] absolute left-0 bottom-0.5">
            {{ chapter.lessons?.length }} chủ đề
          </div>
        </template>
        <div class="flex flex-col gap-3">
          <div v-for="(lesson, lessonIndex) in chapter.lessons" :key="`lesson_${chapterIndex}_${lessonIndex}`" class="!flex items-start">
            <svg
              v-if="isLessonCompleted(chapterIndex, lessonIndex)"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 14 14"
              fill="none"
              class="!mt-1 mr-1 min-w-[16px] min-h-[16px] w-4 h-4"
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
            <a-radio v-else :checked="false" />
            <div>
              <h3 :class="`${isLessonCompleted(chapterIndex, lessonIndex) ? 'text-[#15CF74]' : 'text-primary-100'} text-lg font-semibold cursor-pointer`" @click="handleLessonClick(chapterIndex, lessonIndex)">
                {{ lesson.title }}
              </h3>
              <div class="flex items-center gap-2">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    class="fill-none stroke-[#818a90]"
                  >
                    <path
                      d="M3.5 18V7c0-4 1-5 5-5h7c4 0 5 1 5 5v10c0 .14 0 .28-.01.42"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.35 15H20.5v3.5c0 1.93-1.57 3.5-3.5 3.5H7c-1.93 0-3.5-1.57-3.5-3.5v-.65C3.5 16.28 4.78 15 6.35 15ZM8 7h8M8 10.5h5"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span class="text-[#818a90] font-medium">
                  {{ lesson.descriptions }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '~/stores/courses'
import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue'

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

const props = withDefaults(defineProps<Props>(), {
  chapters: () => [],
})

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()

const activeKey = ref<string>('chapter_0')

// Computed
const course = computed(() => coursesStore.course)
const processing = computed(() => coursesStore.processing)

// Methods
const isLessonCompleted = (chapterIndex: number, lessonIndex: number) => {
  if (!processing.value?.complete) return false
  
  return processing.value.complete.findIndex(
    (lessonCompleted: any) =>
      course.value._id === lessonCompleted.courseId &&
      chapterIndex === lessonCompleted.chapterIndex &&
      lessonCompleted.lessonIndex === lessonIndex
  ) > -1
}

const handlePanelClick = (chapter: number) => {
  // Get the current query parameters
  const queryParams = { ...route.query, chapter: chapter.toString() }
  
  // Navigate with updated query
  router.push({
    path: route.path,
    query: queryParams,
  })
}

const handleLessonClick = (chapterIndex: number, lessonIndex: number) => {
  const slug = route.params.slug
  
  // Create the new URL including lessonIndex within the slug
  const newPath = `/my-learning/${slug}/${lessonIndex}?chapter=${chapterIndex}`
  
  // Navigate to the new URL
  router.push(newPath)
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
    @apply bg-white;
  }
  :deep(.ant-collapse-header) {
    @apply text-xl font-bold text-primary-100 px-0 pb-6 pt-0;
  }
  :deep(.ant-collapse-content-box) {
    @apply p-0 pt-2;
  }
  :deep(.ant-collapse-borderless > .ant-collapse-item) {
    @apply border-[1px] border-solid border-gray-200 p-4 rounded-md;
  }
}
</style>

