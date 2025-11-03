<template>
  <div class="course-card" @click="viewDetail">
    <div class="course-thumbnail">
      <img 
        :src="course.thumbnail || '/images/courses/default-course.jpg'" 
        :alt="course.title"
        class="thumbnail-image"
      />
      <div class="course-badge" v-if="course.isFeatured">
        <span class="badge-text">Nổi bật</span>
      </div>
    </div>
    
    <div class="course-content">
      <div class="course-category">{{ course.category }}</div>
      <h3 class="course-title">{{ course.title }}</h3>
      <p class="course-description">{{ course.shortDescription }}</p>
      
      <div class="course-meta">
        <div class="instructor">
          <img 
            :src="course.instructor?.avatar || '/images/instructors/default-avatar.jpg'" 
            :alt="course.instructor?.name"
            class="instructor-avatar"
          />
          <span class="instructor-name">{{ course.instructor?.name }}</span>
        </div>
        
        <div class="course-stats">
          <div class="stat">
            <i class="icon">👥</i>
            <span>{{ course.students?.toLocaleString() || 0 }}</span>
          </div>
          <div class="stat">
            <i class="icon">⭐</i>
            <span>{{ course.rating?.average || 0 }}</span>
          </div>
          <div class="stat">
            <i class="icon">📚</i>
            <span>{{ course.lessons || 0 }} bài</span>
          </div>
        </div>
      </div>
      
      <div class="course-price" v-if="!isPurchased">
        <div class="price-current">{{ formatPrice(course.price) }}</div>
        <div class="price-original" v-if="course.originalPrice > course.price">
          {{ formatPrice(course.originalPrice) }}
        </div>
        <div class="price-discount" v-if="course.discount > 0">
          -{{ course.discount }}%
        </div>
      </div>
      
      <div class="course-purchased" v-if="isPurchased">
        <div class="purchased-badge">
          <i class="icon">✅</i>
          <span>Đã mua</span>
        </div>
      </div>
      
      <div class="course-actions" v-if="!isPurchased">
        <button class="btn-add-cart" @click.stop="addToCart">
          <i class="icon">🛒</i>
          Thêm vào giỏ
        </button>
        <button class="btn-buy-now" @click.stop="buyNow">
          Mua ngay
        </button>
      </div>
      
      <div class="course-actions" v-else>
        <button class="btn-access" @click.stop="viewDetail">
          <i class="icon">📚</i>
          Truy cập khóa học
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Course {
  _id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  thumbnail: string
  price: number
  originalPrice?: number
  discount?: number
  instructor?: {
    name: string
    avatar?: string
    bio?: string
  }
  category: string
  level: string
  duration: number
  lessons: number
  students: number
  rating: {
    average: number
    count: number
  }
  tags: string[]
  isPublished: boolean
  isFeatured: boolean
  status: string
}

const props = defineProps<{
  course: Course
  isPurchased?: boolean
}>()

// Debug log
console.log(`🔍 CourseCard for ${props.course.title}:`, {
  courseId: props.course._id,
  isPurchased: props.isPurchased
})

const emit = defineEmits<{
  addToCart: [course: Course]
  buyNow: [course: Course]
  viewDetail: [course: Course]
}>()

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const addToCart = () => {
  emit('addToCart', props.course)
}

const buyNow = () => {
  emit('buyNow', props.course)
}

const viewDetail = () => {
  emit('viewDetail', props.course)
}
</script>

<style scoped>
.course-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  z-index: 1;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.course-thumbnail {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ff6b6b;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.course-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-category {
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  margin-bottom: 16px;
}

.instructor {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.instructor-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
}

.instructor-name {
  font-size: 14px;
  color: #666;
}

.course-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.course-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.price-current {
  font-size: 20px;
  font-weight: 700;
  color: #2563eb;
}

.price-original {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.price-discount {
  background: #fef3c7;
  color: #d97706;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.course-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.btn-add-cart,
.btn-buy-now {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add-cart {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-add-cart:hover {
  background: #e5e7eb;
}

.btn-buy-now {
  background: #2563eb;
  color: white;
}

.btn-buy-now:hover {
  background: #1d4ed8;
}

.btn-access {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #10b981;
  color: white;
}

.btn-access:hover {
  background: #059669;
}

.course-purchased {
  margin-bottom: 16px;
}

.purchased-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #d1fae5;
  color: #065f46;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #a7f3d0;
}

.icon {
  margin-right: 4px;
}
</style>
