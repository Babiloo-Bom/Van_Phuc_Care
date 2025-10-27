import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useCourseApi } from './useCourseApi'

export interface LessonProgress {
  courseId: string
  chapterIndex: number
  lessonIndex: number
  completed: boolean
  completedAt?: Date
  timeSpent?: number // in seconds
}

export interface CourseProgress {
  courseId: string
  totalLessons: number
  completedLessons: number
  progressPercentage: number
  lastAccessedAt?: Date
  completedAt?: Date
}

export const useProgressTracking = () => {
  const authStore = useAuthStore()
  const courseApi = useCourseApi()
  
  const lessonProgress = ref<LessonProgress[]>([])
  const courseProgress = ref<CourseProgress[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isLessonCompleted = (courseId: string, chapterIndex: number, lessonIndex: number) => {
    return lessonProgress.value.some(
      progress => 
        progress.courseId === courseId && 
        progress.chapterIndex === chapterIndex && 
        progress.lessonIndex === lessonIndex && 
        progress.completed
    )
  }

  const getCourseProgress = (courseId: string) => {
    return courseProgress.value.find(progress => progress.courseId === courseId)
  }

  const getCourseProgressPercentage = (courseId: string) => {
    const progress = getCourseProgress(courseId)
    return progress?.progressPercentage || 0
  }

  const isCourseCompleted = (courseId: string) => {
    const progress = getCourseProgress(courseId)
    return progress?.progressPercentage === 100
  }

  // Methods
  const markLessonCompleted = async (courseId: string, chapterIndex: number, lessonIndex: number, timeSpent?: number) => {
    try {
      loading.value = true
      error.value = null

      // Check if already completed
      const existingProgress = lessonProgress.value.find(
        progress => 
          progress.courseId === courseId && 
          progress.chapterIndex === chapterIndex && 
          progress.lessonIndex === lessonIndex
      )

      if (existingProgress?.completed) {
        return // Already completed
      }

      // Call backend API to mark lesson as completed
      const response = await $fetch('/api/progress', {
        method: 'PUT',
        body: {
          courseId,
          chapterIndex,
          lessonIndex,
          timeSpent: timeSpent || 0
        }
      })

      if (response.success) {
        // Update local state
        const progressIndex = lessonProgress.value.findIndex(
          progress => 
            progress.courseId === courseId && 
            progress.chapterIndex === chapterIndex && 
            progress.lessonIndex === lessonIndex
        )

        const newProgress: LessonProgress = {
          courseId,
          chapterIndex,
          lessonIndex,
          completed: true,
          completedAt: new Date(),
          timeSpent: timeSpent || 0
        }

        if (progressIndex >= 0) {
          lessonProgress.value[progressIndex] = newProgress
        } else {
          lessonProgress.value.push(newProgress)
        }

        // Update course progress
        await updateCourseProgress(courseId)

        console.log('✅ Lesson marked as completed:', courseId, chapterIndex, lessonIndex)
      }

    } catch (err: any) {
      error.value = err.message || 'Failed to mark lesson as completed'
      console.error('Error marking lesson completed:', err)
    } finally {
      loading.value = false
    }
  }

  const updateCourseProgress = async (courseId: string) => {
    try {
      // Get course details to calculate total lessons
      const course = await courseApi.getCourseBySlug(courseId)
      if (!course) return

      const totalLessons = course.chapters?.reduce((total, chapter) => 
        total + (chapter.lessons?.length || 0), 0) || 0

      const completedLessons = lessonProgress.value.filter(
        progress => progress.courseId === courseId && progress.completed
      ).length

      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

      // Update course progress
      const courseProgressIndex = courseProgress.value.findIndex(
        progress => progress.courseId === courseId
      )

      const newCourseProgress: CourseProgress = {
        courseId,
        totalLessons,
        completedLessons,
        progressPercentage,
        lastAccessedAt: new Date(),
        completedAt: progressPercentage === 100 ? new Date() : undefined
      }

      if (courseProgressIndex >= 0) {
        courseProgress.value[courseProgressIndex] = newCourseProgress
      } else {
        courseProgress.value.push(newCourseProgress)
      }

      // Update user's courseCompleted array
      if (progressPercentage === 100) {
        await markCourseCompleted(courseId)
      }

    } catch (err: any) {
      console.error('Error updating course progress:', err)
    }
  }

  const markCourseCompleted = async (courseId: string) => {
    try {
      if (!authStore.user) return

      const courseCompleted = authStore.user.courseCompleted || []
      if (!courseCompleted.includes(courseId)) {
        courseCompleted.push(courseId)
        
        // Update user data via API
        const authApi = useAuthApi()
        await authApi.updateCourseRegister([courseId], 'add') // This will also update courseCompleted
        
        console.log('✅ Course marked as completed:', courseId)
      }
    } catch (err: any) {
      console.error('Error marking course as completed:', err)
    }
  }

  const saveProgressToBackend = async () => {
    try {
      // Save lesson progress to backend
      const response = await $fetch('/api/progress', {
        method: 'POST',
        body: {
          lessonProgress: lessonProgress.value,
          courseProgress: courseProgress.value
        }
      })

      if (response.success) {
        console.log('✅ Progress saved to backend')
      }
    } catch (err: any) {
      console.error('Error saving progress to backend:', err)
    }
  }

  const loadProgressFromBackend = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch('/api/progress', {
        method: 'GET'
      })

      if (response.success) {
        lessonProgress.value = response.data.lessonProgress || []
        courseProgress.value = response.data.courseProgress || []
        console.log('✅ Progress loaded from backend')
      }
    } catch (err: any) {
      console.error('Error loading progress from backend:', err)
    } finally {
      loading.value = false
    }
  }

  const resetProgress = async (courseId: string) => {
    try {
      // Call backend API to reset progress
      const response = await $fetch(`/api/progress?courseId=${courseId}`, {
        method: 'DELETE'
      })

      if (response.success) {
        // Remove lesson progress for this course
        lessonProgress.value = lessonProgress.value.filter(
          progress => progress.courseId !== courseId
        )

        // Remove course progress
        courseProgress.value = courseProgress.value.filter(
          progress => progress.courseId !== courseId
        )

        console.log('✅ Progress reset for course:', courseId)
      }
    } catch (err: any) {
      console.error('Error resetting progress:', err)
    }
  }

  return {
    // State
    lessonProgress: readonly(lessonProgress),
    courseProgress: readonly(courseProgress),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    isLessonCompleted,
    getCourseProgress,
    getCourseProgressPercentage,
    isCourseCompleted,

    // Methods
    markLessonCompleted,
    updateCourseProgress,
    markCourseCompleted,
    saveProgressToBackend,
    loadProgressFromBackend,
    resetProgress
  }
}
