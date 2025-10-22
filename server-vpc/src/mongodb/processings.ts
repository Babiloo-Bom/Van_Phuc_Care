import mongoose, { Model, Schema } from 'mongoose';

class Processings {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'processings';
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      percent: {
        type: Number,
      },
    },
    {
      strict: false,
      timestamps: {
      },
    },
    );
    if (!mongoose.models[Processings.COLLECTION_NAME]) {
      mongoose.model(Processings.COLLECTION_NAME, this.schema, Processings.COLLECTION_NAME);
    }
    this.model = mongoose.model(Processings.COLLECTION_NAME);
  }
}

export default new Processings();
