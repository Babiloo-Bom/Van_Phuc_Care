<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Baby Avatar & Info -->
    <div class="flex flex-col items-center mb-6">
      <div class="relative mb-4">
        <img
          v-if="healthBook.avatar"
          :src="healthBook.avatar"
          :alt="healthBook.name"
          class="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
        />
        <div
          v-else
          class="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200"
        >
          <UserOutlined class="text-5xl text-blue-500" />
        </div>
      </div>

      <!-- Name -->
      <h2 class="text-2xl font-bold text-gray-800 mb-2 text-center">
        {{ healthBook.name || 'Chưa cập nhật' }}
      </h2>

      <!-- Date of Birth -->
      <div v-if="healthBook.dob" class="text-gray-600 mb-1 flex items-center gap-2">
        <CalendarOutlined />
        <span>{{ formatDate(healthBook.dob) }}</span>
      </div>

      <!-- Age -->
      <div v-if="healthBook.dob" class="text-sm text-gray-500">
        {{ calculateAge(healthBook.dob) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserOutlined, CalendarOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import type { HealthBook } from '~/types/api'

interface Props {
  healthBook: HealthBook
}

defineProps<Props>()

// Format date to Vietnamese format
const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

// Calculate age in months or years
const calculateAge = (dob: string) => {
  const birthDate = dayjs(dob)
  const now = dayjs()
  const months = now.diff(birthDate, 'month')
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (years > 0) {
    return remainingMonths > 0 
      ? `${years} tuổi ${remainingMonths} tháng`
      : `${years} tuổi`
  }
  return `${months} tháng tuổi`
}
</script>
