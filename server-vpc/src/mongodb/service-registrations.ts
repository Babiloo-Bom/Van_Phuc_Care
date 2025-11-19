import mongoose, { Model, Schema } from 'mongoose';

class ServiceRegistrationModels {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'service_registrations';

  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      userId: {
        type: String,
        required: true,
      },
      serviceId: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        default: 'registered',
        enum: ['registered', 'cancelled', 'completed'],
      },
    }, {
      timestamps: true,
    });
    if (!mongoose.models[ServiceRegistrationModels.COLLECTION_NAME]) {
      mongoose.model(ServiceRegistrationModels.COLLECTION_NAME, this.schema, ServiceRegistrationModels.COLLECTION_NAME);
    }
    this.model = mongoose.model(ServiceRegistrationModels.COLLECTION_NAME);
  }
}

export default new ServiceRegistrationModels();
