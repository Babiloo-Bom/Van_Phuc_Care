import mongoose, { Model, Schema } from 'mongoose';

const COLLECTION_NAME = 'settings';

const settingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    label: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const SettingsModel =
  mongoose.models[COLLECTION_NAME] ||
  mongoose.model(COLLECTION_NAME, settingsSchema, COLLECTION_NAME);

export default { model: SettingsModel, COLLECTION_NAME };
