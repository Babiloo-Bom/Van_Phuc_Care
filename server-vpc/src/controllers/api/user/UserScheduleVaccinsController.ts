import { Request, Response } from "express";
import { sendError, sendSuccess } from "@libs/response";
import ScheduleVaccins from "@mongodb/vanphuccare/schedule-vaccin";

class UserScheduleVaccinsController {
  /**
   * Lấy danh sách lịch tiêm cho user (public)
   * GET /api/u/schedule-vaccins
   */
  public async index(req: Request, res: Response) {
    try {
      // Có thể lọc theo độ tuổi, loại vaccine, ... nếu cần
      const { page = 1, limit = 50 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const query: any = { status: "active" };

      const [schedules, total] = await Promise.all([
        ScheduleVaccins.model.find(query).sort({ order: 1, createdAt: 1 }).skip(skip).limit(Number(limit)).lean(),
        ScheduleVaccins.model.countDocuments(query),
      ]);

      return sendSuccess(res, {
        scheduleVaccin: schedules,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error("Error fetching schedule vaccin:", error);
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Seed vaccine schedule data (dev only)
   * POST /api/seed/schedule-vaccins
   */
  public async seed(req: Request, res: Response) {
    try {
      const seedData = [
        {
          name: "Viêm gan B",
          description: "Mũi 1 trong 24h sau sinh",
          age: "0 ngày",
          order: 1,
          status: "active",
        },
        {
          name: "BCG",
          description: "Phòng lao",
          age: "1 tháng",
          order: 2,
          status: "active",
        },
        {
          name: "DPT-VGB-Hib-IPV",
          description: "5 trong 1",
          age: "2 tháng",
          order: 3,
          status: "active",
        },
        {
          name: "DPT-VGB-Hib-IPV",
          description: "5 trong 1",
          age: "3 tháng",
          order: 4,
          status: "active",
        },
        {
          name: "DPT-VGB-Hib-IPV",
          description: "5 trong 1",
          age: "4 tháng",
          order: 5,
          status: "active",
        },
        {
          name: "Quai bị - Sởi - Rubella",
          description: "MMR",
          age: "9 tháng",
          order: 6,
          status: "active",
        },
        {
          name: "Viêm não Nhật Bản",
          description: "Mũi 1",
          age: "12 tháng",
          order: 7,
          status: "active",
        },
        {
          name: "Viêm gan A",
          description: "Mũi 1",
          age: "12 tháng",
          order: 8,
          status: "active",
        },
      ];
      await ScheduleVaccins.model.deleteMany({});
      await ScheduleVaccins.model.insertMany(seedData);
      return sendSuccess(res, { message: "Vaccine schedule seeded successfully!" });
    } catch (err: any) {
      return sendError(res, 500, err.message);
    }
  }
}

export default new UserScheduleVaccinsController();
