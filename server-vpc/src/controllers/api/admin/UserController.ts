/**
 * User Controller
 * Handles user management operations
 */

import { Request, Response } from "express";
import MongoDbAdmins from "@mongodb/admins";
import { sendSuccess, sendError } from "@libs/response";
import { NoData, InternalError } from "@libs/errors";

export default class UserController {
  /**
   * Get all users
   */
  public static async getAllUsers(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        provider = "",
        role = "",
      } = req.query;

      // Build query
      const query: any = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      if (provider) {
        query.provider = provider;
      }

      if (role) {
        query.role = role;
      }

      // Get users with pagination
      const skip = (Number(page) - 1) * Number(limit);
      const users = await MongoDbAdmins.model
        .find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .select("-password"); // Exclude password

      const total = await MongoDbAdmins.model.countDocuments(query);

      sendSuccess(res, {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error("❌ Get all users failed:", error);
      sendError(res, 500, InternalError, error);
    }
  }

  /**
   * Get user statistics
   */
  public static async getUserStats(req: Request, res: Response) {
    try {
      const total = await MongoDbAdmins.model.countDocuments();
      const active = await MongoDbAdmins.model.countDocuments({
        isActive: true,
      });
      const google = await MongoDbAdmins.model.countDocuments({
        provider: "google",
      });
      const local = await MongoDbAdmins.model.countDocuments({
        provider: "local",
      });

      // Get role statistics
      const roleStats = await MongoDbAdmins.model.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
      ]);

      const byRole = roleStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>);

      sendSuccess(res, {
        total,
        active,
        google,
        local,
        byRole,
      });
    } catch (error: any) {
      console.error("❌ Get user stats failed:", error);
      sendError(res, 500, InternalError, error);
    }
  }

  /**
   * Create user
   */
  public static async createUser(req: Request, res: Response) {
    try {
      const {
        email,
        name,
        avatar,
        provider,
        googleId,
        role = "user",
      } = req.body;

      if (!email || !name || !provider) {
        return sendError(res, 400, "Email, name, and provider are required");
      }

      // Check if user already exists
      const existingUser = await MongoDbAdmins.model.findOne({ email });
      if (existingUser) {
        return sendError(res, 400, "User with this email already exists");
      }

      // Create user
      const userData: any = {
        email,
        name,
        provider,
        role,
        isActive: true,
        permissions: [],
      };

      if (avatar) userData.avatar = avatar;
      if (googleId) userData.googleId = googleId;

      const user = await MongoDbAdmins.model.create(userData);
      const userObj: any = user.toObject();

      sendSuccess(res, {
        user: {
          id: userObj._id,
          email: userObj.email,
          name: userObj.name || userObj.fullname,
          avatar: userObj.avatar,
          provider: userObj.provider,
          googleId: userObj.googleId,
          isActive: userObj.isActive,
          role: userObj.role,
          permissions: userObj.permissions || [],
          createdAt: userObj.createdAt,
          updatedAt: userObj.updatedAt,
        },
      });
    } catch (error: any) {
      console.error("❌ Create user failed:", error);
      sendError(res, 500, InternalError, error);
    }
  }

  /**
   * Update user
   */
  public static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await MongoDbAdmins.model
        .findByIdAndUpdate(
          id,
          { ...updateData, updatedAt: new Date() },
          { new: true }
        )
        .select("-password");

      if (!user) {
        return sendError(res, 404, NoData);
      }

      sendSuccess(res, { user });
    } catch (error: any) {
      console.error("❌ Update user failed:", error);
      sendError(res, 500, InternalError, error);
    }
  }

  /**
   * Delete user
   */
  public static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await MongoDbAdmins.model.findByIdAndDelete(id);
      if (!user) {
        return sendError(res, 404, NoData);
      }

      sendSuccess(res, { message: "User deleted successfully" });
    } catch (error: any) {
      console.error("❌ Delete user failed:", error);
      sendError(res, 500, InternalError, error);
    }
  }

  /**
   * Toggle user status
   */
  public static async toggleUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const user = await MongoDbAdmins.model
        .findByIdAndUpdate(
          id,
          { isActive, updatedAt: new Date() },
          { new: true }
        )
        .select("-password");

      if (!user) {
        return sendError(res, 404, NoData);
      }

      sendSuccess(res, { user });
    } catch (error: any) {
      console.error("❌ Toggle user status failed:", error);
      sendError(res, 500, InternalError, error);
    }
  }

  /**
   * Get user profile (for authenticated user)
   */
  public static async getProfile(req: Request, res: Response) {
    try {
      const user = (req as any).currentUser || (req as any).currentAdmin;
      
      if (!user) {
        return sendError(res, 404, 'Không tìm thấy người dùng');
      }

      // Return user profile without sensitive data
      const userProfile = {
        _id: user._id,
        name: user.name || user.fullname,
        fullname: user.fullname || user.name,
        email: user.email,
        phone: user.phoneNumber,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
        gender: user.gender,
        status: user.status,
        type: user.type,
        address: user.address,
        courseRegister: user.courseRegister || [],
        courseCompleted: user.courseCompleted || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      console.log("✅ Returning user profile:", userProfile);
      sendSuccess(res, { user: userProfile });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Update course register (for authenticated user)
   */
  public static async updateCourseRegister(req: Request, res: Response) {
    try {
      const currentUser = (req as any).currentUser || (req as any).currentAdmin;
      const { courseIds, action } = req.body;

      if (!currentUser) {
        return sendError(res, 404, "Không tìm thấy người dùng");
      }

      if (!Array.isArray(courseIds)) {
        return sendError(res, 400, "courseIds phải là một mảng");
      }

      if (!["add", "remove"].includes(action)) {
        return sendError(res, 400, 'action phải là "add" hoặc "remove"');
      }

      const userId = currentUser._id;
      const user = (await MongoDbAdmins.model.findById(userId)) as any;

      if (!user) {
        return sendError(res, 404, "Không tìm thấy người dùng");
      }

      // Initialize courseRegister if not exists
      if (!user.courseRegister) {
        user.courseRegister = [];
      }

      if (action === "add") {
        // Add new courses (avoid duplicates)
        const newCourses = courseIds.filter(
          (id: string) => !user.courseRegister.includes(id)
        );
        user.courseRegister = [...user.courseRegister, ...newCourses];
      } else if (action === "remove") {
        // Remove courses
        user.courseRegister = user.courseRegister.filter(
          (id: string) => !courseIds.includes(id)
        );
      }

      user.updatedAt = new Date();
      await user.save();

      // Return updated user profile
      const userProfile = {
        _id: user._id,
        fullname: user.fullname || user.name,
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
        updatedAt: user.updatedAt,
      };

      sendSuccess(res, { user: userProfile });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * POST /api/a/seed/users
   * Seed sample user data for testing
   */
  public static async seedUsers(req: Request, res: Response) {
    try {
      const bcrypt = require("bcryptjs");
      const MongoDbUsers = require("@mongodb/users").default;

      console.log("👥 Starting User Seed Process via API...\n");

      const salt = bcrypt.genSaltSync();

      // Sample users data
      const usersData = [
        {
          fullname: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          phoneNumber: "0987654321",
          password: bcrypt.hashSync("user123", salt),
          address: {
            province: { id: "01", name: "Hà Nội" },
            district: { id: "001", name: "Ba Đình" },
            ward: { id: "0001", name: "Phúc Xá" },
            addressDetail: "Số 1 Phúc Xá",
          },
          gender: "male",
          status: "active",
          type: "normal",
        },
        {
          fullname: "Trần Thị B",
          email: "tranthib@example.com",
          phoneNumber: "0976543210",
          password: bcrypt.hashSync("user123", salt),
          address: {
            province: { id: "79", name: "Hồ Chí Minh" },
            district: { id: "760", name: "Quận 1" },
            ward: { id: "00001", name: "Bến Nghé" },
            addressDetail: "Số 10 Nguyễn Huệ",
          },
          gender: "female",
          status: "active",
          type: "vip",
        },
        {
          fullname: "Lê Minh C",
          email: "leminhc@example.com",
          phoneNumber: "0965432109",
          password: bcrypt.hashSync("user123", salt),
          address: {
            province: { id: "48", name: "Đà Nẵng" },
            district: { id: "490", name: "Hải Châu" },
            ward: { id: "00001", name: "Thanh Bình" },
            addressDetail: "Số 20 Trần Phú",
          },
          gender: "male",
          status: "active",
          type: "normal",
        },
      ];

      // Delete existing users with same emails
      const emails = usersData.map((u) => u.email);
      await MongoDbUsers.model.deleteMany({ email: { $in: emails } });

      // Insert new users
      const result = await MongoDbUsers.model.insertMany(usersData);

      console.log(`✅ Successfully seeded ${result.length} users`);

      sendSuccess(
        res,
        {
          count: result.length,
          users: result.map((user: any) => ({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            status: user.status,
            type: user.type,
          })),
        },
        `Successfully seeded ${result.length} users`
      );
    } catch (error: any) {
      console.error("❌ Error seeding users:", error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}
