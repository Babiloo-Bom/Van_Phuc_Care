<template>
  <a-modal
    v-model:open="visible"
    title="Thanh toán bằng QR Code"
    :footer="null"
    :width="600"
    @cancel="handleClose"
  >
    <div class="payment-dialog">
      <!-- Thông tin chuyển khoản -->
      <div class="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 class="font-semibold text-lg mb-3">Thông tin chuyển khoản</h4>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Ngân hàng:</span>
            <span class="font-semibold">Vietcombank</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Số tài khoản:</span>
            <span class="font-semibold">1234567890</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Chủ tài khoản:</span>
            <span class="font-semibold">CONG TY VAN PHUC CARE</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Số tiền:</span>
            <span class="font-semibold text-primary-100 text-lg">
              {{ totalAmount.toLocaleString('de-DE') }}đ
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Nội dung:</span>
            <span class="font-semibold">Thanh toán khóa học</span>
          </div>
        </div>
      </div>

      <!-- QR Code (placeholder) -->
      <div class="flex justify-center mb-6">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="w-64 h-64 bg-gray-200 flex items-center justify-center rounded">
            <span class="text-gray-500">QR Code</span>
          </div>
        </div>
      </div>

      <!-- Upload ảnh xác nhận -->
      <div class="mb-6">
        <h4 class="font-semibold mb-3">Upload ảnh xác nhận chuyển khoản</h4>
        <a-upload
          v-model:file-list="fileList"
          :before-upload="beforeUpload"
          :max-count="1"
          list-type="picture-card"
          accept="image/*"
        >
          <div v-if="fileList.length < 1">
            <div class="flex flex-col items-center">
              <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-sm text-gray-500">Chọn ảnh</span>
            </div>
          </div>
        </a-upload>
        <p class="text-xs text-gray-500 mt-2">
          * Vui lòng upload ảnh chụp màn hình xác nhận chuyển khoản thành công
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <a-button
          size="large"
          class="flex-1"
          @click="handleClose"
        >
          Hủy
        </a-button>
        <a-button
          type="primary"
          size="large"
          class="flex-1"
          :loading="loading"
          :disabled="fileList.length === 0"
          @click="handleSubmit"
        >
          Xác nhận thanh toán
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UploadProps } from 'ant-design-vue'

interface Props {
  totalAmount: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  submit: [file: File]
  close: []
}>()

const visible = ref(false)
const fileList = ref<any[]>([])

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  // Validate file type
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('Chỉ được upload file ảnh!')
    return false
  }

  // Validate file size (max 5MB)
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('Kích thước ảnh phải nhỏ hơn 5MB!')
    return false
  }

  return false // Prevent auto upload
}

const handleSubmit = () => {
  if (fileList.value.length === 0) {
    message.warning('Vui lòng upload ảnh xác nhận chuyển khoản!')
    return
  }

  const file = fileList.value[0].originFileObj || fileList.value[0]
  emit('submit', file)
}

const handleClose = () => {
  visible.value = false
  fileList.value = []
  emit('close')
}

const open = () => {
  visible.value = true
  fileList.value = []
}

const close = () => {
  handleClose()
}

defineExpose({
  open,
  close,
})
</script>

<style scoped>
.payment-dialog :deep(.ant-upload-list-picture-card-container) {
  width: 100%;
  height: 200px;
}

.payment-dialog :deep(.ant-upload-list-picture-card .ant-upload-list-item) {
  width: 100%;
  height: 200px;
}

.payment-dialog :deep(.ant-upload.ant-upload-select-picture-card) {
  width: 100%;
  height: 200px;
}
</style>

