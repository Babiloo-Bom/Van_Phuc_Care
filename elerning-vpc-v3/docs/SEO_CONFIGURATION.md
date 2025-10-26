# SEO Configuration Guide

## Tổng quan
Dự án đã được cấu hình SEO đầy đủ với các tính năng sau:

### 1. Meta Tags
- **Title tags**: Động cho từng trang
- **Meta descriptions**: Mô tả chi tiết cho từng trang
- **Keywords**: Từ khóa liên quan đến nội dung
- **Open Graph**: Cho Facebook, LinkedIn
- **Twitter Cards**: Cho Twitter
- **Canonical URLs**: Tránh duplicate content

### 2. Schema.org Markup
- **Course Schema**: Cho trang chi tiết khóa học
- **ItemList Schema**: Cho trang danh sách khóa học
- **Organization Schema**: Thông tin công ty
- **WebSite Schema**: Cho trang chủ
- **BreadcrumbList Schema**: Điều hướng breadcrumb

### 3. Sitemap & Robots
- **Sitemap.xml**: Tự động tạo từ API `/api/sitemap.xml`
- **Robots.txt**: Cấu hình crawl cho search engines

## Cấu hình theo trang

### Trang chủ (`/`)
```typescript
// Meta tags cơ bản
title: 'Van Phuc Care E-Learning - Nền Tảng Học Trực Tuyến Hàng Đầu Việt Nam'
description: 'Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao...'

// Schema.org
- WebSite
- Organization  
- EducationalOrganization
```

### Trang danh sách khóa học (`/courses`)
```typescript
// Meta tags
title: 'Tất Cả Khóa Học - Van Phuc Care E-Learning'
description: 'Khám phá các khóa học trực tuyến chất lượng cao...'

// Schema.org
- ItemList (danh sách khóa học)
- Organization
```

### Trang chi tiết khóa học (`/courses/[slug]`)
```typescript
// Meta tags động
title: computed(() => `${course.value?.title} - Van Phuc Care E-Learning`)
description: computed(() => course.value?.shortDescription)
keywords: computed(() => `${course.value.title}, ${course.value.category}, ${course.value.tags.join(', ')}`)

// Schema.org
- Course (chi tiết khóa học)
- BreadcrumbList (điều hướng)
```

## Cấu hình kỹ thuật

### 1. Nuxt.js SEO Module
```typescript
// nuxt.config.ts
modules: [
  '@nuxtjs/seo'
]
```

### 2. useHead() API
```typescript
useHead({
  title: 'Page Title',
  meta: [
    { name: 'description', content: 'Page description' },
    { property: 'og:title', content: 'OG Title' }
  ],
  link: [
    { rel: 'canonical', href: 'https://example.com/page' }
  ]
})
```

### 3. useSchemaOrg() API
```typescript
useSchemaOrg([
  {
    '@type': 'Course',
    name: 'Course Title',
    description: 'Course Description',
    // ... other properties
  }
])
```

## Kiểm tra SEO

### 1. Google Search Console
- Submit sitemap: `https://vanphuccare.com/sitemap.xml`
- Monitor indexing status
- Check for crawl errors

### 2. Google Rich Results Test
- Test Schema.org markup: https://search.google.com/test/rich-results
- Verify structured data

### 3. Social Media Debuggers
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

### 4. SEO Tools
- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **Screaming Frog**: Crawl website for SEO issues

## Tối ưu hóa

### 1. Performance
- Lazy loading images
- Minify CSS/JS
- Enable compression
- Use CDN

### 2. Content
- Unique, high-quality content
- Proper heading structure (H1, H2, H3)
- Internal linking
- Alt text for images

### 3. Technical
- Fast loading times
- Mobile-friendly design
- HTTPS enabled
- Clean URLs

## Monitoring

### 1. Analytics
- Google Analytics 4
- Search Console
- Core Web Vitals

### 2. Keywords
- Track ranking positions
- Monitor search traffic
- Analyze competitor keywords

### 3. Content Performance
- Page views
- Bounce rate
- Time on page
- Conversion rate

## Lưu ý quan trọng

1. **URL Structure**: Sử dụng slug-friendly URLs
2. **Image Optimization**: Compress và resize images
3. **Mobile First**: Responsive design cho mobile
4. **Loading Speed**: Tối ưu performance
5. **Content Quality**: Nội dung unique và valuable
6. **User Experience**: Easy navigation và clear CTAs

## Cập nhật

Để cập nhật SEO configuration:
1. Chỉnh sửa meta tags trong các file pages
2. Cập nhật Schema.org markup
3. Test với Google tools
4. Monitor performance
5. Iterate based on data
