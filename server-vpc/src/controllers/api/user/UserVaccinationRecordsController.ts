import { Request, Response } from "express";
import { sendError, sendSuccess } from "@libs/response";
import VaccinationRecords from "@mongodb/vanphuccare/vaccination-record";
import ScheduleVaccins from "@mongodb/vanphuccare/schedule-vaccin";

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
        domain: req.headers.origin || "",
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
      const {
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

      // Validate required fields
      if (!customerId || !healthBookId || !vaccineId) {
        return sendError(res, 400, "customerId, healthBookId và vaccineId là bắt buộc");
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
        domain: req.headers.origin || "",
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
}

export default new UserVaccinationRecordsController();
