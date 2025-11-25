<template>
  <div class="support-request-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <a-spin size="large" />
      <p class="loading-text">Đang tải thông tin...</p>
    </div>

    <!-- Error State -->
    <a-result
      v-else-if="error"
      status="error"
      title="Không thể tải thông tin yêu cầu hỗ trợ"
      :sub-title="error"
    >
      <template #extra>
        <a-button type="primary" @click="fetchRequest">
          Thử lại
        </a-button>
        <a-button @click="goBack">
          Quay lại
        </a-button>
      </template>
    </a-result>

    <!-- Content -->
    <div v-else-if="request" class="detail-content">
      <!-- Header -->
      <div class="detail-header">
        <h1 class="page-title">
          Yêu cầu hỗ trợ #{{ formatTicketNumber(request.ticketNumber) }}
        </h1>
        <a-button type="link" class="back-btn" @click="goBack">
          <LeftOutlined />
          <span>Quay lại</span>
        </a-button>
      </div>

      <!-- Request Info Card -->
      <div class="request-info-card">
        <div class="category-label">
          [{{ getCategoryLabel(request.category) }}] {{ request.title }}
        </div>
        <p class="description">{{ request.description }}</p>
        
        <!-- Attachments -->
        <div v-if="request.attachments && request.attachments.length > 0" class="attachments">
          <div class="attachment-list">
            <div
              v-for="(attachment, index) in request.attachments"
              :key="index"
              class="attachment-item"
              @click="previewImage(attachment.url)"
            >
              <img :src="attachment.url" :alt="attachment.filename" />
            </div>
          </div>
        </div>
      </div>

      <!-- Responses Section -->
      <div class="responses-section">
        <h2 class="section-title">Phản hồi</h2>
        
        <div class="responses-list">
          <!-- Response Messages -->
          <div
            v-for="(response, index) in responses"
            :key="index"
            :class="['response-item', response.isAdmin ? 'admin-response' : 'user-response']"
          >
            <div class="response-bubble">
              <p class="response-text">{{ response.content }}</p>
              <!-- Response Attachments -->
              <div v-if="response.attachments && response.attachments.length > 0" class="response-attachments">
                <div
                  v-for="(img, imgIndex) in response.attachments"
                  :key="imgIndex"
                  class="response-attachment"
                  @click="previewImage(img.url)"
                >
                  <img :src="img.url" :alt="img.filename" />
                </div>
              </div>
            </div>
            <div class="response-avatar">
              <a-avatar :src="response.avatar" :size="32">
                {{ response.name?.charAt(0) || 'U' }}
              </a-avatar>
            </div>
          </div>

          <!-- Empty Responses -->
          <div v-if="responses.length === 0" class="empty-responses">
            <p>Chưa có phản hồi nào.</p>
          </div>
        </div>
      </div>

      <!-- Reply Section -->
      <div class="reply-section">
        <!-- Reply Editor -->
        <div class="reply-editor">
          <div class="editor-toolbar">
            <button class="toolbar-btn" title="Bold">
              <BoldOutlined />
            </button>
            <button class="toolbar-btn" title="Italic">
              <ItalicOutlined />
            </button>
            <button class="toolbar-btn" title="Underline">
              <UnderlineOutlined />
            </button>
            <button class="toolbar-btn" title="Strikethrough">
              <StrikethroughOutlined />
            </button>
            <button class="toolbar-btn" title="Ordered List">
              <OrderedListOutlined />
            </button>
            <button class="toolbar-btn" title="Unordered List">
              <UnorderedListOutlined />
            </button>
          </div>
          <a-textarea
            v-model:value="replyContent"
            :rows="4"
            placeholder="Nhập nội dung phản hồi..."
            class="reply-textarea"
          />
        </div>

        <!-- Mobile: Add attachment button -->
        <div class="mobile-attachment-btn">
          <a-upload
            v-model:file-list="replyFileList"
            :before-upload="beforeUpload"
            :custom-request="handleUpload"
            :show-upload-list="false"
            accept="image/*,video/*"
          >
            <a-button type="link" class="add-attachment-btn">
              <LinkOutlined />
              Thêm ảnh hoặc video mô tả
            </a-button>
          </a-upload>
        </div>

        <!-- Preview uploaded files -->
        <div v-if="replyFileList.length > 0" class="uploaded-preview">
          <div
            v-for="file in replyFileList"
            :key="file.uid"
            class="preview-item"
          >
            <img v-if="file.thumbUrl || file.url" :src="file.thumbUrl || file.url" alt="preview" />
            <span class="file-name">{{ file.name }}</span>
            <a-button type="text" size="small" @click="removeFile(file)">
              <CloseOutlined />
            </a-button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <a-button
            v-if="request.status !== 'completed'"
            type="default"
            size="large"
            class="complete-btn"
            :loading="completing"
            @click="handleMarkComplete"
          >
            Đánh dấu hoàn tất
          </a-button>
          <a-button
            type="primary"
            size="large"
            class="send-btn"
            :loading="sending"
            :disabled="!replyContent.trim()"
            @click="handleSendReply"
          >
            Gửi
          </a-button>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <a-modal
      v-model:visible="previewVisible"
      :footer="null"
      :width="800"
      class="image-preview-modal"
    >
      <img :src="previewImageUrl" alt="Preview" class="preview-image" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  LeftOutlined,
  LinkOutlined,
  CloseOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { useSupportRequestsApi } from '~/composables/api/useSupportRequestsApi'
import type { SupportRequest, SupportRequestCategory } from '~/composables/api/useSupportRequestsApi'

// Route
const route = useRoute()
const router = useRouter()
const requestId = computed(() => route.params.id as string)

// API
const { getSupportRequestById, updateSupportRequest } = useSupportRequestsApi()

// State
const loading = ref(true)
const error = ref<string | null>(null)
const request = ref<SupportRequest | null>(null)
const responses = ref<Array<{
  content: string
  isAdmin: boolean
  name: string
  avatar?: string
  attachments?: Array<{ url: string; filename: string }>
  createdAt: string
}>>([])

// Reply state
const replyContent = ref('')
const replyFileList = ref<UploadProps['fileList']>([])
const sending = ref(false)
const completing = ref(false)

// Preview state
const previewVisible = ref(false)
const previewImageUrl = ref('')

// Helpers
const formatTicketNumber = (ticketNumber: string): string => {
  const num = ticketNumber?.replace(/\D/g, '') || '00000'
  return num.slice(-6).padStart(6, '0')
}

const getCategoryLabel = (category: SupportRequestCategory): string => {
  const labels: Record<SupportRequestCategory, string> = {
    parent_support: 'Hỗ trợ cha mẹ',
    health_issue: 'Vấn đề sức khỏe',
    service: 'Dịch vụ',
    course: 'Khóa học',
    other: 'Khác',
  }
  return labels[category] || 'Tên danh mục'
}

// Fetch request details
const fetchRequest = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await getSupportRequestById(requestId.value)
    if (data) {
      request.value = data
      // Mock responses for demo - replace with actual API call
      responses.value = [
        {
          content: 'Với trẻ sơ sinh dưới 6 tuổi với nhu cầu ngủ nhiều vào cả ban ngày và ban đêm, việc thức liên 5 tiếng chắc chắn là tình trạng bất thường. Cha mẹ cần sớm tìm ra nguyên nhân vì nếu tình trạng này lặp lại thường xuyên sẽ ảnh hưởng không nhỏ đến sự phát triển của trẻ. Ngược lại, nếu trẻ đã trên 6 tháng tuổi và có thể ngủ liên mạch những giấc dài ban đêm, thời gian ngủ ban ngày của trẻ rút ngắn và thời gian thức ban ngày tăng lên là bình thường.',
          isAdmin: true,
          name: 'Admin',
          avatar: '/images/admin-avatar.png',
          createdAt: new Date().toISOString(),
        },
        {
          content: 'Ngay cả khi trẻ trên 6 tháng tuổi đã có thể thức liên 5 tiếng, thì việc trẻ thức ban đêm vẫn là bất thường. Nếu trong độ tuổi này, trẻ thức liên 5 tiếng vào ban ngày không quá đáng ngại.',
          isAdmin: false,
          name: 'Nguyễn Văn A',
          avatar: '/images/user-avatar.png',
          attachments: [
            { url: '/images/sample-food.jpg', filename: 'food.jpg' },
          ],
          createdAt: new Date().toISOString(),
        },
      ]
    } else {
      error.value = 'Không tìm thấy yêu cầu hỗ trợ'
    }
  } catch (err: any) {
    console.error('Error fetching support request:', err)
    error.value = err.message || 'Không thể tải thông tin yêu cầu hỗ trợ'
  } finally {
    loading.value = false
  }
}

// Navigation
const goBack = () => {
  router.back()
}

// Image preview
const previewImage = (url: string) => {
  previewImageUrl.value = url
  previewVisible.value = true
}

// Upload handlers
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')

  if (!isImage && !isVideo) {
    message.error('Chỉ có thể tải lên hình ảnh hoặc video!')
    return false
  }

  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('Dung lượng file không được vượt quá 10MB!')
    return false
  }

  return true
}

const handleUpload: UploadProps['customRequest'] = (options) => {
  const { file, onSuccess } = options

  setTimeout(() => {
    if (onSuccess) {
      onSuccess({
        url: URL.createObjectURL(file as File),
      })
    }
  }, 500)
}

const removeFile = (file: any) => {
  const index = replyFileList.value?.findIndex((f) => f.uid === file.uid)
  if (index !== undefined && index > -1) {
    replyFileList.value?.splice(index, 1)
  }
}

// Actions
const handleSendReply = async () => {
  if (!replyContent.value.trim()) {
    message.warning('Vui lòng nhập nội dung phản hồi')
    return
  }

  sending.value = true

  try {
    // TODO: Call API to send reply
    // For now, add to local list
    const attachments = replyFileList.value
      ?.filter((file) => file.status === 'done')
      .map((file) => {
        const response = file.response as { url?: string } | undefined
        return {
          url: response?.url || (file as any).url || '',
          filename: file.name || 'attachment',
        }
      })
      .filter((item) => item.url) || []

    responses.value.push({
      content: replyContent.value,
      isAdmin: false,
      name: 'Bạn',
      attachments,
      createdAt: new Date().toISOString(),
    })

    replyContent.value = ''
    replyFileList.value = []
    message.success('Gửi phản hồi thành công!')
  } catch (err: any) {
    message.error('Không thể gửi phản hồi')
  } finally {
    sending.value = false
  }
}

const handleMarkComplete = async () => {
  completing.value = true

  try {
    await updateSupportRequest(requestId.value, { status: 'completed' })
    if (request.value) {
      request.value.status = 'completed'
    }
    message.success('Đã đánh dấu hoàn tất!')
  } catch (err: any) {
    message.error('Không thể cập nhật trạng thái')
  } finally {
    completing.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchRequest()
})

// Page meta
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})
</script>

<style scoped>
.support-request-detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-text {
  margin-top: 16px;
  font-size: 16px;
  color: #666;
}

/* Header */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
  margin: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1890ff;
  font-weight: 500;
}

.back-btn:hover {
  color: #40a9ff;
}

/* Request Info Card */
.request-info-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.category-label {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 12px;
}

.description {
  font-size: 15px;
  line-height: 1.7;
  color: #333;
  margin: 0 0 16px;
}

.attachments {
  margin-top: 16px;
}

.attachment-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.attachment-item {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #e8e8e8;
}

.attachment-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.attachment-item:hover {
  border-color: #1890ff;
}

/* Responses Section */
.responses-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
  margin: 0 0 16px;
}

.responses-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.response-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.admin-response {
  flex-direction: row;
}

.user-response {
  flex-direction: row-reverse;
}

.response-bubble {
  max-width: 70%;
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
}

.admin-response .response-bubble {
  background: #e6f4ff;
  border: 1px solid #91caff;
  border-radius: 12px 12px 12px 0;
}

.user-response .response-bubble {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px 12px 0 12px;
}

.response-text {
  margin: 0;
  color: #333;
}

.response-attachments {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.response-attachment {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.response-attachment img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.response-avatar {
  flex-shrink: 0;
}

.empty-responses {
  text-align: center;
  padding: 40px;
  color: #999;
}

/* Reply Section */
.reply-section {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 20px;
}

.reply-editor {
  margin-bottom: 16px;
}

.editor-toolbar {
  display: flex;
  gap: 4px;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: #fafafa;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  color: #666;
}

.toolbar-btn:hover {
  background: #e8e8e8;
  color: #333;
}

.reply-textarea {
  border-radius: 0 0 8px 8px !important;
  resize: none;
}

.reply-textarea:focus {
  border-color: #1890ff !important;
  box-shadow: none !important;
}

.mobile-attachment-btn {
  display: none;
}

.add-attachment-btn {
  color: #1890ff;
  padding: 0;
  height: auto;
}

.uploaded-preview {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 8px;
}

.preview-item img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
}

.file-name {
  font-size: 13px;
  color: #666;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.complete-btn {
  border-color: #ff7875;
  color: #ff7875;
  border-radius: 8px;
  height: 44px;
  padding: 0 24px;
  font-weight: 500;
}

.complete-btn:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.send-btn {
  border-radius: 8px;
  height: 44px;
  padding: 0 32px;
  font-weight: 500;
}

/* Image Preview Modal */
.image-preview-modal :deep(.ant-modal-body) {
  padding: 0;
}

.preview-image {
  width: 100%;
  height: auto;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .support-request-detail-page {
    padding: 16px;
  }

  .detail-header {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .page-title {
    font-size: 20px;
    text-align: center;
  }

  .back-btn {
    display: none;
  }

  .request-info-card {
    padding: 16px;
  }

  .category-label {
    font-size: 15px;
  }

  .description {
    font-size: 14px;
  }

  .attachment-list {
    gap: 8px;
  }

  .attachment-item {
    width: 70px;
    height: 70px;
  }

  .response-bubble {
    max-width: 85%;
    padding: 12px;
    font-size: 13px;
  }

  .response-attachment {
    width: 100%;
    height: 150px;
  }

  .editor-toolbar {
    display: none;
  }

  .reply-textarea {
    border-radius: 8px !important;
  }

  .mobile-attachment-btn {
    display: block;
    text-align: center;
    margin-bottom: 16px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .send-btn,
  .complete-btn {
    width: 100%;
    height: 48px;
  }

  .send-btn {
    order: -1;
  }
}
</style>
