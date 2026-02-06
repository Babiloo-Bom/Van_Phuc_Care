<template>
  <div class="container mx-auto">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <a-spin size="large" />
      <p class="loading-text">Đang tải thông tin...</p>
    </div>

    <!-- Error State -->
    <a-result v-else-if="error" status="error" title="Không thể tải thông tin yêu cầu hỗ trợ" :sub-title="error">
      <template #extra>
        <a-button type="primary" @click="fetchRequest"> Thử lại </a-button>
        <a-button @click="goBack"> Quay lại </a-button>
      </template>
    </a-result>

    <!-- Content -->
    <div v-else-if="request" class="detail-content">
      <!-- Header -->
      <div class="detail-header">
        <h1 class="page-title">Yêu cầu hỗ trợ #{{ formatTicketNumber(request.ticketNumber) }}</h1>
        <a-button type="link" class="back-btn" @click="goBack">
          <LeftOutlined />
          <span>Quay lại</span>
        </a-button>
      </div>

      <!-- Request Info Card -->
      <div class="request-info-card">
        <div class="category-label">[{{ getCategoryLabel(request.category) }}] {{ request.title }}</div>

        <div class="request-content-wrapper">
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
                <img :src="attachment.url" :alt="attachment.filename" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Responses Section -->
      <div class="responses-section">
        <h2 class="section-title">Phản hồi</h2>

        <div ref="responsesListRef" class="responses-list">
          <!-- Response Messages -->
          <div
            v-for="(response, index) in responses"
            :key="response._id || index"
            :class="['response-item', response.isAdmin ? 'admin-response' : 'user-response']"
          >
            <div class="response-content">
              <div class="response-bubble">
                <p class="response-text">{{ response.content }}</p>
              </div>
              <!-- Response Attachments - Outside bubble -->
              <div v-if="response.attachments && response.attachments.length > 0" class="response-attachments">
                <div
                  v-for="(img, imgIndex) in response.attachments"
                  :key="imgIndex"
                  class="response-attachment"
                  @click="previewImage(img.url)"
                >
                  <img :src="img.url" :alt="img.filename" loading="lazy" />
                  <div v-if="isVideo(img.url)" class="video-play-icon">
                    <PlayCircleOutlined />
                  </div>
                </div>
              </div>
            </div>
            <div class="response-avatar">
              <a-avatar :src="response.avatar" :size="40">
                {{ response.name?.charAt(0) || "U" }}
              </a-avatar>
            </div>
          </div>

          <!-- Empty Responses -->
          <div v-if="responses.length === 0" class="empty-responses">
            <p>Chưa có phản hồi nào.</p>
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
              <div class="toolbar-divider"></div>
              <a-upload
                v-model:file-list="replyFileList"
                :before-upload="beforeUpload"
                :show-upload-list="false"
                accept="image/*,video/*"
                :multiple="true"
              >
                <button class="toolbar-btn" title="Thêm ảnh hoặc video">
                  <PictureOutlined />
                </button>
              </a-upload>
            </div>
            <!-- Mobile: Add attachment button -->
            <div class="mobile-attachment-btn">
              <a-upload
                v-model:file-list="replyFileList"
                :before-upload="beforeUpload"
                :show-upload-list="false"
                accept="image/*,video/*"
                :multiple="true"
              >
                <a-button type="link" class="add-attachment-btn">
                  <LinkOutlined />
                  Thêm ảnh hoặc video mô tả
                </a-button>
              </a-upload>
            </div>
            <a-textarea
              v-model:value="replyContent"
              :rows="4"
              placeholder="Nhập nội dung phản hồi..."
              class="reply-textarea"
              :style="replyFileList?.length ? { borderRadius: '0 !important' } : {}"
            />
            <!-- Preview uploaded files -->
            <div v-if="replyFileList?.length" class="uploaded-preview">
              <div v-for="file in replyFileList" :key="file.uid" class="preview-item">
                <img v-if="getFilePreviewUrl(file)" :src="getFilePreviewUrl(file)" alt="preview" loading="lazy" />
                <a-button type="text" size="small" @click="removeFile(file)">
                  <CloseOutlined />
                </a-button>
              </div>
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
    </div>

    <!-- Image Preview Modal -->
    <a-modal v-model:visible="previewVisible" :footer="null" :width="800" class="image-preview-modal">
      <img :src="previewImageUrl" alt="Preview" class="preview-image" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { io } from "socket.io-client";
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
  PictureOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { UploadProps } from "ant-design-vue";
import { useSupportRequestsApi } from "~/composables/api/useSupportRequestsApi";
import type { SupportRequest, SupportRequestCategory } from "~/composables/api/useSupportRequestsApi";

// Route
const route = useRoute();
const router = useRouter();
const requestId = computed(() => route.params.id as string);

// API
const { getSupportRequestById, updateSupportRequest, getComments, addCommentWithFiles } = useSupportRequestsApi();

// State
const loading = ref(true);
const error = ref<string | null>(null);
const request = ref<SupportRequest | null>(null);
const responses = ref<
  Array<{
    _id?: string;
    content: string;
    isAdmin: boolean;
    name: string;
    avatar?: string;
    attachments?: Array<{ url: string; filename: string }>;
    createdAt: string;
  }>
>([]);

// Reply state
const replyContent = ref("");
const replyFileList = ref<UploadProps["fileList"]>([]);
const sending = ref(false);
const completing = ref(false);
const responsesListRef = ref<HTMLElement | null>(null);
const ticketSocket = ref<any | null>(null);

// Preview state
const previewVisible = ref(false);
const previewImageUrl = ref("");

// Helpers
const formatTicketNumber = (ticketNumber: string): string => {
  const num = ticketNumber?.replace(/\D/g, "") || "00000";
  return num.slice(-6).padStart(6, "0");
};

const getCategoryLabel = (category: SupportRequestCategory): string => {
  const labels: Record<SupportRequestCategory, string> = {
    parent_support: "Hỗ trợ cha mẹ",
    health_issue: "Vấn đề sức khỏe",
    service: "Dịch vụ",
    course: "Khóa học",
    other: "Khác",
  };
  return labels[category] || "Tên danh mục";
};

// Fetch request details and comments
const fetchRequest = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await getSupportRequestById(requestId.value);
    if (data) {
      request.value = data;
      // Fetch comments
      await fetchComments();
    } else {
      error.value = "Không tìm thấy yêu cầu hỗ trợ";
    }
  } catch (err: any) {
    error.value = err.message || "Không thể tải thông tin yêu cầu hỗ trợ";
  } finally {
    loading.value = false;
  }
};

// Fetch comments
const fetchComments = async () => {
  try {
    const comments = await getComments(requestId.value);
    responses.value = comments;
    scrollResponsesToBottom();
  } catch (err: any) {
  }
};

const scrollResponsesToBottom = () => {
  nextTick(() => {
    const el = responsesListRef.value;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  });
};

// Navigation
const goBack = () => {
  router.back();
};

// Image preview
const previewImage = (url: string) => {
  previewImageUrl.value = url;
  previewVisible.value = true;
};

// Check if URL is video
const isVideo = (url: string): boolean => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

// Upload handlers - return false to prevent auto upload
const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  if (!isImage && !isVideo) {
    message.error("Chỉ có thể tải lên hình ảnh hoặc video!");
    return false;
  }

  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error("Dung lượng file không được vượt quá 10MB!");
    return false;
  }

  // Return false to prevent auto upload - files will be sent with comment API
  return false;
};

// Get preview URL for file
const getFilePreviewUrl = (file: any): string => {
  if (file.thumbUrl) return file.thumbUrl;
  if (file.url) return file.url;
  if (file.originFileObj) {
    return URL.createObjectURL(file.originFileObj);
  }
  return "";
};

const removeFile = (file: any) => {
  const index = replyFileList.value?.findIndex((f) => f.uid === file.uid);
  if (index !== undefined && index > -1) {
    replyFileList.value?.splice(index, 1);
  }
};

// Actions
const handleSendReply = async () => {
  if (!replyContent.value.trim()) {
    message.warning("Vui lòng nhập nội dung phản hồi");
    return;
  }

  sending.value = true;

  try {
    // Collect files from fileList
    const files: File[] = [];
    if (replyFileList.value && replyFileList.value.length > 0) {
      for (const file of replyFileList.value) {
        const fileToUpload = file.originFileObj || file;
        if (fileToUpload instanceof File) {
          files.push(fileToUpload);
        }
      }
    }

    // Call API to add comment with files
    // Server will handle uploading files to MinIO
    await addCommentWithFiles(requestId.value, replyContent.value, files);

    // Comment sẽ được nhận qua Socket.IO listener (ticket:comment:new)
    // Không push local để tránh duplicate
    replyContent.value = "";
    replyFileList.value = [];
    message.success("Gửi phản hồi thành công!");
  } catch (err: any) {
    message.error(err.message || "Không thể gửi phản hồi");
  } finally {
    sending.value = false;
  }
};

const handleMarkComplete = async () => {
  completing.value = true;

  try {
    await updateSupportRequest(requestId.value, { status: "completed" });
    if (request.value) {
      request.value.status = "completed";
    }
    message.success("Đã đánh dấu hoàn tất!");
  } catch (err: any) {
    message.error("Không thể cập nhật trạng thái");
  } finally {
    completing.value = false;
  }
};

// Socket.IO realtime comments
const connectSocket = () => {
  try {
    const config = useRuntimeConfig();
    const apiHost = config.public.apiBaseUrl || config.public.apiHost || 'http://localhost:3000';
    
    console.log('[Socket] Attempting to connect:', `${apiHost}/tickets`);

    ticketSocket.value = io(`${apiHost}/tickets`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    const joinRoom = () => {
      console.log('[Socket] Joining room:', String(requestId.value));
      ticketSocket.value?.emit('join', { ticketId: String(requestId.value) });
    };

    // Join room sau khi connected (và rejoin khi reconnect)
    ticketSocket.value.on('connect', () => {
      console.log('[Socket] Connected! Socket ID:', ticketSocket.value?.id);
      joinRoom();
    });

    ticketSocket.value.on('ticket:comment:new', (payload: any) => {
      console.log('[Socket] Received ticket:comment:new:', payload);
      if (!payload || !requestId.value) return;
      if (String(payload.ticketId) !== String(requestId.value)) return;

      const c = payload.comment;
      if (!c) return;

      // Dedup: skip if comment already exists (from optimistic push)
      if (c._id && responses.value.some((r) => r._id === c._id)) return;

      responses.value.push(c);
      scrollResponsesToBottom();
    });
  } catch (e) {
    console.error('[Socket] Connection error:', e);
    // Socket lỗi thì bỏ qua
  }
};

// Lifecycle
onMounted(async () => {
  console.log('[Page] Mounted, fetching request...');
  await fetchRequest();
  console.log('[Page] Calling connectSocket...');
  connectSocket();
});

onBeforeUnmount(() => {
  if (ticketSocket.value) {
    ticketSocket.value.disconnect();
    ticketSocket.value = null;
  }
});

// Page meta
definePageMeta({
  layout: "default",
  middleware: ["auth"],
});
</script>

<style scoped>
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
  color: #317bc4;
  margin: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #317bc4;
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
  color: #317bc4;
  margin-bottom: 12px;
}

.request-content-wrapper {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.description {
  font-size: 15px;
  line-height: 1.7;
  color: #333;
  margin: 0;
  flex: 1;
}

.attachments {
  flex-shrink: 0;
}

.attachment-list {
  display: flex;
  gap: 8px;
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
  border-color: #317bc4;
}

/* Responses Section */
.responses-section {
  background-color: #fff;
  padding: 24px;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #317bc4;
  margin: 0 0 16px;
}

.responses-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.response-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: flex-end;
}

.admin-response {
  flex-direction: row-reverse;
}

.user-response {
  flex-direction: row;
}

.response-content {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.admin-response .response-content {
  align-items: flex-start;
}

.user-response .response-content {
  align-items: flex-end;
}

.response-bubble {
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
}

.admin-response .response-bubble {
  background: #1a75bb;
  border: none;
  border-radius: 12px;
}

.admin-response .response-text {
  color: #fff;
}

.user-response .response-bubble {
  background: #f4f7f9;
  border: none;
  border-radius: 12px;
}

.user-response .response-text {
  color: #020618;
}

.response-text {
  margin: 0;
}

.response-attachments {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding: 12px;
  background-color: #f4f7f9;
  border-radius: 8px;
}

.response-attachment {
  position: relative;
  width: 200px;
  height: 140px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.response-attachment img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.response-attachment:hover {
  border-color: #317bc4;
}

.video-play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.response-avatar {
  flex-shrink: 0;
  margin-top: 4px;
}

.empty-responses {
  text-align: center;
  padding: 40px;
  color: #999;
}

/* Reply Section */
.reply-section {
  background: #fff;
  padding-top: 20px;
}

.reply-editor {
  margin-bottom: 16px;
  border-bottom: 1px solid #1a75bb;
  border-radius: 0 0 8px 8px;
}

.editor-toolbar {
  display: flex;
  gap: 4px;
  padding: 8px;
  border: 1px solid #1a75bb;
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

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #d9d9d9;
  margin: 6px 4px;
}

.reply-textarea {
  resize: none;
}

.mobile-attachment-btn {
  display: none;
}

.add-attachment-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #317bc4;
  padding: 0;
  height: auto;
  font-size: 14px;
}

.uploaded-preview {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 16px 8px;
  border-left: 1px solid #1a75bb;
  border-right: 1px solid #1a75bb;
  border-radius: 0 0 8px 8px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  border-radius: 8px;
  position: relative;
}

.preview-item img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
}

:deep(.preview-item .ant-btn) {
  position: absolute;
  top: -8px;
  right: -8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  color: #fff;
  width: 20px;
  height: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: #ff6b6b;
  border-color: #ff6b6b;
  color: #fff;
  border-radius: 8px;
  height: 44px;
  padding: 0 24px;
  font-weight: 500;
}

.complete-btn:hover {
  background: #ff5252;
  border-color: #ff5252;
  color: #fff;
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

:deep(.ant-input.reply-textarea) {
  border-radius: 0 0 8px 8px !important;
  border: 1px solid #1a75bb !important;
  border-bottom: none !important;
}

/* Mobile Responsive */
@media (max-width: 768px) {
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

  .request-content-wrapper {
    flex-direction: column;
    gap: 16px;
  }

  .description {
    font-size: 14px;
  }

  .attachments {
    width: 100%;
  }

  .attachment-list {
    gap: 8px;
  }

  .attachment-item {
    width: calc(33.33% - 6px);
    height: auto;
    aspect-ratio: 1;
  }

  .response-content {
    max-width: 85%;
  }

  .response-bubble {
    padding: 12px 16px;
    font-size: 13px;
  }

  .response-attachment {
    width: 100%;
    height: 150px;
  }

  .response-attachments {
    gap: 8px;
  }

  .video-play-icon {
    font-size: 36px;
  }

  .response-avatar :deep(.ant-avatar) {
    width: 32px !important;
    height: 32px !important;
    font-size: 12px !important;
  }

  .editor-toolbar {
    display: none;
  }

  .reply-textarea {
    border-radius: 0 0 8px 8px !important;
    border: 1px solid #1a75bb;
  }

  .mobile-attachment-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px 16px;
    background: #fff;
    border: 1px solid #1a75bb;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
  }

  .action-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .send-btn,
  .complete-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
  }

  .send-btn {
    order: -1;
  }

  .complete-btn {
    background: #ff6b6b;
    border-color: #ff6b6b;
    color: #fff;
  }

  .complete-btn:hover {
    background: #ff5252;
    border-color: #ff5252;
    color: #fff;
  }
}
</style>
