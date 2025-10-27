import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbQuizzes from '@mongodb/quizzes';
import MongoDbQuizAttempts from '@mongodb/quiz-attempts';

export default class QuizController {
  /**
   * Get quiz by course, chapter, and lesson
   */
  public static async getQuiz(req: Request, res: Response) {
    try {
      const { courseId, chapterIndex, lessonIndex } = req.params;
      
      const quiz = await MongoDbQuizzes.findOne({
        courseId,
        chapterIndex: parseInt(chapterIndex),
        lessonIndex: parseInt(lessonIndex),
        status: 'active'
      });

      if (!quiz) {
        return sendSuccess(res, { quiz: null, message: 'No quiz found for this lesson' });
      }

      sendSuccess(res, { quiz });
    } catch (error: any) {
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
      
      if (!userId) {
        return sendError(res, 401, 'User not authenticated');
      }

      const { quizId, courseId, chapterIndex, lessonIndex, answers, timeSpent } = req.body;

      // Get quiz details
      const quiz = await MongoDbQuizzes.findById(quizId);
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
        chapterIndex,
        lessonIndex,
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
