<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-primary-600">Chỉnh sửa thông tin</h1>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="profile-card bg-white rounded-xl p-8 flex flex-col items-center justify-center">
        <img src="/images/avatar.png" alt="Avatar" class="w-28 h-28 rounded-full mb-4" />
        <h2 class="text-xl font-bold mb-1">Nguyễn Văn A</h2>
        <p class="text-gray-600">nguyenvana@gmail.com</p>
      </div>
      <div class="profile-form bg-white rounded-xl p-8">
        <a-tabs v-model:activeKey="activeTab" class="mb-6">
          <a-tab-pane key="info" tab="Thông tin tài khoản">
            <a-form :model="infoForm" layout="vertical" @finish="handleInfoSubmit">
              <a-form-item label="Họ và tên" name="name">
                <a-input v-model:value="infoForm.name" placeholder="Nguyễn Văn A" size="large" />
              </a-form-item>
              <a-form-item label="Số điện thoại" name="phone">
                <a-input v-model:value="infoForm.phone" placeholder="092 333 3389" size="large" />
              </a-form-item>
              <a-form-item label="Email" name="email">
                <a-input v-model:value="infoForm.email" placeholder="nguyenvana@gmail.com" size="large" />
              </a-form-item>
              <a-form-item label="Địa chỉ" name="address">
                <a-textarea v-model:value="infoForm.address" placeholder="Số 59 ngõ 249 Yên Duyên, Phường Yên Sở, Quận Hoàng Mai, Hà Nội" rows="2" size="large" />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit" size="large" block> Lưu thông tin </a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="password" tab="Đổi mật khẩu">
            <a-form :model="passwordForm" layout="vertical" @finish="handlePasswordSubmit">
              <a-form-item label="Mật khẩu hiện tại" name="currentPassword">
                <a-input-password v-model:value="passwordForm.currentPassword" size="large" />
              </a-form-item>
              <div class="flex gap-4">
                <a-form-item label="Mật khẩu mới" name="newPassword" class="flex-1">
                  <a-input-password v-model:value="passwordForm.newPassword" size="large" />
                </a-form-item>
                <a-form-item label="Xác nhận mật khẩu" name="confirmPassword" class="flex-1">
                  <a-input-password v-model:value="passwordForm.confirmPassword" size="large" />
                </a-form-item>
              </div>
              <a-form-item>
                <a-button type="primary" html-type="submit" size="large" block> Lưu thông tin </a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="error" tab="Báo lỗi">
            <a-form :model="errorForm" layout="vertical" @finish="handleErrorSubmit">
              <a-form-item label="Ghi chú lỗi" name="note">
                <a-textarea v-model:value="errorForm.note" placeholder="Phản hồi lỗi hệ thống tại đây" rows="3" size="large" />
              </a-form-item>
              <a-form-item label="Tệp đính kèm (Tuỳ chọn)" name="file">
                <a-upload v-model:file-list="errorForm.fileList" :max-count="1" :show-upload-list="true">
                  <template #default>
                    <a-button type="link">Thêm tệp hoặc thả tệp vào đây</a-button>
                  </template>
                </a-upload>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit" size="large" block> Gửi thông tin </a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useUserManagement } from '~/composables/useUserManagement'
import { useAuth } from '~/composables/useAuth'
import { useApiClient } from '~/composables/useApiClient'
import type { UploadFile } from 'ant-design-vue'

const activeTab = ref('info')
const infoForm = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
})
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const errorForm = reactive({
  note: '',
  fileList: [] as UploadFile[],
})

const { user } = useAuth()
const apiClient = useApiClient()

async function fetchUserInfo() {
  try {
    const userId = user.value?.id
    if (!userId) return
    const res = await apiClient.get(`/api/a/users/${userId}`)
    const u = res.data?.user || {}
    infoForm.name = u.name || u.fullname || ''
    infoForm.phone = u.phone || ''
    infoForm.email = u.email || ''
    infoForm.address = u.address || ''
  } catch (e) {
    // fallback: giữ trống
  }
}

fetchUserInfo()

async function handleInfoSubmit() {
  try {
    const userId = user.value?.id
    if (!userId) throw new Error('User not found')
    await apiClient.put(`/api/a/users/${userId}`, infoForm)
    message.success('Cập nhật thông tin thành công!')
  } catch (e) {
    message.error('Cập nhật thất bại!')
  }
}

async function handlePasswordSubmit() {
  if (!passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.error('Mật khẩu xác nhận không khớp!')
    return
  }
  try {
    await apiClient.post('/api/a/passwords/reset', {
      token: '', // Nếu cần token, lấy từ xác thực
      password: passwordForm.newPassword,
    })
    message.success('Đổi mật khẩu thành công!')
  } catch (e) {
    message.error('Đổi mật khẩu thất bại!')
  }
}

async function handleErrorSubmit() {
  try {
    const formData = new FormData()
    formData.append('content', errorForm.note)
    if (errorForm.fileList.length > 0 && errorForm.fileList[0]?.originFileObj) {
      formData.append('file', errorForm.fileList[0].originFileObj as File)
    }
    await apiClient.post('/api/a/feedbacks', formData)
    message.success('Gửi phản hồi thành công!')
    errorForm.note = ''
    errorForm.fileList = []
  } catch (e) {
    message.error('Gửi phản hồi thất bại!')
  }
}
</script>

<style scoped>
.profile-card {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.profile-form {
  min-height: 260px;
}
@media (max-width: 768px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
  .profile-card, .profile-form {
    padding: 16px;
  }
}
</style>
