import MongoDbAdmins from '@mongodb/admins';
import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbAccessPermission from '@mongodb/access-permissions';
import { NoData } from '@libs/errors';

class AccessPermissionController {
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '20');
      const offset = (page - 1) * limit;
      const { searchKey, status, target } = req.query;
      const queryString: any = {
        origin: req.currentAdmin.domain,
      };
      if (req.currentAdmin.role !== 'manager') {
        Object.assign(queryString, {
          'customer.email': req.currentAdmin.email,
        });
      }
      if (target) {
        Object.assign(queryString, {
          target,
        });
      }
      if (status) {
        Object.assign(queryString, {
          'status': status,
        });
      }
      if (searchKey) {
        Object.assign(queryString, {
          $or: [
            { title: { $regex: searchKey, $options: 'i' } },
            { email: { $regex: searchKey, $options: 'i' } },
            { customer: { $regex: searchKey, $options: 'i' } },
          ],
        });
      }
      const [accessPermissions, total] = await Promise.all([
        MongoDbAccessPermission.model.find(queryString)
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .select({ origin: 0 })
          .lean(),
        MongoDbAccessPermission.model.countDocuments(queryString),
      ]);
      sendSuccess(res, { pagination: { total, page, limit }, accessPermissions });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      if (req.currentAdmin.role !== 'manager') {
        return sendError(res, 404, NoData);
      }
      const accessPermission = await MongoDbAccessPermission.model.create({
        ...params,
        origin: req.currentAdmin.domain,
        status: 'active',
        createdBy: {
          _id: req.currentAdmin._id,
          fullname: req.currentAdmin.fullname,
        },
      });
      sendSuccess(res, { accessPermission });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      // Fetch access permission by ID
      const accessPermission: any = await MongoDbAccessPermission.model.findById(req.params.id);
      if (!accessPermission) {
        return sendError(res, 404, NoData);
      }

      // Update access permission with request body and origin
      await accessPermission.updateOne({
        ...req.body,
        origin: req.currentAdmin.domain,
      });

      // Fetch admin and ensure it's found
      const admin: any = await MongoDbAdmins.model.findById(accessPermission.request.id);
      if (!admin) {
        return sendError(res, 404, 'Admin not found');
      }

      // Ensure admin.courseRegister is initialized as an array
      admin.courseRegister = admin.courseRegister || [];

      const accessIds = accessPermission.access.map((item: { _id: any }) => item._id);

      if (req.body.status === MongoDbAccessPermission.STATUS_ENUM.ACCEPTED) {
        // Add access IDs to the course register, ensuring no duplicates
        const updatedCourseRegister = new Set([...admin.courseRegister, ...accessIds]);
        admin.courseRegister = Array.from(updatedCourseRegister);
      } else {
        // Remove access IDs from the course register
        admin.courseRegister = admin.courseRegister.filter((courseId: any) => !accessIds.includes(courseId));
      }

      // Update the admin document with the modified course register
      await admin.updateOne({ courseRegister: admin.courseRegister });

      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      if (req.currentAdmin.role === 'manager') {
        const accessPermission = await MongoDbAccessPermission.model.findById(req.params.id);
        if (!accessPermission) {
          return sendError(res, 404, NoData);
        }
        await accessPermission.delete();
      }
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new AccessPermissionController();
