import { Router } from 'express';
import TransactionController from '@controllers/api/user/TransactionController';

const router = Router();

router.post('/', TransactionController.create);

export default router;
