<template>
  <div class="related-policies">
    <h3 class="related-title">Điều khoản & Chính sách liên quan</h3>
    <div class="divider"></div>
    <ul class="related-list">
      <li v-for="policy in filteredPolicies" :key="policy.path">
        <NuxtLink :to="policy.path" class="related-link">
          {{ policy.label }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Policy {
  path: string
  label: string
}

const props = defineProps<{
  excludePath?: string
}>()

const allPolicies: Policy[] = [
  { path: '/terms-of-service', label: 'Điều khoản sử dụng' },
  { path: '/privacy-policy', label: 'Chính sách bảo mật & quyền riêng tư' },
  { path: '/content-partner-policy', label: 'Chính sách dành cho đối tác nội dung' },
  { path: '/complaint-procedure', label: 'Quy trình tiếp nhận & giải quyết khiếu nại' }
]

const filteredPolicies = computed(() => {
  if (!props.excludePath) return allPolicies
  return allPolicies.filter(policy => policy.path !== props.excludePath)
})
</script>

<style scoped>
.related-policies {
  background: #F3F9FF;
  border: 1px solid #1A75BB;
  border-radius: 8px;
  padding: 1.75rem 2rem;
  margin-top: 2rem;
}

.related-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1A75BB;
  margin-bottom: 1rem;
  font-style: italic;
}

.divider {
  height: 1px;
  background: #1A75BB;
  margin-bottom: 1.25rem;
  max-width: 100%;
}

.related-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.related-list li {
  margin-bottom: 0.875rem;
  padding-left: 1.5rem;
  position: relative;
}

.related-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #1A75BB;
  font-weight: bold;
  font-size: 1.2rem;
}

.related-list li:last-child {
  margin-bottom: 0;
}

.related-link {
  color: #1A75BB;
  font-size: 1.125rem;
  line-height: 1.6;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
  font-style: italic;
}

.related-link:hover {
  color: #135a91;
  text-decoration: underline;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .related-policies {
    padding: 1.5rem;
  }

  .related-title {
    font-size: 1.25rem;
    margin-bottom: 0.875rem;
  }

  .divider {
    margin-bottom: 1rem;
  }

  .related-link {
    font-size: 1rem;
  }

  .related-list li {
    margin-bottom: 0.75rem;
    padding-left: 1.25rem;
  }
}

@media (max-width: 480px) {
  .related-policies {
    padding: 1.25rem;
  }

  .related-title {
    font-size: 1.125rem;
  }

  .related-link {
    font-size: 0.9375rem;
  }

  .related-list li {
    padding-left: 1rem;
  }

  .related-list li::before {
    font-size: 1rem;
  }
}
</style>
