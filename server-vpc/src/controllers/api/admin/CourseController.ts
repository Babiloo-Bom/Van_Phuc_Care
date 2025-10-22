import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbCourse from '@mongodb/courses';

class CourseController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      const course = await MongoDbCourse.model.create(params);
      sendSuccess(res, { course });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '20');
      const offset = (page - 1) * limit;
      let queryString: any = {
      };
      const { searchKey, from, to, status, branch, course } = req.query;
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
      if (branch) {
        Object.assign(queryString, {
          'branch.value': branch,
        });
      }
      if (course) {
        Object.assign(queryString, {
          'course.value': course,
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
      const course = await MongoDbCourse.model.findById(req.params.courseId);
      sendSuccess(res, { course });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const course = await MongoDbCourse.model.findById(req.params.courseId);
      await course.update(req.body);
      const result = await MongoDbCourse.model.findById(req.params.courseId);
      sendSuccess(res, { course: result });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const course = await MongoDbCourse.model.findById(req.params.courseId);
      await course.delete();
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new CourseController();
