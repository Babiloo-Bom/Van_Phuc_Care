<template>
  <div class="rich-text-editor">
    <div ref="editorRef" style="min-height: 200px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

let Quill: any = null

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Nhập nội dung...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLElement | null>(null)
let quillInstance: any = null

onMounted(async () => {
  if (!editorRef.value || typeof window === 'undefined') return

  // Dynamically import Quill on client side only
  try {
    const quillModule = await import('quill')
    Quill = quillModule.default
    await import('quill/dist/quill.snow.css')
  } catch (error) {
    console.error('Failed to load Quill:', error)
    return
  }

  // Initialize Quill
  quillInstance = new Quill(editorRef.value, {
    theme: 'snow',
    placeholder: props.placeholder,
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ]
    }
  })

  // Set initial content
  if (props.modelValue) {
    quillInstance.root.innerHTML = props.modelValue
  }

  // Listen for text changes
  quillInstance.on('text-change', () => {
    if (quillInstance) {
      const html = quillInstance.root.innerHTML
      emit('update:modelValue', html)
    }
  })
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (quillInstance && quillInstance.root.innerHTML !== newValue) {
    quillInstance.root.innerHTML = newValue || ''
  }
})

onUnmounted(() => {
  if (quillInstance) {
    quillInstance = null
  }
})
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
}

.rich-text-editor :deep(.ql-container) {
  font-size: 14px;
  min-height: 200px;
}

.rich-text-editor :deep(.ql-editor) {
  min-height: 200px;
}

.rich-text-editor :deep(.ql-toolbar) {
  border-top: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
}

.rich-text-editor :deep(.ql-container) {
  border-bottom: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.rich-text-editor :deep(.ql-editor.ql-blank::before) {
  color: #bfbfbf;
  font-style: normal;
}
</style>

