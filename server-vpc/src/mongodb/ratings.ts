import mongoose, { Model, Schema } from 'mongoose';

class RatingModels {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'ratings';

  public readonly CREATABLE_PARAMETERS = ['rating', 'content', 'sources']

  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      // _id: Schema.Types.String,
      userId: {
        type: String,
      },
      productId: {
        type: String,
      },
      rating: {
        type: Number,
      },
      content: {
        type: String,
      },
      sources: {
        type: String,
      },
      status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive'],
      },
      user: {},
    },
    {
      timestamps: {
      },
    },
    );
    if (!mongoose.models[RatingModels.COLLECTION_NAME]) {
      mongoose.model(RatingModels.COLLECTION_NAME, this.schema, RatingModels.COLLECTION_NAME);
    }
    this.model = mongoose.model(RatingModels.COLLECTION_NAME);
  }
}

export default new RatingModels();
