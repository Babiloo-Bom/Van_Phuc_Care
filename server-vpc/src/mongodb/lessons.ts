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
            default: '',
            // videoUrl không required vì có thể đang trong quá trình upload/processing
            // Sẽ validate trong code logic
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
          // Trạng thái xử lý video
          status: {
            type: String,
            enum: ['uploading', 'queueing', 'processing', 'ready', 'error'],
            default: 'uploading',
          },
          // HLS URL (sau khi convert)
          hlsUrl: {
            type: String,
            default: '',
          },
          // Job ID để track video processing status
          jobId: {
            type: String,
            default: '',
          },
          // Error message nếu có lỗi
          errorMessage: {
            type: String,
            default: '',
          },
          // Metadata về chất lượng video
          qualityMetadata: {
            resolution: {
              type: String,
              default: '',
            },
            bitrate: {
              type: String,
              default: '',
            },
            codec: {
              type: String,
              default: '',
            },
            fps: {
              type: Number,
              default: 0,
            },
            segments: {
              type: Number,
              default: 0,
            },
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
      order: {
        type: Number,
        default: 0,
      },
      // Lesson display sections - Admin can choose which sections to show
      showVideo: {
        type: Boolean,
        default: false,
      },
      showText: {
        type: Boolean,
        default: false,
      },
      showDocument: {
        type: Boolean,
        default: false,
      },
      showQuiz: {
        type: Boolean,
        default: false,
      },
      // Section names - Custom names for each section
      videoSectionName: {
        type: String,
        default: '',
      },
      textSectionName: {
        type: String,
        default: '',
      },
      documentSectionName: {
        type: String,
        default: '',
      },
      quizSectionName: {
        type: String,
        default: '',
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

