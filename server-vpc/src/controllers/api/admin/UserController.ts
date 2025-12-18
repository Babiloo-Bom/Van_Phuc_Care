/**
 * User Controller
 * Handles user management operations
 */

import { Request, Response } from "express";
import MongoDbAdmins from "@mongodb/admins";
import MongoDbUsers from "@mongodb/users";
import { sendSuccess, sendError } from "@libs/response";
import { NoData, InternalError } from "@libs/errors";
import mongoose from "mongoose";

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
          { fullname: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }
      
      // Handle isActive filter
      if (req.query.isActive !== undefined) {
        const isActiveValue = String(req.query.isActive);
        if (isActiveValue === 'true' || isActiveValue === '1') {
          query.isActive = true;
        } else if (isActiveValue === 'false' || isActiveValue === '0') {
          query.isActive = false;
        }
      }

      if (provider) {
        query.provider = provider;
      }

      if (role) {
        query.role = role;
      }

      // Build query for both collections
      const adminQuery = { ...query };
      const userQuery = { ...query };
      
      // Handle role filter - admins collection uses 'role', users collection uses 'type'
      const roleStr = String(role || '');
      let shouldQueryAdmins = true;
      let shouldQueryUsers = true;
      
      if (roleStr) {
        if (['admin', 'manager', 'worker'].includes(roleStr)) {
          adminQuery.role = roleStr;
          shouldQueryUsers = false; // Don't query users collection for admin roles
        } else if (roleStr === 'customer' || roleStr === 'user') {
          // Map 'customer' and 'user' to query both collections for customer role
          // 'user' is kept for backward compatibility
          shouldQueryAdmins = true;
          adminQuery.role = 'user'; // admins collection uses 'user' for customers
          shouldQueryUsers = true;
          userQuery.type = 'normal'; // users collection uses 'normal' for customers
        }
      }
      
      // Query ALL records from both collections (without pagination first)
      // Then merge, deduplicate, sort, and apply pagination
      const [allAdmins, allUsers, adminCount, userCount] = await Promise.all([
        shouldQueryAdmins
          ? MongoDbAdmins.model.find(adminQuery).sort({ createdAt: -1 }).select("-password").lean()
          : Promise.resolve([]),
        shouldQueryUsers
          ? MongoDbUsers.model.find(userQuery).sort({ createdAt: -1 }).select("-password").lean()
          : Promise.resolve([]),
        shouldQueryAdmins
          ? MongoDbAdmins.model.countDocuments(adminQuery)
          : Promise.resolve(0),
        shouldQueryUsers
          ? MongoDbUsers.model.countDocuments(userQuery)
          : Promise.resolve(0),
      ]);
      
      // Merge results and add source indicator (no duplicate checking)
      // Normalize role: 'user' and 'normal' both become 'customer'
      const mergedUsers = [
        ...allAdmins.map((admin: any) => ({
          ...admin,
          _source: 'admins',
          provider: admin.provider || 'local',
          role: admin.role === 'user' ? 'customer' : (admin.role || 'customer'),
        })),
        ...allUsers.map((user: any) => ({
          ...user,
          _source: 'users',
          provider: user.provider || 'local',
          role: user.type === 'normal' ? 'customer' : (user.type || 'customer'),
        })),
      ];
      
      // Sort by createdAt descending
      mergedUsers.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      
      // Apply pagination to merged and sorted results
      const skip = (Number(page) - 1) * Number(limit);
      const paginatedUsers = mergedUsers.slice(skip, skip + Number(limit));
      
      // Total is the sum of both collections (no deduplication)
      const total = adminCount + userCount;

      sendSuccess(res, {
        users: paginatedUsers,
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
   * Get user by ID
   */
  public static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Try to find in admins collection first
      let user = await MongoDbAdmins.model.findById(id).select("-password").lean();
      let source = 'admins';

      // If not found in admins, try users collection
      if (!user) {
        user = await MongoDbUsers.model.findById(id).select("-password").lean();
        source = 'users';
      }

      if (!user) {
        return sendError(res, 404, NoData);
      }

      // Format user data
      // Normalize role: 'user' and 'normal' both become 'customer'
      const userData: any = {
        ...user,
        _source: source,
        provider: (user as any).provider || 'local',
        role: source === 'admins' 
          ? (((user as any).role === 'user' ? 'customer' : (user as any).role) || 'customer')
          : (((user as any).type === 'normal' ? 'customer' : (user as any).type) || 'customer'),
        isActive: source === 'admins'
          ? ((user as any).isActive !== undefined ? (user as any).isActive : true)
          : ((user as any).status === 'active'),
      };

      sendSuccess(res, { user: userData });
    } catch (error: any) {
      console.error("❌ Get user by ID failed:", error);
      sendError(res, 500, InternalError, error);
    }
  }

  /**
   * Get user statistics
   */
  public static async getUserStats(req: Request, res: Response) {
    try {
      // Get stats from both collections
      const [adminStats, userStats] = await Promise.all([
        MongoDbAdmins.model.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              active: {
                $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
              },
              google: {
                $sum: { $cond: [{ $eq: ["$provider", "google"] }, 1, 0] }
              },
              local: {
                $sum: { $cond: [{ $or: [{ $eq: ["$provider", "local"] }, { $not: "$provider" }] }, 1, 0] }
              },
            }
          }
        ]),
        MongoDbUsers.model.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              active: {
                $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
              },
              google: {
                $sum: { $cond: [{ $eq: ["$provider", "google"] }, 1, 0] }
              },
              local: {
                $sum: { $cond: [{ $or: [{ $eq: ["$provider", "local"] }, { $not: "$provider" }] }, 1, 0] }
              },
            }
          }
        ]),
      ]);
      
      // Merge stats
      const adminData = adminStats[0] || { total: 0, active: 0, google: 0, local: 0 };
      const userData = userStats[0] || { total: 0, active: 0, google: 0, local: 0 };
      
      const total = adminData.total + userData.total;
      const active = adminData.active + userData.active;
      const google = adminData.google + userData.google;
      const local = adminData.local + userData.local;

      // Get role statistics from both collections
      const [adminRoleStats, userRoleStats] = await Promise.all([
        MongoDbAdmins.model.aggregate([
          { $group: { _id: "$role", count: { $sum: 1 } } },
        ]),
        MongoDbUsers.model.aggregate([
          { $group: { _id: "$type", count: { $sum: 1 } } },
        ]),
      ]);

      // Merge role stats
      const byRole: Record<string, number> = {};
      
      // Process admin roles
      adminRoleStats.forEach((stat: any) => {
        const role = stat._id || "null";
        byRole[role] = (byRole[role] || 0) + stat.count;
      });
      
      // Process user types (map 'normal' to 'user')
      userRoleStats.forEach((stat: any) => {
        const role = stat._id === 'normal' ? 'user' : (stat._id || "null");
        byRole[role] = (byRole[role] || 0) + stat.count;
      });

      // Calculate customers (users collection - type: 'normal')
      const customers = await MongoDbUsers.model.countDocuments({ type: 'normal' });
      
      // Calculate staff (admins collection - role: admin, manager, worker)
      const staff = await MongoDbAdmins.model.countDocuments({
        role: { $in: ['admin', 'manager', 'worker'] }
      });

      sendSuccess(res, {
        total,
        active,
        google,
        local,
        byRole,
        customers,
        staff,
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
        fullname,
        avatar,
        provider,
        googleId,
        role = "user",
        password,
        phone,
        phoneNumber,
        isActive = true
      } = req.body;

      if (!email || (!name && !fullname) || !provider) {
        return sendError(res, 400, "Email, name, and provider are required");
      }

      // For local provider, password is required
      if (provider === 'local' && !password) {
        return sendError(res, 400, "Password is required for local users");
      }

      // Import bcrypt for password hashing
      const bcrypt = await import('bcryptjs')
      
      // Determine which collection to create user in based on role
      const isAdminRole = ['admin', 'manager', 'worker'].includes(role);
      const isCustomerRole = role === 'customer';

      // Check if user already exists in the target collection only
      // Allow same email in different collections (e.g., admin can also be a customer)
      if (isAdminRole) {
        // Check only in admins collection
        const existingAdmin = await MongoDbAdmins.model.findOne({ email });
        if (existingAdmin) {
          return sendError(res, 400, "Admin with this email already exists");
        }
      } else if (isCustomerRole) {
        // Check only in users collection
        const existingUser = await MongoDbUsers.model.findOne({ email });
        if (existingUser) {
          return sendError(res, 400, "User with this email already exists");
        }
      } else {
        // Unknown role, default to admins collection
        const existingAdmin = await MongoDbAdmins.model.findOne({ email });
        if (existingAdmin) {
          return sendError(res, 400, "User with this email already exists");
        }
      }
      
      let createdUser: any = null;
      let userObj: any = null;

      if (isAdminRole) {
        // Create in admins collection only
        const adminData: any = {
          email,
          name: name || fullname,
          fullname: fullname || name,
          provider,
          role: role, // admin, manager, or worker
          isActive: isActive !== false,
          status: isActive !== false ? MongoDbAdmins.STATUS_ENUM.ACTIVE : MongoDbAdmins.STATUS_ENUM.INACTIVE,
          permissions: [],
          verified: provider === 'google' ? 'true' : 'false'
        };

        if (avatar) adminData.avatar = avatar;
        if (googleId) adminData.googleId = googleId;
        if (phone || phoneNumber) adminData.phone = phone || phoneNumber;
        
        // Hash password for local users
        if (provider === 'local' && password) {
          adminData.password = await bcrypt.hash(password, 10);
        }

        createdUser = await MongoDbAdmins.model.create(adminData);
        userObj = createdUser.toObject();
      } else if (isCustomerRole) {
        // Create in users collection only
        const userData: any = {
          email,
          fullname: fullname || name,
          provider,
          type: 'normal', // Customer maps to 'normal' type in users collection
          status: isActive !== false ? MongoDbUsers.STATUS_ENUM.ACTIVE : MongoDbUsers.STATUS_ENUM.INACTIVE,
        };

        if (avatar) userData.avatar = avatar;
        if (googleId) userData.googleId = googleId;
        if (phone || phoneNumber) userData.phoneNumber = phone || phoneNumber;
        else userData.phoneNumber = `local-${Date.now()}`; // Required field
        
        // Hash password for local users
        if (provider === 'local' && password) {
          userData.password = await bcrypt.hash(password, 10);
        }

        createdUser = await MongoDbUsers.model.create(userData);
        userObj = createdUser.toObject();
        
        // Normalize userObj to match expected format
        userObj.role = 'customer';
        userObj.isActive = userObj.status === MongoDbUsers.STATUS_ENUM.ACTIVE;
      } else {
        // Unknown role, default to admins collection
        const adminData: any = {
          email,
          name: name || fullname,
          fullname: fullname || name,
          provider,
          role: role,
          isActive: isActive !== false,
          status: isActive !== false ? MongoDbAdmins.STATUS_ENUM.ACTIVE : MongoDbAdmins.STATUS_ENUM.INACTIVE,
          permissions: [],
          verified: provider === 'google' ? 'true' : 'false'
        };

        if (avatar) adminData.avatar = avatar;
        if (googleId) adminData.googleId = googleId;
        if (phone || phoneNumber) adminData.phone = phone || phoneNumber;
        
        if (provider === 'local' && password) {
          adminData.password = await bcrypt.hash(password, 10);
        }

        createdUser = await MongoDbAdmins.model.create(adminData);
        userObj = createdUser.toObject();
      }

      // Determine source collection for response
      const sourceCollection = isAdminRole ? 'admins' : (isCustomerRole ? 'users' : 'admins');
      
      sendSuccess(res, {
        user: {
          id: userObj._id,
          email: userObj.email,
          name: userObj.name || userObj.fullname,
          fullname: userObj.fullname || userObj.name,
          avatar: userObj.avatar,
          provider: userObj.provider,
          googleId: userObj.googleId,
          isActive: userObj.isActive !== undefined ? userObj.isActive : (userObj.status === MongoDbUsers.STATUS_ENUM.ACTIVE),
          role: userObj.role || (isCustomerRole ? 'customer' : userObj.type === 'normal' ? 'customer' : userObj.role),
          permissions: userObj.permissions || [],
          createdAt: userObj.createdAt,
          updatedAt: userObj.updatedAt,
          _source: sourceCollection
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

      // Try to find user in admins collection first
      let user = await MongoDbAdmins.model.findById(id);
      let source = 'admins';

      // If not found in admins, try users collection
      if (!user) {
        user = await MongoDbUsers.model.findById(id) as any;
        source = 'users';
      }

      if (!user) {
        return sendError(res, 404, NoData);
      }

      // Update based on source collection
      if (source === 'admins') {
        // Update admins collection
        const adminUpdate: any = {
          ...updateData,
          updatedAt: new Date()
        };
        
        // Map role if provided
        // 'customer' maps to 'user' in admins collection
        if (updateData.role) {
          adminUpdate.role = updateData.role === 'customer' ? 'user' : updateData.role;
        }
        
        // Map isActive if provided
        if (updateData.isActive !== undefined) {
          adminUpdate.isActive = updateData.isActive;
        }

        user = await MongoDbAdmins.model
          .findByIdAndUpdate(id, adminUpdate, { new: true })
          .select("-password");
      } else {
        // Update users collection
        const userUpdate: any = {
          ...updateData,
          updatedAt: new Date()
        };
        
        // Map type if role is provided
        // 'customer' maps to 'normal' in users collection
        if (updateData.role) {
          userUpdate.type = (updateData.role === 'customer' || updateData.role === 'user') ? 'normal' : updateData.role;
        }
        
        // Map status if isActive is provided
        if (updateData.isActive !== undefined) {
          userUpdate.status = updateData.isActive ? 'active' : 'inactive';
        }

        user = await MongoDbUsers.model
          .findByIdAndUpdate(id, userUpdate, { new: true })
          .select("-password");
      }

      if (!user) {
        return sendError(res, 404, NoData);
      }

      // Format response
      // Normalize role: 'user' and 'normal' both become 'customer'
      const userData: any = {
        ...user.toObject(),
        _source: source,
        provider: (user as any).provider || 'local',
        role: source === 'admins' 
          ? (((user as any).role === 'user' ? 'customer' : (user as any).role) || 'customer')
          : (((user as any).type === 'normal' ? 'customer' : (user as any).type) || 'customer'),
        isActive: source === 'admins'
          ? ((user as any).isActive !== undefined ? (user as any).isActive : true)
          : ((user as any).status === 'active'),
      };

      sendSuccess(res, { user: userData });
    } catch (error: any) {
      console.error("❌ Update user failed:", error);
      sendError(res, 500, InternalError, error);
    }
  }

  /**
   * Delete user
   */
  /**
   * Delete all related data for a user (cascade delete)
   */
  private static async deleteUserRelatedData(userId: string, email?: string) {
    try {
      const userIdStr = userId.toString();
      const userIdObjId = new mongoose.Types.ObjectId(userIdStr);

      // Import models dynamically to avoid circular dependencies
      const [
        ModelTransaction,
        MongoDbTickets,
        MongoDbTicketComments,
        ServiceRegistrationModels,
        MongoDbQuizAttempts,
        RatingModels
      ] = await Promise.all([
        import('@mongodb/transactions').then(m => m.default),
        import('@mongodb/tickets').then(m => m.default),
        import('@mongodb/ticket-comments').then(m => m.default),
        import('@mongodb/service-registrations').then(m => m.default),
        import('@mongodb/quiz-attempts').then(m => m.default),
        import('@mongodb/ratings').then(m => m.default)
      ]);

      // Delete operations - run in parallel for better performance
      const deletePromises = [
        // Delete transactions
        ModelTransaction.model.deleteMany({ userId: userIdStr }),
        
        // Delete tickets (using ObjectId)
        MongoDbTickets.model.deleteMany({ userId: userIdObjId }),
        
        // Delete ticket comments (using ObjectId)
        MongoDbTicketComments.model.deleteMany({ userId: userIdObjId }),
        
        // Delete service registrations
        ServiceRegistrationModels.model.deleteMany({ userId: userIdStr }),
        
        // Delete quiz attempts
        MongoDbQuizAttempts.deleteMany({ userId: userIdStr }),
        
        // Delete ratings
        RatingModels.model.deleteMany({ userId: userIdStr }),
      ];

      // Delete orders (from Order model in OrderController)
      try {
        const OrderModel = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }), 'orders');
        deletePromises.push(OrderModel.deleteMany({ userId: userIdStr }));
      } catch (err) {
        console.warn('⚠️ Could not delete orders:', err);
      }

      // Delete carts (from Cart model in OrderController)
      try {
        const CartModel = mongoose.models.Cart || mongoose.model('Cart', new mongoose.Schema({}, { strict: false }), 'carts');
        deletePromises.push(CartModel.deleteMany({ userId: userIdStr }));
      } catch (err) {
        console.warn('⚠️ Could not delete carts:', err);
      }

      // Delete health records if exists
      try {
        const HealthRecordModel = mongoose.models['health-records'] || mongoose.model('health-records', new mongoose.Schema({}, { strict: false }), 'health-records');
        deletePromises.push(HealthRecordModel.deleteMany({ userId: userIdStr }));
      } catch (err) {
        console.warn('⚠️ Could not delete health records:', err);
      }

      // Delete health books if exists
      try {
        const HealthBookModel = mongoose.models['health-books'] || mongoose.model('health-books', new mongoose.Schema({}, { strict: false }), 'health-books');
        deletePromises.push(HealthBookModel.deleteMany({ userId: userIdStr }));
      } catch (err) {
        console.warn('⚠️ Could not delete health books:', err);
      }

      // Execute all delete operations
      const results = await Promise.allSettled(deletePromises);
      
      // Log results
      const deletedCounts: Record<string, number> = {};
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const collectionNames = [
            'transactions', 'tickets', 'ticket-comments', 
            'service-registrations', 'quiz-attempts', 'ratings',
            'orders', 'carts', 'health-records', 'health-books'
          ];
          const collectionName = collectionNames[index] || `collection-${index}`;
          deletedCounts[collectionName] = result.value.deletedCount || 0;
        } else {
          console.warn(`⚠️ Failed to delete from collection ${index}:`, result.reason);
        }
      });

      console.log(`✅ Deleted related data for user ${userId}:`, deletedCounts);
      return deletedCounts;
    } catch (error: any) {
      console.error('❌ Error deleting user related data:', error);
      // Don't throw - we still want to delete the user even if related data deletion fails
      return {};
    }
  }

  public static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Try to find user first (before deleting) to get email
      let userToDelete = await MongoDbAdmins.model.findById(id);
      let source = 'admins';

      // If not found in admins, try users collection
      if (!userToDelete) {
        userToDelete = await MongoDbUsers.model.findById(id) as any;
        source = 'users';
      }

      if (!userToDelete) {
        return sendError(res, 404, NoData);
      }

      // Get user email before deletion
      const userObj = userToDelete.toObject ? userToDelete.toObject() : userToDelete;
      const email = (userObj as any).email;

      // Delete all related data first (cascade delete)
      await UserController.deleteUserRelatedData(id, email);

      // Now delete the user from the source collection
      let deletedUser = await MongoDbAdmins.model.findByIdAndDelete(id);
      
      if (!deletedUser) {
        deletedUser = await MongoDbUsers.model.findByIdAndDelete(id) as any;
        source = 'users';
      }

      // Also check if there's a duplicate by email in the other collection
      // and delete it if found (to maintain consistency)
      if (email) {
        if (source === 'admins') {
          // Check and delete from users collection if exists
          await MongoDbUsers.model.findOneAndDelete({ email });
        } else {
          // Check and delete from admins collection if exists
          await MongoDbAdmins.model.findOneAndDelete({ email });
        }
      }

      sendSuccess(res, { 
        message: "User và tất cả dữ liệu liên quan đã được xóa thành công",
        deletedFrom: source
      });
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
      
      // Try to find user in admins collection first
      let user = await MongoDbAdmins.model.findById(id);
      let source = 'admins';

      // If not found in admins, try users collection
      if (!user) {
        user = await MongoDbUsers.model.findById(id) as any;
        source = 'users';
      }

      if (!user) {
        return sendError(res, 404, NoData);
      }

      // Toggle status based on source collection
      if (source === 'admins') {
        // Toggle isActive for admins collection
        const currentIsActive = (user as any).isActive !== undefined ? (user as any).isActive : true;
        const newIsActive = !currentIsActive;
        
        user = await MongoDbAdmins.model
          .findByIdAndUpdate(
            id,
            { 
              isActive: newIsActive,
              // Also update status to match
              status: newIsActive ? MongoDbAdmins.STATUS_ENUM.ACTIVE : MongoDbAdmins.STATUS_ENUM.INACTIVE,
              updatedAt: new Date() 
            },
            { new: true }
          )
          .select("-password");
      } else {
        // Toggle status for users collection
        const currentStatus = (user as any).status || MongoDbUsers.STATUS_ENUM.ACTIVE;
        const newStatus = currentStatus === MongoDbUsers.STATUS_ENUM.ACTIVE 
          ? MongoDbUsers.STATUS_ENUM.INACTIVE 
          : MongoDbUsers.STATUS_ENUM.ACTIVE;
        
        user = await MongoDbUsers.model
          .findByIdAndUpdate(
            id,
            { 
              status: newStatus,
              updatedAt: new Date() 
            },
            { new: true }
          )
          .select("-password");
      }

      if (!user) {
        return sendError(res, 404, NoData);
      }

      // Format response
      const userData: any = {
        ...user.toObject(),
        _source: source,
        provider: (user as any).provider || 'local',
        role: source === 'admins' 
          ? (((user as any).role === 'user' ? 'customer' : (user as any).role) || 'customer')
          : (((user as any).type === 'normal' ? 'customer' : (user as any).type) || 'customer'),
        isActive: source === 'admins'
          ? ((user as any).isActive !== undefined ? (user as any).isActive : true)
          : ((user as any).status === 'active'),
      };

      sendSuccess(res, { user: userData });
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
