import cron from 'node-cron';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Scheduled Job để cleanup các file tạm thời cũ từ video upload
 * Chạy mỗi ngày 1 lần vào lúc 3:00 AM
 */
class TempFileCleanupJob {
  private cronJob: cron.ScheduledTask | null = null;
  private readonly MAX_AGE_HOURS = 24; // Xóa file cũ hơn 24 giờ
  private readonly TEMP_DIRS = [
    path.join(os.tmpdir(), 'video-uploads'),      // File video tạm thời
    path.join(os.tmpdir(), 'hls-uploads'),        // Thư mục HLS tạm thời
    path.join(os.tmpdir(), 'hls-conversions'),    // Thư mục conversion tạm thời
  ];

  constructor() {
    this.start();
  }

  /**
   * Khởi động scheduled job
   * Chạy mỗi ngày lúc 3:00 AM
   */
  private start() {
    // Cron expression: "0 3 * * *" = Mỗi ngày lúc 3:00 AM
    this.cronJob = cron.schedule('0 3 * * *', async () => {
      console.log('🧹 [Temp File Cleanup] Bắt đầu cleanup file tạm thời cũ...');
      await this.cleanup();
    }, {
      scheduled: true,
      timezone: 'Asia/Ho_Chi_Minh',
    });

    console.log('✅ [Temp File Cleanup] Scheduled job đã được khởi động: Cleanup file tạm thời mỗi ngày lúc 3:00 AM');
  }

  /**
   * Dừng scheduled job
   */
  public stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log('⏹️ [Temp File Cleanup] Scheduled job đã được dừng');
    }
  }

  /**
   * Cleanup các file tạm thời cũ
   */
  private async cleanup(): Promise<void> {
    const now = Date.now();
    const maxAge = this.MAX_AGE_HOURS * 60 * 60 * 1000; // Convert hours to milliseconds
    let totalDeleted = 0;
    let totalSize = 0;

    for (const tempDir of this.TEMP_DIRS) {
      try {
        if (!fs.existsSync(tempDir)) {
          continue;
        }

        const stats = fs.statSync(tempDir);
        
        // Nếu là file, kiểm tra và xóa
        if (stats.isFile()) {
          const age = now - stats.mtimeMs;
          if (age > maxAge) {
            try {
              const fileSize = stats.size;
              fs.unlinkSync(tempDir);
              totalDeleted++;
              totalSize += fileSize;
              console.log(`🗑️ [Temp File Cleanup] Đã xóa file: ${tempDir} (${this.formatFileSize(fileSize)})`);
            } catch (error: any) {
              console.warn(`⚠️ [Temp File Cleanup] Không thể xóa file ${tempDir}:`, error.message);
            }
          }
        } 
        // Nếu là thư mục, duyệt và xóa các file/thư mục cũ
        else if (stats.isDirectory()) {
          const deleted = await this.cleanupDirectory(tempDir, maxAge, now);
          totalDeleted += deleted.count;
          totalSize += deleted.size;
        }
      } catch (error: any) {
        console.warn(`⚠️ [Temp File Cleanup] Lỗi khi xử lý ${tempDir}:`, error.message);
      }
    }

    if (totalDeleted > 0) {
      console.log(`✅ [Temp File Cleanup] Hoàn thành: Đã xóa ${totalDeleted} file/thư mục, giải phóng ${this.formatFileSize(totalSize)}`);
    } else {
      console.log(`✅ [Temp File Cleanup] Không có file tạm thời cũ cần xóa`);
    }
  }

  /**
   * Cleanup một thư mục và các file/thư mục con
   */
  private async cleanupDirectory(dirPath: string, maxAge: number, now: number): Promise<{ count: number; size: number }> {
    let deletedCount = 0;
    let deletedSize = 0;

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        try {
          const stats = fs.statSync(fullPath);
          const age = now - stats.mtimeMs;

          // Nếu file/thư mục cũ hơn maxAge, xóa
          if (age > maxAge) {
            if (entry.isDirectory()) {
              // Xóa thư mục và tất cả nội dung
              const dirSize = this.getDirectorySize(fullPath);
              fs.rmSync(fullPath, { recursive: true, force: true });
              deletedCount++;
              deletedSize += dirSize;
              console.log(`🗑️ [Temp File Cleanup] Đã xóa thư mục: ${fullPath} (${this.formatFileSize(dirSize)})`);
            } else {
              // Xóa file
              const fileSize = stats.size;
              fs.unlinkSync(fullPath);
              deletedCount++;
              deletedSize += fileSize;
              console.log(`🗑️ [Temp File Cleanup] Đã xóa file: ${fullPath} (${this.formatFileSize(fileSize)})`);
            }
          } else if (entry.isDirectory()) {
            // Nếu thư mục chưa cũ, tiếp tục duyệt bên trong
            const result = await this.cleanupDirectory(fullPath, maxAge, now);
            deletedCount += result.count;
            deletedSize += result.size;
          }
        } catch (error: any) {
          console.warn(`⚠️ [Temp File Cleanup] Không thể xóa ${fullPath}:`, error.message);
        }
      }
    } catch (error: any) {
      console.warn(`⚠️ [Temp File Cleanup] Lỗi khi đọc thư mục ${dirPath}:`, error.message);
    }

    return { count: deletedCount, size: deletedSize };
  }

  /**
   * Tính tổng kích thước của một thư mục
   */
  private getDirectorySize(dirPath: string): number {
    let totalSize = 0;

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        try {
          if (entry.isDirectory()) {
            totalSize += this.getDirectorySize(fullPath);
          } else {
            const stats = fs.statSync(fullPath);
            totalSize += stats.size;
          }
        } catch (error) {
          // Ignore errors for individual files
        }
      }
    } catch (error) {
      // Ignore errors
    }

    return totalSize;
  }

  /**
   * Format file size thành dạng dễ đọc
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Chạy cleanup ngay lập tức (cho testing hoặc manual trigger)
   */
  public async runNow(): Promise<void> {
    console.log('🧹 [Temp File Cleanup] Chạy cleanup ngay lập tức...');
    await this.cleanup();
  }
}

// Export singleton instance
export default new TempFileCleanupJob();

