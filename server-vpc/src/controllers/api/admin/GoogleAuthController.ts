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
        const clientId = settings.google.clientId
        // Prefer query-provided redirect_uri/frontend_url for per-site behavior
        const requestedRedirectUri = (req.query.redirect_uri as string) || process.env.GOOGLE_REDIRECT_URI || settings.google.redirectUri
        const requestedFrontendUrl = (req.query.frontend_url as string) || process.env.FRONTEND_URL

        console.log('🔍 Google OAuth Configuration:')
        console.log('  - Client ID:', clientId)
        console.log('  - Redirect URI (requested):', requestedRedirectUri)
        console.log('  - Redirect URI (encoded):', encodeURIComponent(requestedRedirectUri))
        console.log('  - Frontend URL (requested):', requestedFrontendUrl)
        
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
        
        console.log('🔍 Full Google OAuth URL:', googleAuthUrl)
        
        return res.redirect(googleAuthUrl)
      }
      
      // If POST request, handle Google OAuth code exchange or profile
      const { code, redirectUri, googleProfile, googleAccessToken } = req.body

      let googleProfileData = googleProfile

      // If code is provided, exchange it for access token and get profile
      if (code) {
        console.log('🔍 Google OAuth code exchange:', { code, redirectUri })

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
        console.log('🔍 Google token response:', tokenData)
        
        if (tokenData.error) {
          console.error('❌ Google token error:', tokenData.error)
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
        console.log('🔍 Google profile:', googleProfileData)
      }

      // If googleProfile is provided directly, use it
      if (!googleProfileData) {
        return sendError(res, 400, 'Google profile is required')
      }

      if (!googleProfileData.email) {
        return sendError(res, 400, 'Failed to get Google profile')
      }

      console.log('🔐 Google Auth: Processing login for', googleProfileData.email)

      // Find or create user in admins collection
      let admin = await MongoDbAdmins.model.findOne({ 
        email: googleProfileData.email 
      })

      if (admin) {
        // Update existing user
        console.log('✅ Existing user found, updating...')
        
        admin.set({
          fullname: googleProfileData.name,
          avatar: googleProfileData.picture,
          provider: 'google',
          googleId: googleProfileData.id,
          verified: true,
          status: MongoDbAdmins.STATUS_ENUM.ACTIVE,
          updatedAt: new Date()
        })
        
        await admin.save()
      } else {
        // Create new user
        console.log('✅ New user, creating...')
        
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

      console.log('✅ JWT token generated for', googleProfileData.email)

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
      const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
      const frontendUrl = baseFrontend ? `${baseFrontend}/login?google_success=true&token=${accessToken}` : `/login?google_success=true&token=${accessToken}`
      return res.redirect(frontendUrl)
      
    } catch (error: any) {
      console.error('❌ Google callback error:', error)
      const baseFrontend = (process.env.FRONTEND_URL || '').replace(/\/$/, '')
      const frontendUrl = baseFrontend ? `${baseFrontend}/login?google_error=true` : `/login?google_error=true`
      return res.redirect(frontendUrl)
    }
  }
}

