import { Router } from 'express';
import TestController from '@controllers/api/test/TestController';
import { adminPassport } from '@middlewares/passport';

const router = Router();

// Test endpoint without authentication
router.get('/test', TestController.test);

// Test endpoint with authentication
router.get('/test-auth', adminPassport.authenticate('jwt', { session: false }), TestController.testAuth);

export default router;
