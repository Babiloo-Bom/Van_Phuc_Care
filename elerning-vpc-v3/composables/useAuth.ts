import type { User, LoginRequest } from '~/types'

export const useAuth = () => {
  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
  const user = useState<User | null>('user', () => null)
  const config = useRuntimeConfig()

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch<{status: boolean, data: {accessToken: string, user: User}}>('/a/sessions/login', {
        method: 'POST',
        baseURL: config.public.apiBase as string,
        body: { email, password }
      })
      
      if (response.status) {
        token.value = response.data.accessToken
        user.value = response.data.user
        return { success: true, data: response.data }
      }
      
      return { success: false, error: 'Login failed' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' }
    }
  }

  const logout = async () => {
    token.value = null
    user.value = null
    await navigateTo('/login')
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return null
    
    try {
      const response = await $fetch<{status: boolean, data: {user: User}}>('/a/sessions/current_user', {
        baseURL: config.public.apiBase as string,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      if (response.status) {
        user.value = response.data.user
        return response.data.user
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      logout()
    }
    
    return null
  }

  const isAuthenticated = computed(() => !!token.value)

  return {
    user,
    token,
    login,
    logout,
    fetchCurrentUser,
    isAuthenticated
  }
}

