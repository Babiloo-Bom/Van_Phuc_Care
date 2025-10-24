/**
 * Google Auth Controller
 * Handles Google OAuth authentication for admin portal
 */

import { Request, Response } from 'express'
import MongoDbAdmins from '@mongodb/admins'
import { sendSuccess, sendError } from '@libs/response'
import { InternalError } from '@libs/errors'
import jwt from 'jsonwebtoken'
import settings from '@configs/settings'

export default class GoogleAuthController {
  /**
   * Handle Google Login
   * Create/update user from Google profile and generate JWT
   */
  public static async googleLogin(req: Request, res: Response) {
    try {
      const { googleProfile, googleAccessToken } = req.body

      if (!googleProfile || !googleProfile.email) {
        return sendError(res, 400, 'Google profile is required')
      }

      console.log('🔐 Google Auth: Processing login for', googleProfile.email)

      // Find or create user in admins collection
      let admin = await MongoDbAdmins.model.findOne({ 
        email: googleProfile.email 
      })

      if (admin) {
        // Update existing user
        console.log('✅ Existing user found, updating...')
        
        admin.set({
          fullname: googleProfile.name,
          avatar: googleProfile.picture,
          provider: 'google',
          googleId: googleProfile.id,
          verified: true,
          status: MongoDbAdmins.STATUS_ENUM.ACTIVE,
          updatedAt: new Date()
        })
        
        await admin.save()
      } else {
        // Create new user
        console.log('✅ New user, creating...')
        
        admin = await MongoDbAdmins.model.create({
          email: googleProfile.email,
          fullname: googleProfile.name,
          avatar: googleProfile.picture,
          provider: 'google',
          googleId: googleProfile.id,
          role: 'user',
          permissions: [],
          verified: true,
          status: MongoDbAdmins.STATUS_ENUM.ACTIVE,
          isActive: true
        })
      }

      // Generate JWT token
      const accessToken = jwt.sign(
        { 
          id: admin._id,
          email: admin.get('email'),
          role: admin.get('role') || 'user'
        },
        settings.jwt.adminSecret,
        { expiresIn: settings.jwt.ttl }
      )

      console.log('✅ JWT token generated for', googleProfile.email)

      sendSuccess(res, {
        user: {
          _id: admin._id,
          email: admin.get('email'),
          fullname: admin.get('fullname'),
          avatar: admin.get('avatar'),
          role: admin.get('role') || 'user',
          permissions: admin.get('permissions') || [],
          provider: 'google',
          googleId: admin.get('googleId')
        },
        accessToken,
        tokenExpireAt: settings.jwt.ttl
      })

    } catch (error: any) {
      console.error('❌ Google auth error:', error)
      sendError(res, 500, InternalError, error)
    }
  }
}

