import { Router } from 'express'
import GoogleAuthController from '@controllers/api/user/GoogleAuthController'

const router = Router()

// GET /api/u/auth/google - Redirect to Google OAuth
router.get('/', GoogleAuthController.googleLogin)

// POST /api/u/auth/google/login - Handle Google profile
router.post('/login', GoogleAuthController.googleLogin)

// GET /api/u/auth/google/callback - Handle Google OAuth callback
router.get('/callback', GoogleAuthController.googleCallback)

export default router

