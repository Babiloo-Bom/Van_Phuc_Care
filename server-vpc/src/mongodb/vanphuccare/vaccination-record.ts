import mongoose, { Model, Schema } from 'mongoose';

class VaccinationRecords {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'vaccination-records';

  constructor() {
    this.generateSchema();
  }

  public generateSchema() {
    this.schema = new Schema(
      {
        customerId: {
          type: String,
          required: true,
          index: true,
        },
        healthBookId: {
          type: String,
          required: true,
          index: true,
        },
        vaccineId: {
          type: Schema.Types.ObjectId,
          ref: 'schedule-vaccins',
          required: true,
        },
        scheduledDate: {
          type: Date,
          required: false,
        },
        injectionDate: {
          type: Date,
          required: false,
        },
        status: {
          type: String,
          enum: ['completed', 'pending', 'scheduled', 'skipped'],
          default: 'pending',
          required: true,
        },
        location: {
          type: String,
          required: false,
        },
        notes: {
          type: String,
          required: false,
        },
        injectionNumber: {
          type: Number,
          default: 1,
          required: false,
        },
        sideEffects: {
          type: String,
          required: false,
        },
        nextDoseDate: {
          type: Date,
          required: false,
        },
        domain: {
          type: String,
          required: true,
        },
      },
      {
        strict: false,
        timestamps: true,
      }
    );

    // Indexes
    this.schema.index({ domain: 1, customerId: 1 });
    this.schema.index({ domain: 1, healthBookId: 1 });
    this.schema.index({ vaccineId: 1, customerId: 1 });

    if (!mongoose.models[VaccinationRecords.COLLECTION_NAME]) {
      mongoose.model(VaccinationRecords.COLLECTION_NAME, this.schema, VaccinationRecords.COLLECTION_NAME);
    }

    this.model = mongoose.model(VaccinationRecords.COLLECTION_NAME);
  }
}

export default new VaccinationRecords();
