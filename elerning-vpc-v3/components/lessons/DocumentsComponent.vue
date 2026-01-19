<template>
  <div class="documents-container">
    <!-- Documents Header -->
    <div v-if="documents.length > 0" class="documents-header  mb-6">
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
        Xem và tải xuống các tài liệu hỗ trợ cho bài học này
      </p>
    </div>

    <!-- Documents List -->
    <div v-if="documents.length > 0" class="documents-list space-y-6">
      <div 
        v-for="(document, index) in documents" 
        :key="`${document.fileName}-${index}`"
        class="document-item bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <!-- Document Header -->
        <div class="p-6 border-b border-gray-200">
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

                <!-- Action Buttons -->
                <div class="flex-shrink-0 ml-4 flex gap-2">
                  <a-button 
                    @click="viewDocument(document, index)"
                    class="!flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Xem
                  </a-button>
                  
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

        <!-- Document Viewer (Expandable) -->
        <div v-if="expandedDoc === `${document.fileName}-${index}`" class="document-viewer border-t border-gray-200">
          <!-- PDF Viewer -->
          <div v-if="isPDF(document.fileType)" class="pdf-viewer bg-gray-50">
            <iframe 
              :src="`https://docs.google.com/viewer?url=${encodeURIComponent(document.fileUrl)}&embedded=true`"
              class="w-full h-[600px]"
              frameborder="0"
            ></iframe>
          </div>

          <!-- Google Docs Viewer for Office files -->
          <div v-else-if="isOfficeFile(document.fileType)" class="office-viewer bg-gray-50">
            <iframe 
              :src="`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(document.fileUrl)}`"
              class="w-full h-[600px]"
              frameborder="0"
            ></iframe>
          </div>

          <!-- Text file viewer -->
          <div v-else-if="isTextFile(document.fileType)" class="text-viewer bg-gray-50 p-6">
            <pre class="whitespace-pre-wrap text-sm">{{ textContent[`${document.fileName}-${index}`] || 'Đang tải...' }}</pre>
          </div>

          <!-- Image viewer -->
          <div v-else-if="isImage(document.fileType)" class="image-viewer bg-gray-50 p-6 flex justify-center">
            <img :src="document.fileUrl" :alt="document.title" class="max-w-full h-auto" />
          </div>

          <!-- Other files - show download message -->
          <div v-else class="p-6 text-center bg-gray-50">
            <p class="text-gray-600">Không thể xem trực tiếp file này. Vui lòng tải xuống để xem.</p>
          </div>
        </div>
      </div>
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
const expandedDoc = ref<string | null>(null)
const textContent = ref<Record<string, string>>({})

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

const viewDocument = async (doc: Document, index: number) => {
  const docKey = `${doc.fileName}-${index}`
  
  // Toggle expanded state
  if (expandedDoc.value === docKey) {
    expandedDoc.value = null
  } else {
    expandedDoc.value = docKey
    
    // Load text content if it's a text file
    if (isTextFile(doc.fileType) && !textContent.value[docKey]) {
      try {
        const response = await fetch(doc.fileUrl)
        const text = await response.text()
        textContent.value[docKey] = text
      } catch (error) {
        textContent.value[docKey] = 'Không thể tải nội dung file.'
      }
    }
  }
}

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
  } finally {
    const docKey = `${doc.fileName}-${index}`
    downloading.value[docKey] = false
  }
}

// Check file types
const isPDF = (fileType: string): boolean => {
  const ext = getFileExtension(fileType)
  return ext === 'pdf' || fileType.includes('pdf')
}

const isOfficeFile = (fileType: string): boolean => {
  const ext = getFileExtension(fileType)
  return ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext)
}

const isTextFile = (fileType: string): boolean => {
  const ext = getFileExtension(fileType)
  return ['txt', 'py', 'js', 'ts', 'json', 'xml', 'html', 'css', 'md'].includes(ext) || 
         fileType.includes('text')
}

const isImage = (fileType: string): boolean => {
  const ext = getFileExtension(fileType)
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) ||
         fileType.includes('image')
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
  width: 100%;
  margin: 0;
}

.document-item {
  width: 100%;
}

.pdf-viewer iframe,
.office-viewer iframe {
  width: 100%;
}
</style>
