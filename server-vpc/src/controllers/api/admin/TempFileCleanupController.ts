import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import tempFileCleanupJob from '@jobs/tempFileCleanupJob';

/**
 * Controller để quản lý temp file cleanup
 */
class TempFileCleanupController {
  /**
   * Trigger cleanup ngay lập tức
   * POST /api/a/temp-file-cleanup/run
   */
  public async runCleanup(req: Request, res: Response) {
    try {
      await tempFileCleanupJob.runNow();
      sendSuccess(res, {
        message: 'Temp file cleanup đã được chạy thành công',
      });
    } catch (error: any) {
      console.error('Run temp file cleanup error:', error);
      sendError(res, 500, error.message || 'Failed to run temp file cleanup', error as Error);
    }
  }
}

export default new TempFileCleanupController();

