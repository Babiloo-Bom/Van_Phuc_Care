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
   * Handle Google OAuth Initiation (GET)
   * Redirect to Google OAuth
   */
  public static async googleLogin(req: Request, res: Response) {
    try {
      // If GET request, redirect to Google OAuth
      if (req.method === 'GET') {
        const clientId = process.env.GOOGLE_CLIENT_ID
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || `http://localhost:3000/a/sessions/google/callback`
        
        if (!clientId) {
          return sendError(res, 500, 'Google Client ID not configured')
        }
        
        const state = Math.random().toString(36).substring(2, 15)
        
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${clientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `response_type=code&` +
          `scope=openid%20email%20profile&` +
          `state=${state}`
        
        return res.redirect(googleAuthUrl)
      }
      
      // If POST request, handle Google profile
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

  /**
   * Handle Google OAuth Callback
   * Process Google OAuth callback and redirect to frontend
   */
  public static async googleCallback(req: Request, res: Response) {
    try {
      const { code, state } = req.query
      
      if (!code) {
        return res.redirect(`http://localhost:3102/login?google_error=true`)
      }
      
      // Exchange code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: process.env.GOOGLE_REDIRECT_URI || `http://localhost:3000/a/sessions/google/callback`
        })
      })
      
      const tokenData = await tokenResponse.json()
      const { access_token } = tokenData
      
      // Get user profile from Google
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      
      const profile = await profileResponse.json()
      
      // Find or create user
      let admin = await MongoDbAdmins.model.findOne({ 
        email: profile.email 
      })

      if (admin) {
        // Update existing user
        admin.set({
          fullname: profile.name,
          avatar: profile.picture,
          provider: 'google',
          googleId: profile.id,
          verified: true,
          status: MongoDbAdmins.STATUS_ENUM.ACTIVE,
          updatedAt: new Date()
        })
        
        await admin.save()
      } else {
        // Create new user
        admin = await MongoDbAdmins.model.create({
          email: profile.email,
          fullname: profile.name,
          avatar: profile.picture,
          provider: 'google',
          googleId: profile.id,
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

      // Redirect to frontend with token
      const frontendUrl = `http://localhost:3102/login?google_success=true&token=${accessToken}`
      return res.redirect(frontendUrl)
      
    } catch (error: any) {
      console.error('❌ Google callback error:', error)
      const frontendUrl = `http://localhost:3102/login?google_error=true`
      return res.redirect(frontendUrl)
    }
  }
}

