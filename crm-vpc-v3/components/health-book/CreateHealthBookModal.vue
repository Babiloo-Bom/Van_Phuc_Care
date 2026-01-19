<template>
  <a-modal
    :visible="visible"
    :title="null"
    :footer="null"
    :closable="false"
    :width="800"
    :bodyStyle="{ padding: 0 }"
    @cancel="handleClose"
    class="create-healthbook-modal"
  >
    <div class="modal-content">
      <!-- Close Button -->
      <button
        @click="handleClose"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
      >
        <CloseOutlined class="text-2xl" />
      </button>

      <!-- Success Screen -->
      <div v-if="isCreateSuccess" class="success-content">
        <!-- Mascot Image -->
        <div class="success-mascot">
          <img
            src="/images/doctor.png"
            alt="Van Phuc Mascot"
            class="mascot-image"
          />
        </div>

        <!-- Success Title -->
        <h2 class="success-title">KHỞI TẠO HỒ SƠ THÀNH CÔNG</h2>

        <!-- Success Message -->
        <p class="success-message">
          Chúc mừng bạn đã khởi tạo hồ sơ thành công. Quay lại trang để tiếp tục
          sử dụng Sổ sức khỏe Điện tử.
        </p>

        <!-- Action Button -->
        <a-button
          type="primary"
          size="large"
          block
          class="success-button"
          @click="handleGoHome"
        >
          Về trang chủ
        </a-button>
      </div>

      <!-- Registration Form -->
      <div v-else>
        <!-- Modal Header -->
        <div class="text-center pt-8 pb-6 px-6">
          <h2 class="text-2xl lg:text-3xl font-bold text-blue-600 uppercase">
            Tạo hồ sơ của bé
          </h2>
        </div>

        <!-- Modal Body -->
        <div class="pb-8">
          <a-form
            :model="formState"
            :rules="rules"
            layout="vertical"
            @finish="handleSubmit"
            ref="formRef"
          >
            <!-- Họ và tên bé -->
            <a-form-item
              label="Họ và tên bé"
              name="name"
              :rules="[
                { required: true, message: 'Vui lòng nhập họ và tên bé' },
              ]"
            >
              <a-input
                v-model:value="formState.name"
                placeholder="Nhập tên bé"
                size="large"
                class="rounded-lg"
              />
            </a-form-item>

            <!-- Ngày sinh & Giới tính -->
            <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <!-- Ngày sinh -->
              <a-form-item
                label="Ngày sinh"
                name="dob"
                :rules="[
                  { required: true, message: 'Vui lòng chọn ngày sinh' },
                ]"
              >
                <a-date-picker
                  v-model:value="formState.dob"
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                  :locale="locale"
                  size="large"
                  class="w-full rounded-lg"
                />
              </a-form-item>

              <!-- Giới tính -->
              <a-form-item
                label="Giới tính"
                name="gender"
                :rules="[
                  { required: true, message: 'Vui lòng chọn giới tính' },
                ]"
              >
                <a-select
                  v-model:value="formState.gender"
                  placeholder="Chọn giới tính"
                  size="large"
                  class="w-full"
                >
                  <a-select-option value="male">Nam</a-select-option>
                  <a-select-option value="female">Nữ</a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <!-- Ảnh đại diện -->
            <a-form-item label="Ảnh đại diện" name="avatar">
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors cursor-pointer"
                @click="handleUploadClick"
              >
                <div
                  v-if="!avatarPreview"
                  class="flex items-center justify-center"
                >
                  <LinkOutlined class="text-xl text-blue-500" />
                  <p class="text-blue-500 font-medium mb-0 ml-2 leading-10">
                    Thêm hình ảnh đại diện
                  </p>
                </div>
                <div v-else class="relative inline-block">
                  <img
                    :src="avatarPreview"
                    alt="Avatar preview"
                    class="size-20 lg:size-32 object-cover rounded-full mx-auto my-4"
                  />
                  <button
                    @click.stop="handleRemoveAvatar"
                    class="absolute top-2 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    <CloseOutlined
                      class="text-xs flex items-center justify-center"
                    />
                  </button>
                </div>
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileChange"
                  accept="image/*"
                  class="!hidden"
                />
              </div>
            </a-form-item>

            <!-- Submit Button -->
            <a-form-item class="mb-0 mt-6 submit-button">
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                block
                :loading="loading"
                class="h-12 text-base font-medium rounded-lg md:max-w-[275px]"
              >
                Khởi tạo hồ sơ
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { CloseOutlined, LinkOutlined } from "@ant-design/icons-vue";
import type { FormInstance } from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import { message } from "ant-design-vue";
import { useHealthBooksApi } from "~/composables/api/useHealthBooksApi";

interface Props {
  visible: boolean;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "success", data: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Form state
const formRef = ref<FormInstance>();
const loading = ref(false);
const fileInput = ref<HTMLInputElement>();
const avatarPreview = ref<string>("");
const avatarFile = ref<File | null>(null);
const isCreateSuccess = ref(false);

const formState = reactive({
  name: "",
  dob: null as Dayjs | null,
  gender: undefined as string | undefined,
  avatar: "",
});

const rules = {
  name: [{ required: true, message: "Vui lòng nhập họ và tên bé" }],
  dob: [{ required: true, message: "Vui lòng chọn ngày sinh" }],
  gender: [{ required: true, message: "Vui lòng chọn giới tính" }],
};

// Handle file upload
const handleUploadClick = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      message.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    avatarFile.value = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleRemoveAvatar = () => {
  avatarPreview.value = "";
  avatarFile.value = null;
  formState.avatar = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Handle submit
const handleSubmit = async () => {
  try {
    loading.value = true;

    const { createHealthBook } = useHealthBooksApi();

    const healthbookData = {
      name: formState.name,
      dob: formState.dob?.format("YYYY-MM-DD") || "",
      gender: formState.gender || "",
      avatar: avatarFile.value || undefined,
    };

    const response = await createHealthBook(healthbookData);

    if (response?.data?.data) {
      // Show success screen instead of closing modal
      // Don't emit success here - wait for user to click "Về trang chủ"
      isCreateSuccess.value = true;
    }
    // Error is already handled by API client, no need to show duplicate message
  } catch (error: any) {
    // Don't show error message here - API client already shows it
  } finally {
    loading.value = false;
  }
};

// Handle close
const handleClose = () => {
  // If success screen is showing, emit success event before closing
  if (isCreateSuccess.value) {
    emit("success", null);
  }
  emit("update:visible", false);
};

// Handle go to home page
const handleGoHome = () => {
  emit("success", null);
  emit("update:visible", false);
};

// Reset form when modal closes
watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) {
      formRef.value?.resetFields();
      handleRemoveAvatar();
      isCreateSuccess.value = false;
    } else {
      // Reset file input when modal opens to ensure change event fires
      if (fileInput.value) {
        fileInput.value.value = "";
      }
    }
  }
);
</script>

<style>
/* Global styles for teleported modal */
.create-healthbook-modal.ant-modal {
  top: 50px;
}

.create-healthbook-modal .ant-modal-content {
  border-radius: 16px;
  overflow: hidden;
}

.create-healthbook-modal .ant-form-item-label > label {
  font-weight: 500;
  color: #374151;
}

/* Move required asterisk to after the label */
.create-healthbook-modal
  .ant-form-item-label
  > label.ant-form-item-required::before {
  display: none !important;
}

.create-healthbook-modal
  .ant-form-item-label
  > label.ant-form-item-required::after {
  display: inline-block !important;
  margin-inline-start: 4px;
  color: #ff4d4f;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: "*" !important;
}

.create-healthbook-modal .ant-input,
.create-healthbook-modal .ant-picker,
.create-healthbook-modal .ant-select-selector {
  border-radius: 8px;
}

.create-healthbook-modal .ant-btn-primary {
  background-color: #317bc4;
  border-color: #317bc4;
}

.create-healthbook-modal .ant-btn-primary:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

/* Success Screen Styles */
.create-healthbook-modal .success-content {
  padding: 60px 40px;
  text-align: center;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.create-healthbook-modal .success-mascot {
  margin-bottom: -20px;
}

.create-healthbook-modal .mascot-image {
  width: auto;
  height: 280px;
  object-fit: contain;
}

.create-healthbook-modal .success-title {
  font-size: 24px;
  font-weight: bold;
  color: #317bc4;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.create-healthbook-modal .success-message {
  font-size: 16px;
  color: #595959;
  line-height: 1.6;
  margin-bottom: 12px;
  max-width: 500px;
}

.create-healthbook-modal .success-button {
  max-width: 400px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
}

.submit-button .ant-form-item-control-input-content {
  @apply text-center;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .create-healthbook-modal.ant-modal {
    max-width: calc(100vw - 32px);
    margin: 16px auto;
  }

  .create-healthbook-modal .ant-modal-content {
    border-radius: 12px;
  }

  .create-healthbook-modal .success-content {
    padding: 40px 24px;
    min-height: 400px;
  }

  .create-healthbook-modal .mascot-image {
    height: 200px;
  }

  .create-healthbook-modal .success-title {
    font-size: 18px;
  }

  .create-healthbook-modal .success-message {
    font-size: 14px;
    margin-bottom: 12px;
  }

  .create-healthbook-modal .success-button {
    height: 44px;
    font-size: 15px;
  }
}
</style>
