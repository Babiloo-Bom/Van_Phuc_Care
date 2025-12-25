<script setup lang="ts">
// Redirect /dashboard to /
definePageMeta({
  middleware: () => {
    return navigateTo('/')
  }
})
</script>

