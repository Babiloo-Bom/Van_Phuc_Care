# 📊 Google Tag Manager (GTM) Setup Guide

> **Hướng dẫn cài đặt và sử dụng Google Tag Manager trong E-Learning Portal**

---

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Cài đặt](#cài-đặt)
3. [Cấu hình](#cấu-hình)
4. [Sử dụng](#sử-dụng)
5. [Events Tracking](#events-tracking)
6. [Kiểm tra](#kiểm-tra)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng quan

Google Tag Manager (GTM) đã được tích hợp vào dự án để:

- 📈 Track user behavior
- 🎯 Conversion tracking
- 📊 Analytics integration
- 🔍 Event tracking
- 📱 User journey analysis

**Package**: `@zadigetvoltaire/nuxt-gtm` đã được cài đặt và cấu hình sẵn.

## ⚙️ Cấu hình

### 1. Thêm GTM ID vào Environment Variables

Thêm biến môi trường `NUXT_PUBLIC_GTM_ID` vào file `.env` hoặc `production.env`:

```bash
NUXT_PUBLIC_GTM_ID=GTM-XXXXXX
```

**Lưu ý:** Thay `GTM-XXXXXX` bằng GTM ID thực tế của bạn.

### 2. Lấy GTM ID

1. Truy cập [Google Tag Manager](https://tagmanager.google.com/)
2. Đăng nhập với tài khoản Google
3. Tạo container mới hoặc chọn container hiện có
4. Copy GTM ID (format: `GTM-XXXXXX`)

### 3. Cấu hình trong `nuxt.config.ts`

GTM đã được cấu hình trong `nuxt.config.ts`:

```typescript
gtm: {
  id: process.env.NUXT_PUBLIC_GTM_ID || 'GTM-WR46Z7DD',
  enabled: !!process.env.NUXT_PUBLIC_GTM_ID || true,
  defer: false,
  compatibility: false,
  noscript: true,
  // Enable router sync để tự động track page views khi route thay đổi
  enableRouterSync: true
}
```

**Lưu ý quan trọng:**
- `enableRouterSync: true` - Tự động track page views khi route thay đổi (SPA/SSR mode)
- GTM ID mặc định: `GTM-WR46Z7DD` (có thể override bằng env variable)

## 🚀 Sử dụng

### Sử dụng Composable Helper

Import và sử dụng `useGtmTracking` trong các component:

```vue
<script setup lang="ts">
const { 
  trackEvent, 
  trackPageView, 
  trackCourseView, 
  trackPurchase,
  trackAddToCart,
  trackVideoPlay 
} = useGtmTracking()

// Track page view
onMounted(() => {
  trackPageView(route.path, route.meta.title)
})

// Track course view
const handleCourseView = (course: any) => {
  trackCourseView({
    courseId: course._id,
    courseName: course.title,
    price: course.price,
    category: course.category?.name,
    instructor: course.instructor?.name
  })
}

// Track purchase
const handlePurchase = (order: any) => {
  trackPurchase({
    orderId: order._id,
    value: order.total,
    currency: 'VND',
    items: order.items.map((item: any) => ({
      item_id: item.course?._id,
      item_name: item.course?.title,
      price: item.price,
      quantity: item.quantity
    }))
  })
}

// Track add to cart
const handleAddToCart = (course: any) => {
  trackAddToCart({
    courseId: course._id,
    courseName: course.title,
    price: course.price
  })
}

// Track video play
const handleVideoPlay = (courseId: string, lessonId?: string) => {
  trackVideoPlay({
    courseId,
    lessonId
  })
}

// Track custom event
const handleCustomAction = () => {
  trackEvent('custom_action', {
    action_type: 'button_click',
    button_name: 'Subscribe'
  })
}
</script>
```

### Các Events Tracking Có Sẵn

#### 1. `trackPageView(pagePath, pageTitle?)`
Track khi người dùng xem một trang:
```ts
trackPageView('/courses/123', 'Course Details')
```

#### 2. `trackCourseView(data)`
Track khi người dùng xem chi tiết khóa học:
```ts
trackCourseView({
  courseId: '123',
  courseName: 'Python Basics',
  price: 500000,
  category: 'Programming',
  instructor: 'John Doe'
})
```

#### 3. `trackPurchase(data)`
Track khi người dùng mua khóa học:
```ts
trackPurchase({
  orderId: 'ORD123',
  value: 500000,
  currency: 'VND',
  items: [{
    item_id: '123',
    item_name: 'Python Basics',
    price: 500000,
    quantity: 1
  }]
})
```

#### 4. `trackAddToCart(data)`
Track khi người dùng thêm vào giỏ hàng:
```ts
trackAddToCart({
  courseId: '123',
  courseName: 'Python Basics',
  price: 500000
})
```

#### 5. `trackRemoveFromCart(data)`
Track khi người dùng xóa khỏi giỏ hàng:
```ts
trackRemoveFromCart({
  courseId: '123',
  courseName: 'Python Basics',
  price: 500000
})
```

#### 6. `trackVideoPlay(data)`
Track khi người dùng phát video:
```ts
trackVideoPlay({
  courseId: '123',
  lessonId: '456',
  videoTitle: 'Introduction to Python'
})
```

#### 7. `trackVideoProgress(data)`
Track tiến độ xem video:
```ts
trackVideoProgress({
  courseId: '123',
  lessonId: '456',
  progress: 50, // 0-100
  videoTitle: 'Introduction to Python'
})
```

#### 8. `trackSearch(data)`
Track khi người dùng tìm kiếm:
```ts
trackSearch({
  searchTerm: 'python',
  resultsCount: 10
})
```

#### 9. `trackLogin(method?)`
Track khi người dùng đăng nhập:
```ts
trackLogin('google') // hoặc 'email'
```

#### 10. `trackSignup(method?)`
Track khi người dùng đăng ký:
```ts
trackSignup('google') // hoặc 'email'
```

#### 11. `trackEvent(eventName, eventData?)`
Track event tùy chỉnh:
```ts
trackEvent('custom_event', {
  custom_param: 'value',
  another_param: 123
})
```

## 📍 Ví dụ Sử Dụng trong Component

### Trang Chi Tiết Khóa Học

```vue
<script setup lang="ts">
const route = useRoute()
const { trackCourseView, trackAddToCart, trackVideoPlay } = useGtmTracking()
const course = ref(null)

// Track khi load trang
onMounted(async () => {
  const courseData = await fetchCourse(route.params.slug)
  course.value = courseData
  
  // Track course view
  trackCourseView({
    courseId: courseData._id,
    courseName: courseData.title,
    price: courseData.price,
    category: courseData.category?.name
  })
})

// Track khi click "Thêm vào giỏ hàng"
const handleAddToCart = () => {
  trackAddToCart({
    courseId: course.value._id,
    courseName: course.value.title,
    price: course.value.price
  })
  // ... logic thêm vào giỏ hàng
}

// Track khi play video intro
const handlePlayVideo = () => {
  trackVideoPlay({
    courseId: course.value._id,
    videoTitle: course.value.title
  })
}
</script>
```

### Trang Thanh Toán

```vue
<script setup lang="ts">
const { trackPurchase } = useGtmTracking()

const handleCheckout = async (order: any) => {
  // ... logic thanh toán
  
  // Track purchase sau khi thanh toán thành công
  if (order.status === 'completed') {
    trackPurchase({
      orderId: order._id,
      value: order.total,
      currency: 'VND',
      items: order.items.map((item: any) => ({
        item_id: item.course?._id,
        item_name: item.course?.title,
        price: item.price,
        quantity: item.quantity
      }))
    })
  }
}
</script>
```

## 🔍 Kiểm Tra GTM

### 1. Kiểm tra trong Browser Console

Mở Developer Tools (F12) và kiểm tra:
- `window.dataLayer` - Array chứa các events đã track
- Network tab - Xem requests đến `googletagmanager.com`

### 2. Sử dụng GTM Preview Mode

1. Truy cập [Google Tag Manager](https://tagmanager.google.com/)
2. Click "Preview" để bật Preview Mode
3. Nhập URL của website
4. Xem các events được trigger trong GTM Preview window

### 3. Kiểm tra trong GTM Dashboard

1. Vào GTM Dashboard
2. Click "Tags" để xem các tags đã cấu hình
3. Click "Triggers" để xem các triggers
4. Click "Variables" để xem các variables

## ⚠️ Lưu Ý

1. **Development vs Production**: GTM chỉ hoạt động khi có `NUXT_PUBLIC_GTM_ID` được set
2. **Privacy**: Đảm bảo tuân thủ các quy định về privacy (GDPR, CCPA, etc.)
3. **Performance**: GTM được load async, không ảnh hưởng đến performance
4. **Debug**: Trong development, có thể xem logs trong console để debug

## 📚 Tài Liệu Tham Khảo

- [Google Tag Manager Documentation](https://developers.google.com/tag-manager)
- [nuxt-gtm GitHub](https://github.com/zadigetvoltaire/nuxt-gtm)
- [GTM Data Layer Guide](https://developers.google.com/tag-manager/devguide)
- [GTM Events Best Practices](https://developers.google.com/analytics/devguides/collection/gtagjs/events)

## 🔗 Related Documentation

- [README.md](../README.md) - Main documentation
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Project structure
- [SEO_CONFIGURATION.md](./SEO_CONFIGURATION.md) - SEO setup
- [PAYMENT_SYSTEM.md](./PAYMENT_SYSTEM.md) - Payment system

---

**Last Updated**: 2025-01-26

## 🆘 Troubleshooting

### GTM không load

1. Kiểm tra `NUXT_PUBLIC_GTM_ID` đã được set chưa
2. Kiểm tra GTM ID có đúng format `GTM-XXXXXX` không
3. Kiểm tra console có lỗi gì không
4. Kiểm tra network requests có block `googletagmanager.com` không

### Events không được track

1. Kiểm tra `isGtmEnabled` có `true` không
2. Kiểm tra `window.dataLayer` có tồn tại không
3. Kiểm tra GTM Preview Mode để xem events có được trigger không
4. Kiểm tra tags và triggers trong GTM Dashboard đã được cấu hình đúng chưa

