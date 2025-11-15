import mongoose, { Model, Schema } from 'mongoose';

const quizSchema = new Schema({
  courseId: {
    type: String,
    required: true,
    index: true
  },
  chapterId: {
    type: String,
    required: true
  },
  lessonId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  questions: [{
    id: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'fill-in-blank'],
      default: 'multiple-choice'
    },
    options: [{
      id: String,
      text: String,
      isCorrect: Boolean
    }],
    correctAnswer: {
      type: String,
      required: true
    },
    explanation: {
      type: String,
      default: ''
    },
    points: {
      type: Number,
      default: 1
    }
  }],
  passingScore: {
    type: Number,
    default: 80 // 80% to pass
  },
  timeLimit: {
    type: Number,
    default: 0 // 0 means no time limit (in minutes)
  },
  attempts: {
    type: Number,
    default: 3 // Maximum attempts allowed
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Create model if it doesn't exist
const MongoDbQuizzes = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema, 'quizzes');

export default MongoDbQuizzes;
