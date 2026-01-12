import { Router } from 'express';
import TempFileCleanupController from '@controllers/api/admin/TempFileCleanupController';

const router = Router();

/**
 * @route   POST /api/a/temp-file-cleanup/run
 * @desc    Trigger temp file cleanup ngay lập tức
 * @access  Admin only
 */
router.post('/run', TempFileCleanupController.runCleanup);

export default router;

