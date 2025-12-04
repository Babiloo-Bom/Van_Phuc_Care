<template>
  <aside class="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:w-[225px] lg:h-screen lg:bg-white lg:border-r lg:border-gray-200 lg:z-[100]">
    <!-- Logo Section -->
    <div class="flex justify-center items-center px-6 py-8 border-b border-gray-200">
      <img 
        src="/images/logo-vanphuc-new.png" 
        alt="Vạn Phúc Care Logo" 
        class="w-[120px] h-auto object-contain"
      />
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 py-4 overflow-y-auto">
      <NuxtLink 
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path" 
        class="flex items-center gap-3 px-5 py-3 mx-2 rounded-lg text-sm font-medium transition-all duration-200"
        :class="isActive(item.path) ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700 hover:bg-gray-100'"
      >
        <div v-html="item.icon" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { MENU_ITEMS } from '~/constants/menu';

const route = useRoute();
const menuItems = MENU_ITEMS;

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};
</script>
