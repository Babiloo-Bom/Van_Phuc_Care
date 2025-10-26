<template>
  <div class="card !p-0 bg-white !rounded-[12px] h-full animate-pulse">
    <!-- Image skeleton -->
    <div class="h-[201px] w-full bg-gray-200 rounded-t-md"></div>
    
    <!-- Content skeleton -->
    <div class="p-4">
      <!-- Title skeleton -->
      <div class="h-6 bg-gray-200 rounded mb-4"></div>
      
      <!-- Description skeleton -->
      <div class="space-y-2 mb-4">
        <div class="h-4 bg-gray-200 rounded"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      <!-- Stats skeleton -->
      <div class="flex items-center gap-4 mb-4">
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-gray-200 rounded"></div>
          <div class="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-gray-200 rounded"></div>
          <div class="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      <!-- Exam count skeleton -->
      <div class="flex items-center gap-1 mb-4">
        <div class="w-2 h-2 bg-gray-200 rounded"></div>
        <div class="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
    
    <!-- Footer skeleton -->
    <div class="px-4 mt-[2px]">
      <div class="border-t-[1px] border-[#8C8C8C] py-4">
        <!-- Price skeleton -->
        <div class="h-6 w-24 bg-gray-200 rounded mb-2"></div>
        
        <!-- Rating skeleton -->
        <div class="flex items-center gap-2">
          <div class="flex gap-1">
            <div class="w-3 h-3 bg-gray-200 rounded" v-for="i in 5" :key="i"></div>
          </div>
          <div class="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Skeleton component for loading state
</script>
