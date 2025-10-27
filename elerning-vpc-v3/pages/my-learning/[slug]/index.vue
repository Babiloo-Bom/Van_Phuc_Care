<template>
  <div v-if="!loading" class="pt-5 py-20">
    <div class="container">
      <div>
        <ul id="courseList" ref="courseListRef" class="text-primary-100 flex items-center gap-3 font-semibold w-full !overflow-auto">
          <li class="w-full sm:w-auto min-w-fit">
            <NuxtLink to="/my-learning">
              Khóa học của tôi
            </NuxtLink>
          </li>
          <li>
            <span>|</span>
          </li>
          <li class="w-full sm:w-auto min-w-fit">
            <NuxtLink :to="`/my-learning/${course.slug}`">
              {{ course?.title }}
            </NuxtLink>
          </li>
        </ul>
        <div class="flex items-center gap-3">
          <a-button class="!w-8 !px-1" type="primary" @click="goBack">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              class="fill-none stroke-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="10"
                stroke-width="1.5"
                d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
              />
            </svg>
          </a-button>
          <span class="text-xl text-primary-100 font-semibold">Về bài học của tôi</span>
        </div>
      </div>
      <section class="mt-10">
        <div class="grid grid-cols-12 md:gap-12">
          <div class="col-span-12 lg:col-span-8">
            <div>
              <div>
                <img class="h-[350px] w-full object object-cover rounded-md" :src="course.thumbnail" alt="/" />
              </div>
              <div class="mt-6">
                <h2 class="text-4xl font-bold text-primary-100 mb-1">
                  {{ course.title }}
                </h2>
                <div class="flex items-center gap-4 rounded-sm flex-wrap">
                  <div class="flex items-center justify-start gap-1 text-black">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 10 9"
                        class="fill-none stroke-black"
                      >
                        <path
                          d="M4.31471 8.36571H2.15047C1.55283 8.3657 1.06836 7.91654 1.06836 7.36246L1.0684 1.34307C1.06841 0.789004 1.55288 0.339844 2.15052 0.339844H7.02016C7.61779 0.339844 8.10227 0.789008 8.10227 1.34308V4.10198M5.93805 6.94448L6.92999 7.86411L9.09422 5.85756M2.96223 2.34631H6.20858M2.96223 3.85117H6.20858M2.96223 5.35602H4.5854"
                          stroke-width="0.7"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{{ course.examCount }} bài trắc nghiệm</span>
                  </div>
                  <div class="flex items-center justify-start gap-1 text-black">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        class="fill-none stroke-black"
                      >
                        <path
                          d="M9.1 12v-1.48c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73V12Z"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{{ course.videoCount }} video</span>
                  </div>
                  <div class="flex items-center justify-start gap-1 text-black">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        class="fill-none stroke-black"
                      >
                        <path
                          d="m21.67 14.3-.4 5c-.15 1.53-.27 2.7-2.98 2.7H5.71C3 22 2.88 20.83 2.73 19.3l-.4-5c-.08-.83.18-1.6.65-2.19l.02-.02C3.55 11.42 4.38 11 5.31 11h13.38c.93 0 1.75.42 2.29 1.07.01.01.02.02.02.03.49.59.76 1.36.67 2.2Z"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                        />
                        <path
                          d="M3.5 11.43V6.28c0-3.4.85-4.25 4.25-4.25h1.27c1.27 0 1.56.38 2.04 1.02l1.27 1.7c.32.42.51.68 1.36.68h2.55c3.4 0 4.25.85 4.25 4.25v1.79M9.43 17h5.14"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{{ course.documentCount }} tài liệu</span>
                  </div>
                </div>
              </div>
              <div class="mt-6">
                <div class="border-[1px] border-solid border-gray-80 p-4 rounded">
                  <div class="flex justify-between items-center flex-wrap">
                    <span class="text-primary-100 font-semibold">Tiến trình</span>
                    <span class="font-semibold text-[#787d84]">{{ progressPercentage }}% Hoàn thành</span>
                    <div class="w-full flex h-2 rounded-full mt-1 overflow-hidden">
                      <div class="bg-[#14cf76]" :style="`width: ${progressPercentage}%`" />
                      <div class="flex-1 bg-[#d9d9d9]" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-6">
                <h1 class="text-primary-100 text-3xl">
                  1. Giới thiệu khóa học
                </h1>
                <div v-html="course.descriptions" />
              </div>
              <div class="hidden sm:flex justify-center mt-6">
                <a-button class="!w-[250px] !flex !items-center !bg-prim-100 !justify-center !gap-2 !py-3 !rounded-sm !h-[48px]" @click="startCourse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    class="fill-none stroke-white"
                  >
                    <path
                      d="M11.97 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8.74 12.23v-1.67c0-2.08 1.47-2.93 3.27-1.89l1.45.84 1.45.84c1.8 1.04 1.8 2.74 0 3.78l-1.45.84-1.45.84c-1.8 1.04-3.27.19-3.27-1.89v-1.69Z"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="text-white text-lg">Bắt đầu khóa học</span>
                </a-button>
              </div>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-4">
            <div>
              <div>
                <a-button class="!w-full !flex !items-center !bg-prim-100 !justify-center !gap-2 !py-3 !rounded-sm !h-[48px]" @click="startCourse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    class="fill-none stroke-white"
                  >
                    <path
                      d="M11.97 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8.74 12.23v-1.67c0-2.08 1.47-2.93 3.27-1.89l1.45.84 1.45.84c1.8 1.04 1.8 2.74 0 3.78l-1.45.84-1.45.84c-1.8 1.04-3.27.19-3.27-1.89v-1.69Z"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="text-white text-lg">Bắt đầu khóa học</span>
                </a-button>
                <div class="mt-4">
                  <ul class="mb-0 border-[1px] border-solid border-prim-20 p-4 rounded-md">
                    <li class="flex justify-between items-center border-b-[1px] border-solid border-prim-20 pb-3">
                      <span class="font-semibold text-primary-100">Thời lượng:</span>
                      <span v-if="course.timeCount" class="bg-[#f3f6f6] text-[#848b9c] rounded-sm py-0.5 px-2 font-medium">Tổng {{ course.timeCount }}</span>
                      <span v-else class="bg-[#f3f6f6] text-[#848b9c] rounded-sm py-0.5 px-2 font-medium">Đang cập nhật</span>
                    </li>
                    <li class="flex justify-between items-center border-b-[1px] border-solid border-prim-20 py-3">
                      <span class="font-semibold text-primary-100">Bài giảng:</span>
                      <span class="bg-[#f3f6f6] text-[#848b9c] rounded-sm py-0.5 px-2 font-medium">{{ totalLessonCount }}</span>
                    </li>
                    <li class="flex justify-between items-center border-b-[1px] border-solid border-prim-20 py-3">
                      <span class="font-semibold text-primary-100">Trắc nghiệm:</span>
                      <span class="bg-[#f3f6f6] text-[#848b9c] rounded-sm py-0.5 px-2 font-medium">{{ course.examCount }}</span>
                    </li>
                    <li class="flex justify-between items-center border-b-[1px] border-solid border-prim-20 py-3">
                      <span class="font-semibold text-primary-100">Trình độ:</span>
                      <span class="bg-[#f3f6f6] text-[#848b9c] rounded-sm py-0.5 px-2 font-medium">{{ mapDifficulty(course.level) }}</span>
                    </li>
                    <li class="flex justify-between items-center border-b-[1px] border-solid border-prim-20 py-3">
                      <span class="font-semibold text-primary-100">Ngôn ngữ:</span>
                      <span class="bg-[#f3f6f6] text-[#848b9c] rounded-sm py-0.5 px-2 font-medium">Tiếng Việt</span>
                    </li>
                    <li class="flex justify-between items-center pt-3">
                      <span class="font-semibold text-primary-100">Chứng nhận:</span>
                      <span class="bg-[#f3f6f6] text-[#848b9c] rounded-sm py-0.5 px-2 font-medium">{{ course.certificate ? 'Có' : 'Không' }}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="mt-10">
                <NavCourse :chapters="course.chapters" />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-10 py-10 border-t-[1px] border-solid border-gray-80">
          <h2 class="text-3xl text-gray-100">
            Khóa học phổ biến
          </h2>
          <RecomentCourse class="mt-6" />
        </div>
      </section>
    </div>
  </div>
  <div v-else class="flex items-center justify-center h-full min-h-[60vh]">
    <a-spin size="large" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '~/stores/courses'
import NavCourse from '~/components/courses/NavCourse.vue'
import RecomentCourse from '~/components/courses/RecomentCourse.vue'

// SEO
useHead({
  title: 'Khóa học của tôi - Van Phuc Care E-Learning',
})

// Middleware: Require authentication
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()

const loading = ref(false)
const totalLessonCount = ref(0)
const courseListRef = ref<HTMLElement | null>(null)

// Computed
const course = computed(() => {
  if (!coursesStore.course) return null
  
  // Tính toán counts từ store getters
  const videoCount = coursesStore.videoCount
  const documentCount = coursesStore.documentCount  
  const examCount = coursesStore.examCount
  
  return {
    ...coursesStore.course,
    videoCount,
    documentCount,
    examCount
  }
})
const processing = computed(() => coursesStore.processing)

const progressPercentage = computed(() => {
  const completed = processing.value?.complete?.length || 0
  const total = totalLessonCount.value || 1
  return ((completed / total) * 100).toFixed(0)
})

// Methods
const mapDifficulty = (level: string) => {
  const difficultyMap: Record<string, string> = {
    easy: 'Dễ',
    medium: 'Vừa',
    hard: 'Khó',
  }
  return difficultyMap[level] || 'Unknown'
}

const calculateTotalLessons = (chapters: any[] = []) => {
  totalLessonCount.value = chapters.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0)
}

const startCourse = () => {
  if (course.value?.chapters?.[0]?.lessons?.[0]) {
    // Use array index (0) instead of lesson.index property
    router.push(`/my-learning/${course.value.slug}/0?chapter=0`)
  }
}

const goBack = () => {
  router.push('/my-learning')
}

const fetchData = async () => {
  try {
    loading.value = true
    const slug = route.params.slug as string
    
    await coursesStore.fetchDetail(slug)
    await coursesStore.fetchProcessing(course.value._id)
    
    calculateTotalLessons(course.value.chapters)
  } catch (error) {
    console.error('Error fetching course detail:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await fetchData()
  
  // Scroll courseList to the right
  nextTick(() => {
    if (courseListRef.value) {
      courseListRef.value.scrollLeft = courseListRef.value.scrollWidth
    }
  })
})
</script>

<style scoped>
/* Add any custom styles here */
</style>

