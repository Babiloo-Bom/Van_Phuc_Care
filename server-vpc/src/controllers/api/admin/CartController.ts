import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ChaptersModel from '@mongodb/chapters';
import LessonsModel from '@mongodb/lessons';
import QuizzesModel from '@mongodb/quizzes';

// Get Review model
const getReviewModel = () => {
  return mongoose.models.Review || mongoose.model('Review');
};

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
   * Calculate videoCount, documentCount, quizCount for a course
   */
  private static async calculateCourseCounts(courseId: string | mongoose.Types.ObjectId) {
    try {
      let totalVideoCount = 0;
      let totalDocumentCount = 0;

      // Convert courseId to ObjectId if it's a string
      const courseObjectId = typeof courseId === 'string' 
        ? new mongoose.Types.ObjectId(courseId) 
        : courseId;

      // Get chapters for this course
      const chapters = await ChaptersModel.model.find({
        courseId: courseObjectId,
        status: 'active',
      });

      // Calculate video and document counts from lessons
      for (const chapter of chapters) {
        const lessons = await LessonsModel.model.find({
          chapterId: chapter._id,
          status: 'active',
        });

        for (const lesson of lessons) {
          const lessonData: any = lesson.toObject();

          // Count videos
          if (lessonData.videos && Array.isArray(lessonData.videos)) {
            totalVideoCount += lessonData.videos.length;
          } else if (lessonData.type === 'video' && lessonData.videoUrl) {
            totalVideoCount += 1;
          }

          // Count documents
          if (lessonData.documents && Array.isArray(lessonData.documents)) {
            totalDocumentCount += lessonData.documents.length;
          } else if (lessonData.type === 'document' && lessonData.documentUrl) {
            totalDocumentCount += 1;
          }
        }
      }

      // Count quizzes
      const totalQuizCount = await QuizzesModel.countDocuments({
        courseId: courseObjectId.toString(),
        status: 'active',
      });

      return {
        videoCount: totalVideoCount,
        documentCount: totalDocumentCount,
        quizCount: totalQuizCount,
      };
    } catch (error: any) {
      console.error('❌ Error calculating course counts:', error);
      return {
        videoCount: 0,
        documentCount: 0,
        quizCount: 0,
      };
    }
  }

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

      // Calculate and add videoCount, documentCount, quizCount for each course in cart
      const cartData = cart.toObject();
      if (cartData.items && cartData.items.length > 0) {
        // Get all courseIds from cart items
        const courseIds = cartData.items
          .map((item: any) => item.courseId?.toString() || item.course?._id?.toString())
          .filter(Boolean);

        // Aggregate ratings from Review collection for all courses at once
        let ratingStats: Record<string, { avg: number; count: number }> = {};
        try {
          const ReviewModel = getReviewModel();
          const ratingAggregation = await ReviewModel.aggregate([
            {
              $match: {
                courseId: { $in: courseIds.map((id: string) => new mongoose.Types.ObjectId(id)) },
                status: 'active',
              },
            },
            {
              $group: {
                _id: '$courseId',
                avgRating: { $avg: '$rating' },
                count: { $sum: 1 },
              },
            },
          ]);

          // Convert aggregation result to lookup object
          ratingStats = ratingAggregation.reduce((acc: Record<string, { avg: number; count: number }>, item: any) => {
            acc[item._id.toString()] = {
              avg: Math.round((item.avgRating || 0) * 10) / 10, // Round to 1 decimal
              count: item.count || 0,
            };
            return acc;
          }, {});
        } catch (ratingError) {
          console.error('Error fetching ratings for cart:', ratingError);
        }

        const itemsWithCounts = await Promise.all(
          cartData.items.map(async (item: any) => {
            const courseId = item.courseId?.toString() || item.course?._id?.toString();
            
            if (!courseId) {
              return item;
            }

            // Calculate counts
            const counts = await CartController.calculateCourseCounts(courseId);
            
            // Get rating from aggregation or fallback to stored value
            const ratingData = ratingStats[courseId];
            
            // Update course object with counts and real rating
            return {
              ...item,
              course: {
                ...item.course,
                videoCount: counts.videoCount,
                documentCount: counts.documentCount,
                quizCount: counts.quizCount,
                rating: {
                  average: ratingData?.avg ?? item.course?.rating?.average ?? 0,
                  count: ratingData?.count ?? item.course?.rating?.count ?? 0,
                },
              },
            };
          })
        );

        cartData.items = itemsWithCounts;
      }
      
      sendSuccess(res, { cart: cartData });
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
      
      if (!courseId || !course) {
        return sendError(res, 400, 'Course ID and course data are required');
      }
      
      // Validate courseId format
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
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
      
      sendSuccess(res, { 
        message: 'Course added to cart successfully',
        cart 
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Remove item from cart
   */
  public static async removeFromCart(req: Request, res: Response) {
    try {
      const { userId, courseId } = req.params;
      
      // Handle guest user - use consistent ID
      const actualUserId = userId === 'guest' ? 'guest_user' : userId;
      
      const cart = await Cart.findOne({ userId: actualUserId });
      
      if (!cart) {
        return sendError(res, 404, 'Cart not found');
      }
      
      // Remove item
      const originalLength = cart.items.length;
      cart.items = cart.items.filter((item: any) => {
        const itemCourseId = item.courseId.toString();
        const targetCourseId = courseId.toString();
        return itemCourseId !== targetCourseId;
      });
      
      
      // Update totals
      cart.totalItems = cart.items.length;
      cart.totalPrice = cart.items.reduce((sum: number, item: any) => sum + (item.course.price || 0), 0);
      
      await cart.save();
      
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
      
      sendSuccess(res, { 
        message: 'Cart cleared successfully',
        cart 
      });
    } catch (error: any) {
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