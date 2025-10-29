import { Router } from 'express'
import GoogleAuthController from '@controllers/api/admin/GoogleAuthController'

const router = Router()

// GET /api/a/auth/google - Redirect to Google OAuth
router.get('/', GoogleAuthController.googleLogin)

// POST /api/a/auth/google/login - Handle Google profile
router.post('/login', GoogleAuthController.googleLogin)

// GET /api/a/auth/google/callback - Handle Google OAuth callback
router.get('/callback', GoogleAuthController.googleCallback)

export default router

