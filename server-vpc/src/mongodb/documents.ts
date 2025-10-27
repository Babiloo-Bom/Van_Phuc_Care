import mongoose, { Model, Schema } from 'mongoose';

const documentSchema = new Schema({
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
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    default: 0 // in bytes
  },
  fileType: {
    type: String,
    required: true // pdf, doc, docx, ppt, pptx, etc.
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  isRequired: {
    type: Boolean,
    default: false
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
const MongoDbDocuments = mongoose.models.Document || mongoose.model('Document', documentSchema, 'documents');

export default MongoDbDocuments;
