<template>
  <div class="checkout-form">
    <h3 class="text-2xl font-semibold mb-6">Thông tin thanh toán</h3>
    
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      @finish="handleSubmit"
    >
      <!-- Họ và tên -->
      <a-form-item
        label="Họ và tên"
        name="fullName"
        required
      >
        <a-input
          v-model:value="formState.fullName"
          placeholder="Nhập họ và tên"
          size="large"
        />
      </a-form-item>

      <!-- Email -->
      <a-form-item
        label="Email"
        name="email"
        required
      >
        <a-input
          v-model:value="formState.email"
          type="email"
          placeholder="Nhập email"
          size="large"
        />
      </a-form-item>

      <!-- Số điện thoại -->
      <a-form-item
        label="Số điện thoại"
        name="phone"
        required
      >
        <a-input
          v-model:value="formState.phone"
          placeholder="Nhập số điện thoại"
          size="large"
        />
      </a-form-item>

      <!-- Địa chỉ -->
      <a-form-item
        label="Địa chỉ"
        name="address"
      >
        <a-textarea
          v-model:value="formState.address"
          placeholder="Nhập địa chỉ (không bắt buộc)"
          :rows="3"
        />
      </a-form-item>

      <!-- Phương thức thanh toán -->
      <a-form-item
        label="Phương thức thanh toán"
        name="paymentMethod"
        required
      >
        <a-radio-group v-model:value="formState.paymentMethod" size="large">
          <a-radio value="vnpay">
            <div class="flex items-center gap-2">
              <img src="/images/vnpay-logo.png" alt="VNPay" class="h-6" />
              <span>Thanh toán qua VNPay</span>
            </div>
          </a-radio>
          <a-radio value="qr">
            <div class="flex items-center gap-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span>Chuyển khoản QR Code</span>
            </div>
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- Submit button (hidden, sẽ trigger từ parent) -->
      <button ref="submitBtnRef" type="submit" class="hidden">Submit</button>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'ant-design-vue'

interface FormState {
  fullName: string
  email: string
  phone: string
  address: string
  paymentMethod: 'vnpay' | 'qr'
}

const emit = defineEmits<{
  submit: [formData: FormState]
}>()

const formRef = ref<FormInstance>()
const submitBtnRef = ref<HTMLButtonElement>()

const formState = reactive<FormState>({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  paymentMethod: 'vnpay',
})

const rules = {
  fullName: [
    { required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur' },
    { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ', trigger: 'blur' },
  ],
  paymentMethod: [
    { required: true, message: 'Vui lòng chọn phương thức thanh toán', trigger: 'change' },
  ],
}

const handleSubmit = () => {
  emit('submit', { ...formState })
}

// Expose method để parent có thể trigger submit
const submit = () => {
  submitBtnRef.value?.click()
}

defineExpose({
  submit,
  formRef,
})
</script>

<style scoped>
.checkout-form :deep(.ant-form-item-label > label) {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 14px;
}

.checkout-form :deep(.ant-form-item-label > label::after) {
  display: none !important;
}

.checkout-form :deep(.ant-input),
.checkout-form :deep(.ant-input-textarea textarea) {
  padding: 12px 16px;
}

.checkout-form :deep(.ant-radio-wrapper) {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.checkout-form :deep(.ant-radio-wrapper:hover) {
  border-color: #1890ff;
}

.checkout-form :deep(.ant-radio-wrapper-checked) {
  border-color: #1890ff;
  background-color: #f0f7ff;
}
</style>

