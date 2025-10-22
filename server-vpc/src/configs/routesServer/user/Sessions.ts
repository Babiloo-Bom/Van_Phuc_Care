import SessionController from '@controllers/api/user/SessionController';
import { userPassport } from '@middlewares/passport';
import { Router } from 'express';

const router = Router();

router.post('/login', SessionController.create);
router.post('/', SessionController.register);
router.post('/verify_email', SessionController.verifyEmail);
router.post('/send_back_otp', SessionController.sendBackOtp);
router.get('/current_user', userPassport.authenticate('jwt', { session: false }), SessionController.getCurrentUser);
router.patch('/', userPassport.authenticate('jwt', { session: false }), SessionController.update);
router.patch('/change_password', userPassport.authenticate('jwt', { session: false }), SessionController.changePassword);
router.post('/forgot_password', SessionController.forgotPassword);
router.post('/verify_otp', SessionController.verifyOtp);
router.post('/reset_password', SessionController.resetPassword);

export default router;
