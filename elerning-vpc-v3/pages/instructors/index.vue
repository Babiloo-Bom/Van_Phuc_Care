<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Instructors</h1>
      <p class="text-gray-600 mt-2">Learn from industry experts</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="card text-center hover:shadow-xl transition-shadow">
        <div class="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
          I{{ i }}
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">Instructor {{ i }}</h3>
        <p class="text-sm text-gray-500 mb-3">Healthcare Expert</p>
        <div class="flex justify-center gap-4 text-sm text-gray-600 mb-4">
          <div>
            <p class="font-semibold text-gray-900">{{ i * 5 }}</p>
            <p>Courses</p>
          </div>
          <div>
            <p class="font-semibold text-gray-900">{{ i * 100 }}+</p>
            <p>Students</p>
          </div>
        </div>
        <button class="btn-secondary w-full text-sm">View Profile</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Instructors' })
</script>

