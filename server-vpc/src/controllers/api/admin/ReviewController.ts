import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess, sendError } from '../../../libs/response';

// Review schema
const reviewSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String,
    default: '/images/avatar-demo.png'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

class ReviewController {
  /**
   * Get reviews by course ID
   */
  public static async getReviewsByCourse(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      
      const reviews = await Review.find({ courseId })
        .sort({ createdAt: -1 })
        .limit(20);
      
      sendSuccess(res, { reviews });
    } catch (error: any) {
      console.error('❌ Get reviews error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Create a new review
   */
  public static async createReview(req: Request, res: Response) {
    try {
      const { courseId, userId, userName, userAvatar, rating, content } = req.body;
      
      const review = new Review({
        courseId,
        userId,
        userName,
        userAvatar,
        rating,
        content,
        isVerified: true
      });
      
      await review.save();
      
      sendSuccess(res, { review });
    } catch (error: any) {
      console.error('❌ Create review error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Seed sample reviews
   */
  public static async seedReviews(req: Request, res: Response) {
    try {
      // Sample reviews data
      const sampleReviews = [
        {
          courseId: '68fdb92c7bdc0381df30533a', // Python course ID
          userId: 'user1',
          userName: 'Nguyễn Văn A',
          userAvatar: '/images/avatar-demo.png',
          rating: 5,
          content: 'Khóa học rất hay và chi tiết! Giảng viên giải thích rất dễ hiểu. Tôi đã học được rất nhiều kiến thức bổ ích về Python và Data Science.',
          isVerified: true
        },
        {
          courseId: '68fdb92c7bdc0381df30533a',
          userId: 'user2',
          userName: 'Trần Thị B',
          userAvatar: '/images/avatar-demo.png',
          rating: 5,
          content: 'Nội dung khóa học rất thực tế và ứng dụng cao. Các bài tập và dự án giúp tôi hiểu sâu hơn về machine learning.',
          isVerified: true
        },
        {
          courseId: '68fdb92c7bdc0381df30533a',
          userId: 'user3',
          userName: 'Lê Văn C',
          userAvatar: '/images/avatar-demo.png',
          rating: 4,
          content: 'Khóa học tốt, nhưng một số phần hơi khó hiểu. Cần thêm ví dụ thực tế để dễ tiếp thu hơn.',
          isVerified: true
        },
        {
          courseId: '68fdb92c7bdc0381df30533a',
          userId: 'user4',
          userName: 'Phạm Thị D',
          userAvatar: '/images/avatar-demo.png',
          rating: 5,
          content: 'Tuyệt vời! Tôi đã áp dụng kiến thức từ khóa học vào công việc và đạt được kết quả tốt. Cảm ơn thầy!',
          isVerified: true
        },
        {
          courseId: '68fdb92c7bdc0381df30533a',
          userId: 'user5',
          userName: 'Hoàng Văn E',
          userAvatar: '/images/avatar-demo.png',
          rating: 5,
          content: 'Khóa học rất đáng giá! Nội dung được cập nhật thường xuyên và phù hợp với xu hướng hiện tại.',
          isVerified: true
        }
      ];

      // Clear existing reviews for this course
      await Review.deleteMany({ courseId: '68fdb92c7bdc0381df30533a' });
      
      // Insert sample reviews
      const reviews = await Review.insertMany(sampleReviews);
      
      sendSuccess(res, { reviews });
    } catch (error: any) {
      console.error('❌ Seed reviews error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default ReviewController;
