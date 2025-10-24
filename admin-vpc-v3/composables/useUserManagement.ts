/**
 * User Management Composable
 * Handles user creation, authentication, and management
 */

import type { User, GoogleUserData, CreateUserRequest, UserResponse } from '~/types/user'

export const useUserManagement = () => {
  const config = useRuntimeConfig()

  // ===== CREATE USER =====
  const createUser = async (userData: CreateUserRequest): Promise<UserResponse> => {
    try {
      const { data } = await useFetch<UserResponse>('/api/users/create', {
        method: 'POST',
        body: userData
      })

      return data.value!
    } catch (error: any) {
      console.error('❌ User creation failed:', error)
      return {
        success: false,
        error: error.message || 'Failed to create user'
      }
    }
  }

  // ===== FIND USER BY EMAIL =====
  const findUserByEmail = async (email: string): Promise<UserResponse> => {
    try {
      const { data } = await useFetch<UserResponse>(`/api/users/find-by-email`, {
        method: 'POST',
        body: { email }
      })

      return data.value!
    } catch (error: any) {
      console.error('❌ User lookup failed:', error)
      return {
        success: false,
        error: error.message || 'Failed to find user'
      }
    }
  }

  // ===== FIND USER BY GOOGLE ID =====
  const findUserByGoogleId = async (googleId: string): Promise<UserResponse> => {
    try {
      const { data } = await useFetch<UserResponse>(`/api/users/find-by-google-id`, {
        method: 'POST',
        body: { googleId }
      })

      return data.value!
    } catch (error: any) {
      console.error('❌ Google user lookup failed:', error)
      return {
        success: false,
        error: error.message || 'Failed to find Google user'
      }
    }
  }

  // ===== CREATE OR UPDATE GOOGLE USER =====
  const createOrUpdateGoogleUser = async (googleData: GoogleUserData): Promise<UserResponse> => {
    try {
      // First, try to find existing user by Google ID
      const existingUser = await findUserByGoogleId(googleData.id)
      
      if (existingUser.success && existingUser.data) {
        // User exists, update their info
        return await updateGoogleUser(googleData)
      }

      // Try to find by email
      const emailUser = await findUserByEmail(googleData.email)
      
      if (emailUser.success && emailUser.data) {
        // User exists with same email, link Google account
        return await linkGoogleAccount(googleData)
      }

      // Create new user
      return await createUser({
        email: googleData.email,
        name: googleData.name,
        avatar: googleData.picture,
        provider: 'google',
        googleId: googleData.id,
        role: 'user' // Default role
      })

    } catch (error: any) {
      console.error('❌ Google user management failed:', error)
      return {
        success: false,
        error: error.message || 'Failed to manage Google user'
      }
    }
  }

  // ===== UPDATE GOOGLE USER =====
  const updateGoogleUser = async (googleData: GoogleUserData): Promise<UserResponse> => {
    try {
      const { data } = await useFetch<UserResponse>('/api/users/update-google', {
        method: 'POST',
        body: {
          googleId: googleData.id,
          name: googleData.name,
          avatar: googleData.picture
        }
      })

      return data.value!
    } catch (error: any) {
      console.error('❌ Google user update failed:', error)
      return {
        success: false,
        error: error.message || 'Failed to update Google user'
      }
    }
  }

  // ===== LINK GOOGLE ACCOUNT =====
  const linkGoogleAccount = async (googleData: GoogleUserData): Promise<UserResponse> => {
    try {
      const { data } = await useFetch<UserResponse>('/api/users/link-google', {
        method: 'POST',
        body: {
          email: googleData.email,
          googleId: googleData.id,
          name: googleData.name,
          avatar: googleData.picture
        }
      })

      return data.value!
    } catch (error: any) {
      console.error('❌ Google account linking failed:', error)
      return {
        success: false,
        error: error.message || 'Failed to link Google account'
      }
    }
  }

  return {
    // User operations
    createUser,
    findUserByEmail,
    findUserByGoogleId,
    
    // Google user operations
    createOrUpdateGoogleUser,
    updateGoogleUser,
    linkGoogleAccount
  }
}
