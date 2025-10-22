import { Router } from 'express';
import TransactionsController from '@controllers/api/admin/TransactionsController';

const router = Router();
router.get('/', TransactionsController.index);
router.get('/:id', TransactionsController.show);
router.post('/', TransactionsController.create);
router.patch('/:id', TransactionsController.update);
router.delete('/:id', TransactionsController.delete);

export default router;
