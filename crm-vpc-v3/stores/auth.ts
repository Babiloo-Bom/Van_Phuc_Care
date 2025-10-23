import { defineStore } from 'pinia'

export interface User {
  id: string | number
  email: string
  name: string
  role?: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    userRole: (state) => state.user?.role || 'guest',
    userName: (state) => state.user?.name || 'Unknown'
  },

  actions: {
    /**
     * Login user
     */
    async login(email: string, password: string) {
      this.isLoading = true
      
      try {
        const { apiBase } = useEnvConfig()
        
        // Call API login
        const response = await $fetch<{ token: string; user: User }>(`${apiBase}/sessions`, {
          method: 'PATCH',
          body: { email, password }
        })

        // Save token
        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true

        // Save to localStorage
        if (process.client) {
          localStorage.setItem('auth_token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        return { success: true }
      } catch (error: any) {
        console.error('Login error:', error)
        return { 
          success: false, 
          error: error.message || 'Login failed' 
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Logout user
     */
    async logout() {
      this.isLoading = true

      try {
        // Clear server session if needed
        // await $fetch(`${apiBase}/sessions/logout`, { method: 'DELETE' })

        // Clear state
        this.user = null
        this.token = null
        this.isAuthenticated = false

        // Clear localStorage
        if (process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
        }

        // Redirect to login
        navigateTo('/login')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Check and restore session from localStorage
     */
    initAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const userStr = localStorage.getItem('user')

        if (token && userStr) {
          this.token = token
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true
        }
      }
    },

    /**
     * Update user profile
     */
    updateUser(userData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...userData }
        
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      }
    }
  }
})

