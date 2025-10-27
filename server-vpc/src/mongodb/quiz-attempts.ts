import mongoose, { Model, Schema } from 'mongoose';

const quizAttemptSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  quizId: {
    type: String,
    required: true,
    index: true
  },
  courseId: {
    type: String,
    required: true,
    index: true
  },
  chapterIndex: {
    type: Number,
    required: true
  },
  lessonIndex: {
    type: Number,
    required: true
  },
  attemptNumber: {
    type: Number,
    required: true,
    default: 1
  },
  answers: [{
    questionId: String,
    answer: String,
    isCorrect: Boolean,
    points: Number
  }],
  score: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  passed: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number,
    default: 0 // in seconds
  },
  completedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  }
}, {
  timestamps: true
});

// Create model if it doesn't exist
const MongoDbQuizAttempts = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', quizAttemptSchema, 'quiz_attempts');

export default MongoDbQuizAttempts;
