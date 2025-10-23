<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My Learning</h1>
      <p class="text-gray-600 mt-2">Track your progress and continue learning</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card hover:shadow-xl transition-shadow">
        <div class="aspect-video bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg mb-4 flex items-center justify-center relative">
          <span class="text-5xl">📚</span>
          <div class="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold">
            {{ i * 20 }}% Complete
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Enrolled Course {{ i }}</h3>
        <p class="text-sm text-gray-600 mb-3">Lesson {{ i * 2 }} of {{ i * 10 }}</p>
        <div class="bg-gray-200 rounded-full h-2 mb-4">
          <div class="bg-primary-500 h-2 rounded-full transition-all" :style="{ width: `${i * 20}%` }"></div>
        </div>
        <button class="btn-primary w-full">Continue Learning</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'My Learning' })
</script>
