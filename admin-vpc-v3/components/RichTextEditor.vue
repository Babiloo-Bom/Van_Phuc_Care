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
    
    // Import quill-table-ui before initializing Quill
    let TableUI: any = null
    try {
      // @ts-ignore - quill-table-ui type definitions may not be perfect
      const quillTableUIModule: any = await import('quill-table-ui')
      TableUI = quillTableUIModule.default || quillTableUIModule
    } catch (tableError) {
      // quill-table-ui not available
    }

    // Custom table handler
    const tableHandler = () => {
      const rows = prompt('Nhập số hàng (ví dụ: 3):', '3')
      const cols = prompt('Nhập số cột (ví dụ: 4):', '4')
      
      if (!rows || !cols) return
      
      const rowCount = parseInt(rows) || 3
      const colCount = parseInt(cols) || 4
      
      if (rowCount < 1 || colCount < 1 || rowCount > 20 || colCount > 20) {
        alert('Vui lòng nhập số từ 1 đến 20')
        return
      }
      
      let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">'
      for (let i = 0; i < rowCount; i++) {
        tableHTML += '<tr>'
        for (let j = 0; j < colCount; j++) {
          tableHTML += '<td style="border: 1px solid #ddd; padding: 8px;">&nbsp;</td>'
        }
        tableHTML += '</tr>'
      }
      tableHTML += '</table>'
      
      const range = quillInstance.getSelection(true)
      quillInstance.clipboard.dangerouslyPasteHTML(range.index, tableHTML)
    }

    // Initialize Quill
    quillInstance = new Quill(editorRef.value, {
      theme: 'snow',
      placeholder: props.placeholder,
      modules: {
        toolbar: {
          container: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['table'],
            ['clean']
          ],
          handlers: {
            'table': tableHandler
          }
        },
        table: true
      }
    })

    // Initialize quill-table-ui after Quill instance is created
    if (TableUI && quillInstance) {
      try {
        // @ts-ignore
        new TableUI(quillInstance)
      } catch (initError) {
        // Failed to initialize TableUI
      }
    }
  } catch (error) {
    // Failed to load Quill
    return
  }

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
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
}

.rich-text-editor :deep(.ql-toolbar .ql-formats) {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  flex-shrink: 0;
}

.rich-text-editor :deep(.ql-toolbar button),
.rich-text-editor :deep(.ql-toolbar .ql-picker) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rich-text-editor :deep(.ql-toolbar .ql-picker-label) {
  display: inline-flex;
  align-items: center;
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

.rich-text-editor :deep(.ql-editor table) {
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0;
}

.rich-text-editor :deep(.ql-editor table td),
.rich-text-editor :deep(.ql-editor table th) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.rich-text-editor :deep(.ql-editor table th) {
  background-color: #f2f2f2;
  font-weight: bold;
}

.rich-text-editor :deep(.ql-editor table tr:nth-child(even)) {
  background-color: #f9f9f9;
}

.rich-text-editor :deep(.ql-editor table tr:hover) {
  background-color: #f5f5f5;
}
</style>

