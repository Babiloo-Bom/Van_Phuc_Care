import { defineStore } from 'pinia'

export interface AppState {
  sidebarOpen: boolean
  loading: boolean
  notifications: Notification[]
  darkMode: boolean
}

export interface Notification {
  id: string | number
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timestamp: Date
  read: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebarOpen: true,
    loading: false,
    notifications: [],
    darkMode: false
  }),

  getters: {
    isSidebarOpen: (state) => state.sidebarOpen,
    isLoading: (state) => state.loading,
    unreadNotifications: (state) => state.notifications.filter(n => !n.read),
    unreadCount: (state) => state.notifications.filter(n => !n.read).length
  },

  actions: {
    /**
     * Toggle sidebar
     */
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    /**
     * Set sidebar state
     */
    setSidebar(open: boolean) {
      this.sidebarOpen = open
    },

    /**
     * Set loading state
     */
    setLoading(loading: boolean) {
      this.loading = loading
    },

    /**
     * Add notification
     */
    addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
      this.notifications.unshift({
        ...notification,
        id: Date.now(),
        timestamp: new Date(),
        read: false
      })

      // Auto remove after 5 seconds for success/info
      if (notification.type === 'success' || notification.type === 'info') {
        setTimeout(() => {
          this.removeNotification(this.notifications[0].id)
        }, 5000)
      }
    },

    /**
     * Remove notification
     */
    removeNotification(id: string | number) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    /**
     * Mark notification as read
     */
    markAsRead(id: string | number) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification) {
        notification.read = true
      }
    },

    /**
     * Mark all as read
     */
    markAllAsRead() {
      this.notifications.forEach(n => n.read = true)
    },

    /**
     * Clear all notifications
     */
    clearNotifications() {
      this.notifications = []
    },

    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      
      if (process.client) {
        localStorage.setItem('darkMode', String(this.darkMode))
      }
    },

    /**
     * Initialize app settings
     */
    initApp() {
      if (process.client) {
        const darkMode = localStorage.getItem('darkMode')
        if (darkMode) {
          this.darkMode = darkMode === 'true'
        }
      }
    }
  }
})

