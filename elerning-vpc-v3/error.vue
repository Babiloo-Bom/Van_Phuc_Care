<template>
  <!-- Use default layout so header/footer are kept -->
  <NuxtLayout>
    <div class="min-h-[75vh] md:min-h-[60vh] flex flex-col items-center justify-center px-10 py-12">
      <div class="relative max-w-[620px] w-full text-center">
        <nuxt-img
            src="/images/404-page.png"
            alt="Van Phuc Care"
            class="object-contain"
            format="webp"
            width="610"
            height="560"
            loading="eager"
            fetchpriority="high"
          />
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


