<template>
  <div class="content-course">
    <a-collapse v-model:activeKey="activeKey" expand-icon-position="right" :bordered="false">
      <template #expandIcon="{ isActive }">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          class="fill-none stroke-black transition-transform"
          :class="{ 'rotate-90': !isActive }"
        >
          <path
            d="M12 4v16m8-8H4"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </template>
      
      <a-collapse-panel
        v-for="(chapter, index) in data.chapters"
        :key="`chapter_${index}`"
      >
        <template #header>
          <div class="w-[85%]">
            {{ chapter.title }}
          </div>
        </template>
        
        <div class="flex flex-col gap-3">
          <!-- Video count -->
          <div class="flex justify-between items-center">
            <div class="flex items-center justify-start gap-2 text-black">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  class="fill-none stroke-black"
                >
                  <path
                    d="M9.1 12v-1.48c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73V12Z"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span>{{ chapter.lessons.length }} video</span>
            </div>
            <div class="flex items-center justify-start gap-2 bg-[#f3f9ff] px-2 py-1 rounded-sm cursor-pointer">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  class="fill-none stroke-prim-100"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="1.5"
                    d="M17.44 14.62L20 12.06 17.44 9.5M9.76 12.06h10.17M11.76 20c-4.42 0-8-3-8-8s3.58-8 8-8"
                  />
                </svg>
              </span>
              <span class="text-primary-100">Xem</span>
            </div>
          </div>

          <!-- Document count -->
          <div class="flex justify-between items-center">
            <div class="flex items-center justify-start gap-2 text-black">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  class="fill-none stroke-black"
                >
                  <path
                    d="m21.67 14.3-.4 5c-.15 1.53-.27 2.7-2.98 2.7H5.71C3 22 2.88 20.83 2.73 19.3l-.4-5c-.08-.83.18-1.6.65-2.19l.02-.02C3.55 11.42 4.38 11 5.31 11h13.38c.93 0 1.75.42 2.29 1.07.01.01.02.02.02.03.49.59.76 1.36.67 2.2Z"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                  />
                  <path
                    d="M3.5 11.43V6.28c0-3.4.85-4.25 4.25-4.25h1.27c1.27 0 1.56.38 2.04 1.02l1.27 1.7c.32.42.51.68 1.36.68h2.55c3.4 0 4.25.85 4.25 4.25v1.79M9.43 17h5.14"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span>{{ totalLessons }} chủ đề</span>
            </div>
            <div class="flex items-center justify-start gap-2 bg-[#f3f9ff] px-2 py-1 rounded-sm cursor-pointer">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  class="fill-none stroke-prim-100"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="1.5"
                    d="M17.44 14.62L20 12.06 17.44 9.5M9.76 12.06h10.17M11.76 20c-4.42 0-8-3-8-8s3.58-8 8-8"
                  />
                </svg>
              </span>
              <span class="text-primary-100">Xem</span>
            </div>
          </div>

          <!-- Lock icon -->
          <div class="flex justify-between items-center">
            <div />
            <div class="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                class="fill-none stroke-black"
              >
                <path
                  d="M6 10V8c0-3.31 1-6 6-6s6 2.69 6 6v2M12 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17 22H7c-4 0-5-1-5-5v-2c0-4 1-5 5-5h10c4 0 5 1 5 5v2c0 4-1 5-5 5Z"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Course } from '~/stores/courses'

interface Props {
  data: Course
}

const props = defineProps<Props>()

const activeKey = ref<string[]>(['1'])

const totalLessons = computed(() => {
  return props.data.chapters?.reduce((total, chapter) => {
    return total + (chapter.lessons?.length || 0)
  }, 0) || 0
})
</script>

<style scoped>
.content-course :deep(.ant-collapse-borderless) {
  @apply bg-white;
}

.content-course :deep(.ant-collapse-header) {
  @apply text-2xl font-bold text-black;
}

.content-course :deep(.ant-collapse-header),
.content-course :deep(.ant-collapse-content-box) {
  @apply px-0;
}
</style>

