/**
 * Google Auth Controller
 * Handles Google OAuth authentication for admin portal
 */

import { Request, Response } from 'express'
import MongoDbAdmins from '@mongodb/admins'
import MongoDbUsers from '@mongodb/users'
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
        const clientId = settings.google.clientId
        // Prefer query-provided redirect_uri/frontend_url for per-site behavior
        const requestedRedirectUri = (req.query.redirect_uri as string) || process.env.GOOGLE_REDIRECT_URI || settings.google.redirectUri
        const requestedFrontendUrl = (req.query.frontend_url as string) || process.env.FRONTEND_URL

        if (!clientId || clientId === 'your_google_client_id_here') {
          return sendError(res, 500, 'Google Client ID not configured')
        }
        if (!requestedRedirectUri) {
          return sendError(res, 400, 'redirect_uri is required')
        }
        
        // Pack requested redirect/frontend in state for callback
        const statePayload = {
          redirectUri: requestedRedirectUri,
          frontendUrl: requestedFrontendUrl,
        }
        const state = encodeURIComponent(JSON.stringify(statePayload))
        
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${clientId}&` +
          `redirect_uri=${encodeURIComponent(requestedRedirectUri)}&` +
          `response_type=code&` +
          `scope=openid%20email%20profile&` +
          `state=${state}`
        
        
        return res.redirect(googleAuthUrl)
      }
      
      // If POST request, handle Google OAuth code exchange or profile
      const { code, redirectUri, googleProfile, googleAccessToken } = req.body

      let googleProfileData = googleProfile

      // If code is provided, exchange it for access token and get profile
      if (code) {

        // Exchange code for access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: settings.google.clientId,
            client_secret: settings.google.clientSecret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri || settings.google.redirectUri
          })
        })
        
        const tokenData = await tokenResponse.json()
        
        if (tokenData.error) {
          return sendError(res, 400, tokenData.error_description || 'Failed to exchange code for token')
        }
        
        const { access_token } = tokenData
        
        // Get user profile from Google
        const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        })
        
        googleProfileData = await profileResponse.json()
      }

      // If googleProfile is provided directly, use it
      if (!googleProfileData) {
        return sendError(res, 400, 'Google profile is required')
      }

      if (!googleProfileData.email) {
        return sendError(res, 400, 'Failed to get Google profile')
      }


      // Find or create user in admins collection
      let admin = await MongoDbAdmins.model.findOne({ 
        email: googleProfileData.email 
      })

      if (admin) {
        // Update existing admin - only update fields that are not already set
        // Don't overwrite custom fullname/avatar if user has edited them
        const adminUpdateData: any = {
          provider: 'google',
          googleId: googleProfileData.id,
          verified: true,
          status: MongoDbAdmins.STATUS_ENUM.ACTIVE,
          updatedAt: new Date()
        }
        
        // Only set fullname from Google if admin doesn't have one
        if (!admin.get('fullname')) {
          adminUpdateData.fullname = googleProfileData.name
        }
        
        // Only set avatar from Google if admin doesn't have one
        if (!admin.get('avatar')) {
          adminUpdateData.avatar = googleProfileData.picture
        }
        
        admin.set(adminUpdateData)
        await admin.save()
      } else {
        // Create new user
        
        admin = await MongoDbAdmins.model.create({
          email: googleProfileData.email,
          fullname: googleProfileData.name,
          avatar: googleProfileData.picture,
          provider: 'google',
          googleId: googleProfileData.id,
          role: 'user',
          permissions: [],
          verified: true,
          status: MongoDbAdmins.STATUS_ENUM.ACTIVE,
          isActive: true
        })
      }

      // Also create/update user in users collection for CRM access
      let user = await MongoDbUsers.model.findOne({ 
        email: googleProfileData.email 
      })

      if (user) {
        // Update existing user - only update fields that are not already set
        // Don't overwrite custom fullname/avatar if user has edited them
        const userUpdateData: any = {
          provider: 'google',
          googleId: googleProfileData.id,
          status: MongoDbUsers.STATUS_ENUM.ACTIVE,
          updatedAt: new Date()
        }
        
        // Only set fullname from Google if user doesn't have one
        if (!user.get('fullname')) {
          userUpdateData.fullname = googleProfileData.name
        }
        
        // Only set avatar from Google if user doesn't have one
        if (!user.get('avatar')) {
          userUpdateData.avatar = googleProfileData.picture
        }
        
        user.set(userUpdateData)
        await user.save()
      } else {
        // Create new user in users collection
        user = await MongoDbUsers.model.create({
          email: googleProfileData.email,
          fullname: googleProfileData.name,
          avatar: googleProfileData.picture,
          phoneNumber: `google-${Date.now()}`, // Required field
          provider: 'google',
          googleId: googleProfileData.id,
          status: MongoDbUsers.STATUS_ENUM.ACTIVE,
          type: 'normal'
        })
      }

      // Generate JWT token using user._id (from users collection) for CRM compatibility
      const accessToken = jwt.sign(
        { 
          id: user._id,
          email: user.get('email'),
          role: 'user'
        },
        settings.jwt.userSecret,
        { expiresIn: settings.jwt.ttl }
      )


      sendSuccess(res, {
        user: {
          _id: user._id,
          email: user.get('email'),
          fullname: user.get('fullname'),
          avatar: user.get('avatar'),
          role: 'user',
          permissions: admin.get('permissions') || [],
          provider: 'google',
          googleId: user.get('googleId')
        },
        accessToken,
        tokenExpireAt: settings.jwt.ttl
      })

    } catch (error: any) {
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
      
      // Decode state to get per-site redirect/frontend
      let stateRedirectUri: string | undefined
      let stateFrontendUrl: string | undefined
      try {
        if (typeof state === 'string' && state.length > 0) {
          const decoded = JSON.parse(decodeURIComponent(state as string))
          stateRedirectUri = decoded?.redirectUri
          stateFrontendUrl = decoded?.frontendUrl
        }
      } catch {}

      if (!code) {
        const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
        if (baseFrontend) return res.redirect(`${baseFrontend}/login?google_error=true`)
        return sendError(res, 400, 'Missing OAuth code')
      }
      
      // Exchange code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: settings.google.clientId,
          client_secret: settings.google.clientSecret,
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: stateRedirectUri || process.env.GOOGLE_REDIRECT_URI || settings.google.redirectUri
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
      
      // Find or create user in admins collection
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

      // Also create/update user in users collection for CRM access
      let user = await MongoDbUsers.model.findOne({ 
        email: profile.email 
      })

      if (user) {
        // Update existing user
        user.set({
          fullname: profile.name,
          avatar: profile.picture,
          provider: 'google',
          googleId: profile.id,
          status: MongoDbUsers.STATUS_ENUM.ACTIVE,
          updatedAt: new Date()
        })
        await user.save()
      } else {
        // Create new user in users collection
        user = await MongoDbUsers.model.create({
          email: profile.email,
          fullname: profile.name,
          avatar: profile.picture,
          phoneNumber: `google-${Date.now()}`, // Required field
          provider: 'google',
          googleId: profile.id,
          status: MongoDbUsers.STATUS_ENUM.ACTIVE,
          type: 'normal'
        })
      }

      // Generate JWT token using user._id (from users collection) for CRM compatibility
      const accessToken = jwt.sign(
        { 
          id: user._id,
          email: user.get('email'),
          role: 'user'
        },
        settings.jwt.userSecret,
        { expiresIn: settings.jwt.ttl }
      )

      // Redirect to frontend with token
      const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
      const frontendUrl = baseFrontend ? `${baseFrontend}?google_success=true&token=${accessToken}` : `/?google_success=true&token=${accessToken}`
      return res.redirect(frontendUrl)
      
    } catch (error: any) {
      const baseFrontend = (process.env.FRONTEND_URL || '').replace(/\/$/, '')
      const frontendUrl = baseFrontend ? `${baseFrontend}/login?google_error=true` : `/login?google_error=true`
      return res.redirect(frontendUrl)
    }
  }
}

