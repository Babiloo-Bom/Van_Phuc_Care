<template>
  <div>
    <div class="flex justify-between items-center mb-4 md:mb-8">
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
            :src="userInfo?.avatar || '/images/avatar-fallback.png'"
            alt="Avatar"
            class="w-28 h-28 rounded-full mb-4 object-cover"
            @error="(e: Event) => (e.target as HTMLImageElement).src = '/images/avatar-fallback.png'"
          />
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
                <a-form-item label="Số điện thoại" name="phone">
                  <a-input
                    v-model:value="infoForm.phone"
                    placeholder="092 333 3389"
                    size="large"
                  />
                </a-form-item>
                <a-form-item label="Email" name="email">
                  <a-input
                    v-model:value="infoForm.email"
                    placeholder="nguyenvana@gmail.com"
                    size="large"
                  />
                </a-form-item>
                <a-form-item label="Địa chỉ" name="address">
                  <a-textarea
                    v-model:value="infoForm.address"
                    placeholder="Số 59 ngõ 249 Yên Duyên, Phường Yên Sở, Quận Hoàng Mai, Hà Nội"
                    rows="2"
                    size="large"
                  />
                </a-form-item>
                <a-form-item>
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
                <div class="flex gap-4">
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
                <a-form-item>
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
                <a-form-item>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import { useAuth } from "~/composables/useAuth";
import { useApiClient } from "~/composables/useApiClient";
import { useAuthStore } from "~/stores/auth";
import type { UploadFile } from "ant-design-vue";

const activeTab = ref("info");
const loading = ref(false);
const userInfo = ref<any>(null);

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

async function fetchUserInfo() {
  try {
    loading.value = true;
    const res = await apiClient.get("/api/u/users/profile", {
      showError: false, // Disable automatic error toast
    });
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

async function handleInfoSubmit() {
  try {
    // Use user profile update API
    const response = await apiClient.put(
      "/api/u/users/profile",
      {
        fullname: infoForm.name,
        phoneNumber: infoForm.phone,
        email: infoForm.email,
        fullAddress: infoForm.address,
      },
      {
        showError: false, // Disable automatic error toast
      }
    );

    if (response.status) {
      message.success("Cập nhật thông tin thành công!");
      // Refresh user info
      await fetchUserInfo();
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
    const response = await apiClient.patch(
      "/api/u/sessions/change_password",
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
    // Use user feedback API (POST /api/u/feedbacks)
    const feedbackData: any = {
      content: errorForm.note,
      fullname: userInfo.value?.fullname || userInfo.value?.name || "",
      email: userInfo.value?.email || "",
      phoneNumber: userInfo.value?.phoneNumber || userInfo.value?.phone || "",
    };
    const response = await apiClient.post("/api/u/feedbacks", feedbackData, {
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

.profile-form .ant-btn-primary {
  background-color: #317bc4;
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
}
</style>
