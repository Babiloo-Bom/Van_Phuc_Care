import mongoose, { Model, Schema } from 'mongoose';

class Modules {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'modules';
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      // _id: Schema.Types.String,
      name: {
        type: String,
      },
      columns: [
        {
          label: {
            type: String,
          },
          key: {
            type: String,
          },
          type: {
            type: String,
          },
          require: {
            type: Boolean,
          },
          showInTable: {
            type: Boolean,
          },
        },
      ],
      settings: {
        pageShow: 20,
        excel: false,
      },
    },
    {
      timestamps: {
      },
    },
    );
    if (!mongoose.models[Modules.COLLECTION_NAME]) {
      mongoose.model(Modules.COLLECTION_NAME, this.schema, Modules.COLLECTION_NAME);
    }
    this.model = mongoose.model(Modules.COLLECTION_NAME);
  }
}

export default new Modules();
