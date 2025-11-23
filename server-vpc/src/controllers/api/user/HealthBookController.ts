import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import MongoDbHealthBooks from '@mongodb/vanphuccare/health-book';
import MongoDbHealthRecords from '@mongodb/vanphuccare/health-record';
import moment from 'moment';

class HealthBookController {
  /**
   * Get user's healthbooks (all children)
   * GET /api/u/healthbooks
   */
  public async index(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;

      if (!userId) {
        return sendError(res, 401, 'Unauthorized');
      }

      const { page = 1, limit = 20 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const [healthBooks, total] = await Promise.all([
        MongoDbHealthBooks.model
          .find({ userId: userId.toString() })
          .select('-domain -__v')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        MongoDbHealthBooks.model.countDocuments({ userId: userId.toString() }),
      ]);

      return sendSuccess(res, {
        data: healthBooks,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Error fetching healthbooks:', error);
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Get current user's healthbook
   * GET /api/u/healthbooks/me
   */
  public async getCurrentHealthBook(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;

      if (!userId) {
        return sendError(res, 401, 'Unauthorized');
      }

      const healthBook = await MongoDbHealthBooks.model
        .findOne({ userId: userId.toString() })
        .select('-domain -__v')
        .lean();

      // Return 200 with null data if healthbook doesn't exist yet
      // This is a valid state, not an error
      if (!healthBook) {
        return sendSuccess(res, { 
          data: null,
          message: 'Healthbook not created yet'
        });
      }

      return sendSuccess(res, { data: healthBook });
    } catch (error: any) {
      console.error('Error fetching current user healthbook:', error);
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Get healthbook detail by ID
   * GET /api/u/healthbooks/:id
   */
  public async show(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;
      const { id } = req.params;

      if (!userId) {
        return sendError(res, 401, 'Unauthorized');
      }

      const healthBook = await MongoDbHealthBooks.model
        .findOne({
          _id: id,
          userId: userId.toString(),
        })
        .select('-domain -__v')
        .lean();

      if (!healthBook) {
        return sendError(res, 404, 'HealthBook not found');
      }

      return sendSuccess(res, { data: healthBook });
    } catch (error: any) {
      console.error('Error fetching healthbook:', error);
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Get all records for a healthbook
   * GET /api/u/healthbooks/:id/records
   */
  public async getRecords(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;
      const { id } = req.params;
      const { page = 1, limit = 30, startDate, endDate } = req.query;

      if (!userId) {
        return sendError(res, 401, 'Unauthorized');
      }

      // Verify healthbook belongs to user
      const healthBook = await MongoDbHealthBooks.model.findOne({
        _id: id,
        userId: userId.toString(),
      });

      if (!healthBook) {
        return sendError(res, 404, 'HealthBook not found');
      }

      const skip = (Number(page) - 1) * Number(limit);
      const query: any = { healthBookId: id };

      // Filter by date range if provided
      if (startDate || endDate) {
        query.date = {};
        if (startDate) {
          query.date.$gte = new Date(startDate as string);
        }
        if (endDate) {
          query.date.$lte = new Date(endDate as string);
        }
      }

      const [records, total] = await Promise.all([
        MongoDbHealthRecords.model
          .find(query)
          .sort({ date: -1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        MongoDbHealthRecords.model.countDocuments(query),
      ]);

      return sendSuccess(res, {
        data: records,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Error fetching health records:', error);
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Get record by date
   * GET /api/u/healthbooks/:id/records?date=YYYY-MM-DD
   */
  public async getRecordByDate(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;
      const { id } = req.params;
      const { date } = req.query;

      if (!userId) {
        return sendError(res, 401, 'Unauthorized');
      }

      if (!date) {
        return sendError(res, 400, 'Date parameter is required');
      }

      // Handle 'me' parameter for healthbook ID
      let healthBook;
      if (id === 'me') {
        healthBook = await MongoDbHealthBooks.model.findOne({
          userId: userId.toString(),
        });
      } else {
        healthBook = await MongoDbHealthBooks.model.findOne({
          _id: id,
          userId: userId.toString(),
        });
      }

      if (!healthBook) {
        return sendError(res, 404, 'HealthBook not found');
      }

      // Parse date (format: YYYY-MM-DD)
      const recordDate = moment(date as string, 'YYYY-MM-DD').startOf('day').toDate();

      const record = await MongoDbHealthRecords.model
        .findOne({
          healthBookId: healthBook._id,
          date: recordDate,
        })
        .lean();

      return sendSuccess(res, { data: record || null });
    } catch (error: any) {
      console.error('Error fetching health record:', error);
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Create or update health record (upsert by date)
   * POST /api/u/healthbooks/:id/records
   */
  public async upsertRecord(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;
      const { id } = req.params;
      const {
        date,
        temperature,
        height,
        weight,
        skinCondition,
        oralHealth,
        nutrition,
        sleep,
        stoolFrequency,
        stoolCondition,
        digestiveIssues,
        method,
        motorSkills,
        vaccination,
        notes,
        healthStatus,
      } = req.body;

      if (!userId) {
        return sendError(res, 401, 'Unauthorized');
      }

      if (!date) {
        return sendError(res, 400, 'Date is required');
      }

      // Verify healthbook belongs to user
      const healthBook: any = await MongoDbHealthBooks.model.findOne({
        _id: id,
        userId: userId.toString(),
      });

      if (!healthBook) {
        return sendError(res, 404, 'HealthBook not found');
      }

      // Parse date
      const recordDate = moment(date, 'YYYY-MM-DD').startOf('day').toDate();

      // Prepare record data
      const recordData: any = {
        userId: userId.toString(),
        healthBookId: id,
        customerId: healthBook.customerId,
        date: recordDate,
      };

      // Add optional fields if provided
      if (temperature !== undefined) recordData.temperature = temperature;
      if (height !== undefined) recordData.height = height;
      if (weight !== undefined) recordData.weight = weight;
      if (skinCondition !== undefined) recordData.skinCondition = skinCondition;
      if (oralHealth !== undefined) recordData.oralHealth = oralHealth;
      if (nutrition !== undefined) recordData.nutrition = nutrition;
      if (sleep !== undefined) recordData.sleep = sleep;
      if (stoolFrequency !== undefined) recordData.stoolFrequency = stoolFrequency;
      if (stoolCondition !== undefined) recordData.stoolCondition = stoolCondition;
      if (digestiveIssues !== undefined) recordData.digestiveIssues = digestiveIssues;
      if (method !== undefined) recordData.method = method;
      if (motorSkills !== undefined) recordData.motorSkills = motorSkills;
      if (vaccination !== undefined) recordData.vaccination = vaccination;
      if (notes !== undefined) recordData.notes = notes;
      if (healthStatus !== undefined) recordData.healthStatus = healthStatus;

      // Upsert: update if exists, create if not
      const record = await MongoDbHealthRecords.model.findOneAndUpdate(
        {
          healthBookId: id,
          date: recordDate,
        },
        { $set: recordData },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      return sendSuccess(res, {
        message: 'Lưu dữ liệu sức khỏe thành công',
        data: record,
      });
    } catch (error: any) {
      console.error('Error upserting health record:', error);
      
      // Handle unique constraint violation
      if (error.code === 11000) {
        return sendError(res, 400, 'Đã có bản ghi cho ngày này');
      }
      
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Delete health record
   * DELETE /api/u/healthbooks/:id/records/:recordId
   */
  public async deleteRecord(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;
      const { id, recordId } = req.params;

      if (!userId) {
        return sendError(res, 401, 'Unauthorized');
      }

      // Verify healthbook belongs to user
      const healthBook = await MongoDbHealthBooks.model.findOne({
        _id: id,
        userId: userId.toString(),
      });

      if (!healthBook) {
        return sendError(res, 404, 'HealthBook not found');
      }

      // Delete record
      const result = await MongoDbHealthRecords.model.deleteOne({
        _id: recordId,
        healthBookId: id,
      });

      if (result.deletedCount === 0) {
        return sendError(res, 404, 'Record not found');
      }

      return sendSuccess(res, {
        message: 'Xóa bản ghi thành công',
      });
    } catch (error: any) {
      console.error('Error deleting health record:', error);
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Create new healthbook for current user
   * POST /api/u/healthbooks
   */
  public async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;

      if (!userId) {
        return sendError(res, 401, 'Unauthorized');
      }

      const { name, dob, gender, avatar } = req.body;

      // Validate required fields
      if (!name || !dob || !gender) {
        return sendError(res, 400, 'Họ tên, ngày sinh và giới tính là bắt buộc');
      }

      // Check if user already has a healthbook
      const existingHealthBook = await MongoDbHealthBooks.model.findOne({
        userId: userId.toString(),
      });

      if (existingHealthBook) {
        return sendError(res, 409, 'Bạn đã có hồ sơ sức khỏe rồi');
      }

      // Create new healthbook
      const healthBook = await MongoDbHealthBooks.model.create({
        userId: userId.toString(),
        name,
        dob,
        gender,
        avatar: avatar || '',
      });

      return sendSuccess(res, {
        data: healthBook,
        message: 'Tạo hồ sơ thành công',
      });
    } catch (error: any) {
      console.error('Error creating healthbook:', error);
      return sendError(res, 500, error.message);
    }
  }
}

export default new HealthBookController();
