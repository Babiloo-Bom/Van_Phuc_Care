import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand
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
      const command = new HeadObjectCommand({
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
}

export default new CloudflareR2Service();