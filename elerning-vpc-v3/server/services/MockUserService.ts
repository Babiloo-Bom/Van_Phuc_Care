/**
 * Mock User Service
 * In-memory user management for testing (fallback when database is unavailable)
 */

import type { GoogleUserData } from '~/types/user'

interface MockUser {
  id: string
  email: string
  name: string
  avatar?: string
  provider: string
  googleId?: string
  isActive: boolean
  role: string
  permissions: string[]
  createdAt: Date
  updatedAt: Date
}

class MockUserServiceClass {
  private users: Map<string, MockUser> = new Map()
  private idCounter = 1

  // ===== CREATE OR UPDATE GOOGLE USER =====
  async createOrUpdateGoogleUser(googleData: GoogleUserData): Promise<MockUser> {
    try {
      // Find existing user by Google ID
      const existingUser = await this.findByGoogleId(googleData.id)
      
      if (existingUser) {
        // Update existing user
        existingUser.name = googleData.name
        existingUser.avatar = googleData.picture
        existingUser.updatedAt = new Date()
        
        this.users.set(existingUser.id, existingUser)
        console.log('✅ MockUserService: Updated existing user:', existingUser.email)
        return existingUser
      }

      // Find by email
      const emailUser = await this.findByEmail(googleData.email)
      if (emailUser) {
        // Link Google account
        emailUser.googleId = googleData.id
        emailUser.avatar = googleData.picture
        emailUser.provider = 'google'
        emailUser.updatedAt = new Date()
        
        this.users.set(emailUser.id, emailUser)
        console.log('✅ MockUserService: Linked Google account to existing user:', emailUser.email)
        return emailUser
      }

      // Create new user
      const newUser: MockUser = {
        id: `mock_${this.idCounter++}`,
        email: googleData.email,
        name: googleData.name,
        avatar: googleData.picture,
        provider: 'google',
        googleId: googleData.id,
        isActive: true,
        role: 'user',
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.users.set(newUser.id, newUser)
      console.log('✅ MockUserService: Created new user:', newUser.email)
      return newUser

    } catch (error: any) {
      console.error('❌ MockUserService: Failed to manage Google user:', error)
      throw new Error(`Failed to manage Google user: ${error.message}`)
    }
  }

  // ===== FIND BY EMAIL =====
  async findByEmail(email: string): Promise<MockUser | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  // ===== FIND BY GOOGLE ID =====
  async findByGoogleId(googleId: string): Promise<MockUser | null> {
    for (const user of this.users.values()) {
      if (user.googleId === googleId) {
        return user
      }
    }
    return null
  }

  // ===== GET ALL USERS =====
  async getAllUsers(): Promise<MockUser[]> {
    return Array.from(this.users.values())
  }

  // ===== GET USER STATS =====
  async getUserStats() {
    const users = Array.from(this.users.values())
    const now = new Date()
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      google: users.filter(u => u.provider === 'google').length,
      local: users.filter(u => u.provider === 'local').length,
      newLast30Days: users.filter(u => u.createdAt >= last30Days).length
    }
  }

  // ===== CLEAR ALL USERS (for testing) =====
  async clearAllUsers(): Promise<void> {
    this.users.clear()
    this.idCounter = 1
    console.log('✅ MockUserService: All users cleared')
  }
}

export const MockUserService = new MockUserServiceClass()

