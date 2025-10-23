<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo & Title -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center">
              <span class="text-2xl font-bold text-primary-500">📚</span>
              <span class="ml-2 text-xl font-semibold text-gray-900">E-Learning</span>
            </NuxtLink>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <NuxtLink to="/" class="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Dashboard
            </NuxtLink>
            <NuxtLink to="/courses" class="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Courses
            </NuxtLink>
            <NuxtLink to="/my-learning" class="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              My Learning
            </NuxtLink>
            <NuxtLink to="/instructors" class="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Instructors
            </NuxtLink>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <button class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                S
              </div>
              <span class="text-sm font-medium text-gray-700">Student</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p class="text-center text-sm text-gray-500">
          © 2025 Van Phuc Care E-Learning. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>
