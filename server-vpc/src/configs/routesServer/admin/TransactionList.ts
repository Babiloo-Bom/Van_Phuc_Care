import { Router } from 'express';
import TransactionListController from '@controllers/api/admin/TransactionListController';

const router = Router();

router.get('/', TransactionListController.list);

export default router;
