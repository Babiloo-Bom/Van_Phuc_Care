import { Router } from 'express';
import ServiceController from '@controllers/api/user/ServiceController';
import { userPassport } from '@middlewares/passport';

const router = Router();

// Get all active services (public)
router.get('/', ServiceController.index);

// Get user's registered services (requires auth) - MUST be before /:id
router.get('/my-services', userPassport.authenticate('jwt', { session: false }), ServiceController.myServices);

// Get service detail by slug or ID (public)
router.get('/:id', ServiceController.show);

export default router;
