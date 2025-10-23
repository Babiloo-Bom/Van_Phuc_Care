<template>
  <div class="min-h-screen gradient-primary flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4">
          <span class="text-3xl">💼</span>
        </div>
        <h2 class="text-3xl font-bold text-white">Van Phuc Care</h2>
        <p class="text-white/80 mt-2">CRM Portal</p>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-lg shadow-2xl p-8">
        <slot />
      </div>

      <!-- Footer -->
      <p class="text-center text-white/60 text-sm mt-8">
        © 2025 Van Phuc Care. All rights reserved.
      </p>
    </div>
  </div>
</template>
