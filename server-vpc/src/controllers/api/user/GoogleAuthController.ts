/**
 * Google Auth Controller
 * Handles Google OAuth authentication for user portal
 */

import { Request, Response } from 'express'
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
      const { code, redirectUri, googleProfile } = req.body

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
        console.log('tokenResponse', tokenResponse)
        const tokenData = await tokenResponse.json()
        
        if (tokenData.error) {
          return sendError(res, 400, tokenData.error_description || 'Failed to exchange code for token')
        }
        
        const { access_token } = tokenData
        
        if (!access_token) {
          return sendError(res, 400, 'Failed to get access token from Google')
        }
        
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

      // Find or create user in users collection
      let user = await MongoDbUsers.model.findOne({ 
        email: googleProfileData.email 
      })

      if (user) {
        // Update existing user
        user.set({
          fullname: googleProfileData.name,
          avatar: googleProfileData.picture,
          provider: 'google',
          googleId: googleProfileData.id,
          status: MongoDbUsers.STATUS_ENUM.ACTIVE,
          updatedAt: new Date()
        })
        
        await user.save()
      } else {
        // Create new user
        user = await MongoDbUsers.model.create({
          email: googleProfileData.email,
          fullname: googleProfileData.name,
          avatar: googleProfileData.picture,
          phoneNumber: googleProfileData.phone || `google-${Date.now()}`, // Required field
          provider: 'google',
          googleId: googleProfileData.id,
          status: MongoDbUsers.STATUS_ENUM.ACTIVE,
          type: 'normal'
        })
      }

      // Generate JWT token (using userSecret)
      const timestampNow = Date.now()
      const tokenExpireAt = new Date(timestampNow + settings.jwt.ttl)
      
      const accessToken = jwt.sign(
        { 
          id: user._id,
          email: user.get('email'),
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
          phoneNumber: user.get('phoneNumber'),
          provider: 'google',
          googleId: user.get('googleId'),
          type: user.get('type') || 'normal',
          status: user.get('status')
        },
        accessToken,
        tokenExpireAt: tokenExpireAt
      })

    } catch (error: any) {
      console.error('❌ Google login error:', error)
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
      } catch (error) {
        console.warn('⚠️ Could not decode state parameter:', error)
      }

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
      
      if (tokenData.error) {
        console.error('❌ Token exchange error:', tokenData.error)
        const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
        if (baseFrontend) return res.redirect(`${baseFrontend}/login?google_error=true`)
        return sendError(res, 400, tokenData.error_description || 'Failed to exchange code for token')
      }
      
      const { access_token } = tokenData
      
      if (!access_token) {
        const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
        if (baseFrontend) return res.redirect(`${baseFrontend}/login?google_error=true`)
        return sendError(res, 400, 'Failed to get access token from Google')
      }
      
      // Get user profile from Google
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      
      const profile = await profileResponse.json()
      
      if (!profile || !profile.email) {
        const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
        if (baseFrontend) return res.redirect(`${baseFrontend}/login?google_error=true`)
        return sendError(res, 400, 'Failed to get Google profile')
      }
      
      // Find or create user
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
        // Create new user
        user = await MongoDbUsers.model.create({
          email: profile.email,
          fullname: profile.name,
          avatar: profile.picture,
          phoneNumber: profile.phone || `google-${Date.now()}`, // Required field
          provider: 'google',
          googleId: profile.id,
          status: MongoDbUsers.STATUS_ENUM.ACTIVE,
          type: 'normal'
        })
      }

      // Generate JWT token (using userSecret)
      const timestampNow = Date.now()
      const tokenExpireAt = new Date(timestampNow + settings.jwt.ttl)
      
      const accessToken = jwt.sign(
        { 
          id: user._id,
          email: user.get('email'),
        },
        settings.jwt.userSecret,
        { expiresIn: settings.jwt.ttl }
      )

      // Redirect to frontend with token
      const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
      const frontendUrl = baseFrontend 
        ? `${baseFrontend}/login?google_success=true&token=${accessToken}` 
        : `/login?google_success=true&token=${accessToken}`
      return res.redirect(frontendUrl)
      
    } catch (error: any) {
      console.error('❌ Google callback error:', error)
      const baseFrontend = (process.env.FRONTEND_URL || '').replace(/\/$/, '')
      const frontendUrl = baseFrontend 
        ? `${baseFrontend}/login?google_error=true` 
        : `/login?google_error=true`
      return res.redirect(frontendUrl)
    }
  }
}

