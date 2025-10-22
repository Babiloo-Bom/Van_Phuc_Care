import { Router } from 'express';
import ProcessingController from '@controllers/api/user/ProcessingController';

const router = Router();

router.get('/:targetId', ProcessingController.show);

export default router;
