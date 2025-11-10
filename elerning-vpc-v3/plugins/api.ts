export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
    
    onRequest({ request, options }) {
      // Add auth token to all requests
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        if (token) {
          options.headers = {
            ...options.headers as Record<string, string>,
            Authorization: `Bearer ${token}`
          }
        } else {
          console.log('🔍 API Plugin: No token found in localStorage')
        }
      }
    },
    
    onResponseError({ response }) {
      // Handle errors globally
      if (response.status === 401) {
        // Unauthorized - redirect to login
        if (process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          localStorage.removeItem('token_expire_at')
        }
        navigateTo('/login')
      }
      
      if (response.status === 403) {
        console.error('Forbidden:', response._data)
      }
      
      if (response.status >= 500) {
        console.error('Server error:', response._data)
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})

