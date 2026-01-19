/**
 * Script để xóa toàn bộ dữ liệu trong R2/MinIO
 * 
 * Cách chạy:
 * 1. Cài đặt AWS CLI hoặc sử dụng MinIO Client (mc)
 * 2. Cấu hình credentials
 * 3. Chạy script này
 * 
 * HOẶC sử dụng MinIO Console UI:
 * - Truy cập http://localhost:9001 (hoặc domain của bạn)
 * - Đăng nhập với credentials
 * - Xóa toàn bộ buckets hoặc objects
 */

const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');

// Cấu hình R2/MinIO
const config = {
  endpoint: process.env.R2_ENDPOINT || process.env.MINIO_ENDPOINT || 'https://your-r2-endpoint.com',
  region: process.env.R2_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || process.env.MINIO_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true, // Required for MinIO
};

const client = new S3Client(config);
const bucketName = process.env.R2_BUCKET_NAME || process.env.MINIO_BUCKET_NAME || 'van-phuc-care';

/**
 * Xóa tất cả objects trong bucket
 */
async function deleteAllObjects() {
  try {
    console.log(`🚀 Bắt đầu xóa tất cả objects trong bucket: ${bucketName}\n`);

    let continuationToken = undefined;
    let totalDeleted = 0;

    do {
      // List objects
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      });

      const listResponse = await client.send(listCommand);

      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        console.log('📭 Bucket đã trống hoặc không có objects');
        break;
      }

      // Delete objects (tối đa 1000 objects mỗi lần)
      const objectsToDelete = listResponse.Contents.map(obj => ({ Key: obj.Key }));
      
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: objectsToDelete,
          Quiet: false,
        },
      });

      const deleteResponse = await client.send(deleteCommand);
      
      if (deleteResponse.Deleted) {
        totalDeleted += deleteResponse.Deleted.length;
        console.log(`   ✅ Đã xóa ${deleteResponse.Deleted.length} objects`);
      }

      if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
        console.error('   ❌ Lỗi khi xóa một số objects:');
        deleteResponse.Errors.forEach(error => {
          console.error(`      - ${error.Key}: ${error.Message}`);
        });
      }

      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);

    console.log(`\n✅ Hoàn thành! Đã xóa tổng cộng ${totalDeleted} objects`);
  } catch (error) {
    console.error('❌ Lỗi khi xóa objects:', error);
    throw error;
  }
}

// Chạy script
if (require.main === module) {
  deleteAllObjects()
    .then(() => {
      console.log('\n🎉 Xóa R2/MinIO hoàn tất!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Lỗi:', error);
      process.exit(1);
    });
}

module.exports = { deleteAllObjects };

