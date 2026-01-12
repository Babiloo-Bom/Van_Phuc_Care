import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import CloudflareService from '@services/cloudflare';

/**
 * Controller để quản lý Lifecycle Rules cho Cloudflare R2
 */
class R2LifecycleController {
  /**
   * Thiết lập Lifecycle Rule: Tự động xóa incomplete multipart uploads sau 1 ngày
   * POST /api/a/r2-lifecycle/setup
   */
  public static async setupLifecycleRule(req: Request, res: Response) {
    try {
      const days = req.body.days || 1; // Mặc định 1 ngày
      
      if (days < 1 || days > 365) {
        return sendError(res, 400, 'Số ngày phải từ 1 đến 365');
      }

      await CloudflareService.setupLifecycleRule(days);
      
      sendSuccess(res, {
        message: `Lifecycle rule đã được thiết lập: Tự động xóa incomplete multipart uploads sau ${days} ngày`,
        days,
      });
    } catch (error: any) {
      console.error('❌ Setup lifecycle rule error:', error);
      sendError(res, 500, error.message || 'Không thể thiết lập lifecycle rule', error as Error);
    }
  }

  /**
   * Lấy thông tin Lifecycle Rules hiện tại
   * GET /api/a/r2-lifecycle/rules
   */
  public static async getLifecycleRules(req: Request, res: Response) {
    try {
      const rules = await CloudflareService.getLifecycleRules();
      
      if (!rules || !rules.Rules || rules.Rules.length === 0) {
        return sendSuccess(res, {
          message: 'Chưa có lifecycle rules nào được thiết lập',
          rules: [],
        });
      }

      sendSuccess(res, {
        rules: rules.Rules,
        message: 'Lấy thông tin lifecycle rules thành công',
      });
    } catch (error: any) {
      console.error('❌ Get lifecycle rules error:', error);
      sendError(res, 500, error.message || 'Không thể lấy thông tin lifecycle rules', error as Error);
    }
  }
}

export default R2LifecycleController;

