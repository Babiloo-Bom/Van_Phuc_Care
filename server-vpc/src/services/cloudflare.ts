import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  PutBucketLifecycleConfigurationCommand,
  GetBucketLifecycleConfigurationCommand
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

class CloudflareR2Service {
  private client: S3Client;
  private bucketName: string;
  private publicBaseUrl: string;

  constructor() {
    this.bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
    this.publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL!;

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
    });
  }

  /** Upload file lên R2 */
  public async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
    folder: string = "general"
  ): Promise<string> {
    try {
      const cleanFileName = fileName.replace(/[^\x20-\x7E]/g, "").replace(/\s+/g, "-");
      const objectName = `${folder}/${Date.now()}-${cleanFileName}`;

      console.log(`📤 [R2 Upload] Uploading file: ${fileName}`);
      console.log(`📤 [R2 Upload] Object name: ${objectName}`);
      console.log(`📤 [R2 Upload] Bucket: ${this.bucketName}`);
      console.log(`📤 [R2 Upload] File size: ${fileBuffer.length} bytes`);
      console.log(`📤 [R2 Upload] Content type: ${contentType}`);

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectName,
        Body: fileBuffer,
        ContentType: contentType,
      });

      const response = await this.client.send(command);
      
      console.log(`✅ [R2 Upload] Upload successful: ${objectName}`);
      console.log(`✅ [R2 Upload] Response ETag: ${response.ETag || 'N/A'}`);

      // Verify upload by checking if object exists
      try {
        const headCommand = new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: objectName,
        });
        const headResponse = await this.client.send(headCommand);
        console.log(`✅ [R2 Upload] Verified object exists: ${objectName}`);
        console.log(`✅ [R2 Upload] Object size: ${headResponse.ContentLength || 'N/A'} bytes`);
      } catch (verifyError: any) {
        console.error(`⚠️ [R2 Upload] Warning: Could not verify upload for ${objectName}:`, verifyError.message);
        // Don't throw - upload might have succeeded but verification failed
      }

      return objectName;
    } catch (error: any) {
      console.error("❌ [R2 Upload] Upload to R2 error:", error);
      console.error("❌ [R2 Upload] Error details:", {
        message: error.message,
        name: error.name,
        code: error.Code || error.code,
        bucket: this.bucketName,
        fileName,
        folder,
      });
      throw error;
    }
  }

  /** Xóa file */
  public async deleteFile(objectName: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: objectName,
        })
      );

      console.log(`Deleted from Cloudflare R2: ${objectName}`);
    } catch (error) {
      console.error("❌ Delete R2 error:", error);
      throw error;
    }
  }

  /** Tạo URL tạm thời (presigned URL) */
  public async getFileUrl(objectName: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: objectName,
      });

      return await getSignedUrl(this.client, command, { expiresIn });
    } catch (error) {
      console.error("❌ Get presigned URL error:", error);
      throw error;
    }
  }

  /** Tạo URL public (nếu bucket bật public) */
  public getPublicUrl(objectName: string): string {
    return `${this.publicBaseUrl}/${objectName}`;
  }

  /** Prefer presigned, fallback public */
  public async getFileUrlWithFallback(
    objectName: string,
    usePublic = false,
    expiresIn = 3600
  ): Promise<string> {
    if (usePublic) return this.getPublicUrl(objectName);

    try {
      return await this.getFileUrl(objectName, expiresIn);
    } catch (err) {
      console.warn("⚠️ Presigned failed → use public URL");
      return this.getPublicUrl(objectName);
    }
  }

  /** Check file tồn tại */
  public async fileExists(objectName: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: objectName,
        })
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /** Lấy info file */
  public async getFileInfo(objectName: string) {
    try {
      const stat = await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: objectName,
        })
      );

      return stat;
    } catch (error) {
      console.error("❌ Get file info error:", error);
      throw error;
    }
  }

  /**
   * Xóa tất cả files trong folder (prefix)
   * @param prefix Folder prefix (e.g., "courses/intro-videos/hls" or "lessons/123/videos/hls")
   * @returns Số lượng files đã xóa
   */
  public async deleteFilesByPrefix(prefix: string): Promise<number> {
    try {
      // Đảm bảo prefix kết thúc bằng / để list đúng folder
      const folderPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
      
      let deletedCount = 0;
      let continuationToken: string | undefined = undefined;

      do {
        // List tất cả objects với prefix
        const listCommand = new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: folderPrefix,
          ContinuationToken: continuationToken,
        });

        const listResponse = await this.client.send(listCommand);

        if (listResponse.Contents && listResponse.Contents.length > 0) {
          // Chia thành batch 1000 objects (AWS S3 limit)
          const objectsToDelete = listResponse.Contents.map((obj: any) => ({
            Key: obj.Key!,
          }));

          // Xóa batch
          const deleteCommand = new DeleteObjectsCommand({
            Bucket: this.bucketName,
            Delete: {
              Objects: objectsToDelete,
              Quiet: true,
            },
          });

          const deleteResponse = await this.client.send(deleteCommand);
          deletedCount += objectsToDelete.length;

          console.log(`🗑️ Deleted ${objectsToDelete.length} files from R2 folder: ${folderPrefix}`);
        }

        continuationToken = listResponse.NextContinuationToken;
      } while (continuationToken);

      console.log(`✅ Total deleted ${deletedCount} files from R2 folder: ${folderPrefix}`);
      return deletedCount;
    } catch (error) {
      console.error(`❌ Delete R2 folder error (${prefix}):`, error);
      throw error;
    }
  }

  /**
   * Extract folder path từ HLS URL
   * @param hlsUrl URL của HLS playlist hoặc segment
   * @returns Folder prefix để xóa
   */
  public extractHlsFolderFromUrl(hlsUrl: string): string | null {
    try {
      // Remove public URL base
      let objectPath = hlsUrl;
      if (hlsUrl.includes(this.publicBaseUrl)) {
        objectPath = hlsUrl.replace(this.publicBaseUrl, '').replace(/^\//, '');
      }

      // Extract folder path (remove filename)
      // Example: "courses/intro-videos/hls/1234567890-video.m3u8" -> "courses/intro-videos/hls"
      // Example: "lessons/123/videos/hls/1234567890-segment_000.ts" -> "lessons/123/videos/hls"
      if (objectPath.includes('/hls/')) {
        const hlsIndex = objectPath.indexOf('/hls/');
        return objectPath.substring(0, hlsIndex + 4); // Include '/hls'
      }

      // Fallback: try to extract from path structure
      const parts = objectPath.split('/');
      const hlsIndex = parts.findIndex(part => part === 'hls');
      if (hlsIndex !== -1) {
        return parts.slice(0, hlsIndex + 1).join('/');
      }

      return null;
    } catch (error) {
      console.error('❌ Extract HLS folder error:', error);
      return null;
    }
  }

  /**
   * Thiết lập Lifecycle Rule để tự động xóa incomplete multipart uploads
   * @param daysAfterInitiation Số ngày sau khi bắt đầu upload (mặc định: 1 ngày)
   * @returns Kết quả setup
   */
  public async setupLifecycleRule(daysAfterInitiation: number = 1): Promise<void> {
    try {
      console.log(`🔄 [R2 Lifecycle] Đang thiết lập lifecycle rule cho bucket: ${this.bucketName}`);
      console.log(`🔑 [R2 Lifecycle] Sử dụng Account ID: ${process.env.CLOUDFLARE_R2_ACCOUNT_ID?.substring(0, 8)}...`);
      console.log(`🔑 [R2 Lifecycle] Sử dụng Access Key ID: ${process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.substring(0, 8)}...`);
      
      const command = new PutBucketLifecycleConfigurationCommand({
        Bucket: this.bucketName,
        LifecycleConfiguration: {
          Rules: [
            {
              ID: 'Abort-Incomplete-Multipart-Uploads',
              Status: 'Enabled',
              AbortIncompleteMultipartUpload: {
                DaysAfterInitiation: daysAfterInitiation,
              },
            },
          ],
        },
      });

      const response = await this.client.send(command);
      console.log(`✅ [R2 Lifecycle] Lifecycle rule đã được thiết lập thành công: Tự động xóa incomplete multipart uploads sau ${daysAfterInitiation} ngày`);
      console.log(`📋 [R2 Lifecycle] Response:`, JSON.stringify(response, null, 2));
    } catch (error: any) {
      console.error('❌ [R2 Lifecycle] Setup lifecycle rule error:', error);
      console.error('❌ [R2 Lifecycle] Error details:', {
        name: error.name,
        Code: error.Code,
        message: error.message,
        statusCode: error.$metadata?.httpStatusCode,
        requestId: error.$metadata?.requestId,
      });
      
      // Nếu là AccessDenied, cung cấp hướng dẫn
      if (error.Code === 'AccessDenied' || error.name === 'AccessDenied' || error.message?.includes('Access Denied')) {
        console.error('⚠️ [R2 Lifecycle] HƯỚNG DẪN SỬA LỖI:');
        console.error('   1. Vào Cloudflare Dashboard → R2 → Manage R2 API Tokens');
        console.error('   2. Tạo API Token mới với quyền "Object Read & Write" và "Bucket Configuration Read & Write"');
        console.error('   3. Hoặc sử dụng Admin API Token với quyền đầy đủ');
        console.error('   4. Cập nhật CLOUDFLARE_R2_ACCESS_KEY_ID và CLOUDFLARE_R2_SECRET_ACCESS_KEY trong .env');
        console.error('   5. Restart server');
      }
      
      throw error;
    }
  }

  /**
   * Lấy thông tin Lifecycle Rules hiện tại
   * @returns Lifecycle configuration hoặc null
   */
  public async getLifecycleRules(): Promise<any> {
    try {
      const command = new GetBucketLifecycleConfigurationCommand({
        Bucket: this.bucketName,
      });

      const response = await this.client.send(command);
      return response;
    } catch (error: any) {
      // Nếu bucket chưa có lifecycle rules, sẽ throw error
      if (error.name === 'NoSuchLifecycleConfiguration') {
        console.log('ℹ️ Bucket chưa có lifecycle rules');
        return null;
      }
      
      // Nếu là AccessDenied, log warning và hướng dẫn
      if (error.Code === 'AccessDenied' || error.name === 'AccessDenied' || error.message?.includes('Access Denied')) {
        console.warn('⚠️ [R2 Lifecycle] Access Denied - Không có quyền truy cập lifecycle rules.');
        console.warn('   Để sửa lỗi này, cần tạo R2 API Token với quyền "Bucket Configuration Read & Write"');
        console.warn('   Xem hướng dẫn trong Cloudflare Dashboard → R2 → Manage R2 API Tokens');
        return null;
      }
      
      // Log error nhưng không throw để không crash server (non-critical)
      console.warn('⚠️ [R2 Lifecycle] Get lifecycle rules error (non-critical):', error.message || error);
      return null;
    }
  }
}

export default new CloudflareR2Service();