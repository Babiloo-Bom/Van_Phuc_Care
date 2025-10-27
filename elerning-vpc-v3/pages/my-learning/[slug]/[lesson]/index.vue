<template>
  <div v-if="!loading" class="pt-5 py-20">
    <div class="container">
      <!-- Debug Info -->
      <div class="mb-4 p-4 bg-yellow-100 rounded">
        <h4 class="font-bold text-yellow-800 mb-2">Lesson Page Debug:</h4>
        <p><strong>Loading:</strong> {{ loading }}</p>
        <p><strong>Course:</strong> {{ course ? 'Loaded' : 'Not loaded' }}</p>
        <p><strong>Chapter:</strong> {{ chapter ? 'Loaded' : 'Not loaded' }}</p>
        <p><strong>Lesson:</strong> {{ lesson ? 'Found' : 'Not found' }}</p>
        <p><strong>Lesson Index:</strong> {{ lessonIndex }}</p>
        <p><strong>Route Params:</strong> {{ JSON.stringify($route.params) }}</p>
        <p><strong>Route Query:</strong> {{ JSON.stringify($route.query) }}</p>
      </div>
      
      <div>
        <ul id="courseList" ref="courseListRef" class="text-primary-100 flex items-center gap-3 font-semibold w-full overflow-auto">
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
          <li>
            <span>|</span>
          </li>
          <li class="w-full sm:w-auto min-w-fit">
            <span>{{ chapter?.title }}</span>
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
      <section class="mt-4">
        <div class="grid grid-cols-12 md:gap-12">
          <div class="col-span-12 lg:col-span-8">
            <div>
              <h2 class="pl-0 sm:pl-4 text-[24px] font-bold text-primary-100 mb-1">
                {{ chapter?.title }}
              </h2>
              <div class="pl-0 sm:pl-8">
                <h3 class="text-[20px] font-[600] text-[#798894] mt-6 mb-3">
                  {{ lesson?.title }}
                </h3>
                <div class="mt-4 mb-6">
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
                <div v-if="lesson?.videoIframe" class="mb-4" v-html="lesson?.videoIframe" />
                
                <!-- Video Component -->
                <div v-if="lesson?.videoUrl || lesson?.videoIframe" class="mb-6">
                  <div class="mb-4 p-4 bg-gray-100 rounded">
                    <h4 class="font-bold text-gray-800 mb-2">Debug Info:</h4>
                    <p><strong>Lesson Title:</strong> {{ lesson?.title }}</p>
                    <p><strong>Video URL:</strong> {{ lesson?.videoUrl }}</p>
                    <p><strong>Thumbnail:</strong> {{ lesson?.thumbnail }}</p>
                    <p><strong>File Size:</strong> {{ lesson?.fileSize }}</p>
                    <p><strong>Quality:</strong> {{ lesson?.quality }}</p>
                  </div>
                  <VideoComponent 
                    v-if="course"
                    :course-id="course._id"
                    :chapter-index="chapterIndex"
                    :lesson-index="lessonIndex"
                    :lesson-title="lesson?.title"
                    :lesson-description="lesson?.description"
                    :video-url="lesson?.videoUrl"
                    :thumbnail-url="lesson?.thumbnail"
                    :file-size="lesson?.fileSize"
                    :quality="lesson?.quality || '720'"
                    :show-stats="true"
                    @watched="handleVideoWatched"
                    @progress="handleVideoProgress"
                  />
                </div>
                <div v-else class="mb-6 p-4 bg-red-100 rounded">
                  <p class="text-red-800">❌ No video URL found for this lesson</p>
                  <p class="text-sm text-red-600">Lesson data: {{ JSON.stringify(lesson) }}</p>
                </div>
                
                <!-- Documents Section -->
                <div class="mt-6">
                  <DocumentsComponent 
                    v-if="course"
                    :course-id="course._id"
                    :chapter-index="chapterIndex"
                    :lesson-index="lessonIndex"
                  />
                </div>
                
                <!-- Quiz Section -->
                <div class="mt-6">
                  <QuizComponent 
                    v-if="course"
                    :course-id="course._id"
                    :chapter-index="chapterIndex"
                    :lesson-index="lessonIndex"
                    @completed="handleQuizCompleted"
                    @close="handleQuizClose"
                  />
                </div>
                <div class="mt-6">
                  <div v-if="lesson?.content" v-html="lesson?.content" />
                  <div v-else class="h-[250px]">
                    <a-empty description="Nội dung đang hoàn thiện" />
                  </div>
                </div>
                <div v-if="lesson?.title">
                  <a-divider />
                  <div v-if="!isCompleted">
                    <a-button class="!bg-prim-100 !text-white" @click="handleExam">
                      Làm trắc nghiệm
                    </a-button>
                    <div v-if="lessonNext?.title">
                      <p class="m-0 text-[#1A75BB] mt-2">
                        Hoàn thành bài kiểm tra và chuyển qua chủ đề tiếp theo
                      </p>
                      <p class="font-[600] m-0 text-[#798894] flex items-center gap-2 ml-2 mt-1">
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="9"
                            height="9"
                            viewBox="0 0 9 9"
                            fill="none"
                          >
                            <path d="M1 1L4.5 4.5L1 8" stroke="#798894" />
                            <path d="M4.5 1L8 4.5L4.5 8" stroke="#798894" />
                          </svg>
                        </span>
                        {{ lessonNext?.title }}
                      </p>
                    </div>
                  </div>
                  <div v-else class="flex gap-1">
                    <a-button class="mb-4 sm:mb-0 !bg-prim-100 !text-white !flex gap-1 items-center" @click="nextCourse">
                      Tiếp theo:
                      {{ lessonNext?.title }}
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="9"
                          height="9"
                          viewBox="0 0 9 9"
                          fill="none"
                        >
                          <path d="M1 1L4.5 4.5L1 8" stroke="#fff" />
                          <path d="M4.5 1L8 4.5L4.5 8" stroke="#fff" />
                        </svg>
                      </span>
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-4">
            <NavCourse v-if="course" :chapters="course.chapters" />
          </div>
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
import DocumentsComponent from '~/components/lessons/DocumentsComponent.vue'
import QuizComponent from '~/components/lessons/QuizComponent.vue'
import VideoComponent from '~/components/lessons/VideoComponent.vue'
import { useProgressTracking } from '~/composables/useProgressTracking'

// SEO
useHead({
  title: 'Học bài - Van Phuc Care E-Learning',
})

// Middleware: Require authentication
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()

const loading = ref(false)
const lessonIndex = ref(0)
const lesson = ref<any>({})
const lessonNext = ref<any>({})
const loadingDownload = ref(false)
const isCompleted = ref(false)
const totalLessonCount = ref(0)
const courseListRef = ref<HTMLElement | null>(null)

// Route params
const slug = route.params.slug as string
const chapterIndex = ref(parseInt(route.query.chapter as string) || 0)

// Computed
const course = computed(() => coursesStore.course)
const chapter = computed(() => coursesStore.chapter)
const processing = computed(() => coursesStore.processing)

const progressPercentage = computed(() => {
  const completed = processing.value?.complete?.length || 0
  const total = totalLessonCount.value || 1
  return ((completed / total) * 100).toFixed(0)
})

// Methods
const calculateTotalLessons = (chapters: any[] = []) => {
  totalLessonCount.value = chapters.reduce((total, ch) => total + (ch.lessons?.length || 0), 0)
}

const handleCheckCompleted = (chapterIndex: number, lessonIdx: number) => {
  if (!processing.value?.complete) return false
  
  return processing.value.complete.findIndex(
    (lessonCompleted: any) =>
      course.value._id === lessonCompleted.courseId &&
      chapterIndex === lessonCompleted.chapterIndex &&
      lessonCompleted.lessonIndex === lessonIdx
  ) > -1
}

const handleDownloadDocuments = async () => {
  if (!chapter.value) return
  
  const documents = chapter.value.documents || []
  if (documents.length) {
    try {
      loadingDownload.value = true
      
      const config = useRuntimeConfig()
      const response = await $fetch('https://api.synck.io.vn/api/s/download', {
        method: 'POST',
        body: {
          urls: documents.map((e: any) => e.source),
        },
        responseType: 'blob',
      })

      // Create a URL for the blob and trigger the download
      const url = window.URL.createObjectURL(new Blob([response as any]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Tài liệu ${course.value.title}.zip`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading files:', error)
    } finally {
      loadingDownload.value = false
    }
  }
}

const handleExam = () => {
  if (course.value && chapter.value) {
    router.push(`/my-learning/${course.value.slug}/${lessonIndex.value}/trac-nghiem?chapter=${chapter.value.order}`)
  }
}

// Progress tracking
const progressTracking = useProgressTracking()

const handleQuizCompleted = async (result: any) => {
  console.log('Quiz completed:', result)
  
  if (result.passed && course.value) {
    // Mark lesson as completed
    await progressTracking.markLessonCompleted(
      course.value._id,
      chapterIndex.value,
      lessonIndex.value
    )
    
    // Show success message
    console.log('✅ Lesson marked as completed after passing quiz')
  }
}

const handleQuizClose = () => {
  console.log('Quiz closed')
}

// Video handling
const handleVideoWatched = (stats: any) => {
  console.log('Video watched:', stats)
  // Video watching is automatically tracked by VideoComponent
}

const handleVideoProgress = (percentage: number) => {
  console.log('Video progress:', percentage + '%')
  // Progress is automatically tracked by VideoComponent
}

const nextCourse = () => {
  if (!course.value || !chapter.value) return
  
  if (lessonIndex.value + 1 === chapter.value.lessons.length && isCompleted.value) {
    return router.push(`/my-learning/${course.value.slug}`)
  }
  if (lessonIndex.value + 1 < chapter.value.lessons.length) {
    return router.push(`/my-learning/${course.value.slug}/${lessonIndex.value + 1}?chapter=${chapter.value.order}`)
  }
  return router.push(`/my-learning/${course.value.slug}/0?chapter=${Number(route.query.chapter) + 1}`)
}

const goBack = () => {
  if (course.value) {
    router.push(`/my-learning/${course.value.slug}`)
  }
}

const fetchData = async () => {
  try {
    loading.value = true
    const slug = route.params.slug as string
    const lessonParam = route.params.lesson as string
    const chapterQuery = route.query.chapter as string
    
    console.log('🔍 Lesson Page Debug:')
    console.log('🔍 Route params:', route.params)
    console.log('🔍 Route query:', route.query)
    console.log('🔍 Slug:', slug)
    console.log('🔍 Lesson param:', lessonParam)
    console.log('🔍 Chapter query:', chapterQuery)

    // Fetch course detail if not already loaded
    if (!course.value?._id) {
      console.log('🔍 Fetching course detail for slug:', slug)
      await coursesStore.fetchDetail(slug)
      console.log('🔍 Course fetched:', course.value)
    } else {
      console.log('🔍 Course already loaded:', course.value)
    }

    // Fetch chapter data
    if (course.value?._id) {
      console.log('🔍 Fetching chapter data for course:', course.value._id, 'chapter:', chapterQuery)
      await coursesStore.fetchChapter({
        origin: 'vanphuccare.gensi.vn',
        courseId: course.value._id,
        chapter: chapterQuery,
      })
      console.log('🔍 Chapter fetched:', chapter.value)
    }

    // Fetch processing data
    if (course.value?._id) {
      await coursesStore.fetchProcessing(course.value._id)
    }

    // Calculate total lessons
    if (course.value?.chapters) {
      calculateTotalLessons(course.value.chapters)
    }

    // Find current lesson
    console.log('🔍 Finding lesson...')
    console.log('🔍 Chapter lessons:', chapter.value?.lessons)
    console.log('🔍 Lesson param as number:', Number(lessonParam))
    
    if (chapter.value?.lessons) {
      // Use lessonParam directly as array index since lessons don't have 'index' field
      lessonIndex.value = Number(lessonParam)
      console.log('🔍 Lesson index:', lessonIndex.value)
      console.log('🔍 Lessons length:', chapter.value.lessons.length)
      
      if (lessonIndex.value >= 0 && lessonIndex.value < chapter.value.lessons.length) {
        lesson.value = chapter.value.lessons[lessonIndex.value]
        console.log('🔍 Found lesson:', lesson.value)
        console.log('🔍 Lesson videoUrl:', lesson.value?.videoUrl)
      } else {
        console.log('❌ Lesson index out of range:', lessonIndex.value, '>=', chapter.value.lessons.length)
      }
    } else {
      console.log('❌ No lessons found in chapter')
    }
    
    // Find next lesson
    if (chapter.value?.lessons && lessonIndex.value >= 0) {
      lessonNext.value = chapter.value.lessons[lessonIndex.value + 1] || course.value?.chapters?.[Number(chapterQuery) + 1]
    }

    // Check if lesson is completed
    isCompleted.value = handleCheckCompleted(Number(chapterQuery), lessonIndex.value)
  } catch (error) {
    console.error('Error fetching lesson data:', error)
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

