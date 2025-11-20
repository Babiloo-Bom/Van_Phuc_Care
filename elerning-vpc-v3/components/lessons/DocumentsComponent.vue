<template>
  <div class="documents-container">
    <!-- Documents Header -->
    <div class="documents-header  mb-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-blue-600">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 2v6h6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 13H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 17H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 9H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800">Tài liệu bài học</h3>
      </div>
      
      <p class="text-gray-600">
        Tải xuống các tài liệu hỗ trợ cho bài học này
      </p>
    </div>

    <!-- Documents List -->
    <div v-if="documents.length > 0" class="documents-list space-y-4">
      <div 
        v-for="(document, index) in documents" 
        :key="`${document.fileName}-${index}`"
        class="document-item bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start gap-4">
            <!-- Document Icon -->
            <div class="flex-shrink-0">
              <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                   :class="getFileTypeColor(document.fileType)">
                <svg v-if="document.fileType === 'pdf'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 2v6h6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 13H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 17H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 9H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="document.fileType === 'doc' || document.fileType === 'docx'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 2v6h6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 13H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 17H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 9H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="document.fileType === 'ppt' || document.fileType === 'pptx'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 2v6h6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 13H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 17H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 9H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="document.fileType === 'py'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 2v6h6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 13H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 17H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 9H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 2v6h6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 13H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 17H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 9H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>

            <!-- Document Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="text-lg font-semibold text-gray-800 mb-1">
                    {{ document.title }}
                  </h4>
                  
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7 10l5 5 5-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 15V3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      {{ formatFileSize(document.fileSize) }}
                    </span>
                    
                    <span class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 2v6h6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 13H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 17H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 9H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      {{ getFileExtension(document.fileType).toUpperCase() }}
                    </span>
                    
                  </div>
                </div>

                <!-- Download Button -->
                <div class="flex-shrink-0 ml-4">
                  <a-button 
                    type="primary"
                    @click="downloadDocument(document, index)"
                    :loading="downloading[`${document.fileName}-${index}`]"
                    class="!flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M7 10l5 5 5-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 15V3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Tải xuống
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="empty-state text-center py-12">
      <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" class="fill-none stroke-gray-400">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 2v6h6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 13H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 17H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 9H8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-600 mb-2">Không có tài liệu</h3>
      <p class="text-gray-500">Bài học này không có tài liệu để tải xuống.</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <a-spin size="large" />
      <p class="text-gray-600 mt-4">Đang tải tài liệu...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useCoursesStore } from '~/stores/courses'

interface Document {
  title: string
  fileUrl: string
  fileName: string
  fileSize?: number
  fileType: string
  index?: number
}

const props = defineProps<{
  courseId: string
  chapterId: string
  lessonId: string
}>()

const coursesStore = useCoursesStore()

// State
const documents = ref<Document[]>([])
const loading = ref(false)
const downloading = ref<Record<string, boolean>>({})

// Get documents from lesson data
const loadDocuments = () => {
  if (!coursesStore.course) return
  
  const chapter = coursesStore.course.chapters?.find(ch => ch._id === props.chapterId)
  if (!chapter) return
  
  const lesson = chapter.lessons?.find(les => les._id === props.lessonId)
  if (!lesson) return
  
  // Get documents from lesson
  if (lesson.documents && Array.isArray(lesson.documents) && lesson.documents.length > 0) {
    documents.value = lesson.documents.map((doc: any) => ({
      title: doc.title || doc.fileName || 'Document',
      fileUrl: doc.fileUrl || doc.url || '',
      fileName: doc.fileName || doc.name || 'document',
      fileSize: doc.fileSize || 0,
      fileType: doc.fileType || doc.mimeType || 'application/pdf',
      index: doc.index || 0
    }))
  } else {
    documents.value = []
  }
}

// Watch for course changes
watch(() => coursesStore.course, () => {
  loadDocuments()
}, { deep: true, immediate: true })

onMounted(() => {
  loadDocuments()
})

const downloadDocument = async (doc: Document, index: number) => {
  if (typeof window === 'undefined') return
  
  try {
    const docKey = `${doc.fileName}-${index}`
    downloading.value[docKey] = true
    
    // Create download link directly from fileUrl
    const link = window.document.createElement('a')
    link.href = doc.fileUrl
    link.download = doc.fileName
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
    
  } catch (error) {
    console.error('Error downloading document:', error)
  } finally {
    const docKey = `${doc.fileName}-${index}`
    downloading.value[docKey] = false
  }
}

// Extract file extension from fileType (could be mime type or extension)
const getFileExtension = (fileType: string): string => {
  if (!fileType) return ''
  
  const lowerType = fileType.toLowerCase()
  
  // If it's already an extension (no slash)
  if (!lowerType.includes('/')) {
    return lowerType
  }
  
  // If it's a mime type, extract extension
  const mimeToExt: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'text/plain': 'txt',
    'application/zip': 'zip',
    'application/x-rar-compressed': 'rar',
    'text/x-python': 'py',
    'application/x-python-code': 'py'
  }
  
  return mimeToExt[lowerType] || lowerType.split('/').pop()?.split(';')[0] || ''
}

const getFileTypeColor = (fileType: string) => {
  const ext = getFileExtension(fileType)
  const colors: Record<string, string> = {
    'pdf': 'bg-red-100 text-red-600',
    'doc': 'bg-blue-100 text-blue-600',
    'docx': 'bg-blue-100 text-blue-600',
    'ppt': 'bg-orange-100 text-orange-600',
    'pptx': 'bg-orange-100 text-orange-600',
    'py': 'bg-yellow-100 text-yellow-600',
    'txt': 'bg-gray-100 text-gray-600',
    'zip': 'bg-purple-100 text-purple-600',
    'rar': 'bg-purple-100 text-purple-600'
  }
  
  return colors[ext] || 'bg-gray-100 text-gray-600'
}

const formatFileSize = (bytes?: number) => {
  if (!bytes || bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.documents-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
