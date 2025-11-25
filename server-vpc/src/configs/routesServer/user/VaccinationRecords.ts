import { Router } from 'express';
import UserVaccinationRecordsController from '@controllers/api/user/UserVaccinationRecordsController';

const router = Router();

// GET /api/u/vaccination-records/:customerId
router.get('/:customerId', UserVaccinationRecordsController.getByCustomer);

// POST /api/u/vaccination-records
router.post('/', UserVaccinationRecordsController.create);

// PUT /api/u/vaccination-records/:id
router.put('/:id', UserVaccinationRecordsController.update);

// DELETE /api/u/vaccination-records/:id
router.delete('/:id', UserVaccinationRecordsController.delete);

export default router;
