<template>
  <div class="completion-chart-container">
    <div v-if="loading" class="chart-loading">
      <a-spin size="large" />
    </div>
    <div v-else class="completion-content">
      <!-- Main completion rate display -->
      <div class="completion-rate-display">
        <div class="rate-value">{{ completionRate }}%</div>
        <div class="rate-label">Tỷ lệ hoàn thành</div>
        <div class="rate-details">
          <span>{{ completedCourses }} / {{ totalPurchasedCourses }} khóa học</span>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `${completionRate}%` }"></div>
      </div>

      <!-- Top courses -->
      <div v-if="topCourses && topCourses.length > 0" class="top-courses">
        <div class="top-courses-title">Top khóa học được hoàn thành nhiều nhất</div>
        <div class="top-courses-list">
          <div
            v-for="(course, index) in topCourses.slice(0, 5)"
            :key="course.courseId"
            class="top-course-item"
          >
            <div class="course-rank">{{ index + 1 }}</div>
            <div class="course-info">
              <div class="course-title">{{ course.courseTitle }}</div>
              <div class="course-count">{{ course.completedCount }} người hoàn thành</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  completionRate: number
  completedCourses: number
  totalPurchasedCourses: number
  topCourses?: Array<{
    courseId: string
    courseTitle: string
    courseSlug: string
    completedCount: number
  }>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  completionRate: 0,
  completedCourses: 0,
  totalPurchasedCourses: 0,
  topCourses: () => [],
  loading: false
})
</script>

<style scoped>
.completion-chart-container {
  position: relative;
  width: 100%;
  min-height: 300px;
}

.chart-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.completion-content {
  padding: 8px 0;
}

.completion-rate-display {
  text-align: center;
  margin-bottom: 24px;
}

.rate-value {
  font-size: 48px;
  font-weight: 700;
  color: #1890ff;
  line-height: 1.2;
  margin-bottom: 8px;
}

.rate-label {
  font-size: 16px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.rate-details {
  font-size: 14px;
  color: #595959;
}

.progress-bar-container {
  width: 100%;
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 32px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%);
  border-radius: 6px;
  transition: width 0.6s ease;
}

.top-courses {
  margin-top: 24px;
}

.top-courses-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.top-courses-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.top-course-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  transition: background 0.2s;
}

.top-course-item:hover {
  background: #f0f0f0;
}

.course-rank {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1890ff;
  color: #ffffff;
  border-radius: 50%;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.course-info {
  flex: 1;
}

.course-title {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.course-count {
  font-size: 12px;
  color: #8c8c8c;
}
</style>

