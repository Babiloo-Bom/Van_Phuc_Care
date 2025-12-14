<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-4 md:mb-6">
      <h1
        class="text-3xl font-bold text-[#1A75BB] w-full text-center md:text-left"
      >
        Chỉnh sửa thông tin
      </h1>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        class="profile-card bg-white rounded-xl p-8 flex flex-col items-center justify-center md:col-span-1"
      >
        <a-spin v-if="loading" />
        <template v-else>
          <img
            :src="avatarPreview || userInfo?.avatar || '/images/avatar-fallback.png'"
            alt="Avatar"
            class="w-28 h-28 rounded-full mb-4 object-cover"
            @error="(e: Event) => (e.target as HTMLImageElement).src = '/images/avatar-fallback.png'"
          />
          <button
            type="button"
            @click="avatarFileInput?.click()"
            class="text-[#1A75BB] text-sm font-medium mb-4 hover:underline cursor-pointer"
            :disabled="isUploadingAvatar"
          >
            {{ isUploadingAvatar ? 'Đang tải...' : 'Tải ảnh đại diện' }}
          </button>
          <h2 class="text-xl font-bold mb-1">
            {{ userInfo?.name || userInfo?.fullname || "Chưa có tên" }}
          </h2>
          <p class="text-gray-600">{{ userInfo?.email || "Chưa có email" }}</p>
        </template>
      </div>
      <div class="profile-form bg-white rounded-xl p-8 md:col-span-2">
        <a-spin :spinning="loading">
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="info" tab="Thông tin tài khoản">
              <a-form
                :model="infoForm"
                layout="vertical"
                @finish="handleInfoSubmit"
              >
                <a-form-item label="Họ và tên" name="name">
                  <a-input
                    v-model:value="infoForm.name"
                    placeholder="Nguyễn Văn A"
                    size="large"
                  />
                </a-form-item>
                <div class="flex flex-col gap-0 lg:flex-row lg:gap-4 w-full">
                  <a-form-item label="Số điện thoại" name="phone" class="flex-1">
                    <a-input
                      v-model:value="infoForm.phone"
                      placeholder="092 333 3389"
                      size="large"
                    />
                  </a-form-item>
                  <a-form-item label="Email" name="email" class="flex-1">
                    <a-input
                      v-model:value="infoForm.email"
                      placeholder="nguyenvana@gmail.com"
                      size="large"
                      disabled
                    />
                  </a-form-item>
                </div>
                <a-form-item label="Địa chỉ" name="address">
                  <a-textarea
                    v-model:value="infoForm.address"
                    placeholder="Số 59 ngõ 249 Yên Duyên, Phường Yên Sở, Quận Hoàng Mai, Hà Nội"
                    rows="2"
                    size="large"
                  />
                </a-form-item>
                <a-form-item class="mb-0 md:mt-14">
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    block
                  >
                    Lưu thông tin
                  </a-button>
                </a-form-item>
              </a-form>
            </a-tab-pane>
            <a-tab-pane key="password" tab="Đổi mật khẩu">
              <a-form
                :model="passwordForm"
                layout="vertical"
                @finish="handlePasswordSubmit"
              >
                <a-form-item label="Mật khẩu hiện tại" name="currentPassword">
                  <a-input-password
                    v-model:value="passwordForm.currentPassword"
                    size="large"
                  />
                </a-form-item>
                <div class="flex gap-0 flex-col md:flex-row md:gap-4">
                  <a-form-item
                    label="Mật khẩu mới"
                    name="newPassword"
                    class="flex-1"
                  >
                    <a-input-password
                      v-model:value="passwordForm.newPassword"
                      size="large"
                    />
                  </a-form-item>
                  <a-form-item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    class="flex-1"
                  >
                    <a-input-password
                      v-model:value="passwordForm.confirmPassword"
                      size="large"
                    />
                  </a-form-item>
                </div>
                <a-form-item class="mb-0 md:mt-[150px]">
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    block
                  >
                    Lưu thông tin
                  </a-button>
                </a-form-item>
              </a-form>
            </a-tab-pane>
            <a-tab-pane key="error" tab="Báo lỗi">
              <a-form
                :model="errorForm"
                layout="vertical"
                @finish="handleErrorSubmit"
              >
                <a-form-item label="Ghi chú lỗi" name="note">
                  <a-textarea
                    v-model:value="errorForm.note"
                    placeholder="Phản hồi lỗi hệ thống tại đây"
                    rows="3"
                    size="large"
                  />
                </a-form-item>
                <a-form-item label="Tệp đính kèm (Tuỳ chọn)" name="file">
                  <div class="upload-container">
                    <a-upload
                      v-model:file-list="errorForm.fileList"
                      :max-count="1"
                      :show-upload-list="true"
                      :before-upload="() => false"
                    >
                      <div class="upload-trigger">
                        <span class="upload-link">Thêm tệp</span>
                        <span class="upload-text">hoặc thả tệp vào đây</span>
                      </div>
                    </a-upload>
                  </div>
                </a-form-item>
                <a-form-item class="mb-0 md:mt-28">
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    block
                  >
                    Gửi thông tin
                  </a-button>
                </a-form-item>
              </a-form>
            </a-tab-pane>
          </a-tabs>
        </a-spin>
      </div>
    </div>
    <!-- Hidden file input for avatar upload -->
    <input
      ref="avatarFileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleAvatarChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import { useAuth } from "~/composables/useAuth";
import { useApiClient } from "~/composables/useApiClient";
import { useAuthStore } from "~/stores/auth";
import { useUploadsApi } from "~/composables/api/useUploadsApi";
import type { UploadFile } from "ant-design-vue";

const activeTab = ref("info");
const loading = ref(false);
const userInfo = ref<any>(null);
const avatarFileInput = ref<HTMLInputElement | null>(null);
const avatarPreview = ref<string>("");
const avatarFile = ref<File | null>(null);
const isUploadingAvatar = ref(false);

const infoForm = reactive({
  name: "",
  phone: "",
  email: "",
  address: "",
});
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const errorForm = reactive({
  note: "",
  fileList: [] as UploadFile[],
});

const { user } = useAuth();
const authStore = useAuthStore();
const apiClient = useApiClient();
const { uploadImage } = useUploadsApi();

async function fetchUserInfo() {
  try {
    loading.value = true;
    // Uses Nuxt server proxy: /api/users/profile -> backend /api/u/users/profile
    const res = await apiClient.get("/api/users/profile", {
      showError: false, // Disable automatic error toast
    });
    console.log("✅ Fetched user info:", res);
    // Try different response structures
    // Backend might return: {status: true, data: {user: {...}}}
    // Or: {data: {user: {...}}}
    const u = res.data?.data?.user || res.data?.user || res.data?.data || {};
    userInfo.value = u;

    // API returns: fullname, phoneNumber, email, fullAddress
    // Use Object.assign to ensure reactivity
    Object.assign(infoForm, {
      name: u.name || u.fullname || "",
      phone: u.phone || u.phoneNumber || "",
      email: u.email || "",
      address: u.fullAddress || "",
    });
  } catch (e) {
    console.error("❌ Failed to fetch user info:", e);
    message.error("Không thể tải thông tin người dùng");
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchUserInfo();
});

// Handle avatar change
const handleAvatarChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    message.error("Vui lòng chọn file ảnh");
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    message.error("Kích thước ảnh tối đa là 5MB");
    return;
  }

  try {
    isUploadingAvatar.value = true;

    // Store file for later use
    avatarFile.value = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Upload image and update profile immediately
    const uploadResult = await uploadImage(file);
    console.log('Upload result:', uploadResult);
    
    // Response structure from /api/uploads: 
    // Backend: { status: true, data: { fileAttributes: [{ source: string }] } }
    // After apiClient.upload: { status: true, data: { status: true, data: { fileAttributes: [...] } } }
    const responseData = uploadResult.data as any;
    const avatarUrl = 
      responseData?.data?.fileAttributes?.[0]?.source || 
      responseData?.fileAttributes?.[0]?.source ||
      responseData?.data?.url || 
      responseData?.url || 
      responseData?.data?.urls?.[0] || 
      responseData?.urls?.[0];

    console.log('Extracted avatar URL:', avatarUrl);

    if (!avatarUrl) {
      console.error('No avatar URL found in response:', responseData);
      throw new Error("Không thể tải ảnh lên");
    }

    // Update profile with new avatar URL
    const response = await apiClient.put(
      "/api/users/profile",
      {
        fullname: infoForm.name || userInfo.value?.fullname || userInfo.value?.name,
        phoneNumber: infoForm.phone || userInfo.value?.phoneNumber,
        email: infoForm.email || userInfo.value?.email,
        fullAddress: infoForm.address || userInfo.value?.fullAddress,
        avatar: avatarUrl,
      },
      {
        showError: false,
      }
    );

    if (response.status) {
      message.success("Cập nhật ảnh đại diện thành công!");
      // Refresh user info
      await fetchUserInfo();
      // Refresh auth store
      await authStore.refreshUserData();
      // Clear file
      avatarFile.value = null;
    } else {
      throw new Error(response.message || "Không thể cập nhật ảnh đại diện");
    }
  } catch (err: any) {
    console.error("Error uploading avatar:", err);
    message.error(err.message || "Không thể cập nhật ảnh đại diện");
    // Reset preview on error
    avatarPreview.value = "";
    avatarFile.value = null;
  } finally {
    isUploadingAvatar.value = false;
    // Reset input value
    if (input) {
      input.value = "";
    }
  }
};

async function handleInfoSubmit() {
  try {
    let avatarUrl = userInfo.value?.avatar;
    if (avatarFile.value) {
      isUploadingAvatar.value = true;
      try {
        const uploadResult = await uploadImage(avatarFile.value);
        console.log('Upload result in form submit:', uploadResult);
    
        const responseData = uploadResult.data as any;
        avatarUrl = 
          responseData?.data?.fileAttributes?.[0]?.source || 
          responseData?.fileAttributes?.[0]?.source ||
          responseData?.data?.url || 
          responseData?.url || 
          responseData?.data?.urls?.[0] || 
          responseData?.urls?.[0];
        
        console.log('Extracted avatar URL in form submit:', avatarUrl);
        
        if (!avatarUrl) {
          console.error('No avatar URL found in response:', responseData);
          throw new Error("Không thể tải ảnh lên");
        }
      } catch (uploadErr: any) {
        message.error(uploadErr.message || "Không thể tải ảnh lên");
        return;
      } finally {
        isUploadingAvatar.value = false;
      }
    }

    // Uses Nuxt server proxy: /api/users/profile -> backend /api/u/users/profile
    const response = await apiClient.put(
      "/api/users/profile",
      {
        fullname: infoForm.name,
        phoneNumber: infoForm.phone,
        email: infoForm.email,
        fullAddress: infoForm.address,
        ...(avatarUrl ? { avatar: avatarUrl } : {}),
      },
      {
        showError: false, // Disable automatic error toast
      }
    );

    if (response.status) {
      message.success("Cập nhật thông tin thành công!");
      // Clear avatar file and preview
      avatarFile.value = null;
      avatarPreview.value = "";
      // Refresh user info in local state
      await fetchUserInfo();
      // Refresh auth store so header/sidebar also updates
      await authStore.refreshUserData();
    } else {
      message.error(response.message || "Cập nhật thất bại!");
    }
  } catch (e: any) {
    console.error("Failed to update user info:", e);
    message.error(e?.message || "Cập nhật thất bại, vui lòng thử lại!");
  }
}

async function handlePasswordSubmit() {
  if (!passwordForm.currentPassword) {
    message.error("Vui lòng nhập mật khẩu hiện tại");
    return;
  }
  if (!passwordForm.newPassword) {
    message.error("Vui lòng nhập mật khẩu mới");
    return;
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.error("Mật khẩu xác nhận không khớp!");
    return;
  }
  if (passwordForm.newPassword.length < 6) {
    message.error("Mật khẩu mới phải có ít nhất 6 ký tự");
    return;
  }

  try {
    // Uses Nuxt server proxy: /api/sessions/change-password -> backend /api/u/sessions/change_password
    const response = await apiClient.patch(
      "/api/sessions/change-password",
      {
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      },
      {
        showError: false, // Disable automatic error toast
      }
    );

    if (response.status) {
      message.success("Đổi mật khẩu thành công!");
      // Clear form
      passwordForm.currentPassword = "";
      passwordForm.newPassword = "";
      passwordForm.confirmPassword = "";
    } else {
      message.error(response.message || "Đổi mật khẩu thất bại!");
    }
  } catch (e: any) {
    console.error("Failed to change password:", e);
    message.error(e?.message || "Đổi mật khẩu thất bại, vui lòng thử lại!");
  }
}

async function handleErrorSubmit() {
  if (!errorForm.note.trim()) {
    message.error("Vui lòng nhập nội dung phản hồi");
    return;
  }

  try {
    // Uses Nuxt server proxy: /api/feedbacks -> backend /api/u/feedbacks
    const feedbackData: any = {
      content: errorForm.note,
      fullname: userInfo.value?.fullname || userInfo.value?.name || "",
      email: userInfo.value?.email || "",
      phoneNumber: userInfo.value?.phoneNumber || userInfo.value?.phone || "",
    };
    const response = await apiClient.post("/api/feedbacks", feedbackData, {
      showError: false, // Disable automatic error toast
    });

    if (response.status) {
      message.success(
        "Gửi phản hồi thành công! Cảm ơn bạn đã đóng góp ý kiến."
      );
      // Clear form
      errorForm.note = "";
      errorForm.fileList = [];
    } else {
      message.error(response.message || "Gửi phản hồi thất bại!");
    }
  } catch (e: any) {
    console.error("Failed to submit feedback:", e);
    message.error(e?.message || "Gửi phản hồi thất bại, vui lòng thử lại!");
  }
}
</script>

<style scoped>
.profile-card {
  height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.profile-form {
  min-height: 260px;
}

:deep(.profile-form .ant-form-item-control-input-content) {
  text-align: end !important;
}

.profile-form .ant-btn-primary {
  background-color: #317bc4;
  width: 220px;
}

/* Upload Container Styles */
.upload-container {
  width: 100%;
}

.upload-container :deep(.ant-upload) {
  width: 100%;
}

.upload-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  padding: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-trigger:hover {
  border-color: #1a75bb;
}

.upload-link {
  color: #1a75bb;
  font-weight: 500;
}

.upload-text {
  color: #333;
}

@media (max-width: 768px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
  .profile-card,
  .profile-form {
    padding: 16px;
  }
  .profile-form .ant-btn-primary {
    width: 100%;
  }

  /* Mobile Tabs Styling */
  .profile-form :deep(.ant-tabs-nav) {
    margin-bottom: 16px;
  }

  .profile-form :deep(.ant-tabs-nav::before) {
    border: none;
  }

  .profile-form :deep(.ant-tabs-nav-wrap) {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    overflow: hidden;
  }

  .profile-form :deep(.ant-tabs-nav-list) {
    width: 100%;
  }

  .profile-form :deep(.ant-tabs-tab) {
    flex: 1;
    justify-content: center;
    margin: 0 !important;
    padding: 10px 12px;
    background: #fff;
    border-radius: 0;
    transition: all 0.3s;
  }

  .profile-form :deep(.ant-tabs-tab .ant-tabs-tab-btn) {
    color: #747474;
    font-size: 14px;
  }

  .profile-form :deep(.ant-tabs-tab-active) {
    background: #1a75bb !important;
  }

  .profile-form :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: #fff !important;
  }

  .profile-form :deep(.ant-tabs-ink-bar) {
    display: none;
  }
}
</style>
