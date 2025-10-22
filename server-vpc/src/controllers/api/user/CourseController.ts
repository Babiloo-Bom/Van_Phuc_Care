import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbCourse from '@mongodb/courses';
import { NoData } from '@libs/errors';

class CourseController {
  public async index (req: Request, res: Response) {
    try {
      if (!req.query.origin) {
        return sendError(res, 404, NoData);
      }
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '20');
      const offset = (page - 1) * limit;
      let queryString: any = {
        origin: req.query.origin,
      };
      const { searchKey, from, to, status } = req.query;
      if (searchKey) {
        queryString = {
          $or: [
            { code: { $regex: searchKey, $options: 'i' } },
          ],
        };
      }
      if (from && to) {
        Object.assign(queryString, {
          'createdAt': {
            $gte: from,
            $lte: to,
          },
        });
      }
      if (status) {
        Object.assign(queryString, {
          'status': status,
        });
      }
      const [courses, total] = await Promise.all([
        MongoDbCourse.model.find(queryString)
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit),
        MongoDbCourse.model.countDocuments(queryString),
      ]);
      sendSuccess(res, { pagination: { total, page, limit }, courses });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      if (!req.query.origin) {
        return sendError(res, 404, NoData);
      }
      const course = await MongoDbCourse.model.findOne({
        _id: req.params.courseId,
        origin: req.query.origin,
      });
      if (!course) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { course });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new CourseController();
