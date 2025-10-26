<template>
  <a-modal
    v-model:open="visible"
    :title="title"
    :ok-text="okText"
    :cancel-text="cancelText"
    @ok="handleConfirm"
    @cancel="handleCancel"
  >
    <p>{{ content }}</p>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  content?: string
  okText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Xác nhận',
  content: 'Bạn có chắc chắn muốn thực hiện hành động này?',
  okText: 'Xác nhận',
  cancelText: 'Hủy',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const visible = ref(false)

const open = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
}

const handleConfirm = () => {
  emit('confirm')
  close()
}

const handleCancel = () => {
  emit('cancel')
  close()
}

defineExpose({
  open,
  close,
})
</script>

