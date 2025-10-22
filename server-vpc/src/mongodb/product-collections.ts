import mongoose, { Model, Schema } from 'mongoose';

class ProductCollection {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'product-collections';
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
      products: [],
      status: {
        type: String,
        default: 'active',
      },
      content: {
        type: String,
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
    if (!mongoose.models[ProductCollection.COLLECTION_NAME]) {
      mongoose.model(ProductCollection.COLLECTION_NAME, this.schema, ProductCollection.COLLECTION_NAME);
    }
    this.model = mongoose.model(ProductCollection.COLLECTION_NAME);
  }
}

export default new ProductCollection();
