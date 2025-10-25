import SessionController from '@controllers/api/admin/SessionController';
import { adminPassport } from '@middlewares/passport';
import { Router } from 'express';

const router = Router();
const sessionController = new SessionController();

router.post('/login', sessionController.login.bind(sessionController));
router.post('/', sessionController.signup.bind(sessionController));
router.get('/current_admin', adminPassport.authenticate('jwt', { session: false }), sessionController.getCurrentAdmin.bind(sessionController));
router.patch('/', adminPassport.authenticate('jwt', { session: false }), sessionController.update.bind(sessionController));
router.patch('/change_password', adminPassport.authenticate('jwt', { session: false }), sessionController.changePassword.bind(sessionController));
router.post('/forgot_password', sessionController.forgotPassword.bind(sessionController));
router.post('/verify_otp', sessionController.verifyOtp.bind(sessionController));
router.post('/verify_email', sessionController.verifyEmail.bind(sessionController));
router.post('/reset_password', sessionController.resetPassword.bind(sessionController));

export default router;
