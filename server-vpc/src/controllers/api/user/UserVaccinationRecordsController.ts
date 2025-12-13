import { Request, Response } from "express";
import { sendError, sendSuccess } from "@libs/response";
import VaccinationRecords from "@mongodb/vanphuccare/vaccination-record";
import ScheduleVaccins from "@mongodb/vanphuccare/schedule-vaccin";
import HealthBooks from "@mongodb/vanphuccare/health-book";

class UserVaccinationRecordsController {
  /**
   * Lấy danh sách vaccination records của customer
   * GET /api/u/vaccination-records/:customerId
   */
  public async getByCustomer(req: Request, res: Response) {
    try {
      const { customerId } = req.params;
      const { page = 1, limit = 100 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const query: any = { 
        customerId,
        domain: req.headers.origin || req.headers.host || "crm.vanphuccare.com",
      };

      const [records, total] = await Promise.all([
        VaccinationRecords.model
          .find(query)
          .populate("vaccineId")
          .sort({ scheduledDate: 1, createdAt: 1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        VaccinationRecords.model.countDocuments(query),
      ]);

      return sendSuccess(res, {
        vaccinationRecords: records,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error("Error fetching vaccination records:", error);
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Tạo vaccination record mới (đánh dấu đã tiêm)
   * POST /api/u/vaccination-records
   */
  public async create(req: Request, res: Response) {
    try {
      let {
        customerId,
        healthBookId,
        vaccineId,
        scheduledDate,
        injectionDate,
        status,
        location,
        notes,
        injectionNumber,
        sideEffects,
        nextDoseDate,
      } = req.body;

      // Validate required fields - healthBookId và vaccineId là bắt buộc
      if (!healthBookId || !vaccineId) {
        return sendError(res, 400, "healthBookId và vaccineId là bắt buộc");
      }

      // Nếu không có customerId, lấy từ healthBook
      if (!customerId) {
        const healthBook = await HealthBooks.model.findById(healthBookId);
        if (!healthBook) {
          return sendError(res, 404, "HealthBook không tồn tại");
        }
        customerId = (healthBook as any).customerId || (healthBook as any).userId || healthBookId;
      }

      // Check if vaccine exists
      const vaccine = await ScheduleVaccins.model.findById(vaccineId);
      if (!vaccine) {
        return sendError(res, 404, "Vaccine không tồn tại");
      }

      // Check if record already exists
      const existingRecord = await VaccinationRecords.model.findOne({
        customerId,
        vaccineId,
        injectionNumber: injectionNumber || 1,
      });

      if (existingRecord) {
        return sendError(res, 400, "Bản ghi tiêm chủng này đã tồn tại");
      }

      const record = await VaccinationRecords.model.create({
        customerId,
        healthBookId,
        vaccineId,
        scheduledDate: scheduledDate || null,
        injectionDate: injectionDate || new Date(),
        status: status || "completed",
        location: location || "",
        notes: notes || "",
        injectionNumber: injectionNumber || 1,
        sideEffects: sideEffects || "",
        nextDoseDate: nextDoseDate || null,
        domain: req.headers.origin || req.headers.host || "crm.vanphuccare.com",
      });

      // Populate vaccine info
      const populatedRecord = await VaccinationRecords.model
        .findById(record._id)
        .populate("vaccineId")
        .lean();

      return sendSuccess(res, {
        vaccinationRecord: populatedRecord,
        message: "Đã tạo bản ghi tiêm chủng thành công",
      });
    } catch (error: any) {
      console.error("Error creating vaccination record:", error);
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Cập nhật vaccination record
   * PUT /api/u/vaccination-records/:id
   */
  public async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Don't allow updating these fields
      delete updateData._id;
      delete updateData.customerId;
      delete updateData.healthBookId;
      delete updateData.vaccineId;
      delete updateData.domain;

      const record = await VaccinationRecords.model.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate("vaccineId");

      if (!record) {
        return sendError(res, 404, "Không tìm thấy bản ghi tiêm chủng");
      }

      return sendSuccess(res, {
        vaccinationRecord: record,
        message: "Đã cập nhật bản ghi tiêm chủng thành công",
      });
    } catch (error: any) {
      console.error("Error updating vaccination record:", error);
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Xóa vaccination record
   * DELETE /api/u/vaccination-records/:id
   */
  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const record = await VaccinationRecords.model.findByIdAndDelete(id);

      if (!record) {
        return sendError(res, 404, "Không tìm thấy bản ghi tiêm chủng");
      }

      return sendSuccess(res, {
        message: "Đã xóa bản ghi tiêm chủng thành công",
      });
    } catch (error: any) {
      console.error("Error deleting vaccination record:", error);
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Seed vaccination records cho một healthbook
   * POST /api/u/vaccination-records/seed
   * Body: { healthBookId, customerId? }
   * Nếu không truyền customerId, sẽ tự lấy từ healthBook
   */
  public async seed(req: Request, res: Response) {
    try {
      const { healthBookId } = req.body;
      let { customerId } = req.body;

      if (!healthBookId) {
        return sendError(res, 400, "healthBookId là bắt buộc");
      }

      // Nếu không có customerId, lấy từ healthBook
      const healthBook = await HealthBooks.model.findById(healthBookId).lean() as any;
      if (!healthBook) {
        return sendError(res, 404, "Không tìm thấy healthBook");
      }
      
      if (!customerId) {
        customerId = healthBook.customerId || healthBook.userId;
        
        if (!customerId) {
          return sendError(res, 400, "Không tìm thấy customerId trong healthBook");
        }
      }

      // Lấy domain từ healthBook hoặc request header
      const domain = healthBook.domain || req.headers.origin || "vanphuccare";

      // Get all vaccines from master list
      const vaccines = await ScheduleVaccins.model.find({ status: "active" }).lean();

      if (vaccines.length === 0) {
        return sendError(res, 400, "Chưa có vaccine trong hệ thống. Hãy chạy seed vaccine trước.");
      }

      // Delete existing records for this healthbook
      await VaccinationRecords.model.deleteMany({ healthBookId });

      const today = new Date();
      const records = [];

      for (const vaccine of vaccines) {
        const vaccineData = vaccine as any;
        const record: any = {
          customerId,
          healthBookId,
          vaccineId: vaccineData._id,
          injectionNumber: parseInt(String(vaccineData.numberOfInjections)) || 1,
          status: "pending",
          notes: "",
          domain: domain,
        };

        const ageInMonths = vaccineData.ageInMonths || 0;

        // Sơ sinh (0 tháng) - đã tiêm tại bệnh viện
        if (ageInMonths === 0) {
          const injectionDate = new Date(today);
          injectionDate.setMonth(injectionDate.getMonth() - 6); // Giả sử bé 6 tháng tuổi
          
          record.status = "completed";
          record.injectionDate = injectionDate;
          record.location = "Bệnh viện Phụ sản Trung ương";
          record.notes = "Tiêm tại bệnh viện sau sinh";
        }
        // 1-2 tháng - đã tiêm đúng lịch
        else if (ageInMonths >= 1 && ageInMonths <= 2) {
          const injectionDate = new Date(today);
          injectionDate.setMonth(injectionDate.getMonth() - (6 - ageInMonths));
          
          record.status = "completed";
          record.injectionDate = injectionDate;
          record.location = "Phòng khám Văn Phúc Care";
          record.notes = "Tiêm đúng lịch";
        }
        // 3-4 tháng - đã đặt lịch hẹn
        else if (ageInMonths >= 3 && ageInMonths <= 4) {
          const scheduledDate = new Date(today);
          scheduledDate.setDate(scheduledDate.getDate() + 7 * (ageInMonths - 2));
          
          record.status = "scheduled";
          record.scheduledDate = scheduledDate;
          record.location = "Phòng khám Văn Phúc Care";
          record.notes = "Đã đặt lịch hẹn";
        }
        // 9+ tháng - chờ đến tuổi tiêm
        else {
          record.status = "pending";
          record.notes = "Chờ đến tuổi tiêm";
        }

        records.push(record);
      }

      // Bulk insert
      const createdRecords = await VaccinationRecords.model.insertMany(records);

      return sendSuccess(res, {
        message: `Đã tạo ${createdRecords.length} bản ghi tiêm chủng cho healthbook`,
        totalVaccines: vaccines.length,
        recordsCreated: createdRecords.length,
        breakdown: {
          completed: records.filter(r => r.status === "completed").length,
          scheduled: records.filter(r => r.status === "scheduled").length,
          pending: records.filter(r => r.status === "pending").length,
        },
      });
    } catch (error: any) {
      console.error("Error seeding vaccination records:", error);
      return sendError(res, 500, error.message);
    }
  }
}

export default new UserVaccinationRecordsController();
