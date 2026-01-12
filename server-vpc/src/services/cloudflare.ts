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

      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: objectName,
          Body: fileBuffer,
          ContentType: contentType,
        })
      );

      return objectName;
    } catch (error) {
      console.error("❌ Upload to R2 error:", error);
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

      await this.client.send(command);
      console.log(`✅ Lifecycle rule đã được thiết lập: Tự động xóa incomplete multipart uploads sau ${daysAfterInitiation} ngày`);
    } catch (error) {
      console.error('❌ Setup lifecycle rule error:', error);
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
      console.error('❌ Get lifecycle rules error:', error);
      throw error;
    }
  }
}

export default new CloudflareR2Service();