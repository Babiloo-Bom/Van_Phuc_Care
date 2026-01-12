import mongoose from 'mongoose';

class MongoDB {
  private uri: string;

  constructor () {
    // Đọc MONGODB_URI từ environment variable
    // Fallback về MongoDB Atlas nếu không có env var (để backward compatibility)
    this.uri = process.env.MONGODB_URI || 'mongodb+srv://minhpham2615:6enDryMjUbIB6jRg@vanphucdev.o40sa.mongodb.net/?retryWrites=true&w=majority&appName=VanphucDev';
    console.log('MongoDB URI:', this.uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Log URI with masked password
    this.connect();
  }

  public async connect (): Promise<void> {
    try {
      // Cấu hình strictQuery
      mongoose.set('strictQuery', false);

      // Kết nối tới MongoDB
      await mongoose.connect(this.uri, { 
        dbName: 'vanphuccare',
        serverSelectionTimeoutMS: 30000, // Timeout sau 30 giây để đợi MongoDB sẵn sàng
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000, // Timeout cho việc thiết lập kết nối
        maxPoolSize: 10, // Số lượng kết nối tối đa trong pool
        retryWrites: true,
        retryReads: true,
      });

      console.log('\x1b[32mMongoDB database connection successfully\x1b[0m');

      // Bật chế độ debug để log query (chỉ trong development)
      if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
      }
    } catch (error: any) {
      console.error('❌ MongoDB connection error:', error.message);
      console.error('❌ MongoDB error stack:', error.stack);
      // Không throw error để server vẫn có thể start, nhưng sẽ log lỗi
    }
  }
}

// Export instance để sử dụng trong các nơi khác
export default new MongoDB();
