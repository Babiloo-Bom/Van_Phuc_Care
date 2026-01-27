// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  devtools: { enabled: true },

  devServer: {
    port: 3102,
    host: '0.0.0.0' // (tùy chọn) để truy cập từ IP mạng LAN
  },
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    // Temporarily removed @nuxtjs/seo to prevent automatic sitemap generation
    // We use custom sitemap at server/routes/sitemap.xml.ts
    // '@nuxtjs/seo',
    '@zadigetvoltaire/nuxt-gtm'
  ],

  // Site config (kept for reference, but @nuxtjs/seo is disabled)
  // site: {
  //   url: process.env.NUXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://edu.vanphuccare.vn' : 'http://localhost:3102'),
  //   name: 'Van Phuc Care E-Learning',
  //   description: 'Nền tảng học trực tuyến hàng đầu Việt Nam',
  //   defaultLocale: 'vi'
  // },
  
  // Enable pages module for routing
  // Enable pages module for routing
  pages: true,
  
  // SSR mode for better SEO
  ssr: true,
  
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
    'ant-design-vue/dist/reset.css',
    '~/assets/css/font.css'
  ],

  // Runtime config - Environment variables
  runtimeConfig: {
    // Private keys (server-side only)
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    apiHostInternal: process.env.NUXT_API_HOST_INTERNAL || 'http://localhost:3000',
    
    public: {
      // API Configuration
      // Để rỗng để sử dụng relative path (proxied by Nuxt server)
      apiHost: process.env.NUXT_PUBLIC_API_HOST || '',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api/u',
      
      // Google OAuth Configuration
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      googleAuthUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      googleTokenUrl: 'https://oauth2.googleapis.com/token',
      googleUserInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      
      // Base URL for OAuth redirects - Dynamic detection
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === 'production' ? process.env.NUXT_PUBLIC_APP_URL || 'https://your-domain.com' : 'http://localhost:3102'),
      
      // TinyMCE Configuration
      tinymceKey: process.env.NUXT_PUBLIC_TINYMCE_KEY || '',
      
      // CRM URL
      baseUrlCrm: process.env.BASE_URL_CRM || 'https://my.vanphuccare.vn',
      
      // App Configuration
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'E-Learning Portal - Van Phuc Care',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3102',

      // Google Tag Manager Configuration (used by @zadigetvoltaire/nuxt-gtm)
      // Nuxt 3 modules read options from runtimeConfig.public.gtm
      gtm: {
        id: process.env.NUXT_PUBLIC_GTM_ID || 'GTM-WR46Z7DD',
        enabled: true,
        enableRouterSync: true,
        debug: process.env.NODE_ENV !== 'production',
        defer: false,
        compatibility: false,
        scriptId: 'gtm-script',
        scriptURL: 'https://www.googletagmanager.com/gtm.js',
        noscript: true,
        noscriptId: 'gtm-noscript'
      },
      
      // Environment
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production',
    }
  },

  // App config
  app: {
    head: {
      htmlAttrs: {
        lang: 'vi'
      },
      title: 'Van Phuc Care E-Learning',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao về chăm sóc mẹ và bé, nuôi dạy con, sức khỏe thai kỳ. Học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.' },
        { name: 'keywords', content: 'học trực tuyến, e-learning, khóa học online, chăm sóc mẹ và bé, nuôi dạy con, thai kỳ, sức khỏe bà bầu, Van Phuc Care, Vạn Phúc Care, học online, giáo dục trực tuyến, bệnh viện Vạn Phúc' },
        { name: 'dmca-site-verification', content: 'MEhyUXU4clB0cEdaZm1aSk56MVhnWTZ4MHY4R3REQkQzblptNHdqVmFkcz01' },
        { name: 'google-site-verification', content: 'MEhyUXU4clB0cEdaZm1aSk56MVhnWTZ4MHY4R3REQkQzblptNHdqVmFkcz01' },
        { name: 'google-site-verification', content: 'JE5D99uHywdAihdJTbbrmh4TPdLicrlViMmfIrIqq2k' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo_van_phuc.png' },
        { rel: 'apple-touch-icon', href: '/images/logo_van_phuc.png' }
      ]
    }
  }
})
