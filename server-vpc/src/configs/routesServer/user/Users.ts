import { Router } from 'express';
import UserController from '@controllers/api/user/UserController';
import { userPassport } from '@middlewares/passport';

const router = Router();

router.get('/profile', userPassport.authenticate('jwt', { session: false }), UserController.getProfile);
router.put('/course-register', userPassport.authenticate('jwt', { session: false }), UserController.updateCourseRegister);
router.get('/:userId', UserController.show);

export default router;
