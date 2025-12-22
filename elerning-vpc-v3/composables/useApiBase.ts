/**
 * API Base URL Helper
 * Provides dynamic API base URL for both client-side and server-side
 */

export const useApiBase = () => {
  const config = useRuntimeConfig()
  
  /**
   * Get base URL dynamically:
   * - Client-side (Browser): Use current domain with port 3000 (or same port if production)
   * - Server-side (SSR): Use internal Docker hostname from config
   */
  const getBaseUrl = () => {
    if (process.client && typeof window !== 'undefined') {
      // Client-side: use current domain
      const origin = window.location.origin
      const hostname = window.location.hostname
      
      // If localhost or IP, use port 3000 for API
      if (hostname === 'localhost' || hostname === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        return origin.replace(/:\d+/, ':3000')
      }
      
      // Production domain: use same origin (nginx will proxy /api/* to backend)
      return origin
    }
    
    // Server-side: Read directly from process.env at RUNTIME (not build time)
    // This ensures we get the value from Docker Compose environment, not baked-in value
    if (process.server) {
      const runtimeApiHost = process.env.NUXT_API_HOST_INTERNAL || config.apiHostInternal
      return runtimeApiHost || 'http://localhost:3000'
    }
    
    // Fallback (should not reach here)
    return config.public.apiHost || 'http://localhost:3000'
  }
  
  const baseUrl = getBaseUrl()
  
  return {
    baseUrl,
    apiAdmin: `${baseUrl}/api/a`,
    apiUser: `${baseUrl}/api/u`,
  }
}

