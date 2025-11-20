<template>
  <div class="progress-bar-container">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-700">Tiến trình</span>
      <span class="text-sm font-medium text-gray-700">{{ percentage }}% Hoàn thành</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div
        class="h-full bg-gradient-to-r from-[#15CF74] to-[#15CF74] rounded-full transition-all duration-500 ease-out"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  percentage?: number
}

const props = withDefaults(defineProps<Props>(), {
  percentage: 0
})
</script>

<style scoped>
.progress-bar-container {
  width: 100%;
}
</style>

