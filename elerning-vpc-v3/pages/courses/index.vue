<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">All Courses</h1>
        <p class="text-gray-600 mt-2">Explore and enroll in courses</p>
      </div>
      <div class="flex gap-2">
        <select class="input-field">
          <option>All Categories</option>
          <option>Healthcare</option>
          <option>Technology</option>
          <option>Business</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 9" :key="i" class="card hover:shadow-xl transition-shadow">
        <div class="aspect-video bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
          <span class="text-5xl">📚</span>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800">Healthcare</span>
          <span class="text-xs text-gray-500">⭐ 4.{{ i }}</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Course Title {{ i }}</h3>
        <p class="text-gray-600 text-sm mb-4">Learn essential skills with hands-on projects</p>
        <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>👨‍🏫 Instructor {{ i }}</span>
          <span>📹 {{ i * 10 }} lessons</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xl font-bold text-primary-500">${{ i * 50 }}</span>
          <button class="btn-primary">Enroll Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Courses' })
</script>
