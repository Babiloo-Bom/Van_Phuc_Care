<template>
  <div></div>
</template>

<script setup lang="ts">
// Redirect to login - registration is not allowed for admin portal
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useHead({
  title: 'Đăng ký - Van Phuc Care'
})

// Redirect immediately to login
onMounted(() => {
  navigateTo('/login')
})
</script>
