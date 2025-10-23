/**
 * Composable để truy cập Runtime Config dễ dàng
 * Usage: const { apiHost, apiBase } = useEnvConfig()
 */
export const useEnvConfig = () => {
  const config = useRuntimeConfig()
  
  return {
    // API Configuration
    apiHost: config.public.apiHost as string,
    apiBase: config.public.apiBase as string,
    
    // TinyMCE Configuration
    tinymceKey: config.public.tinymceKey as string,
    
    // App Configuration
    appName: config.public.appName as string,
    appUrl: config.public.appUrl as string,
    
    // Environment flags
    isDevelopment: config.public.isDevelopment as boolean,
    isProduction: config.public.isProduction as boolean,
    
    // Helper methods
    getApiUrl: (endpoint: string) => {
      const base = config.public.apiBase as string
      return `${base}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
    },
    
    getFullUrl: (path: string) => {
      const appUrl = config.public.appUrl as string
      return `${appUrl}${path.startsWith('/') ? path : `/${path}`}`
    }
  }
}

