import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbExercise from '@mongodb/courses/exercises';

class ExerciseController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      const exercise = await MongoDbExercise.model.create({
        ...params,
      });
      sendSuccess(res, { exercise });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = (page - 1) * limit;
      const queryString: any = {
      };
      const { searchKey } = req.query;
      if (searchKey) {
        queryString.fullname = { $regex: searchKey, $options: 'i' };
      }
      const [exercises, total] = await Promise.all([
        MongoDbExercise.model.find(queryString)
          .sort({ createdAt: -1, showHome: -1 })
          .skip(offset)
          .limit(limit),
        MongoDbExercise.model.countDocuments(queryString),
      ]);

      sendSuccess(res, { pagination: { total, page, limit }, exercises });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const exercise = await MongoDbExercise.model.findById(req.params.exerciseId);
      sendSuccess(res, { exercise });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const exercise = await MongoDbExercise.model.findById(req.params.exerciseId);
      await exercise.update({
        ...req.body,
      });
      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const exercise = await MongoDbExercise.model.findById(req.params.exerciseId);
      await exercise.deleteOne();
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async deleteMany (req: Request, res: Response) {
    try {
      const exerciseIds = req.body.exerciseIds;
      await MongoDbExercise.model.deleteMany({ _id: { $in: exerciseIds } });
      sendSuccess(res, { message: 'Exercises deleted successfully' });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new ExerciseController();
