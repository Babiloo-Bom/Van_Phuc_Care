import { Request, Response } from "express";
import { sendError, sendSuccess } from "@libs/response";
import ScheduleVaccins from "@mongodb/vanphuccare/schedule-vaccin";
import VaccinationRecords from "@mongodb/vanphuccare/vaccination-record";

// Helper function to parse age string to months
function parseAgeInMonths(ageString: string): number {
  if (!ageString) return 0;
  
  const ageStr = ageString.toLowerCase().trim();
  
  // Map Vietnamese age strings to months
  const ageMap: Record<string, number> = {
    'sơ sinh': 0,
    '0 ngày': 0,
    '1 tháng': 1,  // Thêm format của seed data
    '2 tháng': 2,
    '3 tháng': 3,
    '4 tháng': 4,
    '9 tháng': 9,
    '12 tháng': 12,
    '18 tháng': 18,
    '1 tháng tuổi': 1,  // Giữ format của admin panel
    '2 tháng tuổi': 2,
    '3 tháng tuổi': 3,
    '4 tháng tuổi': 4,
    '5 tháng tuổi': 5,
    '6 tháng tuổi': 6,
    '9 tháng tuổi': 9,
    '12 tháng tuổi': 12,
    '18 tháng tuổi': 18,
    '24 tháng tuổi': 24,
  };
  
  // Check exact match first
  if (ageMap[ageStr]) {
    return ageMap[ageStr];
  }
  
  // Try to extract number from string like "1 tháng", "2 tháng tuổi", etc.
  const match = ageStr.match(/(\d+)\s*tháng/);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  // Try to extract from range like "0-2 tháng tuổi"
  const rangeMatch = ageStr.match(/(\d+)\s*-\s*(\d+)\s*tháng/);
  if (rangeMatch) {
    // Use the lower bound
    return parseInt(rangeMatch[1], 10);
  }
  
  return 0;
}

class UserScheduleVaccinsController {
  /**
   * Lấy danh sách lịch tiêm cho user
   * GET /api/u/schedule-vaccins
   * Query params:
   *   - healthBookId: ID của sổ sức khỏe (bắt buộc nếu muốn lấy lịch tiêm cụ thể của bé)
   *   - customerId: ID của customer (optional, dùng để backup)
   *   - ageInMonths: Lọc theo độ tuổi
   */
  public async index(req: Request, res: Response) {
    try {
      const { page = 1, limit = 50, customerId, healthBookId, ageInMonths } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      
      // Build query - get all schedules (no domain filter for user-facing API)
      const query: any = {};
      
      // Only exclude inactive status
      query.status = { $ne: "inactive" };

      console.log('🔍 UserScheduleVaccinsController.index query:', JSON.stringify(query, null, 2));
      console.log('🔍 Query params:', { page, limit, customerId, healthBookId, ageInMonths });

      // Sort: items with order first (ascending), then items without order (by createdAt desc)
      const [schedules, total] = await Promise.all([
        ScheduleVaccins.model.find(query)
          .sort({ 
            order: 1,  // Sort by order if exists
            createdAt: -1  // Then by newest first for items without order
          })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        ScheduleVaccins.model.countDocuments(query),
      ]) as [any[], number];

      console.log('🔍 Found schedules:', schedules.length, 'Total:', total);
      
      // Log all schedules with full details
      console.log('🔍 All schedules details:', schedules.map((s: any) => ({
        _id: String(s._id),
        title: s.title,
        name: s.name,
        time: s.time,
        age: s.age,
        status: s.status,
        domain: s.domain,
        ageInMonths: s.ageInMonths,
        order: s.order,
        createdAt: s.createdAt,
        hasTitle: !!s.title,
        hasName: !!s.name,
        hasOrder: s.order !== undefined && s.order !== null
      })));
      
      console.log('🔍 Sample schedule (full):', schedules[0] ? JSON.stringify(schedules[0], null, 2) : 'No schedules');

      // Normalize data: map title -> name, time -> age, and calculate ageInMonths if missing
      const normalizedSchedules = schedules.map((schedule: any) => {
        // Map title to name (prefer latest title so CRM always sees updated text)
        const name = schedule.title || schedule.name || '';
        
        // Map time to age (for backward compatibility)
        const age = schedule.age || schedule.time || '';
        
        // Calculate ageInMonths from time if not present
        let ageInMonthsValue = schedule.ageInMonths;
        if (ageInMonthsValue === undefined || ageInMonthsValue === null) {
          // Try to extract from time string
          if (schedule.time) {
            ageInMonthsValue = parseAgeInMonths(schedule.time);
          } else if (schedule.age) {
            ageInMonthsValue = parseAgeInMonths(schedule.age);
          } else {
            ageInMonthsValue = 0;
          }
        }
        
        return {
          ...schedule,
          name, // Ensure name exists, prefer title
          age,  // Ensure age exists
          ageInMonths: ageInMonthsValue, // Ensure ageInMonths exists
          // Keep original fields for backward compatibility
          title: schedule.title || name,
          time: schedule.time || age,
        };
      });

      // Filter by ageInMonths after normalization if provided
      let filteredSchedules = normalizedSchedules;
      if (ageInMonths !== undefined) {
        const ageFilter = Number(ageInMonths);
        filteredSchedules = normalizedSchedules.filter((schedule: any) => {
          return schedule.ageInMonths <= ageFilter;
        });
      }

      console.log('🔍 After normalization and filtering:', {
        totalBefore: normalizedSchedules.length,
        totalAfter: filteredSchedules.length,
        sampleSchedule: filteredSchedules[0] ? {
          _id: String(filteredSchedules[0]._id),
          name: filteredSchedules[0].name,
          age: filteredSchedules[0].age,
          ageInMonths: filteredSchedules[0].ageInMonths
        } : null
      });

      // If healthBookId or customerId is provided, merge with vaccination records
      if (healthBookId || customerId) {
        const recordQuery: any = {};
        
        // Prefer healthBookId over customerId for more specific filtering
        if (healthBookId) {
          recordQuery.healthBookId = String(healthBookId);
        } else if (customerId) {
          recordQuery.customerId = String(customerId);
        }

        console.log('🔍 Looking for vaccination records with query:', recordQuery);

        const vaccinationRecords = await VaccinationRecords.model
          .find(recordQuery)
          .lean();

        console.log('🔍 Found vaccination records:', vaccinationRecords.length);

        // Create a map of vaccineId -> record
        const recordsMap = new Map();
        vaccinationRecords.forEach((record: any) => {
          const key = `${record.vaccineId}_${record.injectionNumber || 1}`;
          recordsMap.set(key, record);
        });

        console.log('🔍 Records map size:', recordsMap.size);
        console.log('🔍 Records map keys:', Array.from(recordsMap.keys()));

        // Merge schedule with records
        const mergedSchedules = filteredSchedules.map((schedule: any) => {
          const key = `${schedule._id}_1`; // Default injection number 1
          const record = recordsMap.get(key);

          return {
            ...schedule,
            vaccinationRecord: record || null,
            injectionStatus: record ? record.status : "pending",
            injectionDate: record ? record.injectionDate : null,
            // Giữ scheduledDate từ record nếu có, nếu không lấy từ schedule gốc
            scheduledDate: record && record.scheduledDate ? record.scheduledDate : schedule.scheduledDate || null,
            location: record ? record.location : schedule.location || null,
            notes: record ? record.notes : schedule.notes || null,
          };
        });

        console.log('🔍 Final merged schedules count:', mergedSchedules.length);

        return sendSuccess(res, {
          scheduleVaccin: mergedSchedules,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: filteredSchedules.length,
            totalPages: Math.ceil(filteredSchedules.length / Number(limit)),
          },
        });
      }

      // Return schedules only (no customer-specific data)
      console.log('🔍 Returning schedules without merging:', filteredSchedules.length);
      return sendSuccess(res, {
        scheduleVaccin: filteredSchedules,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: filteredSchedules.length,
          totalPages: Math.ceil(filteredSchedules.length / Number(limit)),
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
