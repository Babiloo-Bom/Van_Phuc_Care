// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  devtools: { enabled: true },

  devServer: {
    port: 3101,
    host: '0.0.0.0' // (tùy chọn) để truy cập từ IP mạng LAN
  },
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image'
  ],
  
  // Enable pages module for routing
  pages: true,
  
  // Router config for better performance
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },
  
  // SPA mode (can enable SSR later if needed)
  ssr: false,
  
  // TypeScript support
  typescript: {
    strict: true,
    typeCheck: false // Disabled temporarily to avoid build errors
  },

  // Build configuration
  build: {
    transpile: ['ant-design-vue']
  },

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['dayjs', 'dayjs/plugin/customParseFormat', 'dayjs/plugin/advancedFormat', 'dayjs/plugin/weekday', 'dayjs/plugin/localeData', 'dayjs/plugin/weekOfYear', 'dayjs/plugin/weekYear', 'dayjs/plugin/quarterOfYear', 'ant-design-vue']
    },
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true
        }
      },
      // Let Vite handle chunking automatically to avoid circular dependencies
      // Vite's automatic chunking is smart enough and avoids initialization issues
      chunkSizeWarningLimit: 1000
    }
  },

  // Experimental features for better performance
  experimental: {
    payloadExtraction: false
  },

  // Optimize CSS delivery
  features: {
    inlineStyles: true
  },

  // TailwindCSS configuration
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  },

  // CSS
  css: [
    '~/assets/css/tailwind.css',
    'ant-design-vue/dist/reset.css',
    '~/assets/css/font.css'
  ],

  // Runtime config - Environment variables
  runtimeConfig: {
    // Private keys (server-side only)
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    apiHostInternal: process.env.NUXT_API_HOST_INTERNAL || 'http://localhost:3000',
    
    public: {
      // API Configuration - use relative paths in production for Nginx proxy
      apiHost: process.env.NUXT_PUBLIC_API_HOST || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'),
      apiBase: process.env.NUXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'production' ? '/api/u' : 'http://localhost:3000/api/u'),
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'),
      
      // Google OAuth Configuration
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      googleAuthUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      googleTokenUrl: 'https://oauth2.googleapis.com/token',
      googleUserInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      
      // Base URL for OAuth redirects
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      
      // TinyMCE Configuration
      tinymceKey: process.env.NUXT_PUBLIC_TINYMCE_KEY || '',
      
      // App Configuration
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'CRM Portal - Van Phuc Care',
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
      
      // Elearning URL
      baseUrlElearning: process.env.BASE_URL_ELEARNING || 'https://edu.vanphuccare.vn',
      
      // Environment
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production',
    }
  },

  // App config
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
        // Preload critical fonts for faster render
        { rel: 'preload', href: '/fonts/SVN-Gilroy Regular.otf', as: 'font', type: 'font/otf', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/SVN-Gilroy Medium.otf', as: 'font', type: 'font/otf', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/SVN-Gilroy Bold.otf', as: 'font', type: 'font/otf', crossorigin: 'anonymous' },
        // Preload LCP image
        { rel: 'preload', href: '/images/baby-default.png', as: 'image', fetchpriority: 'high' }
      ]
    }
  },

  // Nitro config for caching
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
      // Add cache for API responses where appropriate
      '/api/**': {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    }
  }
})