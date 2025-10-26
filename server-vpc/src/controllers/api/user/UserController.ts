import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbUsers from '@mongodb/users';
import { NoData } from '@libs/errors';

class UserController {
  public async show (req: Request, res: Response) {
    try {
      const user = await MongoDbUsers.model.findById(req.params.userId);
      if (!user) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { user });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async getProfile(req: Request, res: Response) {
    try {
      console.log('🔍 getProfile called');
      const user = (req as any).currentUser;
      console.log('🔍 currentUser:', user ? 'exists' : 'null');
      
      if (!user) {
        console.log('❌ No user found');
        return sendError(res, 404, 'Không tìm thấy người dùng');
      }

      // Return user profile without sensitive data
      const userProfile = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
        gender: user.gender,
        status: user.status,
        type: user.type,
        address: user.address,
        courseRegister: user.courseRegister || [],
        courseCompleted: user.courseCompleted || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      sendSuccess(res, { user: userProfile });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async updateCourseRegister(req: Request, res: Response) {
    try {
      console.log('🔍 updateCourseRegister called');
      const currentUser = (req as any).currentUser;
      console.log('🔍 currentUser:', currentUser ? 'exists' : 'null');
      const { courseIds, action } = req.body;
      console.log('🔍 Request body:', { courseIds, action });

      if (!currentUser) {
        return sendError(res, 404, 'Không tìm thấy người dùng');
      }

      if (!Array.isArray(courseIds)) {
        return sendError(res, 400, 'courseIds phải là một mảng');
      }

      if (!['add', 'remove'].includes(action)) {
        return sendError(res, 400, 'action phải là "add" hoặc "remove"');
      }

      const userId = currentUser._id;
      const user = await MongoDbUsers.model.findById(userId) as any;

      if (!user) {
        return sendError(res, 404, 'Không tìm thấy người dùng');
      }

      // Initialize courseRegister if not exists
      if (!user.courseRegister) {
        user.courseRegister = [];
      }

      if (action === 'add') {
        // Add new courses (avoid duplicates)
        const newCourses = courseIds.filter((id: string) => !user.courseRegister.includes(id));
        user.courseRegister = [...user.courseRegister, ...newCourses];
      } else if (action === 'remove') {
        // Remove courses
        user.courseRegister = user.courseRegister.filter((id: string) => !courseIds.includes(id));
      }

      await user.save();

      // Return updated user profile
      const userProfile = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
        gender: user.gender,
        status: user.status,
        type: user.type,
        address: user.address,
        courseRegister: user.courseRegister,
        courseCompleted: user.courseCompleted || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      sendSuccess(res, { user: userProfile });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new UserController();
