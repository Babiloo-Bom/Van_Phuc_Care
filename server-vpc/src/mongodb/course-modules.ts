import mongoose, { Model, Schema } from 'mongoose';

class CourseModules {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'course-modules';

  constructor() {
    this.generateSchema();
  }

  public generateSchema() {
    this.schema = new Schema({
      courseId: {
        type: Schema.Types.ObjectId,
        ref: 'courses',
        required: true,
        index: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: '',
      },
      index: {
        type: Number,
        required: true,
        default: 0,
      },
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
      },
    }, {
      timestamps: true,
    });

    // Tạo index cho courseId và index để query nhanh
    this.schema.index({ courseId: 1, index: 1 });

    if (!mongoose.models[CourseModules.COLLECTION_NAME]) {
      mongoose.model(CourseModules.COLLECTION_NAME, this.schema, CourseModules.COLLECTION_NAME);
    }
    this.model = mongoose.model(CourseModules.COLLECTION_NAME);
  }
}

export default new CourseModules();

