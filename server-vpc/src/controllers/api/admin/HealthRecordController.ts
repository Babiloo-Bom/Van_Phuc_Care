import type { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import { MongoDbHealthRecords } from '@mongodb/vanphuccare/health-record';
import MongoDbCustomers from '@mongodb/customers';

class HealthRecordController {
  /**
   * POST /api/a/health-book/records
   * Create new health record
   */
  async create(req: Request, res: Response) {
    try {
      const params = req.body;
      if (!params.customerId) {
        return sendError(res, 400, 'customerId is required');
      }
      if (!params.date) {
        return sendError(res, 400, 'date is required');
      }
      // Validate customer exists
      const customer = await MongoDbCustomers.model.findById(params.customerId);
      if (!customer) {
        return sendError(res, 404, 'Customer not found');
      }
      // Create health record
      const record = await MongoDbHealthRecords.model.create(params);
      sendSuccess(res, { record }, 'Health record created successfully');
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * GET /api/a/health-book/records?customerId=xxx&date=yyyy-mm-dd
   * Get health records by customer/date
   */
  async index(req: Request, res: Response) {
    try {
      const { customerId, date } = req.query;
      const query: any = {};
      if (customerId) query.customerId = customerId;
      if (date) query.date = new Date(date as string);
      const records = await MongoDbHealthRecords.model.find(query).sort({ date: -1 }).lean();
      sendSuccess(res, { records });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default new HealthRecordController();
