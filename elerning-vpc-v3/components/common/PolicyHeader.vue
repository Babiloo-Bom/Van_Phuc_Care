<template>
  <section class="policy-header">
    <div class="header-overlay"></div>
    <div class="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 relative z-10">
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
  background: linear-gradient(135deg, #1A75BB 0%, #0d5a94 100%);
  color: white;
  min-height: 280px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/policy-header-bg.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  z-index: 1;
}

.header-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  font-style: italic;
}

.header-description {
  font-size: 1rem;
  line-height: 1.8;
  max-width: 1000px;
  opacity: 0.95;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .header-title {
    font-size: 2rem;
  }

  .header-description {
    font-size: 0.95rem;
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
    font-size: 0.9rem;
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
