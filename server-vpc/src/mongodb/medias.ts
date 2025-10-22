import mongoose, { Model, Schema } from 'mongoose';

class Medias {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'medias';
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      source: {
        type: String,
      },
      title: {
        type: String,
      },
      status: {
        default: 'active',
        type: String,
      },
      type: {
        type: String,
      },
      showHome: {
        type: Boolean,
        default: true,
      },
    },
    {
      strict: false, // Allow dynamic fields
      timestamps: {
      },
    },
    );
    if (!mongoose.models[Medias.COLLECTION_NAME]) {
      mongoose.model(Medias.COLLECTION_NAME, this.schema, Medias.COLLECTION_NAME);
    }
    this.model = mongoose.model(Medias.COLLECTION_NAME);
  }
}

export default new Medias();
