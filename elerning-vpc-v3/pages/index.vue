<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Learning Dashboard</h1>
      <p class="text-gray-600 mt-2">Welcome back! Continue your learning journey</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card bg-gradient-to-br from-pink-500 to-pink-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-pink-100 text-sm font-medium">Total Courses</p>
            <p class="text-3xl font-bold mt-2">124</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <p class="text-pink-100 text-sm mt-4">15 categories available</p>
      </div>

      <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">Enrolled</p>
            <p class="text-3xl font-bold mt-2">12</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        </div>
        <p class="text-purple-100 text-sm mt-4">8 in progress</p>
      </div>

      <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Completed</p>
            <p class="text-3xl font-bold mt-2">4</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-blue-100 text-sm mt-4">4 certificates earned</p>
      </div>

      <div class="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm font-medium">Study Hours</p>
            <p class="text-3xl font-bold mt-2">156</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-orange-100 text-sm mt-4">This month: 24 hours</p>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Continue Learning -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Continue Learning</h3>
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="flex gap-4 p-3 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
            <div class="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
              📚
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900">Course {{ i }}</h4>
              <p class="text-sm text-gray-500">Lesson {{ i * 2 }} of 20</p>
              <div class="mt-2 bg-gray-200 rounded-full h-2">
                <div class="bg-primary-500 h-2 rounded-full" :style="{ width: `${i * 30}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink to="/courses" class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-pink-50 transition-all text-center">
            <div class="text-3xl mb-2">📚</div>
            <p class="font-medium text-gray-900">Browse Courses</p>
          </NuxtLink>
          <NuxtLink to="/my-learning" class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-pink-50 transition-all text-center">
            <div class="text-3xl mb-2">🎓</div>
            <p class="font-medium text-gray-900">My Learning</p>
          </NuxtLink>
          <NuxtLink to="/instructors" class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-pink-50 transition-all text-center">
            <div class="text-3xl mb-2">👨‍🏫</div>
            <p class="font-medium text-gray-900">Instructors</p>
          </NuxtLink>
          <button class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-pink-50 transition-all text-center">
            <div class="text-3xl mb-2">🏆</div>
            <p class="font-medium text-gray-900">Certificates</p>
          </button>
        </div>
      </div>
    </div>

    <!-- API Config -->
    <div class="card mt-6 bg-pink-50 border-2 border-pink-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">🔌 API Configuration</h3>
      <div class="space-y-2 font-mono text-sm">
        <p><strong>API Host:</strong> {{ apiHost }}</p>
        <p><strong>API Base:</strong> {{ apiBase }}</p>
        <p><strong>Environment:</strong> 
          <span class="px-2 py-1 rounded text-white text-xs" :class="isDevelopment ? 'bg-yellow-500' : 'bg-green-500'">
            {{ isDevelopment ? 'Development' : 'Production' }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Dashboard' })
const { apiHost, apiBase, isDevelopment } = useEnvConfig()
</script>
