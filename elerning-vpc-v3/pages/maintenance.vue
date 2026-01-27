<template>
  <!-- Dùng layout mặc định để giữ nguyên header / footer -->
  <NuxtLayout>
    <div class="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div
        class="relative max-w-4xl w-full bg-white border border-[#1A75BB] rounded-lg overflow-hidden shadow-sm"
      >
        <!-- Background bảo trì -->
        <img
          src="/images/baotribackground.png"
          alt="Maintenance background"
          class="w-full h-auto block"
        />

        <!-- Mascot ở giữa -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/images/baotri.png"
            alt="Website đang được bảo trì"
            class="max-w-[260px] sm:max-w-[320px]"
          />
        </div>
      </div>

      <!-- Text bên dưới -->
      <div class="mt-8 text-center">
        <h1 class="text-baotri-title font-baotri font-bold text-[24px] sm:text-[28px] mb-2">
          Website đang được bảo trì
        </h1>
        <p class="text-baotri-sub font-baotri text-sm sm:text-base">
          Xin lỗi bạn vì sự bất tiện này. Bạn vui lòng quay lại sau nhé.
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  // Có thể gắn middleware riêng nếu cần, hiện tại chỉ là trang tĩnh
})
</script>

<style scoped>
.font-baotri {
  font-family: 'SVN-Gilroy', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
}

.text-baotri-title {
  color: #0077c8;
}

.text-baotri-sub {
  color: #555555;
}
</style>


