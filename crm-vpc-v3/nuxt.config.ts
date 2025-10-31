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
    '@pinia/nuxt'
  ],
  
  // Enable pages module for routing
  pages: true,
  
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
      include: ['dayjs', 'dayjs/plugin/customParseFormat', 'dayjs/plugin/advancedFormat', 'dayjs/plugin/weekday', 'dayjs/plugin/localeData', 'dayjs/plugin/weekOfYear', 'dayjs/plugin/weekYear', 'dayjs/plugin/quarterOfYear']
    }
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
    'ant-design-vue/dist/reset.css'
  ],

  // Runtime config - Environment variables
  runtimeConfig: {
    // Private keys (server-side only)
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    apiHostInternal: process.env.NUXT_API_HOST_INTERNAL || 'http://localhost:3000',
    
    public: {
      // API Configuration
      apiHost: process.env.NUXT_PUBLIC_API_HOST || 'http://localhost:3000',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'production' ? '/api/a' : 'http://localhost:3000/api/a'),
      
      // Google OAuth Configuration
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      googleAuthUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      googleTokenUrl: 'https://oauth2.googleapis.com/token',
      googleUserInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      
      // Base URL for OAuth redirects
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3101',
      
      // TinyMCE Configuration
      tinymceKey: process.env.NUXT_PUBLIC_TINYMCE_KEY || '',
      
      // App Configuration
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'CRM Portal - Van Phuc Care',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3101',
      
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
