import mongoose, { Model, Schema } from 'mongoose';

class Feedbacks {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'feedbacks';
  public readonly CREATED_BY = { ADMIN: 'admin', CUSTOMER: 'customer' };
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      avatar: {
        type: String,
      },
      email: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      createdBy: {
        type: String,
        default: 'admin',
        enum: ['admin', 'customer'],
      },
      content: {
        type: String,
      },
      position: {
        type: String,
      },
      product: {
        type: String,
      },
      fullname: {
        type: String,
      },
      status: {
        type: String,
        default: 'inactive',
        enum: ['active', 'inactive'],
      },
    },
    {
      timestamps: {
      },
    },
    );
    if (!mongoose.models[Feedbacks.COLLECTION_NAME]) {
      mongoose.model(Feedbacks.COLLECTION_NAME, this.schema, Feedbacks.COLLECTION_NAME);
    }
    this.model = mongoose.model(Feedbacks.COLLECTION_NAME);
  }
}

export default new Feedbacks();
