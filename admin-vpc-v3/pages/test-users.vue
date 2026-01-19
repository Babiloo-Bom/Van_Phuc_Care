<template>
  <div class="test-users-page">
    <h1>🧪 Test Users Page</h1>
    <p>Kiểm tra xem Google users đã được lưu chưa</p>

    <!-- Refresh Button -->
    <a-button type="primary" @click="loadUsers" :loading="loading">
      🔄 Refresh Users
    </a-button>

    <!-- Users List -->
    <div class="users-list" v-if="users.length > 0">
      <h2>📊 Users in System ({{ users.length }})</h2>
      
      <div class="user-cards">
        <a-card 
          v-for="user in users" 
          :key="user.id" 
          class="user-card"
          :title="user.name"
        >
          <template #extra>
            <a-tag :color="getProviderColor(user.provider)">
              {{ getProviderLabel(user.provider) }}
            </a-tag>
          </template>
          
          <div class="user-info">
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Provider:</strong> {{ user.provider }}</p>
            <p v-if="user.googleId"><strong>Google ID:</strong> {{ user.googleId }}</p>
            <p><strong>Role:</strong> {{ user.role }}</p>
            <p><strong>Active:</strong> {{ user.isActive ? 'Yes' : 'No' }}</p>
            <p><strong>Created:</strong> {{ formatDate(user.createdAt) }}</p>
          </div>
          
          <div class="user-avatar" v-if="user.avatar">
            <a-avatar :src="user.avatar" :size="60" />
          </div>
        </a-card>
      </div>
    </div>

    <!-- No Users -->
    <div v-else-if="!loading" class="no-users">
      <a-empty description="Chưa có users nào trong hệ thống" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <a-spin size="large" />
      <p>Đang tải users...</p>
    </div>

    <!-- Stats -->
    <div class="stats" v-if="stats.total > 0">
      <h3>📈 Statistics</h3>
      <a-row :gutter="16">
        <a-col :span="6">
          <a-statistic title="Total Users" :value="stats.total" />
        </a-col>
        <a-col :span="6">
          <a-statistic title="Active Users" :value="stats.active" />
        </a-col>
        <a-col :span="6">
          <a-statistic title="Google Users" :value="stats.google" />
        </a-col>
        <a-col :span="6">
          <a-statistic title="Local Users" :value="stats.local" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== STATE =====
const loading = ref(false)
const users = ref([])
const stats = ref({
  total: 0,
  active: 0,
  google: 0,
  local: 0
})

// ===== METHODS =====
const loadUsers = async () => {
  try {
    loading.value = true
    
    // Load users
    const usersResponse = await $fetch('/api/users/list')
    if (usersResponse.success) {
      users.value = usersResponse.data.users
    }
    
    // Load stats
    const statsResponse = await $fetch('/api/users/stats')
    if (statsResponse.success) {
      stats.value = statsResponse.data
    }
    
  } catch (error: any) {
  } finally {
    loading.value = false
  }
}

const getProviderColor = (provider: string) => {
  const colors = {
    local: 'blue',
    google: 'red',
    facebook: 'blue',
    github: 'black'
  }
  return colors[provider] || 'default'
}

const getProviderLabel = (provider: string) => {
  const labels = {
    local: 'Thường',
    google: 'Google',
    facebook: 'Facebook',
    github: 'GitHub'
  }
  return labels[provider] || provider
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('vi-VN')
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.test-users-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.users-list {
  margin-top: 24px;
}

.user-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.user-card {
  position: relative;
}

.user-info {
  margin-bottom: 16px;
}

.user-info p {
  margin: 4px 0;
}

.user-avatar {
  position: absolute;
  top: 16px;
  right: 16px;
}

.stats {
  margin-top: 32px;
  padding: 24px;
  background: #f5f5f5;
  border-radius: 8px;
}

.loading {
  text-align: center;
  padding: 40px;
}

.no-users {
  text-align: center;
  padding: 40px;
}
</style>
