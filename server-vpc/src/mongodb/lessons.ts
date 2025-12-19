import mongoose, { Model, Schema } from 'mongoose';

class Lessons {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'lessons';

  constructor() {
    this.generateSchema();
  }

  public generateSchema() {
    this.schema = new Schema({
      chapterId: {
        type: Schema.Types.ObjectId,
        ref: 'chapters',
        required: true,
        index: true,
      },
      quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        default: null,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: '',
      },
      content: {
        type: String,
        default: '',
      },
      documents: [
        {
          title: {
            type: String,
            required: true,
          },
          fileUrl: {
            type: String,
            required: true,
          },
          fileName: {
            type: String,
            required: true,
          },
          fileSize: {
            type: Number,
            default: 0,
          },
          fileType: {
            type: String,
            required: true,
          },
          index: {
            type: Number,
            default: 0,
          },
        },
      ],
      videos: [
        {
          title: {
            type: String,
            required: true,
          },
          videoUrl: {
            type: String,
            required: true,
          },
          thumbnail: {
            type: String,
            default: '',
          },
          duration: {
            type: Number,
            default: 0,
          },
          fileSize: {
            type: Number,
            default: 0,
          },
          quality: {
            type: String,
            default: '720',
          },
          index: {
            type: Number,
            default: 0,
          },
        },
      ],
      duration: {
        type: Number,
        default: 0,
      },
      type: {
        type: String,
        enum: ['video', 'document', 'text', 'quiz', 'project'], // Thêm 'text'
        default: 'video',
      },
      isPreview: {
        type: Boolean,
        default: false,
      },
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
      },
    }, {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    });

    this.schema.virtual('chapter', {
      ref: 'chapters',
      localField: 'chapterId',
      foreignField: '_id',
      justOne: true,
    });

    this.schema.virtual('quiz', {
      ref: 'Quiz',
      localField: 'quizId',
      foreignField: '_id',
      justOne: true,
    });

    if (!mongoose.models[Lessons.COLLECTION_NAME]) {
      mongoose.model(Lessons.COLLECTION_NAME, this.schema, Lessons.COLLECTION_NAME);
    }
    this.model = mongoose.model(Lessons.COLLECTION_NAME);
  }
}

export default new Lessons();

