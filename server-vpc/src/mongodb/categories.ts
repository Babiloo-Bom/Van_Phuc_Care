import mongoose, { Model, Schema } from 'mongoose';

class Category {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'categories';
  public readonly TYPE_ENUM = { PRODUCT: 'recruitment', BLOG: 'blog' };
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      type: {
        type: String,
      },
      title: {
        type: String,
      },
      thumbnail: {
        type: String,
      },
      postCount: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
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
    if (!mongoose.models[Category.COLLECTION_NAME]) {
      mongoose.model(Category.COLLECTION_NAME, this.schema, Category.COLLECTION_NAME);
    }
    this.model = mongoose.model(Category.COLLECTION_NAME);
  }
}

export default new Category();
