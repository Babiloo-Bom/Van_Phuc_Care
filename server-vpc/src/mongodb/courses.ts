import mongoose, { Model, Schema } from 'mongoose';

class Courses {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'courses';
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      code: {
        type: String,
      },
      name: {
        type: String,
      },
      status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive'],
      },
      notes: {
        type: String,
      },
    },
    {
      timestamps: {
      },
    },
    );
    if (!mongoose.models[Courses.COLLECTION_NAME]) {
      mongoose.model(Courses.COLLECTION_NAME, this.schema, Courses.COLLECTION_NAME);
    }
    this.model = mongoose.model(Courses.COLLECTION_NAME);
  }
}

export default new Courses();
