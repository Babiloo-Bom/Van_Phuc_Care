import { Router } from 'express';
import UserController from '@controllers/api/admin/UserController';
import { adminPassport } from '@middlewares/passport';

const router = Router();

// Admin profile endpoint
router.get('/profile', adminPassport.authenticate('jwt', { session: false }), UserController.getProfile);

// Admin course register endpoint
router.put('/course-register', adminPassport.authenticate('jwt', { session: false }), UserController.updateCourseRegister);

export default router;
