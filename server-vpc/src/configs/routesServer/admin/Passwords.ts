import PasswordController from '@controllers/api/admin/PasswordController';
import { Router } from 'express';

const router = Router();

// Password management routes
router.post('/forgot_password', PasswordController.forgotPassword);
router.post('/reset', PasswordController.resetPassword);

export default router;
