import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

export interface IHealthRecord extends Document {
  userId: string;
  healthBookId: mongoose.Types.ObjectId | string;
  customerId: mongoose.Types.ObjectId | string;
  date: Date;
  temperature?: number;
  height?: number;
  weight?: number;
  
  // Tình trạng da
  skinCondition?: string;
  skinConditionNote?: string;
  
  // Sức khỏe răng miệng
  oralHealth?: string;
  oralHealthNote?: string;
  
  // Dinh dưỡng
  nutrition?: string;
  nutritionNote?: string;
  
  // Giấc ngủ
  sleep?: string;
  sleepNote?: string;
  
  // Tiêu hóa
  stoolFrequency?: string;
  stoolCondition?: string;
  digestiveIssues?: string;
  
  // Lịch sinh hoạt
  schedule?: string;
  
  // Ghi chú
  notes?: string;
  
  // Mốc phát triển
  developmentMilestone?: string;
  
  // Vận động thô
  grossMotorSkills?: string;
  
  // Vận động tinh
  fineMotorSkills?: string;
  
  // Thị giác và nhận thức
  visualCognition?: string;
  
  // Giao tiếp và cảm xúc
  communicationEmotion?: string;
  
  // Dấu hiệu cảnh báo sớm
  earlyWarning?: string;
  
  // Legacy fields (kept for backward compatibility)
  method?: string;
  motorSkills?: string;
  vaccination?: {
    date?: Date;
    dose?: string;
  } | null;
  healthStatus?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const HealthRecordSchema = new mongoose.Schema<IHealthRecord>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  healthBookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'health-books',
    required: true,
    index: true,
  },
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
  
  // Tình trạng da
  skinCondition: String,
  skinConditionNote: String,
  
  // Sức khỏe răng miệng
  oralHealth: String,
  oralHealthNote: String,
  
  // Dinh dưỡng
  nutrition: String,
  nutritionNote: String,
  
  // Giấc ngủ
  sleep: String,
  sleepNote: String,
  
  // Tiêu hóa
  stoolFrequency: String,
  stoolCondition: String,
  digestiveIssues: String,
  
  // Lịch sinh hoạt
  schedule: String,
  
  // Ghi chú
  notes: String,
  
  // Mốc phát triển
  developmentMilestone: String,
  
  // Vận động thô
  grossMotorSkills: String,
  
  // Vận động tinh
  fineMotorSkills: String,
  
  // Thị giác và nhận thức
  visualCognition: String,
  
  // Giao tiếp và cảm xúc
  communicationEmotion: String,
  
  // Dấu hiệu cảnh báo sớm
  earlyWarning: String,
  
  // Legacy fields (kept for backward compatibility)
  method: String,
  motorSkills: String,
  vaccination: {
    type: {
      date: Date,
      dose: String,
    },
    default: null,
  },
  healthStatus: String,
}, {
  timestamps: true,
  collection: 'health_records',
});

// Ensure one record per healthBook per day
HealthRecordSchema.index({ healthBookId: 1, date: 1 }, { unique: true });
HealthRecordSchema.index({ customerId: 1, date: 1 });

const HealthRecordModel: Model<IHealthRecord> = mongoose.model<IHealthRecord>('health_records', HealthRecordSchema);

export const MongoDbHealthRecords = {
  model: HealthRecordModel,
  schema: HealthRecordSchema,
};

export default MongoDbHealthRecords;
