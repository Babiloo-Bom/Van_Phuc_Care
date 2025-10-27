/**
 * ====================================
 * Base URL Detection Composable
 * ====================================
 * Dynamically detects the correct base URL for OAuth redirects
 */

export const useBaseUrl = () => {
  const config = useRuntimeConfig()
  
  // Get base URL with fallback logic
  const getBaseUrl = () => {
    // 1. Check environment variable first
    if (config.public.baseUrl && config.public.baseUrl !== 'http://localhost:3102') {
      return config.public.baseUrl
    }
    
    // 2. Check if we're in production
    if (process.env.NODE_ENV === 'production') {
      // Try to detect from window.location in browser
      if (process.client && window.location) {
        return `${window.location.protocol}//${window.location.host}`
      }
      
      // Fallback to environment variable
      return process.env.NUXT_PUBLIC_APP_URL || 'https://your-domain.com'
    }
    
    // 3. Development fallback
    return 'http://localhost:3102'
  }
  
  const baseUrl = computed(() => getBaseUrl())
  
  return {
    baseUrl: baseUrl.value,
    getBaseUrl
  }
}
