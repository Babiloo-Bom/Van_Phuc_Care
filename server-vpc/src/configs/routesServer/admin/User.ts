import { Router } from 'express';
import UserController from '@controllers/api/admin/UserController';

const router = Router();

router.get('/', UserController.index);
router.get('/:userId', UserController.show);
router.post('/', UserController.create);
router.patch('/:userId', UserController.update);
router.delete('/:userId', UserController.delete);

export default router;
