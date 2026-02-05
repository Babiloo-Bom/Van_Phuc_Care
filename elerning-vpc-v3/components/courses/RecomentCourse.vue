<template>
  <div class="recoment-course">
    <a-empty v-if="!pending && displayedCourses.length === 0" description="Chưa có khóa học nào" />
    
    <div v-else-if="pending" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="index in 4"
        :key="index"
        class="bg-white rounded-lg shadow-sm animate-pulse"
      >
        <div class="h-48 bg-gray-200 rounded-t-lg" />
        <div class="p-4 space-y-3">
          <div class="h-4 bg-gray-200 rounded w-3/4" />
          <div class="h-4 bg-gray-200 rounded w-1/2" />
          <div class="h-8 bg-gray-200 rounded w-full mt-4" />
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      <CourseCard
        v-for="course in displayedCourses"
        :key="course._id"
        :course="course"
        :is-purchased="isPurchased(course._id)"
        @add-to-cart="handleAddToCart"
        @buy-now="handleBuyNow"
        @view-detail="handleViewDetail"
        :progress="getProgress(course._id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { message } from 'ant-design-vue'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import CourseCard from '~/components/courses/CourseCard.vue'

const authStore = useAuthStore()
const cartStore = useCartStore()

// Use useAsyncData for SSR - fetch courses during server-side rendering
const { data: coursesData, pending } = await useAsyncData(
  'related-courses',
  async () => {
    const courseApi = useCourseApi()
    try {
      const response: any = await courseApi.getAllCourses({ limit: 4 })
      const raw = response.data?.courses || response.data || response.courses || response || []
      
      // Map courses with isPurchased status
      const purchasedSet = new Set(authStore.user?.courseRegister || [])
      return raw.map((c: any) => {
        const id = c?._id?.toString?.()
        return {
          ...c,
          isPurchased: c?.isPurchased === true || (id ? purchasedSet.has(id) : false),
        }
      }).slice(0, 4) // Ensure max 4 courses
    } catch (error) {
      console.error('Error fetching related courses:', error)
      return []
    }
  }
)

const displayedCourses = computed(() => {
  // Return courses from useAsyncData
  if (!coursesData.value || !Array.isArray(coursesData.value)) {
    return []
  }
  return coursesData.value
})

const isPurchased = (courseId: string) => {
  return authStore.user?.courseRegister?.includes(courseId) || false
}

// Event handlers
const handleAddToCart = async (course: any) => {
  try {
    await cartStore.addToCart({ courseId: course._id, quantity: 1, userId: String(authStore.user?.id) || "" })
  } catch (error: any) {
    const msg = error?.data?.message || error?.message || ''
    if (msg.toLowerCase().includes('already in cart') || msg.includes('trong giỏ')) {
      message.warning('Khóa học đã tồn tại trong giỏ hàng')
    } else {
      message.error('Không thể thêm vào giỏ hàng')
    }
  }
}

const handleBuyNow = async (course: any) => {
  try {
    await cartStore.addToCart({ courseId: course._id, quantity: 1, userId: String(authStore.user?.id) || "" })
    navigateTo('/cart')
  } catch (error: any) {
    const msg = error?.data?.message || error?.message || ''
    if (msg.toLowerCase().includes('already in cart') || msg.includes('trong giỏ')) {
      message.warning('Khóa học đã tồn tại trong giỏ hàng')
      navigateTo('/cart')
    } else {
      message.error('Không thể mua ngay lúc này')
    }
  }
}

const handleViewDetail = (course: any) => {
  navigateTo(`/courses/${course.slug}`)
}

const getProgress = (courseId: string) => {
  // Progress is not available for related courses (they're not in myCourses)
  // This is only relevant for courses the user has purchased
  return 0
}
</script>

<style scoped>
/* Custom styles if needed */
</style>

