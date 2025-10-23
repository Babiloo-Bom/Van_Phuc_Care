<template>
  <div class="courses-page">
    <div class="page-header">
      <h1>Courses Management</h1>
      <button class="btn-primary" @click="navigateTo('/courses/create')">
        + Add New Course
      </button>
    </div>
    
    <div class="courses-list">
      <p class="placeholder">
        Course list will be displayed here. Connect to API to load courses data.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.btn-primary {
  padding: 8px 16px;
  background-color: #52c41a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #73d13d;
}

.courses-list {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.placeholder {
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
  padding: 40px;
}
</style>

