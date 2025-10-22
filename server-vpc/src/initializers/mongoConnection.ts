import mongoose from 'mongoose';

class MongoDB {
  private uri: string;

  constructor () {
    // Nên sử dụng biến môi trường để bảo vệ thông tin nhạy cảm
    this.uri = 'mongodb+srv://minhpham2615:6enDryMjUbIB6jRg@vanphucdev.o40sa.mongodb.net/?retryWrites=true&w=majority&appName=VanphucDev';
    this.connect();
  }

  public async connect (): Promise<void> {
    try {
      // Cấu hình strictQuery
      mongoose.set('strictQuery', false);

      // Kết nối tới MongoDB
      await mongoose.connect(this.uri, { dbName: 'vanphuccare' });

      console.log('\x1b[32mMongoDB database connection successfully\x1b[0m');

      // Bật chế độ debug để log query
      mongoose.set('debug', true);
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
    }
  }
}

// Export instance để sử dụng trong các nơi khác
export default new MongoDB();
