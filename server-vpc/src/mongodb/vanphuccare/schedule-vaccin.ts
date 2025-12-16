import mongoose, { Model, Schema } from 'mongoose';

class ScheduleVaccins {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'schedule-vaccins';
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      customerId: {
        type: String,
      },
      thumbnail: {
        type: String,
      },
      content: {
        type: String,
      },
      title: {
        type: String,
      },
      time: {
        type: String,
      },
      numberOfInjections: {
        type: String,
      },
      address: {
        type: String,
      },
      status: {
        type: String,
      },
      detailLink: {
        type: String,
        default: '',
      },
      domain: {
        type: String,
        require: true,
      },
    },
    {
      strict: false, // Allow dynamic fields
      timestamps: {
      },
    },
    );
    this.schema.index({ domain: 1, customerId: 1 });
    if (!mongoose.models[ScheduleVaccins.COLLECTION_NAME]) {
      mongoose.model(ScheduleVaccins.COLLECTION_NAME, this.schema, ScheduleVaccins.COLLECTION_NAME);
    }
    this.model = mongoose.model(ScheduleVaccins.COLLECTION_NAME);
  }
}

export default new ScheduleVaccins();
