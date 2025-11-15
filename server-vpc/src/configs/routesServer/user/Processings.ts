import { Router } from 'express';
import ProcessingController from '@controllers/api/user/ProcessingController';
import ProgressController from '@controllers/api/admin/ProgressController';
import { userPassport } from '@middlewares/passport';

const router = Router();

router.get('/:targetId', ProcessingController.show);
router.post('/lesson-completed', userPassport.authenticate('jwt', { session: false }), ProgressController.markLessonCompleted);
export default router;
