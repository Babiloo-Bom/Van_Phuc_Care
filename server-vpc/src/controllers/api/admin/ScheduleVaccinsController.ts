import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import ScheduleVaccins from '@mongodb/vanphuccare/schedule-vaccin';

class ScheduleVaccinsController {
  // Lấy danh sách schedule vaccin với phân trang
  public async index(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '10');
      const offset = (page - 1) * limit;
      
      // Nếu muốn thêm bộ lọc theo domain, bạn có thể bổ sung ở đây
      const query = {}; 

      const [schedules, total] = await Promise.all([
        ScheduleVaccins.model.find(query)
          .skip(offset)
          .limit(limit)
          .lean(),
        ScheduleVaccins.model.countDocuments(query)
      ]);

      // Trả về dữ liệu với key scheduleVaccin và pagination
      sendSuccess(res, { 
        scheduleVaccin: schedules, 
        pagination: { total, page, limit } 
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  // Lấy chi tiết 1 schedule vaccin theo id
  public async show(req: Request, res: Response) {
    try {
      const schedule = await ScheduleVaccins.model.findById(req.params.id).lean();
      if (!schedule) {
        return sendError(res, 404, 'Not found');
      }
      sendSuccess(res, { schedule });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  // Cập nhật 1 schedule vaccin theo id
  public async update(req: Request, res: Response) {
    try {
      const updated = await ScheduleVaccins.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).lean();
      if (!updated) {
        return sendError(res, 404, 'Not found');
      }
      sendSuccess(res, { schedule: updated });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  // Tạo mới 1 schedule vaccin (nếu cần)
  public async create(req: Request, res: Response) {
    try {
      const newSchedule = await ScheduleVaccins.model.create(req.body);
      sendSuccess(res, { schedule: newSchedule });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ScheduleVaccinsController();
