import { Router } from 'express'
import GoogleAuthController from '@controllers/api/admin/GoogleAuthController'

const router = Router()

// POST /api/a/auth/google/login
router.post('/login', GoogleAuthController.googleLogin)

export default router

