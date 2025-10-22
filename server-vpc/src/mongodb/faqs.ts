import mongoose, { Model, Schema } from 'mongoose';

class Faqs {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'faqs';
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      // _id: Schema.Types.String,
      title: {
        type: String,
      },
      content: {
        type: String,
      },
      status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive'],
      },
      slug: {
        type: String,
        unique: [true, 'slug đã tồn tại'],
      },
    },
    {
      timestamps: {
      },
    },
    );
    if (!mongoose.models[Faqs.COLLECTION_NAME]) {
      mongoose.model(Faqs.COLLECTION_NAME, this.schema, Faqs.COLLECTION_NAME);
    }
    this.model = mongoose.model(Faqs.COLLECTION_NAME);
  }
}

export default new Faqs();
