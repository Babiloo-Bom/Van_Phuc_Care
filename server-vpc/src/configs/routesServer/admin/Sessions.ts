import SessionController from '@controllers/api/admin/SessionController';
import GoogleAuthController from '@controllers/api/admin/GoogleAuthController';
import { adminPassport } from '@middlewares/passport';
import { Router } from 'express';

const router = Router();

router.post('/login', SessionController.login);
router.post('/', SessionController.signup);
router.get('/current_admin', adminPassport.authenticate('jwt', { session: false }), SessionController.getCurrentAdmin);
router.patch('/', adminPassport.authenticate('jwt', { session: false }), SessionController.update);
router.patch('/change_password', adminPassport.authenticate('jwt', { session: false }), SessionController.changePassword);
router.post('/forgot_password', SessionController.forgotPassword);
router.post('/verify_otp', SessionController.verifyOtp);
router.post('/verify_email', SessionController.verifyEmail);
router.post('/reset_password', SessionController.resetPassword);

// Google OAuth routes
router.get('/google/login', GoogleAuthController.googleLogin);
router.post('/google/login', GoogleAuthController.googleLogin);
router.get('/google/callback', GoogleAuthController.googleCallback);

export default router;
