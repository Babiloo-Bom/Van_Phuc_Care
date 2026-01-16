import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbQuizzes from '@mongodb/quizzes';
import MongoDbQuizAttempts from '@mongodb/quiz-attempts';
import mongoose from 'mongoose';

export default class QuizController {
  /**
   * Get quiz by course, chapter, and lesson
   */
  public static async getQuiz(req: Request, res: Response) {
    try {
      const { courseId, chapterId, lessonId } = req.params;
      
      console.log(`🔍 [QuizController.getQuiz] Query params:`, { courseId, chapterId, lessonId });
      
      // Find all quizzes for this lesson to check for duplicates
      const allQuizzes = await MongoDbQuizzes.find({
        courseId,
        chapterId,
        lessonId,
        status: 'active'
      }).sort({ updatedAt: -1 }); // Sort by updatedAt descending to get the latest
      
      console.log(`🔍 [QuizController.getQuiz] Found ${allQuizzes.length} quiz(es) for this lesson`);
      
      if (allQuizzes.length === 0) {
        return sendSuccess(res, { quiz: null, message: 'No quiz found for this lesson' });
      }
      
      // Use the most recently updated quiz
      const quiz = allQuizzes[0];
      
      // Convert to plain object to ensure all fields are included
      const quizData = quiz.toObject ? quiz.toObject() : quiz;
      
      console.log(`🔍 [QuizController.getQuiz] Returning quiz:`, {
        _id: quizData._id,
        title: quizData.title,
        questionsCount: quizData.questions?.length || 0,
        updatedAt: quizData.updatedAt,
        questions: quizData.questions?.map((q: any, idx: number) => ({
          index: idx,
          id: q.id,
          question: q.question?.substring(0, 50) || '',
          optionsCount: q.options?.length || 0,
          hasCorrectAnswer: !!q.correctAnswer
        }))
      });
      
      // Ensure questions array is properly included
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        console.warn(`⚠️ [QuizController.getQuiz] Quiz ${quizData._id} has invalid questions array`);
        quizData.questions = [];
      }

      sendSuccess(res, { quiz: quizData });
    } catch (error: any) {
      console.error(`❌ [QuizController.getQuiz] Error:`, error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Create new quiz
   */
  public static async createQuiz(req: Request, res: Response) {
    try {
      const quizData = req.body;
      
      const quiz = new MongoDbQuizzes(quizData);
      await quiz.save();

      sendSuccess(res, { quiz });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Submit quiz attempt
   */
  public static async submitQuizAttempt(req: Request, res: Response) {
    try {
      const userId = (req as any).currentUser?._id || (req as any).currentAdmin?._id;

      const isUserSubmit = !!(req as any).currentUser?._id 
      
      if (!userId) {
        return sendError(res, 401, 'User not authenticated');
      }

      const { quizId, courseId, chapterId, lessonId, answers, timeSpent } = req.body;

      // Get quiz details
      const quiz: any = await MongoDbQuizzes.findById(quizId);
      if (!quiz) {
        return sendError(res, 404, 'Quiz not found');
      }

      // Calculate score
      let score = 0;
      let totalPoints = 0;
      const processedAnswers = [];

      for (const answer of answers) {
        const question = quiz.questions.find((q: any) => q.id === answer.questionId);
        if (question) {
          const isCorrect = answer.answer === question.correctAnswer;
          const points = isCorrect ? question.points : 0;
          
          score += points;
          totalPoints += question.points;
          
          processedAnswers.push({
            questionId: answer.questionId,
            answer: answer.answer,
            isCorrect,
            points
          });
        }
      }

      const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
      const passed = percentage >= quiz.passingScore;

      // Get attempt number
      const attemptCount = await MongoDbQuizAttempts.countDocuments({
        userId: userId.toString(),
        quizId
      });

      // Create quiz attempt
      const quizAttempt = new MongoDbQuizAttempts({
        userId: userId.toString(),
        quizId,
        courseId,
        chapterId,
        lessonId,
        attemptNumber: attemptCount + 1,
        answers: processedAnswers,
        score,
        percentage,
        passed,
        timeSpent: timeSpent || 0,
        completedAt: new Date(),
        status: 'completed'
      });

      await quizAttempt.save();

      // Nếu quiz passed, tự động mark lesson completed
      if (passed) {
        try {
          const LessonProgress = mongoose.model('LessonProgress');
          const CourseProgress = mongoose.model('CourseProgress');
          
          // Mark lesson as completed
          await LessonProgress.findOneAndUpdate(
            {
              userId: userId.toString(),
              courseId,
              chapterId,
              lessonId
            },
            {
              userId: userId.toString(),
              courseId,
              chapterId,
              lessonId,
              completed: true,
              completedAt: new Date(),
              timeSpent: timeSpent || 0
            },
            { upsert: true, new: true }
          );

          // Update course progress
          const completedLessons = await LessonProgress.countDocuments({
            userId: userId.toString(),
            courseId,
            completed: true
          });

          const Course = mongoose.model('Course');
          const course = await Course.findById(courseId);
          
          if (course) {
            // Calculate total lessons from Chapters and Lessons collections
            const ChaptersModel = (await import('@mongodb/chapters')).default;
            const LessonsModel = (await import('@mongodb/lessons')).default;
            
            const chapters = await ChaptersModel.model.find({
              courseId: course._id,
              status: 'active'
            });
            
            let totalLessons = 0;
            for (const chapter of chapters) {
              const lessonCount = await LessonsModel.model.countDocuments({
                chapterId: chapter._id,
                status: 'active'
              });
              totalLessons += lessonCount;
            }

            const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            // Check if course progress already exists to preserve completedAt
            const existingProgress = await CourseProgress.findOne({
              userId: userId.toString(),
              courseId
            });

            // Only set completedAt if course is newly completed (100%) and doesn't have completedAt yet
            const shouldSetCompletedAt = progressPercentage === 100 && !existingProgress?.completedAt;

            const updateData: any = {
              userId: userId.toString(),
              courseId,
              totalLessons,
              completedLessons,
              progressPercentage,
              lastAccessedAt: new Date()
            };

            // Only set completedAt once - when first reaching 100%
            let completedAtDate: Date | null = null;
            if (shouldSetCompletedAt) {
              completedAtDate = new Date();
              updateData.completedAt = completedAtDate;
            }

            await CourseProgress.findOneAndUpdate(
              {
                userId: userId.toString(),
                courseId
              },
              updateData,
              { upsert: true, new: true }
            );

            // Tự động tạo coupon quà tặng khi hoàn thành khóa học (chỉ tạo 1 lần)
            if (progressPercentage === 100 && completedAtDate) {
              try {
                const UserCouponController = (await import('@controllers/api/user/CouponController')).default;
                await UserCouponController.createCompletionCouponIfNeeded(
                  userId.toString(),
                  courseId.toString(),
                  completedAtDate
                );
              } catch (error: any) {
                console.error(`[submitQuizAttempt] Error creating completion coupon:`, error);
                // Không throw error để không ảnh hưởng đến việc submit quiz
              }
            }

            if (progressPercentage === 100 && isUserSubmit) {
              const UserModel = (await import('@mongodb/users')).default;
              const user = (await UserModel.model.findById(userId)) as any;
              if (!user.courseCompleted) {
                user.courseCompleted = [];
              }
              
              user.courseCompleted = [...user.courseCompleted, courseId];
              user.updatedAt = new Date();
              await user.save();
            }
          }
          
          console.log(`✅ Lesson ${chapterId}-${lessonId} auto-completed after quiz passed`);
        } catch (progressError: any) {
          console.error('Error auto-updating progress after quiz:', progressError);
          // Don't fail the quiz submission if progress update fails
        }
      }

      sendSuccess(res, { 
        quizAttempt,
        message: passed ? 'Congratulations! You passed the quiz.' : 'You need to retake the quiz to pass.'
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get user's quiz attempts
   */
  public static async getUserQuizAttempts(req: Request, res: Response) {
    try {
      const userId = (req as any).currentUser?._id || (req as any).currentAdmin?._id;
      const { courseId } = req.params;
      
      if (!userId) {
        return sendError(res, 401, 'User not authenticated');
      }

      const attempts = await MongoDbQuizAttempts.find({
        userId: userId.toString(),
        courseId
      }).sort({ createdAt: -1 });

      sendSuccess(res, { attempts });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Seed sample quizzes
   */
  public static async seedQuizzes(req: Request, res: Response) {
    try {
      const sampleQuizzes = [
        {
          courseId: '68fcdc39f681bccec39c8ef0', // Python course ID
          chapterIndex: 0,
          lessonIndex: 0,
          title: 'Quiz: Giới thiệu Python',
          description: 'Kiểm tra kiến thức cơ bản về Python',
          questions: [
            {
              id: 'q1',
              question: 'Python là ngôn ngữ lập trình gì?',
              type: 'multiple-choice',
              options: [
                { id: 'a', text: 'Compiled language', isCorrect: false },
                { id: 'b', text: 'Interpreted language', isCorrect: true },
                { id: 'c', text: 'Assembly language', isCorrect: false },
                { id: 'd', text: 'Machine language', isCorrect: false }
              ],
              correctAnswer: 'b',
              explanation: 'Python là ngôn ngữ lập trình thông dịch (interpreted language)',
              points: 1
            },
            {
              id: 'q2',
              question: 'Python được tạo ra bởi ai?',
              type: 'multiple-choice',
              options: [
                { id: 'a', text: 'Guido van Rossum', isCorrect: true },
                { id: 'b', text: 'James Gosling', isCorrect: false },
                { id: 'c', text: 'Bjarne Stroustrup', isCorrect: false },
                { id: 'd', text: 'Dennis Ritchie', isCorrect: false }
              ],
              correctAnswer: 'a',
              explanation: 'Python được tạo ra bởi Guido van Rossum vào năm 1991',
              points: 1
            },
            {
              id: 'q3',
              question: 'Python có thể được sử dụng cho web development.',
              type: 'true-false',
              options: [
                { id: 'true', text: 'True', isCorrect: true },
                { id: 'false', text: 'False', isCorrect: false }
              ],
              correctAnswer: 'true',
              explanation: 'Python có thể được sử dụng cho web development với frameworks như Django và Flask',
              points: 1
            }
          ],
          passingScore: 80,
          timeLimit: 10,
          attempts: 3
        },
        {
          courseId: '68fcdc39f681bccec39c8ef0',
          chapterIndex: 0,
          lessonIndex: 1,
          title: 'Quiz: Biến và Kiểu dữ liệu',
          description: 'Kiểm tra kiến thức về biến và kiểu dữ liệu trong Python',
          questions: [
            {
              id: 'q1',
              question: 'Trong Python, kiểu dữ liệu nào sau đây là immutable?',
              type: 'multiple-choice',
              options: [
                { id: 'a', text: 'List', isCorrect: false },
                { id: 'b', text: 'Dictionary', isCorrect: false },
                { id: 'c', text: 'Tuple', isCorrect: true },
                { id: 'd', text: 'Set', isCorrect: false }
              ],
              correctAnswer: 'c',
              explanation: 'Tuple là immutable trong Python, không thể thay đổi sau khi tạo',
              points: 1
            },
            {
              id: 'q2',
              question: 'Cách nào sau đây là đúng để khai báo biến trong Python?',
              type: 'multiple-choice',
              options: [
                { id: 'a', text: 'int x = 5;', isCorrect: false },
                { id: 'b', text: 'x = 5', isCorrect: true },
                { id: 'c', text: 'var x = 5;', isCorrect: false },
                { id: 'd', text: 'let x = 5;', isCorrect: false }
              ],
              correctAnswer: 'b',
              explanation: 'Python không cần khai báo kiểu dữ liệu, chỉ cần gán giá trị',
              points: 1
            }
          ],
          passingScore: 80,
          timeLimit: 15,
          attempts: 3
        }
      ];

      // Clear existing quizzes for this course
      await MongoDbQuizzes.deleteMany({ courseId: '68fcdc39f681bccec39c8ef0' });

      // Insert sample quizzes
      const quizzes = await MongoDbQuizzes.insertMany(sampleQuizzes);

      sendSuccess(res, { 
        message: `Created ${quizzes.length} sample quizzes`,
        quizzes 
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
