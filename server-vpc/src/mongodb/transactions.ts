import mongoose, { Model, Schema } from 'mongoose';

class TransactionModels {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'transactions';
  public readonly STATUS_ENUM = { PENDING: 'pending', SUCCESS: 'success', DENIED: 'denied', ACTIVE: 'active', INACTIVE: 'inactive' };

  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema(
      {
        origin: { type: String, require: true },
        userId: { type: String, require: true },
        type: { type: String, require: true },
        title: { type: String, require: true },
        total: { type: Number, require: true },
        status: { type: String, default: "pending", enum: Object.values(this.STATUS_ENUM) },
      },
      {
        strict: false,
        timestamps: true,
      }
    );
    if (!mongoose.models[TransactionModels.COLLECTION_NAME]) {
      mongoose.model(TransactionModels.COLLECTION_NAME, this.schema, TransactionModels.COLLECTION_NAME);
    }
    this.model = mongoose.model(TransactionModels.COLLECTION_NAME);
  }
}

export default new TransactionModels();
