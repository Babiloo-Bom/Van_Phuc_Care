/**
 * User Service
 * Business logic for user management
 */

import User, { IUser } from '../database/models/User'
import { connectToDatabase } from '../database/connection'
import type { GoogleUserData } from '~/types/user'

export class UserService {
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
  }): Promise<IUser> {
    try {
      // Ensure database connection
      await connectToDatabase()
      
      const user = new User(userData)
      await user.save()
      return user
    } catch (error: any) {
      throw new Error('Failed to create user: ' + error.message)
    }
  }

  // ===== FIND USER BY EMAIL =====
  static async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findByEmail(email)
    } catch (error: any) {
      throw new Error('Failed to find user by email')
    }
  }

  // ===== FIND USER BY GOOGLE ID =====
  static async findByGoogleId(googleId: string): Promise<IUser | null> {
    try {
      // Ensure database connection
      await connectToDatabase()
      return await User.findByGoogleId(googleId)
    } catch (error: any) {
      // Return null instead of throwing error for now
      return null
    }
  }

  // ===== CREATE OR UPDATE GOOGLE USER =====
  static async createOrUpdateGoogleUser(googleData: GoogleUserData): Promise<IUser> {
    try {
      // First, try to find existing user by Google ID
      let user = await this.findByGoogleId(googleData.id)
      
      if (user) {
        // User exists, update their info
        user.name = googleData.name
        user.avatar = googleData.picture
        user.lastLoginAt = new Date()
        await user.save()
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
        user.lastLoginAt = new Date()
        await user.save()
        return user
      }

      // Create new user
      return await this.createUser({
        email: googleData.email,
        name: googleData.name,
        avatar: googleData.picture,
        provider: 'google',
        googleId: googleData.id,
        role: 'user'
      })

    } catch (error: any) {
      throw new Error('Failed to manage Google user: ' + error.message)
    }
  }

  // ===== UPDATE USER =====
  static async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      )
      return user
    } catch (error: any) {
      throw new Error('Failed to update user')
    }
  }

  // ===== DEACTIVATE USER =====
  static async deactivateUser(userId: string): Promise<IUser | null> {
    try {
      return await this.updateUser(userId, { isActive: false })
    } catch (error: any) {
      throw new Error('Failed to deactivate user')
    }
  }

  // ===== ACTIVATE USER =====
  static async activateUser(userId: string): Promise<IUser | null> {
    try {
      return await this.updateUser(userId, { isActive: true })
    } catch (error: any) {
      throw new Error('Failed to activate user')
    }
  }

  // ===== GET ALL USERS =====
  static async getAllUsers(page = 1, limit = 10): Promise<{
    users: IUser[]
    total: number
    pages: number
  }> {
    try {
      const skip = (page - 1) * limit
      const users = await User.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-password') // Exclude password from results
      
      const total = await User.countDocuments()
      const pages = Math.ceil(total / limit)

      return { users, total, pages }
    } catch (error: any) {
      throw new Error('Failed to get users')
    }
  }

  // ===== GET USERS BY PROVIDER =====
  static async getUsersByProvider(provider: string): Promise<IUser[]> {
    try {
      return await User.findByProvider(provider)
    } catch (error: any) {
      throw new Error('Failed to get users by provider')
    }
  }

  // ===== GET GOOGLE USERS =====
  static async getGoogleUsers(): Promise<IUser[]> {
    try {
      return await this.getUsersByProvider('google')
    } catch (error: any) {
      throw new Error('Failed to get Google users')
    }
  }

  // ===== USER STATISTICS =====
  static async getUserStats(): Promise<{
    total: number
    active: number
    google: number
    local: number
    byRole: Record<string, number>
  }> {
    try {
      const total = await User.countDocuments()
      const active = await User.countDocuments({ isActive: true })
      const google = await User.countDocuments({ provider: 'google' })
      const local = await User.countDocuments({ provider: 'local' })
      
      const roleStats = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ])
      
      const byRole = roleStats.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {} as Record<string, number>)

      return { total, active, google, local, byRole }
    } catch (error: any) {
      throw new Error('Failed to get user statistics')
    }
  }
}
