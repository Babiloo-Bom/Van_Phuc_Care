# 📐 Cấu Trúc Dự Án E-Learning Portal

## 🎯 Tổng Quan

Tài liệu này mô tả chi tiết cấu trúc và tổ chức code của dự án E-Learning Portal.

---

## 📁 Cấu Trúc Thư Mục

```
elerning-vpc-v3/
│
├── 📂 assets/                    # Static assets
│   ├── css/                      # Stylesheets
│   │   ├── tailwind.css         # Tailwind base styles
│   │   └── font.css             # Custom fonts
│   └── fonts/                    # Font files
│
├── 📂 components/                 # Vue components
│   ├── common/                   # Common/reusable components
│   ├── courses/                  # Course-related components
│   │   ├── CourseCard.vue       # Course card display
│   │   └── CourseList.vue        # Course list
│   ├── lessons/                  # Lesson components
│   ├── payment/                  # Payment components
│   │   └── PaymentMethodSelector.vue
│   └── ...
│
├── 📂 composables/                # Vue composables (reusable logic)
│   ├── api/                      # API composables
│   │   ├── useBannersApi.ts     # Banner API
│   │   ├── useCoursesApi.ts     # Course API
│   │   ├── useOrdersApi.ts      # Order API
│   │   └── ...
│   ├── useApiBase.ts             # Base API configuration
│   ├── useApiClient.ts           # API client setup
│   ├── useAuth.ts                # Authentication logic
│   ├── useAuthApi.ts             # Auth API calls
│   ├── useCart.ts                # Cart management
│   ├── useCartApi.ts             # Cart API calls
│   ├── useGtmTracking.ts         # GTM tracking (NEW)
│   ├── useGoogleAuth.ts          # Google OAuth
│   ├── useImageUrl.ts            # Image URL helpers
│   ├── usePayment.ts             # Payment handling
│   ├── useProgressTracking.ts    # Learning progress
│   └── ...
│
├── 📂 configs/                    # Configuration files
│   └── paymentMethods.ts         # Payment methods config
│
├── 📂 constants/                  # Constants
│
├── 📂 docs/                       # Documentation
│   ├── GTM_SETUP.md             # GTM setup guide (NEW)
│   ├── SEO_CONFIGURATION.md      # SEO config
│   ├── PAYMENT_SYSTEM.md         # Payment system
│   ├── CART_SYSTEM.md            # Cart system
│   └── PROJECT_STRUCTURE.md      # This file (NEW)
│
├── 📂 layouts/                    # Layout components
│   └── default.vue               # Default layout
│
├── 📂 middleware/                 # Route middleware
│   ├── auth.ts                   # Authentication check
│   ├── guest.ts                  # Guest-only routes
│   └── ...
│
├── 📂 pages/                      # Pages/routes (file-based routing)
│   ├── index.vue                 # Home page
│   ├── courses/                  # Course pages
│   │   ├── index.vue            # Course list
│   │   └── [slug].vue          # Course detail
│   ├── my-learning/              # Learning pages
│   │   └── [slug].vue          # Learning course
│   ├── checkout/                 # Checkout pages
│   └── ...
│
├── 📂 plugins/                    # Nuxt plugins
│   └── ...
│
├── 📂 public/                     # Public static files
│   ├── images/                   # Images
│   │   ├── logo_van_phuc.png
│   │   └── ...
│   ├── videos/                   # Videos
│   └── ...
│
├── 📂 server/                     # Server-side code
│   └── api/                      # API routes
│       └── ...
│
├── 📂 stores/                     # Pinia stores
│   ├── auth.ts                   # Auth store
│   ├── cart.ts                   # Cart store
│   └── README.md                 # Stores documentation
│
├── 📂 types/                      # TypeScript type definitions
│   └── ...
│
├── 📂 utils/                      # Utility functions
│   └── ...
│
├── 📄 app.vue                    # Root component
├── 📄 nuxt.config.ts             # Nuxt configuration
├── 📄 tailwind.config.js         # Tailwind configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 package.json               # Dependencies
└── 📄 README.md                  # Main documentation
```

---

## 🔑 Các Thành Phần Chính

### 1. Components (`components/`)

**Pattern**: Composition API với `<script setup>`

```vue
<!-- components/courses/CourseCard.vue -->
<script setup lang="ts">
interface Props {
  course: Course
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: [course: Course]
}>()
</script>
```

**Best Practices:**
- ✅ Sử dụng TypeScript cho props
- ✅ Đặt tên component theo PascalCase
- ✅ Tách logic phức tạp vào composables
- ✅ Sử dụng Ant Design Vue components

### 2. Composables (`composables/`)

**Pattern**: Reusable logic functions

```typescript
// composables/useGtmTracking.ts
export const useGtmTracking = () => {
  const trackEvent = (eventName: string, data?: any) => {
    // GTM tracking logic
  }
  
  return { trackEvent }
}
```

**Categories:**
- **API Composables** (`api/`): API calls
- **Business Logic**: Cart, Payment, Auth
- **Utilities**: Image URL, Progress tracking

### 3. Pages (`pages/`)

**Pattern**: File-based routing

- `pages/index.vue` → `/`
- `pages/courses/index.vue` → `/courses`
- `pages/courses/[slug].vue` → `/courses/:slug`

**Best Practices:**
- ✅ Sử dụng `useHead()` cho SEO
- ✅ Sử dụng `useGtmTracking()` cho tracking
- ✅ Lazy load heavy components

### 4. Stores (`stores/`)

**Pattern**: Pinia stores cho global state

```typescript
// stores/cart.ts
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  actions: {
    addItem(item) { /* ... */ }
  }
})
```

**Available Stores:**
- `auth.ts`: Authentication state
- `cart.ts`: Shopping cart state

### 5. Middleware (`middleware/`)

**Pattern**: Route guards

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
```

---

## 🔄 Data Flow

### 1. API Calls Flow

```
Component
  ↓
Composable (useCoursesApi)
  ↓
API Client (useApiClient)
  ↓
Backend API
  ↓
Response → Store/State
```

### 2. State Management Flow

```
User Action
  ↓
Component Event
  ↓
Composable/Store Action
  ↓
API Call
  ↓
Update Store State
  ↓
Reactive UI Update
```

### 3. GTM Tracking Flow

```
User Action
  ↓
Component Event Handler
  ↓
useGtmTracking().trackEvent()
  ↓
GTM dataLayer
  ↓
Google Tag Manager
```

---

## 📦 Module Organization

### API Module

```
composables/api/
├── useBannersApi.ts      # Banner endpoints
├── useCoursesApi.ts      # Course endpoints
├── useOrdersApi.ts       # Order endpoints
└── useCartApi.ts         # Cart endpoints
```

**Pattern:**
- Mỗi resource có một API composable
- Tất cả sử dụng `useApiClient()` base
- Consistent error handling

### Payment Module

```
composables/
├── usePayment.ts         # Payment logic
configs/
└── paymentMethods.ts      # Payment configs
components/
└── payment/
    └── PaymentMethodSelector.vue
```

### Cart Module

```
composables/
├── useCart.ts            # Cart logic
├── useCartApi.ts         # Cart API
stores/
└── cart.ts               # Cart store
```

### GTM Module (NEW)

```
composables/
└── useGtmTracking.ts     # GTM tracking
nuxt.config.ts
└── gtm: { ... }          # GTM config
```

---

## 🎨 Styling Organization

### Tailwind CSS

- **Base**: `assets/css/tailwind.css`
- **Config**: `tailwind.config.js`
- **Custom classes**: Sử dụng `@apply` hoặc inline classes

### Component Styles

- **Scoped styles**: `<style scoped>`
- **Global styles**: `assets/css/`
- **Ant Design**: Import từ `ant-design-vue`

---

## 🔐 Security Considerations

### 1. Authentication

- JWT tokens stored in httpOnly cookies (server-side)
- Client-side tokens in Pinia store
- Middleware protection for routes

### 2. API Security

- CORS configuration
- API key validation
- Rate limiting (backend)

### 3. Data Protection

- No sensitive data in client code
- Environment variables for secrets
- HTTPS in production

---

## 📊 Performance Optimization

### 1. Code Splitting

- Automatic route-based code splitting
- Lazy load heavy components
- Dynamic imports for large libraries

### 2. Asset Optimization

- Image optimization with `@nuxt/image`
- Font preloading
- CSS minification

### 3. Caching

- API response caching
- Static asset caching
- Browser caching headers

---

## 🧪 Testing Structure

### Unit Tests (Future)

```
tests/
├── unit/
│   ├── components/
│   ├── composables/
│   └── utils/
└── e2e/
    └── ...
```

---

## 📝 Code Conventions

### Naming

- **Components**: PascalCase (`CourseCard.vue`)
- **Composables**: camelCase với `use` prefix (`useGtmTracking.ts`)
- **Stores**: camelCase (`cart.ts`)
- **Types**: PascalCase (`Course`, `User`)
- **Constants**: UPPER_SNAKE_CASE

### File Organization

- One component per file
- Related files grouped in folders
- Index files for exports (if needed)

### Import Order

```typescript
// 1. Vue/Nuxt imports
import { ref, computed } from 'vue'

// 2. Third-party imports
import { Button } from 'ant-design-vue'

// 3. Local composables
import { useGtmTracking } from '~/composables/useGtmTracking'

// 4. Types
import type { Course } from '~/types'
```

---

## 🔄 Migration & Updates

### Adding New Features

1. **Create composable** (if needed)
2. **Create component** (if needed)
3. **Update types** (if needed)
4. **Add to store** (if global state)
5. **Update documentation**

### Updating Dependencies

1. Check breaking changes
2. Update package.json
3. Test thoroughly
4. Update documentation if needed

---

## 📚 Related Documentation

- [README.md](../README.md) - Main documentation
- [GTM_SETUP.md](./GTM_SETUP.md) - GTM integration
- [SEO_CONFIGURATION.md](./SEO_CONFIGURATION.md) - SEO setup
- [PAYMENT_SYSTEM.md](./PAYMENT_SYSTEM.md) - Payment system
- [CART_SYSTEM.md](./CART_SYSTEM.md) - Cart system
- [stores/README.md](../stores/README.md) - Stores guide

---

**Last Updated**: 2025-01-26

