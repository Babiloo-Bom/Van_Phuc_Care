<template>
  <div class="revenue-chart-container">
    <div v-if="loading || !isReady" class="chart-loading">
      <a-spin size="large" />
      <div style="margin-top: 10px; color: #8c8c8c; font-size: 12px;">
        {{ loading ? 'Đang tải dữ liệu...' : 'Đang khởi tạo biểu đồ...' }}
      </div>
    </div>
    <div v-else style="position: relative; width: 100%; height: 300px; background: #fafafa;">
      <canvas 
        ref="chartCanvas" 
        style="max-width: 100%; height: 100%; display: block;" 
        width="800"
        height="300"
      />
      <div v-if="!chartInstance" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #8c8c8c;">
        Đang vẽ biểu đồ...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
console.log('🔵 RevenueChart component script loaded')

import { ref, onMounted, onUnmounted, watch, nextTick, watchEffect } from 'vue'

// Import Chart.js directly (Nuxt 3 handles SSR)
let Chart: any = null
let chartInstance: any = null

interface Props {
  data: Array<{
    month: string
    monthNumber: number
    year: number
    revenue: number
    orderCount: number
  }>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const isReady = ref(false)

// Load Chart.js on client side only
onMounted(async () => {
  console.log('🎯 RevenueChart component mounted')
  console.log('📊 Initial props:', {
    loading: props.loading,
    dataLength: props.data?.length || 0,
    data: props.data
  })
  
  if (typeof window === 'undefined') {
    console.log('⏸️ Not in browser, skipping Chart.js load')
    return
  }
  
  try {
    console.log('📦 Loading Chart.js...')
    const chartModule = await import('chart.js')
    Chart = chartModule.Chart
    
    const {
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      LineController,
      Title,
      Tooltip,
      Legend,
      Filler
    } = chartModule
    
    Chart.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      LineController,  // Thêm LineController - QUAN TRỌNG!
      Title,
      Tooltip,
      Legend,
      Filler
    )
    
    isReady.value = true
    console.log('✅ Chart.js loaded successfully')
    
    // Wait for DOM to be ready
    await nextTick()
    await nextTick()
    await nextTick()
    
    // Try to render after Chart.js is loaded and DOM is ready
    setTimeout(() => {
      console.log('🚀 Attempting initial render after Chart.js load', {
        isReady: isReady.value,
        hasChart: !!Chart,
        loading: props.loading,
        dataLength: props.data?.length || 0,
        hasCanvas: !!chartCanvas.value
      })
      
      if (!props.loading && props.data && props.data.length > 0 && chartCanvas.value) {
        renderChart()
      } else {
        console.log('⏸️ Cannot render yet, will wait for watchEffect')
      }
    }, 500)
  } catch (error) {
    console.error('❌ Failed to load Chart.js:', error)
  }
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    notation: 'compact',
    maximumFractionDigits: 0
  }).format(amount)
}

const renderChart = () => {
  try {
    if (!Chart || !isReady.value) {
      console.log('⏸️ Chart.js not loaded yet', { hasChart: !!Chart, isReady: isReady.value })
      return
    }
    
    if (!chartCanvas.value || !props.data || props.data.length === 0 || props.loading) {
      console.log('⏸️ Chart render skipped:', {
        hasChart: !!Chart,
        isReady: isReady.value,
        hasCanvas: !!chartCanvas.value,
        hasData: !!props.data,
        dataLength: props.data?.length || 0,
        loading: props.loading
      })
      return
    }

    // Destroy existing chart - QUAN TRỌNG: phải destroy trước khi tạo mới
    if (chartInstance) {
      console.log('🗑️ Destroying existing chart instance')
      try {
        chartInstance.destroy()
      } catch (e) {
        console.warn('Warning destroying chart:', e)
      }
      chartInstance = null
    }
    
    // Đảm bảo canvas không còn chart nào
    const existingChart = Chart.getChart(chartCanvas.value)
    if (existingChart) {
      console.log('🗑️ Found existing chart on canvas, destroying it')
      existingChart.destroy()
    }

    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) {
      console.warn('Chart canvas context not available')
      return
    }

    const labels = props.data.map(item => item.month)
    const revenueData = props.data.map(item => item.revenue)
    
    console.log('📈 Rendering chart with data:', { labels, revenueData })
    console.log('📐 Canvas dimensions:', {
      width: chartCanvas.value.width,
      height: chartCanvas.value.height,
      clientWidth: chartCanvas.value.clientWidth,
      clientHeight: chartCanvas.value.clientHeight,
      offsetWidth: chartCanvas.value.offsetWidth,
      offsetHeight: chartCanvas.value.offsetHeight
    })

    chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Doanh thu',
          data: revenueData,
          borderColor: '#1890ff',
          backgroundColor: 'rgba(24, 144, 255, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#1890ff',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: 500
          }
        }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 600
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: (context: any) => {
              const value = context.parsed.y
              return `Doanh thu: ${formatCurrency(value)}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            },
            color: '#8c8c8c'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              size: 11
            },
            color: '#8c8c8c',
            callback: (value: any) => {
              return formatCurrency(value)
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  })
  
  console.log('✅ Chart rendered successfully', {
    chartId: chartInstance?.id,
    canvas: chartCanvas.value,
    chart: chartInstance
  })
  
  // Force update để đảm bảo chart được hiển thị
  if (chartInstance) {
    chartInstance.update()
    console.log('🔄 Chart updated')
  }
  } catch (error) {
    console.error('❌ Error rendering chart:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}

// Watch for changes and render
watchEffect(async () => {
  const shouldRender = isReady.value && Chart && !props.loading && props.data && props.data.length > 0
  
  console.log('🔄 WatchEffect triggered:', {
    isReady: isReady.value,
    hasChart: !!Chart,
    loading: props.loading,
    dataLength: props.data?.length || 0,
    hasCanvas: !!chartCanvas.value,
    shouldRender
  })
  
  if (shouldRender && chartCanvas.value) {
    await nextTick()
    await nextTick()
    setTimeout(() => {
      console.log('🚀 WatchEffect: Attempting to render chart')
      renderChart()
    }, 200)
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
.revenue-chart-container {
  position: relative;
  width: 100%;
  height: 300px;
  min-height: 300px;
}

.revenue-chart-container canvas {
  display: block !important;
  width: 100% !important;
  height: 300px !important;
}

.chart-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  min-height: 300px;
}
</style>

