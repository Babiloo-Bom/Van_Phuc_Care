import { Router } from 'express';
import { adminPassport } from '@middlewares/passport';
import R2LifecycleController from '@controllers/api/admin/R2LifecycleController';

const router = Router();

// Tất cả routes đều yêu cầu admin authentication
router.use(adminPassport.authenticate('jwt', { session: false }));

// Setup lifecycle rule
router.post('/setup', R2LifecycleController.setupLifecycleRule);

// Get current lifecycle rules
router.get('/rules', R2LifecycleController.getLifecycleRules);

export default router;

