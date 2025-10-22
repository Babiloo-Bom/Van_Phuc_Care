import { Router } from 'express';
import CustomerController from '@controllers/api/admin/CustomerController';

const router = Router();
router.get('/', CustomerController.index);
router.get('/:customerId', CustomerController.show);
router.post('/', CustomerController.create);
router.patch('/:customerId', CustomerController.update);
router.delete('/:customerId', CustomerController.delete);
export default router;
