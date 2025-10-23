# Admin Portal - Van Phuc Care (Nuxt 3 + TypeScript)

Admin portal for Van Phuc Care Healthcare Management System built with Nuxt 3 and TypeScript.

## 🚀 Features

- ✅ Nuxt 3 with TypeScript
- ✅ Auto-imports for Vue and Nuxt composables
- ✅ File-based routing
- ✅ Authentication system
- ✅ API integration with $fetch
- ✅ Middleware for route protection
- ✅ Pinia store ready
- ✅ Composables for reusable logic
- ✅ TypeScript types defined

## 📁 Project Structure

```
admin-vpc-v3/
├── app/
│   └── app.vue              # Root component
├── assets/
│   ├── css/
│   │   └── main.css         # Global styles
│   └── images/
├── components/              # Vue components
│   ├── layout/
│   ├── shared/
│   ├── auth/
│   ├── faqs/
│   ├── products/
│   └── customers/
├── composables/             # Composition API composables
│   └── useAuth.ts          # Auth composable
├── layouts/                 # Layout components
│   ├── default.vue         # Main layout
│   └── auth.vue            # Auth layout
├── middleware/              # Route middleware
│   └── auth.ts             # Auth middleware
├── pages/                   # File-based routing
│   ├── index.vue           # Dashboard
│   ├── login.vue           # Login page
│   ├── faqs/
│   ├── products/
│   └── customers/
├── plugins/                 # Nuxt plugins
│   └── api.ts              # API plugin
├── public/                  # Static files
├── server/                  # Server API routes
│   └── api/
├── stores/                  # Pinia stores (add as needed)
├── types/                   # TypeScript types
│   └── index.ts
├── utils/                   # Utility functions
├── nuxt.config.ts          # Nuxt configuration
├── package.json
└── tsconfig.json           # TypeScript config
```

## 🛠️ Setup

### Install dependencies:

```bash
npm install
```

### Development server:

```bash
npm run dev
```

Server runs on: http://localhost:3000

### Build for production:

```bash
npm run build
```

### Preview production build:

```bash
npm run preview
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```bash
NUXT_PUBLIC_API_BASE=http://localhost:3000/api
NUXT_PUBLIC_APP_NAME=Van Phuc Care Admin
NUXT_PUBLIC_APP_URL=http://localhost:3001
```

### API Configuration

API base URL is configured in `nuxt.config.ts`:

```typescript
runtimeConfig: {
  public: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api'
  }
}
```

## 🔐 Authentication

### Login

Navigate to `/login` and use demo credentials:
- Email: `admin@vanphuccare.com`
- Password: `password123`

### Auth Flow

1. User logs in via `/login`
2. Token is saved in cookie
3. User data is stored in composable state
4. Auth middleware protects routes
5. API plugin adds token to requests

### Composable Usage

```vue
<script setup lang="ts">
const { user, login, logout, isAuthenticated } = useAuth()

const handleLogin = async () => {
  const result = await login(email.value, password.value)
  if (result.success) {
    navigateTo('/')
  }
}
</script>
```

## 📡 API Integration

### Using the API Plugin

```typescript
const { $api } = useNuxtApp()

// GET request
const data = await $api('/a/faqs')

// POST request
const result = await $api('/a/faqs', {
  method: 'POST',
  body: { title: 'New FAQ' }
})
```

### Using useFetch

```typescript
const { data, pending, error } = await useFetch('/a/faqs', {
  baseURL: useRuntimeConfig().public.apiBase
})
```

## 🎨 Styling

Global styles in `assets/css/main.css`

Component styles use scoped CSS:

```vue
<style scoped>
.my-component {
  /* styles */
}
</style>
```

## 🧩 Components

Create reusable components in `components/` directory:

```
components/
├── layout/        # Layout components
├── shared/        # Shared/common components
└── [feature]/     # Feature-specific components
```

Components are auto-imported!

```vue
<!-- No import needed -->
<template>
  <MyComponent />
</template>
```

## 📄 Pages & Routing

File-based routing:

```
pages/
  index.vue           → /
  login.vue           → /login
  faqs/
    index.vue         → /faqs
    [id].vue          → /faqs/:id
    create.vue        → /faqs/create
```

## 🛡️ Middleware

### Auth Middleware

Protects routes requiring authentication:

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

### Custom Middleware

Create in `middleware/` directory:

```typescript
// middleware/admin.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()
  
  if (user.value?.role !== 'admin') {
    return navigateTo('/')
  }
})
```

## 📦 Adding Dependencies

### UI Framework (Example: Ant Design Vue)

```bash
npm install ant-design-vue
npm install -D @ant-design-vue/nuxt
```

Update `nuxt.config.ts`:

```typescript
modules: [
  '@ant-design-vue/nuxt'
]
```

### State Management (Pinia)

```bash
npm install pinia @pinia/nuxt
```

Update `nuxt.config.ts`:

```typescript
modules: [
  '@pinia/nuxt'
]
```

Create stores in `stores/` directory.

## 🔍 TypeScript

TypeScript is enabled by default in Nuxt 3.

### Type Definitions

Located in `types/index.ts`:

```typescript
export interface Admin {
  _id: string
  fullname: string
  email: string
  role: string
  // ...
}
```

### Usage

```typescript
import type { Admin } from '~/types'

const user = ref<Admin | null>(null)
```

## 📝 Development Tips

1. **Auto-imports**: Vue, Nuxt composables, and components are auto-imported
2. **Hot reload**: Changes reflect instantly during development
3. **Type safety**: TypeScript provides type checking
4. **File-based routing**: Add files to `pages/` for new routes
5. **Composables**: Reusable logic in `composables/`

## 🐛 Troubleshooting

### Port already in use

Change port in `package.json`:

```json
"dev": "nuxt dev --port 3001"
```

### TypeScript errors

Run type checking:

```bash
npm run typecheck
```

### Clear cache

```bash
rm -rf .nuxt node_modules/.cache
npm install
```

## 📚 Resources

- [Nuxt 3 Documentation](https://nuxt.com)
- [Vue 3 Documentation](https://vuejs.org)
- [TypeScript Documentation](https://www.typescriptlang.org)

## 📄 License

Proprietary - Van Phuc Care © 2024
