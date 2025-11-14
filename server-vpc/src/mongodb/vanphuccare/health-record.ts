import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

export interface IHealthRecord extends Document {
  customerId: mongoose.Types.ObjectId | string;
  date: Date;
  temperature?: number;
  height?: number;
  weight?: number;
  skinCondition?: string;
  oralHealth?: string;
  nutrition?: string;
  sleep?: string;
  stoolFrequency?: string;
  stoolCondition?: string;
  digestiveIssues?: string;
  method?: string;
  motorSkills?: string;
  vaccination?: {
    date?: Date;
    dose?: string;
  } | null;
  notes?: string;
  healthStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HealthRecordSchema = new mongoose.Schema<IHealthRecord>({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customers',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  temperature: Number,
  height: Number,
  weight: Number,
  skinCondition: String,
  oralHealth: String,
  nutrition: String,
  sleep: String,
  stoolFrequency: String,
  stoolCondition: String,
  digestiveIssues: String,
  method: String,
  motorSkills: String,
  vaccination: {
    type: {
      date: Date,
      dose: String,
    },
    default: null,
  },
  notes: String,
  healthStatus: String,
}, {
  timestamps: true,
  collection: 'health_records',
});

const HealthRecordModel: Model<IHealthRecord> = mongoose.model<IHealthRecord>('health_records', HealthRecordSchema);

export const MongoDbHealthRecords = {
  model: HealthRecordModel,
  schema: HealthRecordSchema,
};

export default MongoDbHealthRecords;
