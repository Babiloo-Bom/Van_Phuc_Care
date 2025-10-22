import { Router } from 'express';
import UserController from '@controllers/api/user/UserController';

const router = Router();

router.get('/:userId', UserController.show);

export default router;
