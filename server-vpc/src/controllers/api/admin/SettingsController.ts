import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import SettingsDb from '@mongodb/settings';

const VAT_KEY = 'elearning_vat_percent';
const DEFAULT_VAT = 8;

export default class SettingsController {
  /**
   * GET /api/a/settings - Lấy tất cả settings (admin)
   */
  public static async getAll(req: Request, res: Response) {
    try {
      const list = await SettingsDb.model.find({}).lean();
      const map: Record<string, any> = {};
      (list as any[]).forEach((s: any) => {
        map[s.key] = s.value;
      });
      return sendSuccess(res, { settings: map, list });
    } catch (e: any) {
      return sendError(res, 500, e.message, e);
    }
  }

  /**
   * GET /api/a/settings/:key - Lấy một setting theo key
   */
  public static async getByKey(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const doc = await SettingsDb.model.findOne({ key }).lean();
      if (!doc) {
        if (key === VAT_KEY) {
          return sendSuccess(res, { key: VAT_KEY, value: DEFAULT_VAT });
        }
        return sendError(res, 404, 'Setting not found');
      }
      return sendSuccess(res, { key: (doc as any).key, value: (doc as any).value });
    } catch (e: any) {
      return sendError(res, 500, e.message, e);
    }
  }

  /**
   * PUT /api/a/settings/:key - Cập nhật setting (upsert)
   */
  public static async setByKey(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const { value } = req.body;
      if (value === undefined) {
        return sendError(res, 400, 'value is required');
      }
      const doc = await SettingsDb.model.findOneAndUpdate(
        { key },
        { $set: { value, updatedAt: new Date() } },
        { new: true, upsert: true }
      );
      return sendSuccess(res, { key: (doc as any).key, value: (doc as any).value });
    } catch (e: any) {
      return sendError(res, 500, e.message, e);
    }
  }
}
