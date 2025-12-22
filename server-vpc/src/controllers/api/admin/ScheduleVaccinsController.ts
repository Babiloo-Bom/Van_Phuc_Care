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
      const searchKey = req.query.searchKey as string;
      
      // Build query với domain filter
      const query: any = {
        domain: req.currentAdmin.domain
      };

      // Thêm search nếu có
      if (searchKey) {
        query.$or = [
          { title: { $regex: searchKey, $options: 'i' } },
          { content: { $regex: searchKey, $options: 'i' } },
          { time: { $regex: searchKey, $options: 'i' } }
        ];
      }

      const [schedules, total] = await Promise.all([
        ScheduleVaccins.model.find(query)
          .skip(offset)
          .limit(limit)
          .sort({ createdAt: -1 })
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
      const schedule = await ScheduleVaccins.model.findOne({
        _id: req.params.id,
        domain: req.currentAdmin.domain
      }).lean();
      if (!schedule) {
        return sendError(res, 404, 'Not found');
      }
      sendSuccess(res, { schedule });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  // Tạo mới 1 schedule vaccin
  public async create(req: Request, res: Response) {
    try {
      const data = {
        ...req.body,
        domain: req.currentAdmin.domain
      };
      // Đồng bộ name với title để CRM dùng name vẫn thấy giá trị mới
      data.name = data.title || data.name;
      // Bỏ trường address nếu có
      if (data.address) {
        delete data.address;
      }
      const newSchedule = await ScheduleVaccins.model.create(data);
      sendSuccess(res, { schedule: newSchedule });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  // Cập nhật 1 schedule vaccin theo id
  public async update(req: Request, res: Response) {
    try {
      const data = { ...req.body };
      // Đồng bộ name với title để CRM dùng name vẫn thấy giá trị mới
      if (data.title) {
        data.name = data.title;
      }
      // Bỏ trường address nếu có
      if (data.address) {
        delete data.address;
      }
      const updated = await ScheduleVaccins.model.findOneAndUpdate(
        {
          _id: req.params.id,
          domain: req.currentAdmin.domain
        },
        data,
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

  // Xóa 1 schedule vaccin theo id
  public async delete(req: Request, res: Response) {
    try {
      const deleted = await ScheduleVaccins.model.findOneAndDelete({
        _id: req.params.id,
        domain: req.currentAdmin.domain
      });
      if (!deleted) {
        return sendError(res, 404, 'Not found');
      }
      sendSuccess(res, { message: 'Deleted successfully' });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ScheduleVaccinsController();
