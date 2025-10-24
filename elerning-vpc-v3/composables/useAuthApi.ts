/**
 * Auth API Composable
 * Migrated from elerning-vpc/api/auth.js
 */

export const useAuthApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiHost

  return {
    /**
     * Login
     * @param username Email or phone
     * @param password Password
     * @param remindAccount Remember account
     */
    async login(username: string, password: string, remindAccount = false) {
      return await $fetch(`${apiBase}/a/sessions/login`, {
        method: 'POST',
        body: {
          username,
          password,
          remindAccount,
          origin: 'vanphuccare.gensi.vn'
        }
      })
    },

    /**
     * Register new account
     * @param email Email
     * @param password Password
     * @param repeat_password Repeat password
     */
    async register(email: string, password: string, repeat_password: string) {
      return await $fetch(`${apiBase}/a/sessions`, {
        method: 'POST',
        body: {
          email,
          password,
          repeat_password,
          domain: 'vanphuccare.gensi.vn'
        }
      })
    },

    /**
     * Verify email with OTP after registration
     * @param email Email
     * @param otp OTP code
     */
    async verifyEmail(email: string, otp: string) {
      return await $fetch(`${apiBase}/a/sessions/verify_email`, {
        method: 'POST',
        body: {
          email,
          otp,
          origin: 'vanphuccare.gensi.vn'
        }
      })
    },

    /**
     * Update profile
     * @param data Profile data
     */
    async updateProfile(data: Record<string, any>) {
      return await $fetch(`${apiBase}/a/sessions`, {
        method: 'PATCH',
        body: data
      })
    },

    /**
     * Change password
     * @param oldPassword Old password
     * @param newPassword New password
     */
    async changePassword(oldPassword: string, newPassword: string) {
      return await $fetch(`${apiBase}/a/sessions/change_password`, {
        method: 'PATCH',
        body: {
          oldPassword,
          newPassword
        }
      })
    },

    /**
     * Forgot password - Send OTP to email
     * @param email Email
     */
    async forgotPassword(email: string) {
      return await $fetch(`${apiBase}/a/sessions/forgot_password`, {
        method: 'POST',
        body: { email }
      })
    },

    /**
     * Verify OTP for forgot password
     * @param email Email
     * @param otp OTP code
     */
    async verifyOtp(email: string, otp: string) {
      return await $fetch(`${apiBase}/a/sessions/verify_otp`, {
        method: 'POST',
        body: { email, otp }
      })
    },

    /**
     * Reset password with token
     * @param email Email
     * @param token Token from OTP verification
     * @param newPassword New password
     */
    async resetPassword(email: string, token: string, newPassword: string) {
      return await $fetch(`${apiBase}/a/sessions/reset_password`, {
        method: 'POST',
        body: { 
          email,
          token,
          password: newPassword 
        }
      })
    },

    /**
     * Logout
     */
    async logout() {
      return await $fetch(`${apiBase}/a/sessions/logout`, {
        method: 'PATCH'
      })
    },

    /**
     * Get geo IP information
     */
    async getGeoIp() {
      return await $fetch('https://get.geojs.io/v1/ip/geo.json', {
        method: 'GET'
      })
    }
  }
}

