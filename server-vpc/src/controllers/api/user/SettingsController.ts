import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import SettingsDb from '@mongodb/settings';

const VAT_KEY = 'elearning_vat_percent';
const DEFAULT_VAT = 8;

/**
 * GET /api/u/settings/elearning-public - Cấu hình public cho EDU (VAT %, ...) - không cần auth
 */
export async function getElearningPublic(req: Request, res: Response) {
  try {
    const doc = await SettingsDb.model.findOne({ key: VAT_KEY }).lean();
    const vatPercent = doc ? (doc as any).value : DEFAULT_VAT;
    const num = Number(vatPercent);
    const vatPercentSafe = Number.isFinite(num) && num >= 0 && num <= 100 ? num : DEFAULT_VAT;
    return sendSuccess(res, { vatPercent: vatPercentSafe });
  } catch (e: any) {
    return sendError(res, 500, e.message, e);
  }
}
