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
        <a-upload
          v-model:file-list="fileList"
          :before-upload="beforeUpload"
          :custom-request="handleUpload"
          list-type="picture-card"
          :max-count="5"
          accept="image/*,video/*"
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
const { createSupportRequest } = useSupportRequestsApi();

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
    console.log("CreateSupportRequestModal: props.visible changed to:", newVal);
    isVisible.value = newVal;
  }
);

// Watch isVisible to emit update
watch(isVisible, (newVal) => {
  console.log("CreateSupportRequestModal: isVisible changed to:", newVal);
  if (!newVal) {
    emit("update:visible", false);
  }
});

// Upload handlers
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

  return true;
};

const handleUpload: UploadProps["customRequest"] = (options) => {
  // TODO: Implement actual upload to server using UploadersController
  const { file, onSuccess, onError } = options;

  setTimeout(() => {
    // Simulate upload success
    if (onSuccess) {
      onSuccess({
        url: URL.createObjectURL(file as File),
      });
    }
  }, 1000);
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

    // Get uploaded file URLs
    const attachments =
      fileList.value
        ?.filter((file) => file.status === "done")
        .map((file) => {
          const response = file.response as { url?: string } | undefined;
          return {
            filename: file.name,
            url: response?.url || (file as any).url || "",
            uploadedAt: new Date().toISOString(),
          };
        })
        .filter((item) => item.url) || [];

    // Create support request via API
    // Note: customerId is not needed, user API auto-sets userId from logged-in user
    await createSupportRequest({
      title: generateTitle(formState.category),
      description: formState.description,
      customerId: props.customerId || "", // Optional, not used by user API
      category: formState.category,
      attachments,
      priority: "medium",
    });

    // Emit success event - parent component handles the success message and refresh
    emit("success");
    handleClose();
  } catch (error: any) {
    console.error("Error creating support request:", error);
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
  gap: 8px;
  color: #317BC4;
  font-size: 14px;
  cursor: pointer;
  padding: 32px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  width: 100%;
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

.upload-area {
  padding: 0;
  width: 100%;
  height: 72px;
}
.upload-area .ant-upload-list {
  width: 100%;
  height: 100%;
}
.upload-area .ant-upload-list .ant-upload-select {
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 768px) {
  .create-support-request-modal .ant-modal-content {
    padding: 24px 12px;
  }
  .modal-header .close-button {
    top: 12px;
    right: 12px;
  }
  .upload-area {
    height: 40px;
  }
}
</style>
