import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Cart schema
const cartSchema = new mongoose.Schema({
  userId: {
    type: String, // Changed from ObjectId to String to support guest users
    required: true
  },
  items: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'courses',
      required: true
    },
    course: {
      type: Object, // Store course data for quick access
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalPrice: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    default: 0
  },
  coupon: {
    code: {
      type: String
    },
    name: {
      type: String
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    value: {
      type: Number
    },
    discountAmount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Create model if it doesn't exist
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

class CartController {
  /**
   * Get user's cart
   */
  public static async getCart(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      // Handle guest user - use consistent ID
      const actualUserId = userId === 'guest' ? 'guest_user' : userId;
      
      let cart = await Cart.findOne({ userId: actualUserId });
      
      if (!cart) {
        // Create new cart if doesn't exist
        cart = await Cart.create({
          userId: actualUserId,
          items: [],
          totalPrice: 0,
          totalItems: 0
        });
      }
      
      console.log(`📦 Found cart for user ${actualUserId}: ${cart.items.length} items`);
      sendSuccess(res, { cart });
    } catch (error: any) {
      console.error('❌ Get cart error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Add item to cart
   */
  public static async addToCart(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { courseId, course } = req.body;
      
      console.log('🔍 Add to cart request:', { userId, courseId, course: course ? 'exists' : 'null' });
      console.log('🔍 CourseId type:', typeof courseId);
      console.log('🔍 CourseId value:', courseId);
      
      if (!courseId || !course) {
        console.log('❌ Missing required fields:', { courseId: !!courseId, course: !!course });
        return sendError(res, 400, 'Course ID and course data are required');
      }
      
      // Validate courseId format
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        console.log('❌ Invalid courseId format:', courseId);
        return sendError(res, 400, 'Invalid course ID format');
      }
      
      // Handle guest user - use consistent ID
      const actualUserId = userId === 'guest' ? 'guest_user' : userId;
      
      let cart = await Cart.findOne({ userId: actualUserId });
      
      if (!cart) {
        // Create new cart
        cart = await Cart.create({
          userId: actualUserId,
          items: [],
          totalPrice: 0,
          totalItems: 0
        });
      }
      
      // Check if course already exists in cart
      const existingItem = cart.items.find((item: any) => item.courseId.toString() === courseId);
      
      if (existingItem) {
        return sendError(res, 400, 'Course already in cart');
      }
      
      // Add new item
      cart.items.push({
        courseId,
        course,
        addedAt: new Date()
      });
      
      // Update totals
      cart.totalItems = cart.items.length;
      cart.totalPrice = cart.items.reduce((sum: number, item: any) => sum + (item.course.price || 0), 0);
      
      await cart.save();
      
      console.log(`✅ Added course ${courseId} to cart for user ${actualUserId}`);
      sendSuccess(res, { 
        message: 'Course added to cart successfully',
        cart 
      });
    } catch (error: any) {
      console.error('❌ Add to cart error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Remove item from cart
   */
  public static async removeFromCart(req: Request, res: Response) {
    try {
      const { userId, courseId } = req.params;
      
      console.log('🔍 Remove from cart - userId:', userId, 'courseId:', courseId);
      
      // Handle guest user - use consistent ID
      const actualUserId = userId === 'guest' ? 'guest_user' : userId;
      
      const cart = await Cart.findOne({ userId: actualUserId });
      
      if (!cart) {
        console.log('❌ Cart not found for user:', actualUserId);
        return sendError(res, 404, 'Cart not found');
      }
      
      console.log('🔍 Cart before removal - items count:', cart.items.length);
      console.log('🔍 Cart items:', cart.items.map((item: any) => ({ courseId: item.courseId, title: item.course?.title })));
      
      // Remove item
      const originalLength = cart.items.length;
      cart.items = cart.items.filter((item: any) => {
        const itemCourseId = item.courseId.toString();
        const targetCourseId = courseId.toString();
        console.log('🔍 Comparing:', itemCourseId, '!==', targetCourseId, '=', itemCourseId !== targetCourseId);
        return itemCourseId !== targetCourseId;
      });
      
      console.log('🔍 Cart after removal - items count:', cart.items.length, 'removed:', originalLength - cart.items.length);
      
      // Update totals
      cart.totalItems = cart.items.length;
      cart.totalPrice = cart.items.reduce((sum: number, item: any) => sum + (item.course.price || 0), 0);
      
      await cart.save();
      
      console.log(`✅ Removed course ${courseId} from cart for user ${userId}`);
      sendSuccess(res, { 
        message: 'Course removed from cart successfully',
        cart 
      });
    } catch (error: any) {
      console.error('❌ Remove from cart error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Clear cart
   */
  public static async clearCart(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      // Handle guest user - use consistent ID
      const actualUserId = userId === 'guest' ? 'guest_user' : userId;
      
      const cart = await Cart.findOne({ userId: actualUserId });
      
      if (!cart) {
        return sendError(res, 404, 'Cart not found');
      }
      
      // Clear all items
      cart.items = [];
      cart.totalItems = 0;
      cart.totalPrice = 0;
      
      await cart.save();
      
      console.log(`✅ Cleared cart for user ${userId}`);
      sendSuccess(res, { 
        message: 'Cart cleared successfully',
        cart 
      });
    } catch (error: any) {
      console.error('❌ Clear cart error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Force clear cart (for debugging)
   */
  public static async forceClearCart(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      // Handle guest user - use consistent ID
      const actualUserId = userId === 'guest' ? 'guest_user' : userId;
      
      // Delete cart completely
      await Cart.deleteMany({ userId: actualUserId });
      
      console.log(`✅ Force cleared all carts for user ${userId}`);
      sendSuccess(res, { 
        message: 'All carts force cleared successfully'
      });
    } catch (error: any) {
      console.error('❌ Force clear cart error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default CartController;