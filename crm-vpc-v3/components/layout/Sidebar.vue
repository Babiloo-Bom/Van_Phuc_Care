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
      <template v-for="item in menuItems" :key="item.path">
        <!-- External Link -->
        <a
          v-if="isExternalLink(item.path)"
          :href="getElearningSSOUrl(item.path)"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 px-5 py-3 mx-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100"
        >
          <div v-html="item.icon" />
          <span>{{ item.label }}</span>
        </a>
        <!-- Internal Link -->
        <NuxtLink
          v-else
          :to="item.path"
          class="flex items-center gap-3 px-5 py-3 mx-2 rounded-lg text-sm font-medium transition-all duration-200"
          :class="isActive(item.path) ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700 hover:bg-gray-100'"
        >
          <div v-html="item.icon" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useRuntimeConfig } from '#app';
import { MENU_ITEMS } from '~/constants/menu';

const route = useRoute();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const menuItems = MENU_ITEMS;

// Elearning Base URL
const elearningBaseUrl = computed(() => config.public.baseUrlElearning || 'http://elearning.vanphuccare.com');

const isExternalLink = (path: string) => {
  return path.startsWith('http://') || path.startsWith('https://');
};

const isActive = (path: string) => {
  if (isExternalLink(path)) {
    return false;
  }
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};

// Get SSO URL for Elearning
const getElearningSSOUrl = (path: string) => {
  if (!isExternalLink(path)) return path;
  
  // If it's the "Khóa học của tôi" link, add SSO token
  if (path.includes('my-learning') && authStore.isAuthenticated && authStore.token) {
    try {
      const { buildSSOUrl } = require('~/utils/sso');
      return buildSSOUrl(elearningBaseUrl.value, '/my-learning');
    } catch {
      return path;
    }
  }
  
  return path;
};
</script>
