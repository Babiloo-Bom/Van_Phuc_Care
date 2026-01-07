import { Router } from 'express';
import CustomerController from '@controllers/api/admin/CustomerController';

const router = Router();

// Statistics endpoint must come before /:customerId to avoid conflicts
router.get('/statistics', CustomerController.statistics);

// CRUD operations
router.get('/', CustomerController.index);
router.get('/:customerId', CustomerController.show);
router.post('/', CustomerController.create);
router.patch('/:customerId', CustomerController.update);
router.delete('/:customerId', CustomerController.delete);

// Toggle customer status (Block/Unblock)
router.patch('/:customerId/status', CustomerController.toggleStatus);

export default router;
