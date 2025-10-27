<template>
  <div class="video-container">
    <!-- Debug Info -->
    <div class="mb-4 p-4 bg-blue-100 rounded">
      <h4 class="font-bold text-blue-800 mb-2">VideoComponent Debug:</h4>
      <p><strong>Video URL:</strong> {{ videoUrl }}</p>
      <p><strong>Thumbnail:</strong> {{ thumbnailUrl }}</p>
      <p><strong>Course ID:</strong> {{ courseId }}</p>
      <p><strong>Chapter Index:</strong> {{ chapterIndex }}</p>
      <p><strong>Lesson Index:</strong> {{ lessonIndex }}</p>
    </div>
    
    <!-- Video Player -->
    <div v-if="videoUrl" class="video-player bg-black rounded-lg overflow-hidden shadow-lg mb-6">
      <div class="relative w-full" :style="{ aspectRatio: '16/9' }">
        <!-- Video Element -->
        <video
          ref="videoRef"
          :src="videoUrl"
          :poster="thumbnailUrl"
          class="w-full h-full object-cover"
          controls
          preload="metadata"
          @loadedmetadata="onVideoLoaded"
          @timeupdate="onTimeUpdate"
          @ended="onVideoEnded"
          @play="onVideoPlay"
          @pause="onVideoPause"
        >
          <source :src="videoUrl" type="video/mp4">
          <source :src="videoUrl" type="video/webm">
          <source :src="videoUrl" type="video/ogg">
          Trình duyệt của bạn không hỗ trợ video.
        </video>

        <!-- Custom Controls Overlay -->
        <div v-if="showCustomControls" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="text-center text-white">
            <div class="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-30 transition-all"
                 @click="playVideo">
              <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="fill-white ml-1">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="fill-white">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ lessonTitle }}</h3>
            <p class="text-sm opacity-80">{{ lessonDescription }}</p>
          </div>
        </div>

        <!-- Progress Overlay -->
        <div v-if="showProgress" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div class="flex items-center gap-3 text-white">
            <div class="flex-1">
              <div class="w-full bg-white bg-opacity-30 rounded-full h-1">
                <div class="bg-white h-1 rounded-full transition-all duration-300" 
                     :style="{ width: `${progressPercentage}%` }"></div>
              </div>
            </div>
            <span class="text-sm font-medium">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Info -->
    <div v-if="videoUrl" class="video-info bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-blue-600">
              <path d="M23 7l-7 5 7 5V7z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ lessonTitle }}</h3>
          <p v-if="lessonDescription" class="text-gray-600 mb-4">{{ lessonDescription }}</p>
          
          <div class="flex items-center gap-6 text-sm text-gray-500">
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
                <path d="M12 6v6l4 2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ formatTime(duration) }}
            </span>
            
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 10l5 5 5-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 15V3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ formatFileSize(fileSize) }}
            </span>
            
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2v6h6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 13H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 9H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ quality }}p
            </span>
          </div>
        </div>

        <!-- Video Actions -->
        <div class="flex-shrink-0 flex items-center gap-2">
          <a-button 
            v-if="!isWatched"
            type="primary"
            @click="markAsWatched"
            :loading="markingWatched"
            class="!flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
              <path d="M9 12l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Đánh dấu đã xem
          </a-button>
          
          <a-button 
            v-else
            class="!border-green-200 !text-green-600 !bg-green-50"
            disabled
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
              <path d="M9 12l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Đã xem
          </a-button>
        </div>
      </div>
    </div>

    <!-- Video Stats -->
    <div v-if="videoUrl && showStats" class="video-stats bg-gray-50 rounded-lg p-4 mb-6">
      <h4 class="text-sm font-semibold text-gray-700 mb-3">Thống kê xem video</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ watchCount }}</div>
          <div class="text-xs text-gray-500">Lần xem</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ Math.round(completionRate) }}%</div>
          <div class="text-xs text-gray-500">Hoàn thành</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">{{ formatTime(totalWatchTime) }}</div>
          <div class="text-xs text-gray-500">Thời gian xem</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ lastWatchedAt ? formatDate(lastWatchedAt) : 'Chưa xem' }}</div>
          <div class="text-xs text-gray-500">Lần cuối</div>
        </div>
      </div>
    </div>

    <!-- No Video State -->
    <div v-if="!videoUrl" class="no-video-state text-center py-12 bg-gray-50 rounded-lg">
      <div class="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" class="fill-none stroke-gray-400">
          <path d="M23 7l-7 5 7 5V7z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-600 mb-2">Không có video</h3>
      <p class="text-gray-500">Bài học này không có video để xem.</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <a-spin size="large" />
      <p class="text-gray-600 mt-4">Đang tải video...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useProgressTracking } from '~/composables/useProgressTracking'

interface VideoStats {
  watchCount: number
  totalWatchTime: number
  completionRate: number
  lastWatchedAt?: Date
}

const props = defineProps<{
  courseId: string
  chapterIndex: number
  lessonIndex: number
  lessonTitle?: string
  lessonDescription?: string
  videoUrl?: string
  thumbnailUrl?: string
  fileSize?: number
  quality?: string
  showStats?: boolean
}>()

const emit = defineEmits<{
  watched: [stats: VideoStats]
  progress: [percentage: number]
}>()

// State
const videoRef = ref<HTMLVideoElement | null>(null)
const loading = ref(false)
const markingWatched = ref(false)
const isPlaying = ref(false)
const isWatched = ref(false)
const showCustomControls = ref(false)
const showProgress = ref(false)

// Video state
const currentTime = ref(0)
const duration = ref(0)
const watchCount = ref(0)
const totalWatchTime = ref(0)
const completionRate = ref(0)
const lastWatchedAt = ref<Date | null>(null)

// Progress tracking
const progressTracking = useProgressTracking()

// Computed
const progressPercentage = computed(() => {
  return duration.value > 0 ? Math.round((currentTime.value / duration.value) * 100) : 0
})

// Methods
const onVideoLoaded = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration
    console.log('📹 Video loaded:', { duration: duration.value })
  }
}

const onTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime
    
    // Emit progress
    emit('progress', progressPercentage.value)
    
    // Auto-mark as watched if watched more than 80%
    if (progressPercentage.value >= 80 && !isWatched.value) {
      markAsWatched()
    }
  }
}

const onVideoEnded = () => {
  isPlaying.value = false
  watchCount.value++
  totalWatchTime.value += duration.value
  completionRate.value = 100
  lastWatchedAt.value = new Date()
  
  // Mark as watched
  markAsWatched()
  
  console.log('📹 Video ended:', { watchCount: watchCount.value })
}

const onVideoPlay = () => {
  isPlaying.value = true
  showCustomControls.value = false
  showProgress.value = true
}

const onVideoPause = () => {
  isPlaying.value = false
  showProgress.value = false
}

const playVideo = () => {
  if (videoRef.value) {
    videoRef.value.play()
  }
}

const pauseVideo = () => {
  if (videoRef.value) {
    videoRef.value.pause()
  }
}

const markAsWatched = async () => {
  try {
    markingWatched.value = true
    
    // Mark lesson as completed in progress tracking
    await progressTracking.markLessonCompleted(
      props.courseId,
      props.chapterIndex,
      props.lessonIndex,
      Math.round(currentTime.value || 0)
    )
    
    isWatched.value = true
    watchCount.value++
    lastWatchedAt.value = new Date()
    
    // Emit watched event
    const stats: VideoStats = {
      watchCount: watchCount.value,
      totalWatchTime: totalWatchTime.value,
      completionRate: completionRate.value,
      lastWatchedAt: lastWatchedAt.value
    }
    
    emit('watched', stats)
    
    console.log('✅ Video marked as watched')
  } catch (error) {
    console.error('Error marking video as watched:', error)
  } finally {
    markingWatched.value = false
  }
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const formatFileSize = (bytes: number | undefined) => {
  if (!bytes) return '0 MB'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('vi-VN')
}

// Watch for video URL changes
watch(() => props.videoUrl, (newUrl) => {
  if (newUrl) {
    loading.value = true
    // Reset video state
    currentTime.value = 0
    duration.value = 0
    isWatched.value = false
    showCustomControls.value = true
    showProgress.value = false
    
    // Simulate loading
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
})

// Lifecycle
onMounted(() => {
  if (props.videoUrl) {
    showCustomControls.value = true
  }
})

onUnmounted(() => {
  // Cleanup if needed
})
</script>

<style scoped>
.video-container {
  max-width: 100%;
}

.video-player {
  position: relative;
}

.video-player:hover .video-stats {
  opacity: 1;
}

/* Custom video controls */
video::-webkit-media-controls {
  display: none;
}

video::-webkit-media-controls-enclosure {
  display: none;
}

/* Responsive video */
@media (max-width: 768px) {
  .video-player {
    border-radius: 0.5rem;
  }
}
</style>
