<template>
  <div class="support-request-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <a-spin size="large" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen px-4">
      <a-result status="error" :title="error">
        <template #extra>
          <a-button type="primary" @click="navigateTo('/health-book/' + customerId)">
            Quay lại
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- Main Content -->
    <div v-else-if="request" class="container mx-auto px-4 py-6">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <a-button class="hidden lg:inline-flex" @click="handleBack">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
            Quay lại
          </a-button>
          <h1 class="text-2xl font-bold text-gray-800 mb-0">
            Yêu cầu hỗ trợ #{{ request.ticketNumber }}
          </h1>
        </div>
        
        <a-tag :color="statusColor" class="status-tag">
          {{ statusText }}
        </a-tag>
      </div>

      <!-- Request Content -->
      <div class="request-content bg-white rounded-lg shadow-sm p-6 mb-6">
        <!-- Title -->
        <h2 class="request-title">
          [{{ categoryName }}] {{ request.title }}
        </h2>

        <!-- Description -->
        <p class="request-description">
          {{ request.description }}
        </p>

        <!-- Attachments -->
        <div v-if="request.attachments && request.attachments.length > 0" class="attachments">
          <div class="attachment-grid">
            <div
              v-for="(attachment, index) in request.attachments"
              :key="index"
              class="attachment-item"
            >
              <a-image
                :src="attachment.url"
                :preview="true"
                class="attachment-image"
              />
            </div>
          </div>
        </div>

        <!-- Meta Info -->
        <div class="meta-info">
          <span class="meta-item">Ngày tạo: {{ dayjs(request.createdAt).format('DD/MM/YYYY') }}</span>
          <span class="meta-divider">•</span>
          <span class="meta-item">ID: #{{ request.ticketNumber }}</span>
        </div>
      </div>

      <!-- Comments/Replies Section -->
      <div class="comments-section bg-white rounded-lg shadow-sm p-6">
        <h3 class="section-title">Phản hồi</h3>

        <!-- Comments List -->
        <div ref="commentsContainerRef" class="comments-list">
          <div
            v-for="comment in comments"
            :key="comment.id"
            :class="['comment-item', comment.isStaff ? 'staff-comment' : 'user-comment']"
          >
            <div class="comment-avatar">
              <a-avatar :src="comment.avatar" :size="40">
                {{ comment.author.charAt(0).toUpperCase() }}
              </a-avatar>
            </div>
            
            <div class="comment-content">
              <div class="comment-bubble">
                <p class="comment-text">{{ comment.message }}</p>
                
                <!-- Comment Images -->
                <div v-if="comment.images && comment.images.length > 0" class="comment-images">
                  <a-image
                    v-for="(image, idx) in comment.images"
                    :key="idx"
                    :src="image"
                    :preview="true"
                    class="comment-image"
                  />
                </div>
              </div>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="comments.length === 0" class="empty-comments">
          <a-empty description="Chưa có phản hồi nào" />
        </div>

        <!-- Reply Form -->
        <div class="reply-form">
          <!-- Rich Text Editor -->
          <div class="editor-wrapper">
            <div class="editor-toolbar">
              <a-button size="small" type="text" @click="formatText('bold')">
                <BoldOutlined />
              </a-button>
              <a-button size="small" type="text" @click="formatText('italic')">
                <ItalicOutlined />
              </a-button>
              <a-button size="small" type="text" @click="formatText('underline')">
                <UnderlineOutlined />
              </a-button>
              <a-divider type="vertical" />
              <a-button size="small" type="text" @click="formatText('insertUnorderedList')">
                <UnorderedListOutlined />
              </a-button>
              <a-button size="small" type="text" @click="formatText('insertOrderedList')">
                <OrderedListOutlined />
              </a-button>
              <a-divider type="vertical" />
              <a-button size="small" type="text" @click="insertLink">
                <LinkOutlined />
              </a-button>
              <a-button size="small" type="text" @click="triggerImageUpload">
                <PictureOutlined />
              </a-button>
            </div>

            <div
              ref="editorRef"
              contenteditable="true"
              class="editor-content"
              placeholder="Nhập phản hồi của bạn..."
              @input="handleEditorInput"
            />

            <!-- Image Upload (Hidden) -->
            <input
              ref="imageInputRef"
              type="file"
              accept="image/*"
              multiple
              style="display: none"
              @change="handleImageSelect"
            />

            <!-- Upload Button with Icon -->
            <div class="upload-section">
              <a-button type="link" @click="triggerImageUpload">
                <LinkOutlined />
                Thêm ảnh hoặc video mô tả
              </a-button>
            </div>

            <!-- Preview Uploaded Images -->
            <div v-if="uploadedImages.length > 0" class="preview-images">
              <div
                v-for="(image, idx) in uploadedImages"
                :key="idx"
                class="preview-item"
              >
                <img :src="image" alt="Preview" />
                <a-button
                  size="small"
                  type="text"
                  danger
                  class="remove-btn"
                  @click="removeImage(idx)"
                >
                  <CloseOutlined />
                </a-button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <a-button
              v-if="request.status !== 'completed'"
              size="large"
              class="complete-btn"
              @click="handleComplete"
            >
              Đánh dấu hoàn tất
            </a-button>
            <a-button
              type="primary"
              size="large"
              :loading="submitting"
              @click="handleSendReply"
            >
              Gửi
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  ArrowLeftOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  CloseOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { io, Socket } from 'socket.io-client'
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/stores/auth'
import dayjs from 'dayjs'
import { useSupportRequestsApi } from '~/composables/api/useSupportRequestsApi'
import type { SupportRequest, SupportRequestCategory } from '~/composables/api/useSupportRequestsApi'

// Define page meta
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

// Types
interface Comment {
  id: string
  author: string
  avatar: string
  message: string
  time: string
  isStaff: boolean
  images?: string[]
}

// Get route params
const route = useRoute()
const requestId = computed(() => route.params.id as string)
const customerId = computed(() => route.query.customerId as string)

// API
const { getSupportRequestById, updateSupportRequest, getComments, addComment, addCommentWithFiles } = useSupportRequestsApi()

// State
const loading = ref(true)
const error = ref('')
const submitting = ref(false)
const request = ref<SupportRequest | null>(null)
const comments = ref<Comment[]>([])
const editorRef = ref<HTMLDivElement>()
const imageInputRef = ref<HTMLInputElement>()
const uploadedImages = ref<string[]>([])
const replyContent = ref('')
const commentsContainerRef = ref<HTMLElement | null>(null)
let commentsPollInterval: ReturnType<typeof setInterval> | null = null

// Category mapping
const categoryMap: Record<SupportRequestCategory, string> = {
  parent_support: 'Hỗ trợ cha mẹ',
  health_issue: 'Vấn đề sức khỏe',
  service: 'Dịch vụ',
  course: 'Khóa học',
  other: 'Khác'
}

const categoryName = computed(() => {
  return request.value ? categoryMap[request.value.category] || 'Tên danh mục' : ''
})

// Status config
const statusConfig = {
  pending: { color: 'default', text: 'CHỜ XỬ LÝ' },
  processing: { color: 'warning', text: 'ĐANG XỬ LÝ' },
  completed: { color: 'success', text: 'HOÀN TẤT' }
}

const statusColor = computed(() => request.value ? statusConfig[request.value.status].color : 'default')
const statusText = computed(() => request.value ? statusConfig[request.value.status].text : '')

// Socket.io instance
const socket = ref<Socket | null>(null)

// Fetch request details
const fetchRequestDetail = async () => {
  try {
    loading.value = true
    error.value = ''

    // Fetch from API
    const response = await getSupportRequestById(requestId.value)
    request.value = response

    // Load comments từ backend tickets API
    await loadComments()
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Không thể tải thông tin yêu cầu hỗ trợ'
  } finally {
    loading.value = false
  }
}

// Editor functions
const formatText = (command: string) => {
  document.execCommand(command, false)
  editorRef.value?.focus()
}

const insertLink = () => {
  const url = prompt('Nhập URL:')
  if (url) {
    document.execCommand('createLink', false, url)
  }
}

const triggerImageUpload = () => {
  imageInputRef.value?.click()
}

const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          uploadedImages.value.push(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    })
  }
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
}

const handleEditorInput = () => {
  replyContent.value = editorRef.value?.innerHTML || ''
}

// Actions
const handleBack = () => {
  navigateTo('/health-book/' + customerId.value + '?tab=support')
}

const handleComplete = () => {
  Modal.confirm({
    title: 'Xác nhận hoàn tất',
    content: 'Bạn có chắc chắn muốn đánh dấu yêu cầu này là hoàn tất?',
    okText: 'Đồng ý',
    cancelText: 'Hủy',
    onOk: async () => {
      try {
        // Update status via API
        if (request.value) {
          await updateSupportRequest(request.value.id, {
            status: 'completed'
          })
          request.value.status = 'completed'
          message.success('Đã đánh dấu hoàn tất!')
        }
      } catch (err: any) {
        const errorMessage = err?.data?.message || err?.message || 'Có lỗi xảy ra'
        message.error(errorMessage)
      }
    }
  })
}

const handleSendReply = async () => {
  const content = editorRef.value?.innerText.trim()
  
  if (!content && uploadedImages.value.length === 0) {
    message.warning('Vui lòng nhập nội dung phản hồi!')
    return
  }

  try {
    submitting.value = true

    // Gửi comment qua API tickets (user)
    let newComment: any = null

    // Nếu có file, dùng multipart
    if (uploadedImages.value.length > 0 && imageInputRef.value?.files?.length) {
      const files = Array.from(imageInputRef.value.files)
      newComment = await addCommentWithFiles(requestId.value, content || '', files as File[])
    } else {
      newComment = await addComment(requestId.value, content || '')
    }

    if (newComment) {
      // Map TicketComment -> Comment UI (trong khi chờ socket event)
      comments.value.push({
        id: newComment._id,
        author: newComment.name || 'Bạn',
        avatar: newComment.avatar || '/images/avatar-fallback.png',
        message: newComment.content || '',
        time: dayjs(newComment.createdAt || new Date()).format('HH:mm DD/MM/YYYY'),
        isStaff: !!newComment.isAdmin,
        images: (newComment.attachments || []).map((a: any) => a.url).filter((x: string) => !!x),
      })
    }

    if (editorRef.value) {
      editorRef.value.innerHTML = ''
    }
    uploadedImages.value = []
    replyContent.value = ''

    message.success('Đã gửi phản hồi!')
    scrollToBottom()
  } catch (err: any) {
    const errorMessage = err?.data?.message || err?.message || 'Có lỗi xảy ra'
    message.error(errorMessage)
  } finally {
    submitting.value = false
  }
}

// Map API comment -> Comment UI
const mapComment = (c: any) => ({
  id: c._id,
  author: c.isAdmin && c.adminId
    ? (typeof c.adminId === 'object' ? c.adminId.fullname : null) || 'Chuyên viên'
    : c.name || 'Bạn',
  avatar: (c.adminId && typeof c.adminId === 'object' ? c.adminId.avatar : null) ||
    (c.userId && typeof c.userId === 'object' ? c.userId.avatar : null) ||
    c.avatar ||
    '/images/avatar-fallback.png',
  message: c.content || '',
  time: dayjs(c.createdAt || new Date()).format('HH:mm DD/MM/YYYY'),
  isStaff: !!c.isAdmin,
  images: (c.attachments || []).map((a: any) => a.url).filter((x: string) => !!x),
})

// Load comments helper: dùng Tickets API user-side
const loadComments = async () => {
  try {
    const ticketComments = await getComments(requestId.value)
    comments.value = ticketComments.map((c: any) => mapComment(c))
    scrollToBottom()
  } catch (e) {
    // Nếu lỗi thì giữ comments hiện tại
  }
}

// Poll comments để nhận tin admin khi socket không tới (fallback realtime)
const pollComments = async () => {
  if (!requestId.value) return
  try {
    const ticketComments = await getComments(requestId.value)
    const newList = ticketComments.map((c: any) => mapComment(c))
    const prevLen = comments.value.length
    const prevLastId = comments.value[prevLen - 1]?.id
    const hasNew = newList.length > prevLen || (newList.length > 0 && newList[newList.length - 1]?.id !== prevLastId)
    if (hasNew) {
      comments.value = newList
      scrollToBottom()
    }
  } catch (_) {}
}

const scrollToBottom = () => {
  if (commentsContainerRef.value) {
    commentsContainerRef.value.scrollTop = commentsContainerRef.value.scrollHeight
  }
}

// Socket: join room (gọi sau khi đã có request từ API để dùng đúng id backend)
const joinTicketRoom = () => {
  const tid = request.value?.id ?? requestId.value
  if (socket.value && tid) {
    socket.value.emit('join', { ticketId: String(tid) })
  }
}

// Lifecycle
onMounted(async () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  // Lấy URL backend từ server (tránh client dùng apiBaseUrl rỗng -> kết nối nhầm sang Nuxt)
  let socketBaseUrl = ''
  try {
    const res = await $fetch<{ url?: string }>('/api/socket-base-url')
    socketBaseUrl = (res?.url || '').replace(/\/$/, '')
  } catch (_) {}
  if (!socketBaseUrl) {
    socketBaseUrl = (config.public.apiBaseUrl || config.public.apiHost || 'http://localhost:3000') as string
    socketBaseUrl = socketBaseUrl.replace(/\/$/, '')
  }

  socket.value = io(`${socketBaseUrl}/tickets`, {
    auth: { token: authStore.token },
    transports: ['websocket', 'polling'],
    withCredentials: true,
  })

  socket.value.on('connect', () => {
    joinTicketRoom()
  })
  socket.value.on('connect_error', () => {
    // Có thể log hoặc thông báo; vẫn dùng HTTP bình thường
  })

  socket.value.on('ticket:comment:new', (payload: any) => {
    if (!payload || !payload.comment) return
    const tid = payload.ticketId != null ? String(payload.ticketId) : ''
    const myId = String(request.value?.id ?? requestId.value)
    if (tid !== myId) return
    const c = payload.comment

    const authorName =
      c.isAdmin && c.adminId
        ? (typeof c.adminId === 'object' ? c.adminId.fullname : null) || 'Chuyên viên'
        : c.name || (c.userId && typeof c.userId === 'object' ? c.userId.fullname : null) || 'Bạn'
    const avatar =
      (c.adminId && typeof c.adminId === 'object' ? c.adminId.avatar : null) ||
      (c.userId && typeof c.userId === 'object' ? c.userId.avatar : null) ||
      c.avatar ||
      '/images/avatar-fallback.png'

    comments.value.push({
      id: (c._id && String(c._id)) || Date.now().toString(),
      author: authorName,
      avatar,
      message: c.content || c.message || '',
      time: dayjs(c.createdAt || new Date()).format('HH:mm DD/MM/YYYY'),
      isStaff: !!c.isAdmin,
      images: (c.attachments || []).map((a: any) => a.url).filter((x: string) => !!x),
    })
    scrollToBottom()
  })

  await fetchRequestDetail()
  joinTicketRoom()

  // Poll 3s một lần để nhận tin admin khi socket không tới (không cần F5)
  commentsPollInterval = setInterval(pollComments, 3000)
})

onBeforeUnmount(() => {
  if (commentsPollInterval) {
    clearInterval(commentsPollInterval)
    commentsPollInterval = null
  }
  if (socket.value) {
    socket.value.disconnect()
    socket.value = null
  }
})
</script>

<style scoped>
.support-request-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* Request Content */
.request-content {
  margin-bottom: 24px;
}

.request-title {
  font-size: 18px;
  font-weight: 600;
  color: #317BC4;
  margin-bottom: 16px;
}

.request-description {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 20px;
}

.attachments {
  margin-bottom: 20px;
}

.attachment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.attachment-item {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.attachment-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #999;
}

.meta-divider {
  color: #d9d9d9;
}

/* Comments Section */
.comments-section {
  margin-bottom: 24px;
  max-height: 420px;
  overflow-y: auto;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #317BC4;
  margin-bottom: 24px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 4px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.staff-comment {
  flex-direction: row;
}

.user-comment {
  flex-direction: row-reverse;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  max-width: 70%;
}

.staff-comment .comment-content {
  align-items: flex-start;
}

.user-comment .comment-content {
  align-items: flex-end;
}

.comment-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 6px;
}

.staff-comment .comment-bubble {
  background-color: #317BC4;
  color: white;
  border-bottom-left-radius: 4px;
}

.user-comment .comment-bubble {
  background-color: #f5f5f5;
  color: #333;
  border-bottom-right-radius: 4px;
}

.comment-text {
  margin: 0;
  line-height: 1.6;
  font-size: 14px;
}

.comment-images {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.comment-image {
  max-width: 200px;
  border-radius: 8px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.staff-comment .comment-time {
  display: block;
  text-align: left;
}

.user-comment .comment-time {
  display: block;
  text-align: right;
}

.empty-comments {
  padding: 40px 0;
  text-align: center;
}

/* Reply Form */
.reply-form {
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
}

.editor-wrapper {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  margin-bottom: 16px;
  background: white;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.editor-content {
  min-height: 120px;
  padding: 12px 16px;
  outline: none;
  font-size: 14px;
  line-height: 1.6;
}

.editor-content:empty:before {
  content: attr(placeholder);
  color: #bfbfbf;
}

.upload-section {
  padding: 8px 16px;
  border-top: 1px solid #f0f0f0;
}

.preview-images {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  flex-wrap: wrap;
  border-top: 1px solid #f0f0f0;
}

.preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.complete-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
}

.complete-btn:hover {
  background-color: #ff7875;
}

.status-tag {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .attachment-grid {
    grid-template-columns: 1fr;
  }

  .comment-content {
    max-width: 85%;
  }

  .action-buttons {
    flex-direction: column-reverse;
  }

  .action-buttons button {
    width: 100%;
  }

  .editor-toolbar {
    flex-wrap: wrap;
  }
}
</style>
