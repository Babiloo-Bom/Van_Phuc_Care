/**
 * Mock User Service
 * Fallback service when database is not available
 */

import type { GoogleUserData } from '~/types/user'

export interface MockUser {
  _id: string
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

export class MockUserService {
  private static users: MockUser[] = []

  // ===== CREATE USER =====
  static async createUser(userData: {
    email: string
    name: string
    avatar?: string
    provider: 'local' | 'google' | 'facebook' | 'github'
    googleId?: string
    facebookId?: string
    githubId?: string
    password?: string
    role?: string
  }): Promise<MockUser> {
    const user: MockUser = {
      _id: 'mock_' + Date.now(),
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar,
      provider: userData.provider,
      googleId: userData.googleId,
      isActive: true,
      role: userData.role || 'user',
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.users.push(user)
    console.log('✅ Mock user created:', user)
    return user
  }

  // ===== FIND USER BY EMAIL =====
  static async findByEmail(email: string): Promise<MockUser | null> {
    const user = this.users.find(u => u.email === email)
    return user || null
  }

  // ===== FIND USER BY GOOGLE ID =====
  static async findByGoogleId(googleId: string): Promise<MockUser | null> {
    const user = this.users.find(u => u.googleId === googleId)
    return user || null
  }

  // ===== CREATE OR UPDATE GOOGLE USER =====
  static async createOrUpdateGoogleUser(googleData: GoogleUserData): Promise<MockUser> {
    try {
      // First, try to find existing user by Google ID
      let user = await this.findByGoogleId(googleData.id)
      
      if (user) {
        // User exists, update their info
        user.name = googleData.name
        user.avatar = googleData.picture
        user.updatedAt = new Date()
        console.log('✅ Mock Google user updated:', user)
        return user
      }

      // Try to find by email
      user = await this.findByEmail(googleData.email)
      
      if (user) {
        // User exists with same email, link Google account
        user.googleId = googleData.id
        user.provider = 'google'
        user.name = googleData.name
        user.avatar = googleData.picture
        user.updatedAt = new Date()
        console.log('✅ Mock Google account linked:', user)
        return user
      }

      // Create new user
      const newUser = await this.createUser({
        email: googleData.email,
        name: googleData.name,
        avatar: googleData.picture,
        provider: 'google',
        googleId: googleData.id,
        role: 'user'
      })

      return newUser

    } catch (error: any) {
      console.error('❌ Mock Google user management failed:', error)
      throw new Error('Failed to manage Google user: ' + error.message)
    }
  }

  // ===== GET ALL USERS =====
  static async getAllUsers(): Promise<MockUser[]> {
    console.log('📊 Mock users in memory:', this.users.length)
    return [...this.users]
  }

  // ===== GET USER STATS =====
  static async getUserStats(): Promise<{
    total: number
    active: number
    google: number
    local: number
    byRole: Record<string, number>
  }> {
    const total = this.users.length
    const active = this.users.filter(u => u.isActive).length
    const google = this.users.filter(u => u.provider === 'google').length
    const local = this.users.filter(u => u.provider === 'local').length
    
    const byRole = this.users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return { total, active, google, local, byRole }
  }

  // ===== CLEAR ALL USERS =====
  static async clearAllUsers(): Promise<number> {
    const count = this.users.length
    this.users = []
    console.log(`🗑️ Cleared ${count} mock users`)
    return count
  }
}

