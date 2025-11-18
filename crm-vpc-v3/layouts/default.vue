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
      <main class="pt-16 lg:pt-[72px] p-4 lg:p-6 xl:p-8">
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
