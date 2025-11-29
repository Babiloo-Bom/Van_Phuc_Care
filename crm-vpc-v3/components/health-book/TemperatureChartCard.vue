<template>
  <div
    class="bg-white rounded-none lg:rounded-lg shadow-none lg:shadow-sm border-b border-gray-200 lg:border-0"
  >
    <div class="flex items-center justify-start gap-2 mb-2">
      <h4 class="font-bold text-[#1A75BB] text-sm mb-0">Nhiệt độ cơ thể:</h4>
      <span
        class="text-2xl font-bold mb-2"
        :style="{ color: getTemperatureColor(healthBook.temperature) }"
      >
        {{ healthBook.temperature ? `${healthBook.temperature}°C` : "--" }}
      </span>
    </div>

    <!-- Temperature Bar Chart -->
    <div v-if="chartData.length > 0" class="mt-2">
      <div class="relative">
        <div class="bg-gray-50 rounded-lg p-4 overflow-x-auto">
          <svg
            :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
            :width="svgWidth"
            :height="svgHeight"
            preserveAspectRatio="xMinYMin meet"
          >
            <!-- Y axis labels (temperature) -->
            <g>
              <text
                v-for="(label, i) in yAxisLabels"
                :key="`ylabel-${i}`"
                :x="paddingLeft - 8"
                :y="getYPosition(label.value) + 4"
                font-size="12"
                fill="#6b7280"
                font-weight="500"
                text-anchor="end"
              >
                {{ label.text }}
              </text>
            </g>

            <!-- Grid lines -->
            <g>
              <line
                v-for="(label, i) in yAxisLabels"
                :key="`grid-${i}`"
                :x1="paddingLeft"
                :y1="getYPosition(label.value)"
                :x2="svgWidth - paddingRight"
                :y2="getYPosition(label.value)"
                stroke="#e5e7eb"
                stroke-width="1"
              />
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
                :fill="index === selectedDayIndex ? '#2563eb' : '#cbd5e1'"
                rx="4"
              />
              <!-- Value label for selected day bar with background box -->
              <g
                v-if="
                  chartData.length > 0 &&
                  chartData[selectedDayIndex] &&
                  chartData[selectedDayIndex].value > 0
                "
              >
                <!-- Background box -->
                <rect
                  :x="getBarX(selectedDayIndex) + barWidth / 2 - 32"
                  :y="getBarY(chartData[selectedDayIndex]?.value ?? 0) - 36"
                  width="64"
                  height="28"
                  rx="8"
                  fill="white"
                  stroke="#2563eb"
                  stroke-width="1.5"
                />
                <!-- Temperature text -->
                <text
                  :x="getBarX(selectedDayIndex) + barWidth / 2"
                  :y="getBarY(chartData[selectedDayIndex]?.value ?? 0) - 17"
                  font-size="14"
                  fill="#2563eb"
                  font-weight="bold"
                  text-anchor="middle"
                >
                  {{ (chartData[selectedDayIndex]?.value ?? 0).toFixed(1) }}°C
                </text>
              </g>
            </g>

            <!-- X axis labels (days) -->
            <g>
              <!-- "Ngày" label at the start -->
              <text
                :x="8"
                :y="svgHeight - 8"
                font-size="12"
                fill="#6b7280"
                font-weight="500"
                text-anchor="start"
              >
                Ngày
              </text>

              <!-- Day numbers -->
              <text
                v-for="(point, index) in chartData"
                :key="`xlabel-${index}`"
                :x="getBarX(index) + barWidth / 2"
                :y="svgHeight - 8"
                font-size="12"
                fill="#374151"
                font-weight="500"
                text-anchor="middle"
              >
                {{ index + 1 }}
              </text>
            </g>
          </svg>
        </div>
        <div class="text-sm text-gray-500 mt-2 text-center hidden">Ngày</div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      Chưa có dữ liệu nhiệt độ
    </div>

    <!-- Note -->
    <div v-if="healthBook.note" class="hidden lg:block bg-blue-50 rounded-lg p-4 mt-5">
      <h4 class="font-bold text-[#1A75BB] text-sm mb-2">Lưu ý:</h4>
      <div
        class="text-sm text-gray-600 leading-relaxed"
        v-html="healthBook.note"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import dayjs, { Dayjs } from "dayjs";
import type {
  HealthBook,
  HealthBookTemperatureHistory,
  HealthBookTemperatureHistoryItem,
} from "~/types/api";

interface Props {
  healthBook: HealthBook;
  temperatureHistory?: HealthBookTemperatureHistoryItem[];
  selectedDate?: Dayjs | null;
}

const props = defineProps<Props>();

// Get selected day index (1-based day of month)
const selectedDayIndex = computed(() => {
  if (!props.selectedDate) return dayjs().date() - 1; // Default to today
  return props.selectedDate.date() - 1;
});

// chartData: lấy từ props.temperatureHistory nếu có, fallback mock nếu không
const chartData = computed(() => {
  // Determine current month and today
  const today = dayjs();
  const daysInMonth = today.date(); // Only render up to today
  const month = today.format("YYYY-MM");

  // Build a map from temperatureHistory for quick lookup
  let tempMap: Record<string, number> = {};
  if (props.temperatureHistory && Array.isArray(props.temperatureHistory)) {
    for (const item of props.temperatureHistory) {
      tempMap[dayjs(item.date).format("YYYY-MM-DD")] = item.temperature;
    }
  }

  // Build chart data for each day from 1 to today
  const data = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = dayjs(`${month}-${String(d).padStart(2, "0")}`);
    const key = dateObj.format("YYYY-MM-DD");
    data.push({
      date: dateObj.format("DD/MM"),
      value: tempMap[key] !== undefined ? tempMap[key] : 0,
    });
  }
  return data;
});

// Bar chart dimensions
const barWidth = 16;
const barGap = 8;
const paddingLeft = 55; // Space for Y axis labels + "Ngày" label
const paddingRight = 20; // Increased to prevent UI cutoff on right side
const paddingTop = 45; // Space for value labels above bars (increased for label box)
const paddingBottom = 35; // Space for X axis labels (increased by 10px)
const chartHeight = 160; // Height of the chart area (without padding)

// Y axis configuration
const yAxisLabels = [
  { value: 40, text: "40°C" },
  { value: 39, text: "39°C" },
  { value: 38, text: "38°C" },
  { value: 37, text: "37°C" },
  { value: 36, text: "36°C" },
  { value: 35, text: "35°C" },
];

const svgHeight = chartHeight + paddingTop + paddingBottom;
const svgWidth = computed(
  () =>
    paddingLeft + chartData.value.length * (barWidth + barGap) + paddingRight
);

const getBarX = (index: number) => {
  return paddingLeft + index * (barWidth + barGap);
};

const getYPosition = (value: number) => {
  const min = 35;
  const max = 40;
  const normalized = (value - min) / (max - min);
  return paddingTop + chartHeight - normalized * chartHeight;
};

const getBarY = (value: number) => {
  if (value <= 0) return paddingTop + chartHeight; // No bar for 0 value
  const min = 35;
  const max = 40;
  const clampedValue = Math.max(min, Math.min(max, value));
  const normalized = (clampedValue - min) / (max - min);
  return paddingTop + chartHeight - normalized * chartHeight;
};

const getBarHeight = (value: number) => {
  if (value <= 0) return 0;
  const min = 35;
  const max = 40;
  const clampedValue = Math.max(min, Math.min(max, value));
  const normalized = (clampedValue - min) / (max - min);
  return Math.max(0, normalized * chartHeight);
};

// Temperature color
const getTemperatureColor = (temp: string | number | undefined) => {
  if (!temp) return "#6b7280";
  const value = typeof temp === "number" ? temp : parseFloat(temp);
  if (value < 36.5) return "#3b82f6"; // Blue - cold
  if (value >= 36.5 && value <= 37.5) return "#08E862"; // Green - normal
  if (value > 37.5 && value <= 38.5) return "#f59e0b"; // Orange - warm
  return "#ef4444"; // Red - fever
};
</script>
