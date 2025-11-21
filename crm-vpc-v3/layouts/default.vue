<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar - Desktop only -->
    <Sidebar />

    <!-- Header Mobile - Mobile only -->
    <HeaderMobile />

    <!-- Main Content Area -->
    <div class="lg:ml-[225px]">
      <!-- Header Desktop - Desktop only -->
      <HeaderDesktop />

      <!-- Page Content - Scrollable -->
      <main class="px-4 lg:px-6 xl:px-8 pt-24">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '~/components/layout/Sidebar.vue'
import HeaderDesktop from '~/components/layout/HeaderDesktop.vue'
import HeaderMobile from '~/components/layout/HeaderMobile.vue'
</script>
