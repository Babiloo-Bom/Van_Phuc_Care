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
        // Frontend URL để redirect về sau khi xử lý
        const requestedFrontendUrl = (req.query.frontend_url as string) || process.env.FRONTEND_URL
        // Redirect URI từ frontend (frontend callback URL)
        const requestedRedirectUri = (req.query.redirect_uri as string)

        if (!clientId || clientId === 'your_google_client_id_here') {
          return sendError(res, 500, 'Google Client ID not configured')
        }
        
        // Use requested redirect_uri from frontend (giống elearning và crm)
        // Frontend sẽ gửi redirect_uri là frontend callback URL
        const redirectUri = requestedRedirectUri || process.env.GOOGLE_REDIRECT_URI || settings.google.redirectUri
        
        if (!redirectUri) {
          return sendError(res, 400, 'redirect_uri is required')
        }
        
        // Pack frontend URL in state for callback
        const statePayload = {
          redirectUri: redirectUri,
          frontendUrl: requestedFrontendUrl,
        }
        const state = encodeURIComponent(JSON.stringify(statePayload))
        
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${clientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
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


      // Check if email exists in either collection first (like googleCallback method)
      const [existingAdmin, existingUser] = await Promise.all([
        MongoDbAdmins.model.findOne({ email: googleProfileData.email }),
        MongoDbUsers.model.findOne({ email: googleProfileData.email })
      ])
      
      const emailExists = !!(existingAdmin || existingUser)
      
      // If email exists in either collection, only update - don't create new
      let admin = existingAdmin
      let user = existingUser
      
      if (emailExists) {
        // Check if account is active BEFORE updating
        // Check admin account (if exists)
        if (admin) {
          const adminStatus = admin.get('status');
          const adminIsActive = admin.get('isActive');
          if (adminStatus !== MongoDbAdmins.STATUS_ENUM.ACTIVE || adminIsActive === false) {
            console.warn('⚠️ Admin account is inactive or deactivated:', googleProfileData.email);
            return sendError(res, 403, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
          }
        }
        
        // Check user account (if exists)
        if (user) {
          const userStatus = user.get('status');
          if (userStatus !== MongoDbUsers.STATUS_ENUM.ACTIVE) {
            console.warn('⚠️ User account is inactive:', googleProfileData.email);
            return sendError(res, 403, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
          }
        }
        
        // Update existing records only (only if account is active)
        if (admin) {
          // Update existing admin - preserve existing data, only update Google-related fields
          // DON'T override isActive or status if they are false/inactive
          admin.set({
            provider: 'google',
            googleId: googleProfileData.id,
            verified: true,
            updatedAt: new Date()
          })
          // Only update fullname/avatar if not already set
          if (!admin.get('fullname')) {
            admin.set('fullname', googleProfileData.name)
          }
          if (!admin.get('avatar')) {
            admin.set('avatar', googleProfileData.picture)
          }
          await admin.save()
        }
        
        if (user) {
          // Update existing user - preserve existing data, only update Google-related fields
          // DON'T override status if it's inactive
          user.set({
            provider: 'google',
            googleId: googleProfileData.id,
            updatedAt: new Date()
          })
          // Only update fullname/avatar if not already set
          if (!user.get('fullname')) {
            user.set('fullname', googleProfileData.name)
          }
          if (!user.get('avatar')) {
            user.set('avatar', googleProfileData.picture)
          }
          await user.save()
        }
      } else {
        // Email doesn't exist in either collection - create new in both
        // Create in admins collection
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
        
        // Create in users collection
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
      
      // Ensure we have at least one user record for token generation
      if (!user && admin) {
        // If admin exists but user doesn't, create user record
        user = await MongoDbUsers.model.create({
          email: googleProfileData.email,
          fullname: admin.get('fullname') || googleProfileData.name,
          avatar: admin.get('avatar') || googleProfileData.picture,
          phoneNumber: `google-${Date.now()}`,
          provider: 'google',
          googleId: googleProfileData.id,
          status: MongoDbUsers.STATUS_ENUM.ACTIVE,
          type: 'normal'
        })
      }
      
      if (!admin && user) {
        // If user exists but admin doesn't, check user's role
        // First, check if user has a role field (may have been added manually)
        const userRole = user.get('role')
        const userType = user.get('type') || 'normal'
        let adminRole: string | null = null
        
        // Check if user has a role field with valid admin role
        if (userRole && ['admin', 'manager', 'worker'].includes(userRole)) {
          adminRole = userRole
        } else if (userType === 'normal' || userType === 'customer') {
          // Customer/normal users cannot login to admin portal
          console.warn('⚠️ User from users collection with customer/normal type cannot login to admin portal:', googleProfileData.email)
          return sendError(res, 403, 'Bạn không có quyền truy cập vào hệ thống quản trị. Vui lòng liên hệ quản trị viên để được cấp quyền.')
        } else {
          // Unknown type, default to 'user' but this shouldn't happen
          adminRole = 'user'
        }
        
        if (!adminRole) {
          console.warn('⚠️ Cannot determine admin role for user:', googleProfileData.email)
          return sendError(res, 403, 'Bạn không có quyền truy cập vào hệ thống quản trị. Vui lòng liên hệ quản trị viên để được cấp quyền.')
        }
        
        // Create admin record with appropriate role
        admin = await MongoDbAdmins.model.create({
          email: googleProfileData.email,
          fullname: user.get('fullname') || googleProfileData.name,
          avatar: user.get('avatar') || googleProfileData.picture,
          provider: 'google',
          googleId: googleProfileData.id,
          role: adminRole,
          permissions: [],
          verified: true,
          status: MongoDbAdmins.STATUS_ENUM.ACTIVE,
          isActive: true
        })
      }

      // Check if account is active before allowing login
      // Check admin account (if exists)
      if (admin) {
        const adminStatus = admin.get('status');
        const adminIsActive = admin.get('isActive');
        if (adminStatus !== MongoDbAdmins.STATUS_ENUM.ACTIVE || adminIsActive === false) {
          console.warn('⚠️ Admin account is inactive or deactivated:', googleProfileData.email);
          return sendError(res, 403, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
        }
      }
      
      // Check user account (if exists)
      if (user) {
        const userStatus = user.get('status');
        if (userStatus !== MongoDbUsers.STATUS_ENUM.ACTIVE) {
          console.warn('⚠️ User account is inactive:', googleProfileData.email);
          return sendError(res, 403, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
        }
      }

      // Ensure we have at least admin or user record
      if (!admin && !user) {
        console.error('❌ No admin or user record found after processing:', googleProfileData.email)
        return sendError(res, 500, InternalError, new Error('Không thể tạo hoặc tìm thấy tài khoản người dùng'))
      }

      // Determine which user ID and role to use for token generation
      // Prefer admin record if exists (for admin portal), otherwise use user record
      const tokenUserId = admin?._id || user?._id
      const tokenUserEmail = admin?.get('email') || user?.get('email')
      let tokenUserRole: string | null = null
      
      // Get role from admin record if exists
      if (admin) {
        tokenUserRole = admin.get('role') || null
      }
      
      // If no admin record, try to get role from user record
      if (!tokenUserRole && user) {
        const userRole = user.get('role')
        if (userRole && ['admin', 'manager', 'worker'].includes(userRole)) {
          tokenUserRole = userRole
        }
      }
      
      // Default to 'user' if no role found (but this should not happen after our checks)
      if (!tokenUserRole) {
        tokenUserRole = 'user'
      }
      
      // Check if user has valid admin role (admin, manager, worker)
      const validAdminRoles = ['admin', 'manager', 'worker']
      if (!validAdminRoles.includes(tokenUserRole)) {
        console.warn('⚠️ User does not have valid admin role:', tokenUserRole, googleProfileData.email)
        return sendError(res, 403, 'Bạn không có quyền truy cập vào hệ thống quản trị. Vui lòng liên hệ quản trị viên để được cấp quyền.')
      }

      // Validate required fields
      if (!tokenUserId || !tokenUserEmail) {
        console.error('❌ Missing required fields for token generation:', { tokenUserId, tokenUserEmail })
        return sendError(res, 500, InternalError, new Error('Thiếu thông tin cần thiết để tạo token'))
      }

      // Generate JWT token using admin._id (preferred) or user._id
      const accessToken = jwt.sign(
        { 
          id: tokenUserId,
          email: tokenUserEmail,
          role: tokenUserRole
        },
        settings.jwt.userSecret,
        { expiresIn: settings.jwt.ttl }
      )

      // Prepare user data for response
      const responseUserData = {
        _id: admin?._id || user?._id,
        email: admin?.get('email') || user?.get('email'),
        fullname: admin?.get('fullname') || user?.get('fullname'),
        avatar: admin?.get('avatar') || user?.get('avatar'),
        role: tokenUserRole,
        permissions: admin?.get('permissions') || [],
        provider: 'google',
        googleId: admin?.get('googleId') || user?.get('googleId')
      }

      sendSuccess(res, {
        user: responseUserData,
        accessToken,
        tokenExpireAt: settings.jwt.ttl
      })

    } catch (error: any) {
      console.error('❌ Google login (POST) failed:', error)
      console.error('Error stack:', error.stack)
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        code: error.code
      })
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
      
      // Decode state to get frontend URL
      let stateFrontendUrl: string | undefined
      try {
        if (typeof state === 'string' && state.length > 0) {
          const decoded = JSON.parse(decodeURIComponent(state as string))
          stateFrontendUrl = decoded?.frontendUrl
        }
      } catch {}

      if (!code) {
        const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
        const errorUrl = baseFrontend 
          ? `${baseFrontend}/login?google_error=${encodeURIComponent('Không nhận được mã xác thực từ Google')}` 
          : `/login?google_error=${encodeURIComponent('Không nhận được mã xác thực từ Google')}`
        return res.redirect(errorUrl)
      }
      
      // Backend callback URL (must match the one used in Google OAuth redirect)
      let backendCallbackUrl = process.env.GOOGLE_REDIRECT_URI || settings.google.redirectUri
      
      if (!backendCallbackUrl) {
        // Tự động tạo từ request (fallback)
        const protocol = req.protocol || 'http'
        const host = req.get('host') || 'localhost:3000'
        backendCallbackUrl = `${protocol}://${host}/api/a/auth/google/callback`
      }
      
      // Đảm bảo không có trailing slash
      backendCallbackUrl = backendCallbackUrl.replace(/\/$/, '')
      
      console.log('🔍 Google OAuth callback redirect_uri:', backendCallbackUrl)
      
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
          redirect_uri: backendCallbackUrl
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
      
      // Check if email exists in either collection
      const [existingAdmin, existingUser] = await Promise.all([
        MongoDbAdmins.model.findOne({ email: profile.email }),
        MongoDbUsers.model.findOne({ email: profile.email })
      ])
      
      const emailExists = !!(existingAdmin || existingUser)
      
      // If email exists in either collection, only update - don't create new
      let admin = existingAdmin
      let user = existingUser
      
      if (emailExists) {
        // Check if account is active BEFORE updating
        // Check admin account (if exists)
        if (admin) {
          const adminStatus = admin.get('status');
          const adminIsActive = admin.get('isActive');
          if (adminStatus !== MongoDbAdmins.STATUS_ENUM.ACTIVE || adminIsActive === false) {
            console.warn('⚠️ Admin account is inactive or deactivated:', profile.email);
            const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
            const errorUrl = baseFrontend 
              ? `${baseFrontend}/login?google_error=${encodeURIComponent('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.')}` 
              : `/login?google_error=${encodeURIComponent('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.')}`
            return res.redirect(errorUrl)
          }
        }
        
        // Check user account (if exists)
        if (user) {
          const userStatus = user.get('status');
          if (userStatus !== MongoDbUsers.STATUS_ENUM.ACTIVE) {
            console.warn('⚠️ User account is inactive:', profile.email);
            const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
            const errorUrl = baseFrontend 
              ? `${baseFrontend}/login?google_error=${encodeURIComponent('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.')}` 
              : `/login?google_error=${encodeURIComponent('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.')}`
            return res.redirect(errorUrl)
          }
        }
        
        // Update existing records only (only if account is active)
        if (admin) {
          // Update existing admin - preserve existing data, only update Google-related fields
          // DON'T override isActive or status if they are false/inactive
          admin.set({
            provider: 'google',
            googleId: profile.id,
            verified: true,
            updatedAt: new Date()
          })
          // Only update fullname/avatar if not already set
          if (!admin.get('fullname')) {
            admin.set('fullname', profile.name)
          }
          if (!admin.get('avatar')) {
            admin.set('avatar', profile.picture)
          }
          await admin.save()
        }
        
        if (user) {
          // Update existing user - preserve existing data, only update Google-related fields
          // DON'T override status if it's inactive
          user.set({
            provider: 'google',
            googleId: profile.id,
            updatedAt: new Date()
          })
          // Only update fullname/avatar if not already set
          if (!user.get('fullname')) {
            user.set('fullname', profile.name)
          }
          if (!user.get('avatar')) {
            user.set('avatar', profile.picture)
          }
          await user.save()
        }
      } else {
        // Email doesn't exist in either collection - create new in both
        // Create in admins collection
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
        
        // Create in users collection
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
      
      // Ensure we have at least one user record for token generation
      if (!user && admin) {
        // If admin exists but user doesn't, create user record
        user = await MongoDbUsers.model.create({
          email: profile.email,
          fullname: admin.get('fullname') || profile.name,
          avatar: admin.get('avatar') || profile.picture,
          phoneNumber: `google-${Date.now()}`,
          provider: 'google',
          googleId: profile.id,
          status: MongoDbUsers.STATUS_ENUM.ACTIVE,
          type: 'normal'
        })
      }
      
      if (!admin && user) {
        // If user exists but admin doesn't, check user's role
        // First, check if user has a role field (may have been added manually)
        const userRole = user.get('role')
        const userType = user.get('type') || 'normal'
        let adminRole: string | null = null
        
        // Check if user has a role field with valid admin role
        if (userRole && ['admin', 'manager', 'worker'].includes(userRole)) {
          adminRole = userRole
        } else if (userType === 'normal' || userType === 'customer') {
          // Customer/normal users cannot login to admin portal
          // Redirect directly to login with error message (don't create admin record)
          console.warn('⚠️ User from users collection with customer/normal type cannot login to admin portal:', profile.email)
          const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
          const errorUrl = baseFrontend 
            ? `${baseFrontend}/login?google_error=${encodeURIComponent('Bạn không có quyền truy cập vào hệ thống quản trị. Chỉ admin, manager và worker mới được phép.')}` 
            : `/login?google_error=${encodeURIComponent('Bạn không có quyền truy cập vào hệ thống quản trị. Chỉ admin, manager và worker mới được phép.')}`
          return res.redirect(errorUrl)
        } else {
          // Unknown type, default to 'user' but this shouldn't happen
          adminRole = 'user'
        }
        
        if (!adminRole) {
          console.warn('⚠️ Cannot determine admin role for user:', profile.email)
          const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
          const errorUrl = baseFrontend 
            ? `${baseFrontend}/login?google_error=${encodeURIComponent('Bạn không có quyền truy cập vào hệ thống quản trị. Chỉ admin, manager và worker mới được phép.')}` 
            : `/login?google_error=${encodeURIComponent('Bạn không có quyền truy cập vào hệ thống quản trị. Chỉ admin, manager và worker mới được phép.')}`
          return res.redirect(errorUrl)
        }
        
        // Create admin record with appropriate role
        admin = await MongoDbAdmins.model.create({
          email: profile.email,
          fullname: user.get('fullname') || profile.name,
          avatar: user.get('avatar') || profile.picture,
          provider: 'google',
          googleId: profile.id,
          role: adminRole,
          permissions: [],
          verified: true,
          status: MongoDbAdmins.STATUS_ENUM.ACTIVE,
          isActive: true
        })
      }

      // Check if account is active before allowing login
      // Check admin account (if exists)
      if (admin) {
        const adminStatus = admin.get('status');
        const adminIsActive = admin.get('isActive');
        if (adminStatus !== MongoDbAdmins.STATUS_ENUM.ACTIVE || adminIsActive === false) {
          console.warn('⚠️ Admin account is inactive or deactivated:', profile.email);
          const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
          const errorUrl = baseFrontend 
            ? `${baseFrontend}/login?google_error=${encodeURIComponent('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.')}` 
            : `/login?google_error=${encodeURIComponent('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.')}`
          return res.redirect(errorUrl)
        }
      }
      
      // Check user account (if exists)
      if (user) {
        const userStatus = user.get('status');
        if (userStatus !== MongoDbUsers.STATUS_ENUM.ACTIVE) {
          console.warn('⚠️ User account is inactive:', profile.email);
          const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
          const errorUrl = baseFrontend 
            ? `${baseFrontend}/login?google_error=${encodeURIComponent('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.')}` 
            : `/login?google_error=${encodeURIComponent('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.')}`
          return res.redirect(errorUrl)
        }
      }

      // Determine which user ID and role to use for token generation
      // Prefer admin record if exists (for admin portal), otherwise use user record
      const tokenUserId = admin?._id || user?._id
      const tokenUserEmail = admin?.get('email') || user?.get('email')
      let tokenUserRole: string | null = null
      
      // Get role from admin record if exists
      if (admin) {
        tokenUserRole = admin.get('role') || null
      }
      
      // If no admin record, try to get role from user record
      if (!tokenUserRole && user) {
        const userRole = user.get('role')
        if (userRole && ['admin', 'manager', 'worker'].includes(userRole)) {
          tokenUserRole = userRole
        }
      }
      
      // Check if user has valid admin role (admin, manager, worker)
      const validAdminRoles = ['admin', 'manager', 'worker']
      if (!tokenUserRole || !validAdminRoles.includes(tokenUserRole)) {
        console.warn('⚠️ User does not have valid admin role:', tokenUserRole, profile.email)
        const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
        const errorUrl = baseFrontend 
          ? `${baseFrontend}/login?google_error=${encodeURIComponent('Bạn không có quyền truy cập vào hệ thống quản trị. Chỉ admin, manager và worker mới được phép.')}` 
          : `/login?google_error=${encodeURIComponent('Bạn không có quyền truy cập vào hệ thống quản trị. Chỉ admin, manager và worker mới được phép.')}`
        return res.redirect(errorUrl)
      }

      // Generate JWT token using admin._id (preferred) or user._id
      const accessToken = jwt.sign(
        { 
          id: tokenUserId,
          email: tokenUserEmail,
          role: tokenUserRole
        },
        settings.jwt.userSecret,
        { expiresIn: settings.jwt.ttl }
      )

      // Return success response with token and user data (giống elearning và crm)
      // Frontend callback page sẽ xử lý token
      sendSuccess(res, {
        accessToken,
        tokenExpireAt: settings.jwt.ttl,
        user: {
          _id: admin?._id || user._id,
          id: admin?._id || user._id,
          email: admin?.get('email') || user.get('email'),
          fullname: admin?.get('fullname') || user.get('fullname'),
          name: admin?.get('fullname') || user.get('fullname'),
          username: admin?.get('username') || user.get('username') || user.get('email'),
          role: tokenUserRole,
          avatar: user.get('avatar'),
          verified: admin.get('verified'),
          status: admin.get('status'),
          provider: 'google',
          googleId: user.get('googleId')
        }
      })
      
    } catch (error: any) {
      console.error('❌ Google callback error:', error)
      // Extract state to get frontend URL
      const stateFrontendUrl = req.query.state ? (() => {
        try {
          if (typeof req.query.state === 'string' && req.query.state.length > 0) {
            const decoded = JSON.parse(decodeURIComponent(req.query.state as string))
            return decoded?.frontendUrl
          }
        } catch (e) {}
        return undefined
      })() : undefined
      
      const baseFrontend = (stateFrontendUrl || process.env.FRONTEND_URL || '').replace(/\/$/, '')
      // Redirect to login page with error message (same as Elearning)
      const errorUrl = baseFrontend 
        ? `${baseFrontend}/login?google_error=${encodeURIComponent(error.message || 'Đăng nhập Google thất bại')}` 
        : `/login?google_error=${encodeURIComponent(error.message || 'Đăng nhập Google thất bại')}`
      return res.redirect(errorUrl)
    }
  }
}

