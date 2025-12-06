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
        origin: { type: String, required: true },       // nguồn giao dịch (web/app/api)
        userId: { type: String, required: true },       // ID người dùng
        type: { type: String, required: true },         // loại giao dịch
        title: { type: String, required: true },        // mô tả ngắn
        total: { type: Number, required: true },        // tổng tiền
        fee: { type: Number, default: 0 },              // phí giao dịch
        retryCount: { type: Number, default: 0 },       // số lần retry

        paymentMethod: { type: String, default: null }, // momo, vnpay, cod, wallet...
        
        status: {
          type: String,
          default: this.STATUS_ENUM.PENDING,
          enum: Object.values(this.STATUS_ENUM),
        },

        paidAt: { type: Date, default: null },          // thời điểm thanh toán thành công
        expiredAt: { type: Date, default: null },       // thời gian hết hạn giao dịch

        orderId: { type: String },                  // mã tham chiếu đối tác
        referenceId: { type: String },                  // mã tham chiếu đối tác
        metadata: { type: Schema.Types.Mixed, default: {} },

        errorMessage: { type: String },
        errorCode: { type: String },
      },
      {
        strict: false,
        timestamps: true,
      }
    );
    if (!mongoose.models[TransactionModels.COLLECTION_NAME]) {
      mongoose.model(TransactionModels.COLLECTION_NAME, this.schema, TransactionModels.COLLECTION_NAME);
    }
    this.schema.index({ userId: 1 });
    this.model = mongoose.model(TransactionModels.COLLECTION_NAME);
  }
}

export default new TransactionModels();
