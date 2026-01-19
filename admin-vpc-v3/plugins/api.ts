export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
    
    onRequest({ request, options }) {
      // Add auth token to all requests
      if (token.value) {
        options.headers = {
          ...options.headers as Record<string, string>,
          Authorization: `Bearer ${token.value}`
        }
      }
    },
    
    onResponseError({ response }) {
      // Handle errors globally
      if (response.status === 401) {
        // Unauthorized - redirect to login
        token.value = null
        navigateTo('/login')
      }
      
      if (response.status === 403) {
      }
      
      if (response.status >= 500) {
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})

