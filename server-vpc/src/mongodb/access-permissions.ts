import mongoose, { Model, Schema } from 'mongoose';

class AccessPermissionModels {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'access-permissions';
  public readonly STATUS_ENUM = { PENDING: 'pending', DENIED: 'denied', ACCEPTED: 'accepted' };

  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      // _id: Schema.Types.String,
      origin: {
        type: String,
        require: true,
      },
      type: {
        type: String,
        require: true,
      },
      request: {
      },
      access: {
      },
      status: {
        type: String,
        default: 'pending',
        enum: this.STATUS_ENUM,
      },
    },
    {
      strict: false,
      timestamps: {
      },
    },
    );
    if (!mongoose.models[AccessPermissionModels.COLLECTION_NAME]) {
      mongoose.model(AccessPermissionModels.COLLECTION_NAME, this.schema, AccessPermissionModels.COLLECTION_NAME);
    }
    this.model = mongoose.model(AccessPermissionModels.COLLECTION_NAME);
  }
}

export default new AccessPermissionModels();
