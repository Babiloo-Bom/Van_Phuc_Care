import { Request, Response } from "express";
import { sendError, sendSuccess } from "@libs/response";
import ScheduleVaccins from "@mongodb/vanphuccare/schedule-vaccin";
import VaccinationRecords from "@mongodb/vanphuccare/vaccination-record";

class UserScheduleVaccinsController {
  /**
   * Lấy danh sách lịch tiêm cho user (public hoặc có customerId)
   * GET /api/u/schedule-vaccins hoặc /api/u/schedule-vaccins?customerId=xxx
   */
  public async index(req: Request, res: Response) {
    try {
      const { page = 1, limit = 50, customerId, ageInMonths } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const query: any = { status: "active" };

      // Filter by age if provided
      if (ageInMonths !== undefined) {
        query.ageInMonths = { $lte: Number(ageInMonths) };
      }

      const [schedules, total] = await Promise.all([
        ScheduleVaccins.model.find(query).sort({ order: 1, createdAt: 1 }).skip(skip).limit(Number(limit)).lean(),
        ScheduleVaccins.model.countDocuments(query),
      ]);

      // If customerId is provided, merge with vaccination records
      if (customerId) {
        const vaccinationRecords = await VaccinationRecords.model
          .find({ customerId: String(customerId) })
          .lean();

        // Create a map of vaccineId -> record
        const recordsMap = new Map();
        vaccinationRecords.forEach((record: any) => {
          const key = `${record.vaccineId}_${record.injectionNumber || 1}`;
          recordsMap.set(key, record);
        });

        // Merge schedule with records
        const mergedSchedules = schedules.map((schedule: any) => {
          const key = `${schedule._id}_1`; // Default injection number 1
          const record = recordsMap.get(key);

          return {
            ...schedule,
            vaccinationRecord: record || null,
            injectionStatus: record ? record.status : "pending",
            injectionDate: record ? record.injectionDate : null,
            scheduledDate: record ? record.scheduledDate : null,
            location: record ? record.location : null,
            notes: record ? record.notes : null,
          };
        });

        return sendSuccess(res, {
          scheduleVaccin: mergedSchedules,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
          },
        });
      }

      // Return schedules only (no customer-specific data)
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
          name: "BCG – Vắc xin Lao liều sơ sinh",
          description: "Vaccine phòng bệnh lao (Tuberculosis). Thường tiêm trong 24 giờ đầu sau sinh hoặc trong tháng đầu tiên.",
          age: "0 ngày",
          ageInMonths: 0,
          order: 1,
          status: "active",
          thumbnail: "/images/vaccines/bcg.png",
          numberOfInjections: "1",
          category: "Vaccine bắt buộc",
        },
        {
          name: "Viêm gan B – Mũi 1",
          description: "Mũi 1 vaccine phòng viêm gan B. Tiêm trong 24h sau sinh để bảo vệ gan khỏi virus viêm gan B.",
          age: "0 ngày", 
          ageInMonths: 0,
          order: 2,
          status: "active",
          thumbnail: "/images/vaccines/hepatitis-b.png",
          numberOfInjections: "1",
          category: "Vaccine bắt buộc",
        },
        {
          name: "Heberbiovac, Gene-HBvax, Euvax B – Vắc xin Viêm gan B liều sơ sinh",
          description: "Vaccine phòng viêm gan B cho trẻ sơ sinh. Mũi tiêm đầu tiên trong chuỗi 3 mũi.",
          age: "1 tháng",
          ageInMonths: 1,
          order: 3,
          status: "active",
          thumbnail: "/images/vaccines/hepatitis-b-1m.png",
          numberOfInjections: "2",
          category: "Vaccine bắt buộc",
        },
        {
          name: "Quinvaxem, Hexaxim – Vắc xin 5 trong 1 hoặc 6 trong 1",
          description: "Vaccine phòng bạch hầu, ho gà, uốn ván, viêm gan B, Hib. Mũi 1.",
          age: "2 tháng",
          ageInMonths: 2,
          order: 4,
          status: "active",
          thumbnail: "/images/vaccines/quinvaxem-2m.png",
          numberOfInjections: "1",
          category: "Vaccine bắt buộc",
        },
        {
          name: "Synflorix, Prevenar 13 – Vắc xin phòng phế cầu",
          description: "Vaccine phòng bệnh do phế cầu khuẩn gây ra như viêm phổi, viêm tai giữa, viêm màng não.",
          age: "2 tháng",
          ageInMonths: 2,
          order: 5,
          status: "active",
          thumbnail: "/images/vaccines/pneumococcal-2m.png",
          numberOfInjections: "1",
          category: "Vaccine mở rộng",
        },
        {
          name: "Rotarix, RotaTeq – Vắc xin phòng tiêu chảy Rota",
          description: "Vaccine uống phòng virus Rota gây tiêu chảy cấp ở trẻ nhỏ. Mũi 1.",
          age: "2 tháng",
          ageInMonths: 2,
          order: 6,
          status: "active",
          thumbnail: "/images/vaccines/rotavirus-2m.png",
          numberOfInjections: "1",
          category: "Vaccine mở rộng",
        },
        {
          name: "Quinvaxem, Hexaxim – Vắc xin 5 trong 1 hoặc 6 trong 1",
          description: "Vaccine phòng bạch hầu, ho gà, uốn ván, viêm gan B, Hib. Mũi 2.",
          age: "3 tháng",
          ageInMonths: 3,
          order: 7,
          status: "active",
          thumbnail: "/images/vaccines/quinvaxem-3m.png",
          numberOfInjections: "2",
          category: "Vaccine bắt buộc",
        },
        {
          name: "Synflorix, Prevenar 13 – Vắc xin phòng phế cầu",
          description: "Vaccine phòng bệnh do phế cầu khuẩn. Mũi 2.",
          age: "3 tháng",
          ageInMonths: 3,
          order: 8,
          status: "active",
          thumbnail: "/images/vaccines/pneumococcal-3m.png",
          numberOfInjections: "2",
          category: "Vaccine mở rộng",
        },
        {
          name: "Rotarix, RotaTeq – Vắc xin phòng tiêu chảy Rota",
          description: "Vaccine uống phòng virus Rota. Mũi 2.",
          age: "3 tháng",
          ageInMonths: 3,
          order: 9,
          status: "active",
          thumbnail: "/images/vaccines/rotavirus-3m.png",
          numberOfInjections: "2",
          category: "Vaccine mở rộng",
        },
        {
          name: "Quinvaxem, Hexaxim – Vắc xin 5 trong 1 hoặc 6 trong 1",
          description: "Vaccine phòng bạch hầu, ho gà, uốn ván, viêm gan B, Hib. Mũi 3.",
          age: "4 tháng",
          ageInMonths: 4,
          order: 10,
          status: "active",
          thumbnail: "/images/vaccines/quinvaxem-4m.png",
          numberOfInjections: "3",
          category: "Vaccine bắt buộc",
        },
        {
          name: "Synflorix, Prevenar 13 – Vắc xin phòng phế cầu",
          description: "Vaccine phòng bệnh do phế cầu khuẩn. Mũi 3.",
          age: "4 tháng",
          ageInMonths: 4,
          order: 11,
          status: "active",
          thumbnail: "/images/vaccines/pneumococcal-4m.png",
          numberOfInjections: "3",
          category: "Vaccine mở rộng",
        },
        {
          name: "MMR, Priorix – Vắc xin phòng Sởi - Quai bị - Rubella",
          description: "Vaccine phòng sởi, quai bị và rubella. Mũi 1.",
          age: "9 tháng",
          ageInMonths: 9,
          order: 12,
          status: "active",
          thumbnail: "/images/vaccines/mmr-9m.png",
          numberOfInjections: "1",
          category: "Vaccine bắt buộc",
        },
        {
          name: "Imojev, Jevax – Vắc xin phòng Viêm não Nhật Bản",
          description: "Vaccine phòng bệnh viêm não do virus Nhật Bản. Mũi 1.",
          age: "12 tháng",
          ageInMonths: 12,
          order: 13,
          status: "active",
          thumbnail: "/images/vaccines/japanese-encephalitis.png",
          numberOfInjections: "1",
          category: "Vaccine bắt buộc",
        },
        {
          name: "Havax, Avaxim – Vắc xin phòng Viêm gan A",
          description: "Vaccine phòng viêm gan A, bệnh lây qua đường ăn uống. Mũi 1.",
          age: "12 tháng",
          ageInMonths: 12,
          order: 14,
          status: "active",
          thumbnail: "/images/vaccines/hepatitis-a.png",
          numberOfInjections: "1",
          category: "Vaccine mở rộng",
        },
        {
          name: "Varilrix, Varivax – Vắc xin phòng Thủy đậu",
          description: "Vaccine phòng bệnh thủy đậu (chickenpox). Mũi 1.",
          age: "12 tháng",
          ageInMonths: 12,
          order: 15,
          status: "active",
          thumbnail: "/images/vaccines/varicella.png",
          numberOfInjections: "1",
          category: "Vaccine mở rộng",
        },
        {
          name: "MMR, Priorix – Vắc xin phòng Sởi - Quai bị - Rubella",
          description: "Vaccine phòng sởi, quai bị và rubella. Mũi 2 (Nhắc lại).",
          age: "18 tháng",
          ageInMonths: 18,
          order: 16,
          status: "active",
          thumbnail: "/images/vaccines/mmr-18m.png",
          numberOfInjections: "2",
          category: "Vaccine bắt buộc",
        },
        {
          name: "Havax, Avaxim – Vắc xin phòng Viêm gan A",
          description: "Vaccine phòng viêm gan A. Mũi 2 (Nhắc lại sau 6-12 tháng).",
          age: "18 tháng",
          ageInMonths: 18,
          order: 17,
          status: "active",
          thumbnail: "/images/vaccines/hepatitis-a-18m.png",
          numberOfInjections: "2",
          category: "Vaccine mở rộng",
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
