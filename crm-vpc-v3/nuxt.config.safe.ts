// SAFE VERSION - Nếu vẫn còn lỗi, dùng config này
// Rename file này thành nuxt.config.ts

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  devtools: { enabled: true },

  devServer: {
    port: 3101,
    host: '0.0.0.0'
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image'
  ],
  
  pages: true,
  
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },
  
  ssr: false,
  
  typescript: {
    strict: true,
    typeCheck: false
  },

  build: {
    transpile: ['ant-design-vue']
  },

  // Vite configuration - SAFE VERSION (no manual chunks)
  vite: {
    optimizeDeps: {
      include: [
        'dayjs', 
        'dayjs/plugin/customParseFormat', 
        'dayjs/plugin/advancedFormat', 
        'dayjs/plugin/weekday', 
        'dayjs/plugin/localeData', 
        'dayjs/plugin/weekOfYear', 
        'dayjs/plugin/weekYear', 
        'dayjs/plugin/quarterOfYear', 
        'ant-design-vue'
      ]
    },
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      // Let Vite handle chunking automatically - safer
      chunkSizeWarningLimit: 1000
    }
  },

  experimental: {
    payloadExtraction: false
  },

  features: {
    inlineStyles: true
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  },

  css: [
    '~/assets/css/tailwind.css',
    'ant-design-vue/dist/reset.css',
    '~/assets/css/font.css'
  ],

  runtimeConfig: {
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    apiHostInternal: process.env.NUXT_API_HOST_INTERNAL || 'http://localhost:3000',
    
    public: {
      apiHost: process.env.NUXT_PUBLIC_API_HOST || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'),
      apiBase: process.env.NUXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'production' ? '/api/u' : 'http://localhost:3000/api/u'),
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'),
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      googleAuthUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      googleTokenUrl: 'https://oauth2.googleapis.com/token',
      googleUserInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      tinymceKey: process.env.NUXT_PUBLIC_TINYMCE_KEY || '',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'CRM Portal - Van Phuc Care',
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
      baseUrlElearning: process.env.BASE_URL_ELEARNING || 'https://edu.vanphuccare.vn',
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production',
    }
  },

  app: {
    head: {
      title: 'CRM Portal - Van Phuc Care',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Van Phuc Care CRM Portal' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preload', href: '/fonts/SVN-Gilroy Regular.otf', as: 'font', type: 'font/otf', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/SVN-Gilroy Medium.otf', as: 'font', type: 'font/otf', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/SVN-Gilroy Bold.otf', as: 'font', type: 'font/otf', crossorigin: 'anonymous' },
        // Avatar/header fallback trên trang chủ MY
        { rel: 'preload', href: '/images/avatar-fallback.png', as: 'image', fetchpriority: 'high' }
      ]
    }
  },

  nitro: {
    compressPublicAssets: true,
    minify: true,
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
      },
      '/fonts/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000, immutable' 
        } 
      },
      '/api/**': {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    }
  }
})
