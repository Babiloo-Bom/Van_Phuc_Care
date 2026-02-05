<template>
  <div class="settings-elearning-page">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Cài đặt E-Learning</h1>
      <p class="text-gray-600 mt-2">Cấu hình áp dụng cho trang E-Learning (giá khóa học, VAT, ...)</p>
    </div>

    <a-card title="Thuế VAT (%)" :loading="loading">
      <a-form layout="vertical" class="max-w-md">
        <a-form-item
          label="Phần trăm VAT"
          help="Tỷ lệ % VAT áp dụng khi tính giá khóa học (0–100). E-Learning sẽ dùng giá trị này để tính VAT trong giỏ hàng và thanh toán."
        >
          <a-input-number
            v-model:value="vatPercent"
            :min="0"
            :max="100"
            :step="1"
            :precision="0"
            style="width: 140px"
            addon-after="%"
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" :loading="saving" @click="handleSave">
              Lưu cài đặt
            </a-button>
            <a-button @click="loadSettings">Làm mới</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { useSettingsApi, VAT_KEY } from '~/composables/api/useSettingsApi'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role'],
  requiredRole: ['admin', 'manager']
})

useHead({ title: 'Cài đặt E-Learning' })

const { getByKey, setByKey } = useSettingsApi()
const loading = ref(false)
const saving = ref(false)
const vatPercent = ref<number>(8)

async function loadSettings() {
  loading.value = true
  try {
    const res = await getByKey(VAT_KEY)
    const body = (res as any)?.data
    const data = body?.data ?? body
    if (data?.value !== undefined) {
      const num = Number(data.value)
      vatPercent.value = Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : 8
    }
  } catch {
    vatPercent.value = 8
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  const val = vatPercent.value
  if (val === undefined || val < 0 || val > 100) {
    message.warning('VAT phải từ 0 đến 100')
    return
  }
  saving.value = true
  try {
    await setByKey(VAT_KEY, Math.round(val))
    message.success('Đã lưu cài đặt VAT. E-Learning sẽ dùng giá trị mới khi tính giá.')
    await loadSettings()
  } catch {
    message.error('Không thể lưu cài đặt')
  } finally {
    saving.value = false
  }
}

onMounted(loadSettings)
</script>

<style scoped>
.settings-elearning-page {
  max-width: 800px;
}
</style>
