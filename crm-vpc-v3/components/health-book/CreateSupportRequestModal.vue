<template>
  <a-modal
    v-model:visible="isVisible"
    :footer="null"
    :width="700"
    :closable="false"
    class="create-support-request-modal"
  >
    <template #closeIcon>
      <CloseOutlined />
    </template>

    <!-- Custom Header with Close Button -->
    <div class="modal-header">
      <h2 class="modal-title">TẠO YÊU CẦU HỖ TRỢ</h2>
      <a-button type="text" class="close-button" @click="handleClose">
        <CloseOutlined />
      </a-button>
    </div>

    <!-- Form -->
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      class="support-form"
      @finish="handleSubmit"
    >
      <!-- Category -->
      <a-form-item label="Danh mục" name="category" :required="true">
        <a-select v-model:value="formState.category" placeholder="Hỗ trợ cha mẹ" size="large">
          <a-select-option value="parent_support">Hỗ trợ cha mẹ</a-select-option>
          <a-select-option value="health_issue">Vấn đề sức khỏe</a-select-option>
          <a-select-option value="service">Dịch vụ</a-select-option>
          <a-select-option value="course">Khóa học</a-select-option>
          <a-select-option value="other">Khác</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Description -->
      <a-form-item label="Vấn đề của bạn (Mô tả)" name="description" :required="true">
        <a-textarea v-model:value="formState.description" :rows="6" placeholder="" :maxlength="1000" />
        <div class="helper-text hidden md:block">
          Vui lòng bao gồm chi tiết yêu cầu của bạn (các bước sao chép, thiết bị/môi trường, vv) để chúng tôi có thể
          cung cấp hỗ trợ đầy đủ và chính xác nhất. Nếu có liên quan, chúng tôi rất khuyến khích chụp ảnh màn hình và
          quay video.
        </div>
      </a-form-item>

      <!-- Attachments -->
      <a-form-item label="Tệp đính kèm (Tùy chọn)" name="attachments">
        <!-- Preview selected images -->
        <div v-if="fileList && fileList.length > 0" class="selected-images">
          <div v-for="file in fileList" :key="file.uid" class="image-preview-item">
            <img :src="getFilePreviewUrl(file)" :alt="file.name" />
            <button type="button" class="remove-btn" @click="removeFile(file)">
              <CloseOutlined />
            </button>
          </div>
        </div>
        
        <!-- Upload button -->
        <a-upload
          v-model:file-list="fileList"
          :before-upload="beforeUpload"
          :show-upload-list="false"
          :max-count="5"
          accept="image/*,video/*"
          :multiple="true"
          class="upload-area"
        >
          <div v-if="(fileList?.length ?? 0) < 5" class="upload-button">
            <LinkOutlined />
            <span class="upload-text">Thêm hình ảnh mô tả</span>
          </div>
        </a-upload>
      </a-form-item>

      <!-- Submit Button -->
      <a-form-item class="submit-button-wrapper flex justify-center items-center">
        <a-button class="!w-72 bg-[#1A75BB]" type="primary" html-type="submit" size="large" block :loading="loading">
          Tạo phiếu ngay
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { CloseOutlined, LinkOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { FormInstance, UploadProps } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { useSupportRequestsApi } from "~/composables/api/useSupportRequestsApi";
import type { SupportRequestCategory } from "~/composables/api/useSupportRequestsApi";

interface Props {
  visible?: boolean;
  customerId?: string;
}

interface FormState {
  category: SupportRequestCategory | "";
  title: string;
  description: string;
  attachments: string[];
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  customerId: "",
});

const emit = defineEmits<{
  "update:visible": [value: boolean];
  success: [];
}>();

// API
const { createSupportRequestWithFiles } = useSupportRequestsApi();

// State
const isVisible = ref(props.visible);
const formRef = ref<FormInstance>();
const loading = ref(false);
const fileList = ref<UploadProps["fileList"]>([]);

const formState = reactive<FormState>({
  category: "",
  title: "",
  description: "",
  attachments: [],
});

// Validation rules
const rules: Record<string, Rule[]> = {
  category: [{ required: true, message: "Vui lòng chọn danh mục", trigger: "change" }],
  description: [
    { required: true, message: "Vui lòng mô tả vấn đề của bạn", trigger: "blur" },
    { min: 10, message: "Vui lòng mô tả chi tiết hơn (tối thiểu 10 ký tự)", trigger: "blur" },
  ],
};

// Watch props.visible
watch(
  () => props.visible,
  (newVal) => {
    isVisible.value = newVal;
  }
);

// Watch isVisible to emit update
watch(isVisible, (newVal) => {
  if (!newVal) {
    emit("update:visible", false);
  }
});

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

  // Return false to prevent auto upload - files will be uploaded on form submit
  return false;
};

// Get preview URL for file
const getFilePreviewUrl = (file: any): string => {
  if (file.thumbUrl) return file.thumbUrl;
  if (file.url) return file.url;
  if (file.originFileObj) {
    return URL.createObjectURL(file.originFileObj);
  }
  return '';
};

// Remove file from list
const removeFile = (file: any) => {
  const index = fileList.value?.findIndex((f) => f.uid === file.uid);
  if (index !== undefined && index > -1) {
    fileList.value?.splice(index, 1);
  }
};

// Form handlers
const handleClose = () => {
  isVisible.value = false;
  resetForm();
};

const resetForm = () => {
  formRef.value?.resetFields();
  fileList.value = [];
  formState.category = "";
  formState.title = "";
  formState.description = "";
  formState.attachments = [];
};

// Generate title from category
const generateTitle = (category: SupportRequestCategory): string => {
  const titles: Record<SupportRequestCategory, string> = {
    parent_support: "Yêu cầu hỗ trợ cha mẹ",
    health_issue: "Vấn đề sức khỏe của bé",
    service: "Yêu cầu dịch vụ",
    course: "Thắc mắc về khóa học",
    other: "Yêu cầu hỗ trợ khác",
  };
  return titles[category] || "Yêu cầu hỗ trợ";
};

const handleSubmit = async () => {
  if (!formState.category) {
    message.error("Vui lòng chọn danh mục!");
    return;
  }
  try {
    loading.value = true;

    // Collect files from fileList
    const files: File[] = [];
    if (fileList.value && fileList.value.length > 0) {
      for (const file of fileList.value) {
        const fileToUpload = file.originFileObj || file;
        if (fileToUpload instanceof File) {
          files.push(fileToUpload);
        }
      }
    }

    // Create support request with files via single API call
    // Server will handle uploading files to MinIO
    await createSupportRequestWithFiles({
      title: generateTitle(formState.category),
      description: formState.description,
      category: formState.category,
      files,
      priority: "medium",
    });

    // Emit success event - parent component handles the success message and refresh
    emit("success");
    handleClose();
  } catch (error: any) {
    const errorMessage = error?.data?.message || error?.message || "Có lỗi xảy ra khi tạo yêu cầu";
    message.error(errorMessage);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #317bc4;
  margin: 0;
  letter-spacing: 0.5px;
}

.close-button {
  font-size: 20px;
  color: #999;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 24px;
  right: 24px;
}

.close-button:hover {
  color: #333;
}

.support-form {
  padding-top: 8px;
}

/* Form Labels */
:deep(.ant-form-item-label > label) {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

:deep(.ant-form-item-required::before) {
  color: #ff4d4f;
}

/* Select */
:deep(.ant-select-selector) {
  border-radius: 6px !important;
  border-color: #d9d9d9 !important;
}

:deep(.ant-select-selector:hover) {
  border-color: #317BC4 !important;
}

/* Textarea */
:deep(.ant-input) {
  border-radius: 6px !important;
  border-color: #d9d9d9 !important;
}

:deep(.ant-input:hover),
:deep(.ant-input:focus) {
  border-color: #317BC4 !important;
}

.helper-text {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.6;
  color: #999;
  font-style: italic;
}

/* Upload */
.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #317BC4;
  font-size: 14px;
  cursor: pointer;
  padding: 24px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  width: 100%;
  border: 1px solid #1A75BB;
}

.upload-button:hover {
  border-color: #317BC4;
  background-color: #f0f7ff;
}

.upload-text {
  font-weight: 500;
}

:deep(.ant-upload-list-picture-card-container) {
  width: 104px;
  height: 104px;
}

:deep(.ant-upload-list-item) {
  border-radius: 6px;
}

/* Submit Button */
.submit-button-wrapper {
  margin-top: 32px;
  margin-bottom: 0;
}

:deep(.ant-btn-primary) {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  text-transform: none;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .modal-header {
    margin-bottom: 0;
  }
  .modal-title {
    font-size: 20px;
  }

  .helper-text {
    font-size: 12px;
  }

  .upload-button {
    padding: 8px;
  }

  :deep(.ant-modal) {
    max-width: calc(100vw - 32px);
    margin: 16px;
  }

  :deep(.ant-modal-body) {
    padding: 16px;
  }
}
</style>

<style>
/* Global modal styles */
.create-support-request-modal.ant-modal {
  top: 50px !important;
}

.create-support-request-modal .ant-modal-content {
  border-radius: 12px;
  padding: 24px;
}

.create-support-request-modal .ant-modal-body {
  padding: 0;
}

/* Selected images preview */
.selected-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.image-preview-item {
  position: relative;
  width: 104px;
  height: 104px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #d9d9d9;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-preview-item .remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.image-preview-item .remove-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.upload-area {
  width: 100%;
}

.upload-area .ant-upload {
  width: 100%;
}

@media (max-width: 768px) {
  .create-support-request-modal .ant-modal-content {
    padding: 24px 12px;
  }
  .modal-header .close-button {
    top: 12px;
    right: 12px;
  }
  .image-preview-item {
    width: 80px;
    height: 80px;
  }
}
</style>
