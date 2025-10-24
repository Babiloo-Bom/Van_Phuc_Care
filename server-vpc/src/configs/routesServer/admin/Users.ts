/**
 * User Routes
 * API routes for user management
 */

import UserController from '@controllers/api/admin/UserController'
import { adminPassport } from '@middlewares/passport'
import { Router } from 'express'

const router = Router()

// Get all users
router.get('/', adminPassport.authenticate('jwt', { session: false }), UserController.getAllUsers)

// Get user statistics
router.get('/stats', adminPassport.authenticate('jwt', { session: false }), UserController.getUserStats)

// Create user
router.post('/', adminPassport.authenticate('jwt', { session: false }), UserController.createUser)

// Update user
router.put('/:id', adminPassport.authenticate('jwt', { session: false }), UserController.updateUser)

// Delete user
router.delete('/:id', adminPassport.authenticate('jwt', { session: false }), UserController.deleteUser)

// Toggle user status
router.patch('/:id/status', adminPassport.authenticate('jwt', { session: false }), UserController.toggleUserStatus)

export default router
