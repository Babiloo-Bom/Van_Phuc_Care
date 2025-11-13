<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex item// Generate mock temperature data for last 15 days
const chartData = computed(() => {
  // TODO: Fetch real temperature history from API
  // const { getTemperatureHistory } = useHealthBooksApi()
  // await getTemperatureHistory(date)
  
  // Mock data for now
  const data = []
  for (let i = 14; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day')
    data.push({
      date: date.format('DD/MM'),
      value: 36.5 + Math.random() * 1.5, // Random between 36.5 and 38
    })
  }
  return data
})ween mb-4">
      <h4 class="font-semibold text-blue-600 text-base">
        Nhiệt độ cơ thể:
      </h4>
      <span 
        class="text-3xl font-bold"
        :style="{ color: getTemperatureColor(healthBook.temperature) }"
      >
        {{ healthBook.temperature ? `${healthBook.temperature}°C` : '--' }}
      </span>
    </div>

    <!-- Temperature Chart -->
    <div v-if="chartData.length > 0" class="mt-6">
      <div class="relative">
        <div class="text-sm text-gray-500 text-right mb-2">Nhiệt độ (°C)</div>
        
        <!-- Simple Line Chart using SVG -->
        <div class="bg-gray-50 rounded-lg p-4 overflow-x-auto">
          <svg 
            viewBox="0 0 600 200" 
            class="w-full h-48"
            preserveAspectRatio="none"
          >
            <!-- Grid lines -->
            <line v-for="i in 5" :key="`grid-${i}`" 
              :x1="0" 
              :y1="i * 40" 
              :x2="600" 
              :y2="i * 40" 
              stroke="#e5e7eb" 
              stroke-width="1"
            />
            
            <!-- Temperature line -->
            <polyline 
              :points="linePoints"
              fill="none"
              stroke="#3b82f6"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            
            <!-- Data points -->
            <circle
              v-for="(point, index) in chartData"
              :key="`point-${index}`"
              :cx="getX(index)"
              :cy="getY(point.value)"
              r="5"
              fill="#3b82f6"
              stroke="white"
              stroke-width="2"
            />
          </svg>
        </div>

        <div class="text-sm text-gray-500 mt-2">Ngày (15 ngày gần nhất)</div>
      </div>

      <!-- Date Labels -->
      <div class="flex justify-between mt-2 text-xs text-gray-500">
        <span>{{ chartData[0]?.date }}</span>
        <span>{{ chartData[Math.floor(chartData.length / 2)]?.date }}</span>
        <span>{{ chartData[chartData.length - 1]?.date }}</span>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      Chưa có dữ liệu nhiệt độ
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { HealthBook } from '~/types/api'

interface Props {
  healthBook: HealthBook
}

const props = defineProps<Props>()

// Generate mock temperature data for last 15 days
const chartData = computed(() => {
  // TODO: Fetch real temperature history from API
  // const { getTemperatureHistory } = useHealthBooksApi()
  // await getTemperatureHistory(date)
  
  // Mock data for now
  const data = []
  for (let i = 14; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day')
    data.push({
      date: date.format('DD/MM'),
      value: 36.5 + Math.random() * 1.5, // Random between 36.5 and 38
    })
  }
  return data
})

// SVG coordinates
const getX = (index: number) => {
  return (index / (chartData.value.length - 1)) * 600
}

const getY = (value: number) => {
  const min = 36
  const max = 40
  const normalized = (value - min) / (max - min)
  return 200 - (normalized * 200)
}

const linePoints = computed(() => {
  return chartData.value
    .map((point: any, index: number) => `${getX(index)},${getY(point.value)}`)
    .join(' ')
})

// Temperature color
const getTemperatureColor = (temp: string | undefined) => {
  if (!temp) return '#6b7280'
  const value = parseFloat(temp)
  if (value < 36.5) return '#3b82f6' // Blue - cold
  if (value >= 36.5 && value <= 37.5) return '#10b981' // Green - normal
  if (value > 37.5 && value <= 38.5) return '#f59e0b' // Orange - warm
  return '#ef4444' // Red - fever
}
</script>
