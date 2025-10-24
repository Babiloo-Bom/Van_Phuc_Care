/**
 * Guest Middleware
 * Redirects authenticated users away from guest-only pages (login, register)
 * Migrated from @nuxtjs/auth-next
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // If user is authenticated, redirect to home
  if (authStore.isAuthenticated) {
    return navigateTo('/')
  }
})

