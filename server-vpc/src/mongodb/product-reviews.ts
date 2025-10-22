import mongoose, { Model, Schema } from 'mongoose';

class ProductReview {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'product-reviews';
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
      thumbnail: {
        type: String,
      },
      status: {
        type: String,
        default: 'verified',
      },
      content: {
        type: String,
      },
      rate: {
        type: Number,
      },
      slug: {
        type: String,
      },
    },
    {
      strict: false,
      timestamps: {
      },
    },
    );
    if (!mongoose.models[ProductReview.COLLECTION_NAME]) {
      mongoose.model(ProductReview.COLLECTION_NAME, this.schema, ProductReview.COLLECTION_NAME);
    }
    this.model = mongoose.model(ProductReview.COLLECTION_NAME);
  }
}

export default new ProductReview();
