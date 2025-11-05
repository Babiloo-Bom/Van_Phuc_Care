import { defineStore } from 'pinia';

export interface UserPreferences {
  language: string
  timezone: string
  notifications: boolean
  emailNotifications: boolean
}

export interface UserState {
  preferences: UserPreferences
  recentActivities: Activity[]
}

export interface Activity {
  id: string | number
  type: string
  title: string
  description: string
  timestamp: Date
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    preferences: {
      language: 'en',
      timezone: 'Asia/Ho_Chi_Minh',
      notifications: true,
      emailNotifications: true,
    },
    recentActivities: [],
  }),

  getters: {
    userLanguage: state => state.preferences.language,
    isNotificationsEnabled: state => state.preferences.notifications,
    recentActivitiesList: state => state.recentActivities.slice(0, 10),
  },

  actions: {
    /**
     * Update user preferences
     */
    updatePreferences(prefs: Partial<UserPreferences>) {
      this.preferences = { ...this.preferences, ...prefs };
      
      if (process.client) {
        localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
      }
    },

    /**
     * Add activity
     */
    addActivity(activity: Omit<Activity, 'id' | 'timestamp'>) {
      this.recentActivities.unshift({
        ...activity,
        id: Date.now(),
        timestamp: new Date(),
      });

      // Keep only last 50 activities
      if (this.recentActivities.length > 50) {
        this.recentActivities = this.recentActivities.slice(0, 50);
      }
    },

    /**
     * Clear activities
     */
    clearActivities() {
      this.recentActivities = [];
    },

    /**
     * Initialize user settings
     */
    initUser() {
      if (process.client) {
        const prefs = localStorage.getItem('userPreferences');
        if (prefs) {
          this.preferences = JSON.parse(prefs);
        }
      }
    },
  },
});

