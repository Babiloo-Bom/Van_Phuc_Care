# 📊 Lighthouse Performance Optimization Guide

## 🔍 PHÂN TÍCH VẤN ĐỀ

### Hiện tại
- **Desktop Score**: 90+ ✅
- **Mobile Score**: 60+ ❌

### Nguyên nhân chính
Mobile có điểm thấp hơn do:
1. Network latency cao hơn (3G/4G)
2. CPU yếu hơn (throttling)
3. Màn hình nhỏ hơn nhưng load cùng resources

---

## 🎯 CÁC VẤN ĐỀ ĐÃ PHÁT HIỆN & GIẢI PHÁP

### 1. ⚡ **Improve Image Delivery** (~59 KiB)

#### Vấn đề:
- Avatar 60.9 KiB, hiển thị 142×96px nhưng file gốc 433×433px
- Format JPG chưa tối ưu
- Không dùng format hiện đại (WebP, AVIF)

#### ✅ Đã fix:
1. **Thêm `decoding="async"`** cho tất cả avatar images
2. **Thêm `preconnect`** cho external domain (`files.vanphuccare.vn`)
3. **Set `fetchpriority="high"`** cho LCP image

#### 🔄 Cần làm thêm (Backend):
```nginx
# Trong nginx config
location ~* ^/van-phuc-care/avatars/.*\.(jpg|jpeg|png)$ {
    # Serve WebP nếu browser hỗ trợ
    set $webp_suffix "";
    if ($http_accept ~* "webp") {
        set $webp_suffix ".webp";
    }
    
    # Resize on-the-fly (dùng ngx_http_image_filter_module)
    image_filter resize 200 200;
    image_filter_jpeg_quality 85;
    image_filter_webp_quality 85;
    
    # Cache headers
    expires 7d;
    add_header Cache-Control "public, immutable";
}
```

**Hoặc dùng Image CDN:**
- Cloudinary
- ImageKit
- Cloudflare Images

```typescript
// Trong component
const optimizeAvatar = (url: string, size: number = 200) => {
  if (!url) return '';
  // Example with ImageKit
  return `${url}?tr=w-${size},h-${size},f-webp,q-85`;
};
```

---

### 2. 💾 **Use Efficient Cache Lifetimes** (~61 KiB)

#### Vấn đề:
- Avatar từ `vanphuccare.vn` có `Cache-Control: None`
- Browser phải download lại mỗi lần

#### ✅ Đã fix trong `nuxt.config.ts`:
```typescript
nitro: {
  compressPublicAssets: true,
  routeRules: {
    '/_nuxt/**': { 
      headers: { 
        'Cache-Control': 'public, max-age=31536000, immutable' 
      } 
    },
    '/images/**': { 
      headers: { 
        'Cache-Control': 'public, max-age=31536000, immutable' 
      } 
    }
  }
}
```

#### 🔄 Cần làm (Backend API):
Backend server cần set cache headers cho avatars:

```javascript
// Express.js example
app.use('/van-phuc-care/avatars', (req, res, next) => {
  res.set({
    'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
    'ETag': generateETag(req.path)
  });
  next();
});
```

---

### 3. 🔍 **LCP Request Discovery**

#### Vấn đề:
- LCP image (avatar) không discoverable trong initial HTML
- Browser phải chờ JS load → parse → discover image

#### ✅ Đã fix:
1. **Thêm `preconnect`** cho external domain
2. **Set `fetchpriority="high"`** + `loading="eager"`
3. **Thêm preload** trong `nuxt.config.ts`

```typescript
app: {
  head: {
    link: [
      // Preload LCP image
      { rel: 'preload', href: '/images/baby-default.png', as: 'image', fetchpriority: 'high' }
    ]
  }
}
```

#### 💡 Best Practice:
- Critical images: `fetchpriority="high"` + `loading="eager"`
- Below-fold images: `loading="lazy"`
- Decorative images: `loading="lazy"` + `decoding="async"`

---

### 4. 🌐 **Network Dependency Tree** (649ms latency)

#### Vấn đề:
- Fonts load trong critical path
- Không có preconnect cho external domains

#### ✅ Đã có trong config:
```typescript
link: [
  // Preload critical fonts
  { rel: 'preload', href: '/fonts/SVN-Gilroy Regular.otf', as: 'font', type: 'font/otf', crossorigin: 'anonymous' },
  { rel: 'preload', href: '/fonts/SVN-Gilroy Medium.otf', as: 'font', type: 'font/otf', crossorigin: 'anonymous' }
]
```

#### 🔄 Nâng cao hơn:
Convert fonts sang WOFF2 (nhỏ hơn 30%):

```bash
# Dùng tool online hoặc:
npm install -g woff2
woff2_compress SVN-Gilroy-Regular.otf
```

Sau đó update `font.css`:
```css
@font-face {
  font-family: "Gilroy";
  src: url("../fonts/SVN-Gilroy-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap; /* Đã có rồi */
}
```

---

### 5. 📦 **Reduce Unused JavaScript** (~276 KiB)

#### Vấn đề:
- Bundle `/_nuxt/DHHroqaJ.js` = 399.9 KiB
- Có thể tiết kiệm 276 KiB

#### ✅ Đã fix trong `nuxt.config.ts`:

```typescript
vite: {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.log
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('ant-design-vue')) return 'vendor-antd';
            if (id.includes('@ant-design/icons-vue')) return 'vendor-icons';
            if (id.includes('dayjs')) return 'vendor-dayjs';
            return 'vendor';
          }
        }
      }
    }
  }
}
```

#### 🔄 Lazy load components:

```vue
<script setup>
// Thay vì import trực tiếp:
// import VaccinationSchedule from '~/components/health-book/VaccinationSchedule.vue';

// Dùng lazy loading:
const VaccinationSchedule = defineAsyncComponent(() => 
  import('~/components/health-book/VaccinationSchedule.vue')
);

const SupportRequestList = defineAsyncComponent(() => 
  import('~/components/health-book/SupportRequestList.vue')
);
</script>

<template>
  <a-tab-pane key="vaccination" tab="Lịch tiêm">
    <Suspense>
      <VaccinationSchedule :customerId="customerId" />
      <template #fallback>
        <a-spin />
      </template>
    </Suspense>
  </a-tab-pane>
</template>
```

#### 🔄 Tree-shake Ant Design icons:

```typescript
// Thay vì:
import * from '@ant-design/icons-vue';

// Chỉ import những gì cần:
import { UserOutlined, CalendarOutlined, CameraOutlined } from '@ant-design/icons-vue';
```

---

### 6. ⚠️ **Page Prevented Back/Forward Cache**

#### Vấn đề:
- Internal error (Not actionable)
- Có thể do unfinished requests hoặc event listeners

#### 🔄 Best practices để tránh:

```vue
<script setup>
// ✅ Good: Cleanup listeners
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// ✅ Good: Abort pending requests
const controller = new AbortController();

const fetchData = async () => {
  try {
    await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') return;
  }
};

onUnmounted(() => {
  controller.abort();
});
</script>
```

---

## 🚀 CHECKLIST TRIỂN KHAI

### Frontend (Đã hoàn thành ✅)
- [x] Add `preconnect` cho external domains
- [x] Optimize avatar loading (`fetchpriority`, `decoding`, `loading`)
- [x] Configure bundle splitting
- [x] Add terser minification
- [x] Set cache headers for static assets
- [x] Preload critical fonts

### Backend (Cần làm 🔄)
- [ ] **Image CDN hoặc on-the-fly resize**
  - Serve WebP format
  - Resize images theo yêu cầu
  - Set proper cache headers
  
- [ ] **API Response Cache Headers**
  ```
  /van-phuc-care/avatars/** → Cache-Control: public, max-age=604800
  ```

### Tối ưu nâng cao (Optional ⭐)
- [ ] Convert fonts → WOFF2
- [ ] Lazy load tab components
- [ ] Implement virtual scrolling for long lists
- [ ] Add Service Worker for offline support
- [ ] Prerender critical pages (SSG)

---

## 📈 DỰ KIẾN KẾT QUẢ

### Sau khi áp dụng các fix hiện tại:
- **Mobile Score**: 60 → **75-80** 📈
- **Desktop Score**: 90+ → **95+** 📈

### Sau khi Backend optimize images:
- **Mobile Score**: 75-80 → **85-90** 🎯
- **LCP**: Giảm 30-40%
- **Total Bundle Size**: Giảm ~300 KiB

---

## 🧪 CÁCH TEST

```bash
# 1. Build production
npm run build

# 2. Preview production build
npm run preview

# 3. Test with Lighthouse (Chrome DevTools)
# - Open DevTools → Lighthouse tab
# - Select "Mobile" device
# - Run analysis

# 4. Test with PageSpeed Insights
# https://pagespeed.web.dev/
```

---

## 📚 TÀI LIỆU THAM KHẢO

- [Web.dev - Optimize LCP](https://web.dev/optimize-lcp/)
- [Web.dev - Responsive Images](https://web.dev/serve-responsive-images/)
- [Nuxt Image Module](https://image.nuxt.com/)
- [Vite - Build Optimizations](https://vitejs.dev/guide/build.html)

---

## 💡 LƯU Ý QUAN TRỌNG

1. **Test trên mobile device thật**, không chỉ DevTools mobile emulation
2. **Test với network throttling** (Slow 3G, Fast 3G)
3. **Monitor real user metrics** (Core Web Vitals)
4. **Ưu tiên fix LCP** (Largest Contentful Paint) - impact lớn nhất đến score
5. **Cache invalidation**: Khi update avatar, cần strategy để bust cache

---

**Last updated**: 2024-12-30
**Status**: ✅ Frontend optimizations applied | 🔄 Awaiting backend changes
