<template>
  <!-- Dùng layout mặc định để giữ nguyên header / footer -->
  <div
    class="h-[100vh] flex flex-col items-center justify-center px-10 py-12"
  >
    <div class="relative text-center">
      <nuxt-img
        src="/images/maintenance-desktop.png"
        alt="Van Phuc Care"
        class="object-contain hidden sm:block"
        format="webp"
        width="680"
        height="560"
        loading="eager"
        fetchpriority="high"
      />
      <nuxt-img
        src="/images/maintenance-mobile.png"
        alt="Van Phuc Care"
        class="object-contain block sm:hidden"
        format="webp"
        width="306"
        height="276"
        loading="eager"
        fetchpriority="high"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
</script>

<style scoped>
.font-baotri {
  font-family:
    "SVN-Gilroy",
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.text-baotri-title {
  color: #0077c8;
}

.text-baotri-sub {
  color: #555555;
}
</style>
