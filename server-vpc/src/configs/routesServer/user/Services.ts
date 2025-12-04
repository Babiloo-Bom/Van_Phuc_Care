import { Router } from 'express';
import ServiceController from '@controllers/api/user/ServiceController';
import { userPassport } from '@middlewares/passport';

const router = Router();

// Get all active services (requires auth)
router.get('/', userPassport.authenticate('jwt', { session: false }), ServiceController.index);

// Get user's registered services (requires auth) - MUST be before /:id
router.get('/my-services', userPassport.authenticate('jwt', { session: false }), ServiceController.myServices);

// Register for a service (requires auth) - MUST be before /:id
router.post('/register', userPassport.authenticate('jwt', { session: false }), ServiceController.register);

// Get service detail by slug or ID (public)
router.get('/:id', ServiceController.show);

export default router;
