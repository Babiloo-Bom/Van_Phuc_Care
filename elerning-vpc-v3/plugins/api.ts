export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
    
    onRequest({ request, options }) {
      // Add auth token to all requests (read from cookie)
      if (process.client) {
        const token = useCookie('auth_token').value;
        if (token) {
          options.headers = {
            ...options.headers as Record<string, string>,
            Authorization: `Bearer ${token}`
          }
        }
      }
    },
    
    onResponseError({ response }) {
      // Handle errors globally
      if (response.status === 401) {
        // Unauthorized - redirect to login
        if (process.client) {
          // Remove auth cookies
          document.cookie = `auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
          document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
          document.cookie = `token_expire_at=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
        }
        navigateTo('/login');
      }
      
      if (response.status === 403) {
        console.error('Forbidden:', response._data);
      }
      
      if (response.status >= 500) {
        console.error('Server error:', response._data);
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});

