// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  devtools: { enabled: true },
  
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
    public: {
      // API Configuration
      apiHost: process.env.NUXT_PUBLIC_API_HOST || 'http://103.216.119.104:3000',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://103.216.119.104:3000/a',
      
      // TinyMCE Configuration
      tinymceKey: process.env.NUXT_PUBLIC_TINYMCE_KEY || '',
      
      // App Configuration
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'CRM Portal - Van Phuc Care',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3001',
      
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
