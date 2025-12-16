import { Router } from 'express';
import ProcessingController from '@controllers/api/user/ProcessingController';
import ProgressController from '@controllers/api/admin/ProgressController';
import { userPassport } from '@middlewares/passport';

const router = Router();

// Đánh dấu hoàn thành bài học (tiến trình chi tiết)
router.post(
  '/lesson-completed',
  userPassport.authenticate('jwt', { session: false }),
  ProgressController.markLessonCompleted
);

// Reset toàn bộ tiến trình một khóa học cho user hiện tại
router.delete(
  '/course/:courseId',
  userPassport.authenticate('jwt', { session: false }),
  ProgressController.resetProgress
);

// Các API xử lý Processing cũ
router.get('/:targetId', ProcessingController.show);

export default router;
