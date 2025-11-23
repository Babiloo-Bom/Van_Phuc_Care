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
      const user = (req as any).currentUser;
      
      if (!user) {
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
        fullAddress: user.fullAddress,
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

  public async updateProfile(req: Request, res: Response) {
    try {
      const currentUser = (req as any).currentUser;
      const { fullname, phoneNumber, email, address, fullAddress, avatar, gender } = req.body;

      if (!currentUser) {
        return sendError(res, 404, 'Không tìm thấy người dùng');
      }

      const userId = currentUser._id;
      const user = await MongoDbUsers.model.findById(userId) as any;

      if (!user) {
        return sendError(res, 404, 'Không tìm thấy người dùng');
      }

      // Update user fields if provided
      if (fullname !== undefined) user.fullname = fullname;
      if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
      if (email !== undefined) user.email = email;
      if (address !== undefined) user.address = address;
      if (fullAddress !== undefined) user.fullAddress = fullAddress;
      if (avatar !== undefined) user.avatar = avatar;
      if (gender !== undefined) user.gender = gender;

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
        fullAddress: user.fullAddress,
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
      const currentUser = (req as any).currentUser;
      const { courseIds, action } = req.body;

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
