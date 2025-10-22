import mongoose, { Model, Schema } from 'mongoose';

class ProductReview {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'course-reviews';
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      type: {
        type: String,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      status: {
        type: String,
        default: 'unverified',
      },
      content: {
        type: String,
      },
      domain: {
        type: String,
      },
      rate: {
        type: Number,
      },
      idCourse: {
        type: String,
      },
    },
    {
      strict: false,
      timestamps: {
      },
    },
    );
    this.schema.index({ name: 1, domain: 1 });
    if (!mongoose.models[ProductReview.COLLECTION_NAME]) {
      mongoose.model(ProductReview.COLLECTION_NAME, this.schema, ProductReview.COLLECTION_NAME);
    }
    this.model = mongoose.model(ProductReview.COLLECTION_NAME);
  }
}

export default new ProductReview();
