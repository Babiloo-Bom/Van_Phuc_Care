import { Router } from 'express';
import TransactionListController from '@controllers/api/user/TransactionListController';

const router = Router();

router.get('/', TransactionListController.list);

export default router;
