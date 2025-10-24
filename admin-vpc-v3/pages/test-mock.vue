<template>
  <div class="test-mock-page">
    <h1>🧪 Test Mock Service</h1>
    <p>Kiểm tra MockUserService hoạt động</p>

    <!-- Test Buttons -->
    <div class="test-buttons">
      <a-button type="primary" @click="testCreateUser" :loading="loading">
        ➕ Create Test User
      </a-button>
      
      <a-button @click="testCreateGoogleUser" :loading="loading">
        🔗 Create Google User
      </a-button>
      
      <a-button @click="loadUsers" :loading="loading">
        📋 Load All Users
      </a-button>
      
      <a-button @click="clearUsers" :loading="loading" danger>
        🗑️ Clear All Users
      </a-button>
    </div>

    <!-- Users List -->
    <div class="users-section" v-if="users.length > 0">
      <h2>📊 Users in Mock Service ({{ users.length }})</h2>
      
      <a-list
        :data-source="users"
        item-layout="horizontal"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <a-tag :color="getProviderColor(item.provider)">
                {{ getProviderLabel(item.provider) }}
              </a-tag>
            </template>
            
            <a-list-item-meta>
              <template #avatar>
                <a-avatar :src="item.avatar" :size="40">
                  {{ item.name.charAt(0).toUpperCase() }}
                </a-avatar>
              </template>
              
              <template #title>
                {{ item.name }}
              </template>
              
              <template #description>
                <p><strong>Email:</strong> {{ item.email }}</p>
                <p><strong>Provider:</strong> {{ item.provider }}</p>
                <p v-if="item.googleId"><strong>Google ID:</strong> {{ item.googleId }}</p>
                <p><strong>Role:</strong> {{ item.role }}</p>
                <p><strong>Active:</strong> {{ item.isActive ? 'Yes' : 'No' }}</p>
                <p><strong>Created:</strong> {{ formatDate(item.createdAt) }}</p>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </div>

    <!-- No Users -->
    <div v-else-if="!loading" class="no-users">
      <a-empty description="Chưa có users nào trong mock service" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <a-spin size="large" />
      <p>Đang xử lý...</p>
    </div>

    <!-- Console Logs -->
    <div class="console-logs" v-if="logs.length > 0">
      <h3>📝 Console Logs</h3>
      <div class="log-container">
        <div 
          v-for="(log, index) in logs" 
          :key="index"
          class="log-item"
          :class="log.type"
        >
          {{ log.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'

// ===== STATE =====
const loading = ref(false)
const users = ref([])
const logs = ref([])

// ===== METHODS =====
const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
  logs.value.unshift({
    message: `[${new Date().toLocaleTimeString()}] ${message}`,
    type
  })
  
  // Keep only last 10 logs
  if (logs.value.length > 10) {
    logs.value = logs.value.slice(0, 10)
  }
}

const testCreateUser = async () => {
  try {
    loading.value = true
    addLog('Creating test user...', 'info')
    
    const response = await $fetch('/api/users/create', {
      method: 'POST',
      body: {
        email: 'test@example.com',
        name: 'Test User',
        provider: 'local',
        role: 'user'
      }
    })
    
    if (response.success) {
      addLog('✅ Test user created successfully', 'success')
      message.success('Test user created!')
      await loadUsers()
    } else {
      throw new Error(response.error)
    }
  } catch (error: any) {
    addLog(`❌ Failed to create test user: ${error.message}`, 'error')
    message.error('Failed to create test user')
  } finally {
    loading.value = false
  }
}

const testCreateGoogleUser = async () => {
  try {
    loading.value = true
    addLog('Creating Google user...', 'info')
    
    const response = await $fetch('/api/users/create', {
      method: 'POST',
      body: {
        email: 'google@example.com',
        name: 'Google User',
        provider: 'google',
        googleId: 'google_' + Date.now(),
        role: 'user'
      }
    })
    
    if (response.success) {
      addLog('✅ Google user created successfully', 'success')
      message.success('Google user created!')
      await loadUsers()
    } else {
      throw new Error(response.error)
    }
  } catch (error: any) {
    addLog(`❌ Failed to create Google user: ${error.message}`, 'error')
    message.error('Failed to create Google user')
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    loading.value = true
    addLog('Loading users...', 'info')
    
    const response = await $fetch('/api/users/list')
    
    if (response.success) {
      users.value = response.data.users
      addLog(`✅ Loaded ${users.value.length} users`, 'success')
    } else {
      throw new Error(response.error)
    }
  } catch (error: any) {
    addLog(`❌ Failed to load users: ${error.message}`, 'error')
    message.error('Failed to load users')
  } finally {
    loading.value = false
  }
}

const clearUsers = async () => {
  try {
    loading.value = true
    addLog('Clearing users...', 'info')
    
    // Note: This would need a clear API endpoint
    // For now, just reload to see current state
    await loadUsers()
    addLog('Users reloaded', 'info')
  } catch (error: any) {
    addLog(`❌ Failed to clear users: ${error.message}`, 'error')
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
  addLog('Test page loaded', 'info')
  loadUsers()
})
</script>

<style scoped>
.test-mock-page {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.test-buttons {
  display: flex;
  gap: 12px;
  margin: 24px 0;
  flex-wrap: wrap;
}

.users-section {
  margin-top: 32px;
}

.loading {
  text-align: center;
  padding: 40px;
}

.no-users {
  text-align: center;
  padding: 40px;
}

.console-logs {
  margin-top: 32px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
}

.log-item {
  padding: 4px 8px;
  margin: 2px 0;
  border-radius: 4px;
}

.log-item.info {
  background: #e6f7ff;
  color: #1890ff;
}

.log-item.success {
  background: #f6ffed;
  color: #52c41a;
}

.log-item.error {
  background: #fff2f0;
  color: #ff4d4f;
}
</style>
