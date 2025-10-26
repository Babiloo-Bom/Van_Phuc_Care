<template>
  <div class="mb-20 mt-20">
    <main class="container py-10 lg:pt-0">
      <!-- Header -->
      <div class="mb-6 md:mb-12">
        <h2 class="block text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-100">
          Khóa học của tôi
        </h2>
        <p class="text-gray-600 mt-2">Quản lý và theo dõi tiến độ học tập của bạn</p>
      </div>
      <hr class="border-gray-50/70 my-4 md:my-10 xl:my-12">

      <!-- Content -->
      <div class="space-y-8">
        <!-- My Courses Section -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 bg-prim-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800">Khóa học đã mua</h3>
          </div>

          <!-- Courses List -->
          <div v-if="myCourses.length > 0" class="space-y-6">
            <div 
              v-for="(course, index) in myCourses" 
              :key="`my_course_${index}`"
              class="flex gap-6 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <!-- Course Thumbnail -->
              <div class="w-32 h-24 flex-shrink-0">
                <img
                  class="w-full h-full object-cover rounded-lg shadow-sm"
                  :src="course.thumbnail || '/images/courses/python-course.jpg'"
                  :alt="course.title"
                >
              </div>

              <!-- Course Info -->
              <div class="flex-1 min-w-0">
                <h4 class="text-xl font-semibold text-gray-800 mb-2">{{ course.title }}</h4>
                <p class="text-gray-600 mb-4">{{ course.shortDescription || course.description }}</p>
                
                <!-- Progress Bar -->
                <div class="mb-4">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-700">Tiến độ học tập</span>
                    <span class="text-sm font-semibold text-primary-100">{{ course.progress || 0 }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-prim-100 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${course.progress || 0}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Course Stats -->
                <div class="flex items-center gap-6 text-sm text-gray-600">
                  <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                      <path d="m21.67 14.3-.4 5c-.15 1.53-.27 2.7-2.98 2.7H5.71C3 22 2.88 20.83 2.73 19.3l-.4-5c-.08-.83.18-1.6.65-2.19l.02-.02C3.55 11.42 4.38 11 5.31 11h13.38c.93 0 1.75.42 2.29 1.07.01.01.02.02.02.03.49.59.76 1.36.67 2.2Z" stroke-width="1.5" stroke-miterlimit="10"/>
                      <path d="M3.5 11.43V6.28c0-3.4.85-4.25 4.25-4.25h1.27c1.27 0 1.56.38 2.04 1.02l1.27 1.7c.32.42.51.68 1.36.68h2.55c3.4 0 4.25.85 4.25 4.25v1.79M9.43 17h5.14" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ course.lessons || 0 }} bài học
                  </span>
                  <span v-if="course.duration" class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                      <path d="M9.1 12v-1.48c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73V12Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ course.duration }} phút
                  </span>
                  <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Mua ngày {{ formatDate(course.purchasedAt) }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-3 flex-shrink-0">
                <a-button
                  type="primary"
                  class="!bg-prim-100 !py-3 !h-[50px] !text-white !border-prim-100 !text-lg !font-semibold !rounded-xl !shadow-lg hover:!shadow-xl transition-all duration-300 !flex !items-center !justify-center !gap-2 !min-w-[140px]"
                  @click="navigateTo(`/courses/${course.slug}`)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Tiếp tục học</span>
                </a-button>
                
                <a-button
                  size="large"
                  class="!py-2 !h-[40px] !text-primary-100 !border-2 !border-prim-100 hover:!bg-prim-100 hover:!text-white transition-all duration-300 !rounded-lg !font-medium !text-base !flex !items-center !justify-center !gap-2 !min-w-[140px]"
                  @click="navigateTo(`/courses/${course.slug}`)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" class="fill-none stroke-current">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M21 12H9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Xem chi tiết</span>
                </a-button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <div class="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" class="fill-none stroke-gray-400">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-700 mb-3">Chưa có khóa học nào</h3>
            <p class="text-gray-500 mb-8 text-lg">Hãy mua khóa học đầu tiên để bắt đầu hành trình học tập!</p>
            <a-button
              type="primary"
              size="large"
              class="!bg-prim-100 !py-3 !h-[50px] !text-white !border-prim-100 !text-lg !font-semibold !rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              @click="navigateTo('/')"
            >
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </template>
              Khám phá khóa học
            </a-button>
          </div>
        </div>

        <!-- Learning Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="fill-none stroke-blue-600">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h4 class="text-2xl font-bold text-gray-800 mb-2">{{ myCourses.length }}</h4>
            <p class="text-gray-600">Khóa học đã mua</p>
          </div>

          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="fill-none stroke-green-600">
                <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.3 0 2.52.28 3.6.8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h4 class="text-2xl font-bold text-gray-800 mb-2">{{ completedCourses }}</h4>
            <p class="text-gray-600">Khóa học đã hoàn thành</p>
          </div>

          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="fill-none stroke-purple-600">
                <path d="M9.1 12v-1.48c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73V12Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h4 class="text-2xl font-bold text-gray-800 mb-2">{{ totalStudyTime }}</h4>
            <p class="text-gray-600">Giờ học tập</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Sample data for demo
const myCourses = ref([
  {
    _id: '1',
    title: 'Lập trình Python từ cơ bản đến nâng cao',
    slug: 'lap-trinh-python-tu-co-ban-den-nang-cao',
    description: 'Khóa học toàn diện về Python cho người mới bắt đầu',
    shortDescription: 'Học Python từ cơ bản đến nâng cao',
    thumbnail: '/images/courses/python-course.jpg',
    lessons: 45,
    duration: 1200,
    progress: 75,
    purchasedAt: new Date('2024-01-15'),
    price: 299000,
    instructor: {
      name: 'Nguyễn Văn A',
      avatar: '/images/instructors/instructor-1.jpg'
    }
  },
  {
    _id: '2',
    title: 'React.js - Xây dựng ứng dụng web hiện đại',
    slug: 'react-js-xay-dung-ung-dung-web-hien-dai',
    description: 'Học React.js để xây dựng các ứng dụng web tương tác',
    shortDescription: 'Học React.js từ cơ bản',
    thumbnail: '/images/courses/react-course.jpg',
    lessons: 32,
    duration: 800,
    progress: 30,
    purchasedAt: new Date('2024-01-20'),
    price: 399000,
    instructor: {
      name: 'Trần Thị B',
      avatar: '/images/instructors/instructor-2.jpg'
    }
  }
])

const completedCourses = computed(() => {
  return myCourses.value.filter(course => course.progress === 100).length
})

const totalStudyTime = computed(() => {
  return myCourses.value.reduce((total, course) => {
    return total + Math.floor((course.duration * course.progress) / 100)
  }, 0)
})

const formatDate = (date: Date) => {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

onMounted(() => {
  console.log('📚 My courses page mounted')
  // TODO: Fetch real data from API
})
</script>

<style scoped>
/* Custom colors to match design */
.text-primary-100 {
  color: #2176FF;
}

.bg-prim-100 {
  background-color: #2176FF;
}

.border-prim-100 {
  border-color: #2176FF;
}
</style>
