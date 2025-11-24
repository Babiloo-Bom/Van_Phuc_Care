<template>
  <div class="bg-white rounded-none lg:rounded-lg shadow-none lg:shadow-sm p-6 border-b border-gray-200 lg:border-0">
    <div class="flex items-center justify-between mb-4">
      <h4 class="font-semibold text-gray-800 text-base">
        Nhiệt độ cơ thể:
      </h4>
      <span 
        class="text-2xl font-bold"
        :style="{ color: getTemperatureColor(healthBook.temperature) }"
      >
        {{ healthBook.temperature ? `${healthBook.temperature}°C` : '--' }}
      </span>
    </div>

    <!-- Temperature Bar Chart -->
    <div v-if="chartData.length > 0" class="mt-6">
      <div class="relative">
        <div class="text-sm text-gray-500 text-right mb-2">Nhiệt độ (°C)</div>
        <div class="bg-gray-50 rounded-lg p-4 overflow-x-auto">
          <svg
            :viewBox="`0 0 ${barChartWidth} 200`"
            :width="barChartWidth"
            height="200"
            class="h-48"
            preserveAspectRatio="none"
          >
            <!-- Grid lines and labels -->
            <g>
              <line v-for="i in 5" :key="`grid-${i}`"
                :x1="0"
                :y1="i * 40"
                :x2="barChartWidth"
                :y2="i * 40"
                stroke="#e5e7eb"
                stroke-width="1"
              />
              <text v-for="i in 5" :key="`label-${i}`"
                x="0"
                :y="i * 40 + 4"
                font-size="14"
                fill="#6b7280"
                font-weight="bold"
                text-anchor="start"
              >{{ 40 - (i * 1) }}°C</text>
            </g>
            <!-- Bars -->
            <g>
              <rect
                v-for="(point, index) in chartData"
                :key="`bar-${index}`"
                :x="getBarX(index)"
                :y="getBarY(point.value)"
                :width="barWidth"
                :height="getBarHeight(point.value)"
                :fill="index === chartData.length - 1 ? '#2563eb' : '#cbd5e1'"
                rx="6"
              />
              <!-- Value label for last bar -->
              <g v-if="chartData.length > 0">
                <text
                  v-if="chartData.length > 0 && chartData[chartData.length - 1]"
                  :x="getBarX(chartData.length - 1) + barWidth / 2"
                  :y="getBarY(chartData[chartData.length - 1]?.value ?? 0) - 8"
                  font-size="16"
                  fill="#2563eb"
                  font-weight="bold"
                  text-anchor="middle"
                >{{ (chartData[chartData.length - 1]?.value ?? 0).toFixed(1) }}°C</text>
              </g>
            </g>
            <!-- X axis labels (days) -->
            <g>
              <text
                v-for="(point, index) in chartData"
                :key="`xlabel-${index}`"
                :x="getBarX(index) + barWidth / 2"
                y="195"
                font-size="14"
                fill="#374151"
                font-weight="bold"
                text-anchor="middle"
              >{{ index + 1 }}</text>
            </g>
          </svg>
        </div>
        <div class="text-sm text-gray-500 mt-2">Ngày</div>
      </div>
      <!-- Date Labels (optional, can be removed if not needed) -->
      <!--
      <div class="flex justify-between mt-2 text-xs text-gray-500">
        <span>{{ chartData[0]?.date }}</span>
        <span>{{ chartData[Math.floor(chartData.length / 2)]?.date }}</span>
        <span>{{ chartData[chartData.length - 1]?.date }}</span>
      </div>
      -->
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      Chưa có dữ liệu nhiệt độ
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed } from 'vue'
import dayjs from 'dayjs'
import type { HealthBook, HealthBookTemperatureHistory, HealthBookTemperatureHistoryItem } from '~/types/api'

interface Props {
  healthBook: HealthBook
  temperatureHistory?: HealthBookTemperatureHistoryItem[]
}

const props = defineProps<Props>()

// chartData: lấy từ props.temperatureHistory nếu có, fallback mock nếu không
const chartData = computed(() => {
  // Determine current month and today
  const today = dayjs();
  const daysInMonth = today.date(); // Only render up to today
  const month = today.format('YYYY-MM');

  // Build a map from temperatureHistory for quick lookup
  let tempMap: Record<string, number> = {};
  if (props.temperatureHistory && Array.isArray(props.temperatureHistory)) {
    for (const item of props.temperatureHistory) {
      tempMap[dayjs(item.date).format('YYYY-MM-DD')] = item.temperature;
    }
  }

  // Build chart data for each day from 1 to today
  const data = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = dayjs(`${month}-${String(d).padStart(2, '0')}`);
    const key = dateObj.format('YYYY-MM-DD');
    data.push({
      date: dateObj.format('DD/MM'),
      value: tempMap[key] !== undefined ? tempMap[key] : 0,
    });
  }
  return data;
})

// Bar chart dimensions
const barWidth = 24
const barGap = 16
const barChartWidth = computed(() => chartData.value.length * (barWidth + barGap))

const getBarX = (index: number) => {
  return index * (barWidth + barGap)
}
const getBarY = (value: number) => {
  const min = 36
  const max = 40
  const normalized = (value - min) / (max - min)
  return 200 - (normalized * 200)
}
const getBarHeight = (value: number) => {
  const min = 36
  const max = 40
  const normalized = (value - min) / (max - min)
  return Math.max(0, normalized * 200)
}

// Temperature color
const getTemperatureColor = (temp: string | number | undefined) => {
  if (!temp) return '#6b7280'
  const value = typeof temp === 'number' ? temp : parseFloat(temp)
  if (value < 36.5) return '#3b82f6' // Blue - cold
  if (value >= 36.5 && value <= 37.5) return '#10b981' // Green - normal
  if (value > 37.5 && value <= 38.5) return '#f59e0b' // Orange - warm
  return '#ef4444' // Red - fever
}
</script>
