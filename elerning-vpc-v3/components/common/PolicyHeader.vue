<template>
  <section class="policy-header">
    <div class="header-overlay">
      <img
        src="/images/privacy-policy.png"
        alt="Policy Header Background"
        class="w-full h-full object-cover" />
    </div>
    <div class="container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-12 lg:py-16 relative z-10">
      <h1 class="header-title">{{ title }}</h1>
      <div v-if="description" class="header-description">
        <p v-for="(paragraph, index) in descriptionParagraphs" :key="index" :class="{ 'mb-4': index < descriptionParagraphs.length - 1 }">
          {{ paragraph }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  description?: string
}>()

const descriptionParagraphs = computed(() => {
  if (!props.description) return []
  return props.description.split('\n').filter(p => p.trim())
})
</script>

<style scoped>
.policy-header {
  color: white;
  min-height: 280px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.header-overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.header-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.25;
}

.header-description {
  font-size: 0.875rem;
  line-height: 1.44;
  max-width: 840px;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .header-title {
    font-size: 2rem;
  }

  .header-description {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .policy-header {
    min-height: 260px;
  }

  .header-title {
    font-size: 1.75rem;
    margin-bottom: 1.25rem;
  }

  .header-description {
    font-size: 1rem;
    line-height: 1.7;
  }
}

@media (max-width: 640px) {
  .policy-header {
    min-height: 240px;
  }

  .header-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .header-description {
    font-size: 0.875rem;
    line-height: 1.65;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 1.35rem;
  }
}
</style>
