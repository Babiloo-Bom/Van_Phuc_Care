<template>
  <a-modal v-model:open="isVisible" :footer="null" :width="500" class="register-service-modal">
    <div class="modal-content flex flex-col md:flex-row items-center md:items-start">
      <div class="form-section flex-1">
        <h2 class="text-3xl font-bold text-primary-600 mb-6">Đăng ký dịch vụ</h2>
        <a-form :model="formState" :rules="rules" layout="vertical" @finish="handleSubmit">
          <a-form-item label="Họ và tên" name="name">
            <a-input v-model:value="formState.name" placeholder="Nguyễn Văn A" size="large" />
          </a-form-item>
          <div class="flex gap-4 mb-0">
            <a-form-item label="Số điện thoại" name="phone" class="flex-1">
              <a-input v-model:value="formState.phone" placeholder="0923333389" size="large" />
            </a-form-item>
            <a-form-item label="Email" name="email" class="flex-1">
              <a-input v-model:value="formState.email" placeholder="nguyenvana@gmail.com" size="large" />
            </a-form-item>
          </div>
          <a-form-item label="Địa chỉ" name="address">
            <a-textarea v-model:value="formState.address" placeholder="Số 59 ngõ 249 Yên Duyên, Phường Yên Sở, Quận Hoàng Mai, Hà Nội" rows="2" size="large" />
          </a-form-item>
          <a-form-item class="mt-6">
            <a-button type="primary" html-type="submit" size="large" block :loading="loading">
              Đăng ký ngay
            </a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="mascot-section hidden md:block ml-8">
        <img src="/images/mascot.png" alt="Mascot" class="w-64 h-auto" />
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useServicesApi } from '~/composables/api/useServicesApi'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible', 'success'])

const isVisible = ref(props.visible)
const loading = ref(false)

const formState = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
})

const rules = {
  name: [{ required: true, message: 'Vui lòng nhập họ tên', trigger: 'blur' }],
  phone: [{ required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' }],
  email: [{ required: true, type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }],
  address: [{ required: true, message: 'Vui lòng nhập địa chỉ', trigger: 'blur' }],
}

const { createService } = useServicesApi()

const handleSubmit = async () => {
  loading.value = true
  try {
    // Gọi API đăng ký dịch vụ thực tế
    await createService({ ...formState })
    message.success('Đăng ký dịch vụ thành công!')
    emit('success')
    emit('update:visible', false)
  } catch (e) {
    message.error('Đăng ký thất bại!')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-service-modal .modal-content {
  padding: 32px 16px;
  border-radius: 16px;
  background: #fff;
}
.form-section {
  min-width: 320px;
}
.mascot-section img {
  max-width: 256px;
}
@media (max-width: 768px) {
  .register-service-modal .modal-content {
    flex-direction: column;
    padding: 24px 8px;
  }
  .mascot-section {
    display: none !important;
  }
}
</style>
