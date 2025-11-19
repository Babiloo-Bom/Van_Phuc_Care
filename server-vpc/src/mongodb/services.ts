import mongoose, { Model, Schema } from 'mongoose';

class ServiceModels {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'services';

  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema(
      {
        origin: { type: String },
        title: { type: String },
        thumbnail: { type: String },
        descriptions: { type: String },
        shortDescriptions: { type: String },
        usageTimeUnit: { type: String },
        implementer: {
          fullname: { type: String },
          avatar: { type: String },
          position: { type: String },
        },
        slug: { type: String },
        reviews: { type: Number, default: 0 },
        status: { type: String, default: "active", enum: ["active", "inactive"] },
      },
      {
        strict: false,
        timestamps: true,
      }
    );
    if (!mongoose.models[ServiceModels.COLLECTION_NAME]) {
      mongoose.model(ServiceModels.COLLECTION_NAME, this.schema, ServiceModels.COLLECTION_NAME);
    }
    this.model = mongoose.model(ServiceModels.COLLECTION_NAME);
  }

  public async updateNumberReview (serviceId: String, number: Number) {
    try {
      await this.model.findByIdAndUpdate(
        serviceId,
        {
          $inc: { reviews: number },
        },
        { new: true },
      );
      return true;
    } catch {
      return false;
    }
  }
}

export default new ServiceModels();
