<template>
  <!-- Use default layout so header/footer are kept -->
  <NuxtLayout>
    <div class="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div class="relative max-w-[620px] w-full text-center">
        <!-- 404 image on top -->
        <img
          src="/images/404-so.png"
          alt="404"
          class="mx-auto mb-4 max-w-[360px] sm:max-w-[420px]"
        />

        <!-- Mascot image in the middle (kéo sát xuống để đầu chạm đáy số 0) -->
        <img
          src="/images/404.png"
          alt="Page not found"
          class="mx-auto max-w-[280px] sm:max-w-[360px] -mt-6 sm:-mt-10 mb-6"
        />

        <!-- PAGE NOT FOUND text at bottom (giữ nguyên style) -->
        <h1
          class="font-404 text-2xl sm:text-[40px] font-bold text-404 leading-none tracking-[13px] uppercase"
        >
          Page not found
        </h1>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()
</script>

<style scoped>
.font-404 {
  font-family: 'SVN-Gilroy', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
}

.text-404 {
  color: #F48284;
}
</style>


