import { Router } from 'express';
import HealthBookController from '@controllers/api/user/HealthBookController';
import { userPassport } from '@middlewares/passport';

const router = Router();

// All routes require authentication
const auth = userPassport.authenticate('jwt', { session: false });

// Get user's healthbooks
router.get('/', auth, HealthBookController.index);

// Create new healthbook
router.post('/', auth, HealthBookController.create);

// Get current user's healthbook (must be before /:id to match first)
router.get('/me', auth, HealthBookController.getCurrentHealthBook);

// Get healthbook detail by ID
router.get('/:id', auth, HealthBookController.show);

// Get all records for a healthbook (also handles date query param)
router.get('/:id/records', auth, (req, res) => {
  // If date query param exists, route to getRecordByDate
  if (req.query.date) {
    return HealthBookController.getRecordByDate(req, res);
  }
  return HealthBookController.getRecords(req, res);
});

// Create or update record (upsert by date)
router.post('/:id/records', auth, HealthBookController.upsertRecord);

// Delete record
router.delete('/:id/records/:recordId', auth, HealthBookController.deleteRecord);

export default router;
