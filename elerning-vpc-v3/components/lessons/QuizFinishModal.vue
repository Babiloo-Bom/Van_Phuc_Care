<template>
  <div>
    <a-modal 
      v-model:open="props.visible" 
      :closable="true"
      :maskClosable="true"
      :footer="false"
      @cancel="handleShowQuiz"
    >
      <div class="modal-container">
        <div class="flex justify-end" @click="backQuiz">
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.9746 10.5L20.4873 2.9873C21.1709 2.30371 21.1709 1.19629 20.4873 0.512695C19.8037 -0.170898 18.6963 -0.170898 18.0127 0.512695L10.5 8.02539L2.9873 0.512695C2.30371 -0.170898 1.19629 -0.170898 0.512695 0.512695C-0.170898 1.19629 -0.170898 2.30371 0.512695 2.9873L8.02539 10.5L0.512695 18.0127C-0.170898 18.6963 -0.170898 19.8037 0.512695 20.4873C0.854492 20.8291 1.30225 21 1.75 21C2.19775 21 2.64551 20.8291 2.9873 20.4873L10.5 12.9746L18.0127 20.4873C18.3545 20.8291 18.8022 21 19.25 21C19.6978 21 20.1455 20.8291 20.4873 20.4873C21.1709 19.8037 21.1709 18.6963 20.4873 18.0127L12.9746 10.5Z" fill="#62748E"/>
          </svg>
        </div>
        <div class="flex w-full items-center justify-center -mt-6">
          <img src="/public/images/quiz_done_dragon.png" v-if="props.quizResult.passed == true" alt="done" />
          <img src="/public/images/quiz_fail_dragon.png" v-else alt="done" />
        </div>
        <div class="text-xl font-bold leading-6 text-[#232325] mt-5 text-center">{{ title }}</div>
        <div class="text-base text-[#6F727A] font-normal leading-6 mt-1 text-center">{{ description }}</div>
        <div :class="[{'text-[#F48284]': true}, {'text-[#1A75BB]': false}, 'font-bold leading-6 mt-1 text-center']">Số câu trả lời đúng: {{ props?.quizResult?.score }}/{{ props?.quizResult?.totalPoints }}</div>
        <div class="grid grid-cols-2 gap-3 mt-10 mb-2">
          <a-button class="w-full h-[48px] border border-[#1A75BB] text-[#1A75BB] flex items-center justify-center rounded-lg font-bold"
            @click="handleShowQuiz"
          >
              Kiểm tra kết quả
          </a-button>
          <a-button class="w-full h-[48px] border bg-[#1A75BB] !text-white flex items-center justify-center rounded-lg font-bold" @click="backQuiz">
              Quay lại bài học
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import type { IQuizResult } from '~/stores/quiz'

interface Props {
  visible: boolean
  title?: string
  description?: string
  quizResult: IQuizResult
  onClose: () => void,
  onSubmit: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Xin chúc mừng, bạn đã vượt qua bài kiểm tra!!!',
  description: 'Làm tốt lắm, hãy tiếp tục phát huy lần sau nhé!',
})

// Watch visible để debug
watch(() => props.visible, (newVal) => {
  console.log('🔍 [QuizFinishModal] visible changed:', newVal, 'quizResult:', props.quizResult)
}, { immediate: true })

const backQuiz = () => {
  console.log('🔍 [QuizFinishModal] backQuiz called')
  props?.onClose();
}

const handleShowQuiz = () => {
  console.log('🔍 [QuizFinishModal] handleShowQuiz called')
  props?.onSubmit()
}

</script>

<style scoped>

</style>
