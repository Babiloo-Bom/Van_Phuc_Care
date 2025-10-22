import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MonggoDbCourseReivew from '@mongodb/vanphuccare/course-reviews';
import { NoData } from '@libs/errors';

class CourseReivewController {
  public async index (req: Request, res: Response) {
    try {
      if (!req.query.origin) {
        return sendError(res, 404, NoData);
      }
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '20');
      const offset = (page - 1) * limit;
      const [reviews, total] = await Promise.all([
        MonggoDbCourseReivew.model.find({ domain: req.query.origin, idCourse: req.params.id }).lean().skip(offset).limit(limit).sort({ createdAt: -1 }),
        MonggoDbCourseReivew.model.countDocuments({ domain: req.query.origin }),
      ]);
      sendSuccess(res, { reviews, pagination: { total, page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new CourseReivewController();
