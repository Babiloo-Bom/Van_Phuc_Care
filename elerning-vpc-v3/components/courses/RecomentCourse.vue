<template>
  <div class="recoment-course">
    <a-empty v-if="!loading && displayedCourses.length === 0" description="Chưa có khóa học nào" />
    
    <div v-else-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
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
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCoursesStore } from '~/stores/courses'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import CourseCard from '~/components/courses/CourseCard.vue'

const coursesStore = useCoursesStore()
const authStore = useAuthStore()
const cartStore = useCartStore()
const loading = ref(false)

const courses = computed(() => coursesStore.courses)

const displayedCourses = computed(() => {
  // Hiển thị tối đa 4 khóa học
  if (!courses.value || !Array.isArray(courses.value)) {
    return []
  }
  return courses.value.slice(0, 4)
})

const isPurchased = (courseId: string) => {
  return authStore.user?.courseRegister?.includes(courseId) || false
}

const fetchCourses = async () => {
  try {
    loading.value = true
    console.log('🔍 RecomentCourse: Fetching courses...')
    await coursesStore.fetchAll()
    console.log('✅ RecomentCourse: Courses fetched:', coursesStore.courses.length)
  } catch (error) {
    console.error('❌ RecomentCourse: Error fetching courses:', error)
  } finally {
    loading.value = false
  }
}

// Event handlers
const handleAddToCart = async (course: any) => {
  console.log('🛒 Adding to cart from RecomentCourse:', course.title)
  try {
    await cartStore.addToCart({ courseId: course._id, quantity: 1 })
  } catch (error) {
    console.error('❌ Error adding to cart:', error)
  }
}

const handleBuyNow = async (course: any) => {
  console.log('💳 Buy now from RecomentCourse:', course.title)
  try {
    await cartStore.addToCart({ courseId: course._id, quantity: 1 })
    navigateTo('/checkout')
  } catch (error) {
    console.error('❌ Error buying now:', error)
  }
}

const handleViewDetail = (course: any) => {
  console.log('👁️ View detail from RecomentCourse:', course.title)
  navigateTo(`/courses/${course.slug}`)
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>

