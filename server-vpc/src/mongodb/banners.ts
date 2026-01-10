import mongoose, { Model, Schema } from 'mongoose';

class Banners {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'banners';
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      page: {
        type: String,
        required: true,
        enum: ['all-courses', 'my-courses'],
      },
      title: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        default: '',
      },
      order: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive'],
      },
    },
    {
      timestamps: true,
    },
    );
    if (!mongoose.models[Banners.COLLECTION_NAME]) {
      mongoose.model(Banners.COLLECTION_NAME, this.schema, Banners.COLLECTION_NAME);
    }
    this.model = mongoose.model(Banners.COLLECTION_NAME);
  }
}

export default new Banners();

