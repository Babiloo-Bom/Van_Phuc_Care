import * as Minio from 'minio';
import dotenv from 'dotenv';

dotenv.config();

class MinioService {
  private client: Minio.Client;
  private bucketName: string;

  constructor() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });

    this.bucketName = process.env.MINIO_BUCKET_NAME || 'van-phuc-care';

    this.initializeBucket();
  }

  private async initializeBucket(): Promise<void> {
    try {
      const bucketExists = await this.client.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.client.makeBucket(this.bucketName, 'us-east-1');
        console.log(`✅ Created MinIO bucket: ${this.bucketName}`);
      } else {
        console.log(`✅ MinIO bucket exists: ${this.bucketName}`);
      }

      // Setup bucket policy to allow public read access
      await this.setBucketPolicy();
    } catch (error) {
      console.error('❌ MinIO initialization error:', error);
    }
  }

  /**
   * Setup bucket policy to allow public read access
   */
  private async setBucketPolicy(): Promise<void> {
    try {
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };

      await this.client.setBucketPolicy(this.bucketName, JSON.stringify(policy));
      console.log(`✅ Set public read policy for bucket: ${this.bucketName}`);
    } catch (error) {
      console.warn('⚠️ Could not set bucket policy (may already be set):', error);
    }
  }

  /**
   * Upload file to MinIO
   */
  public async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
    folder: string = 'general'
  ): Promise<string> {
    try {
      const cleanFileName = fileName.replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, '-');
      const objectName = `${folder}/${Date.now()}-${cleanFileName}`;
      
      await this.client.putObject(
        this.bucketName, 
        objectName, 
        fileBuffer, 
        fileBuffer.length, 
        {
          'Content-Type': contentType,
        }
      );

      const fileUrl = `/${this.bucketName}/${objectName}`;
      
      return fileUrl;
    } catch (error) {
      console.error('❌ Upload file error:', error);
      throw error;
    }
  }

  /**
   */
  public async deleteFile(objectName: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucketName, objectName);
      console.log(`Deleted from MinIO: ${objectName}`);
    } catch (error) {
      console.error('Delete from MinIO error:', error);
      throw error;
    }
  }

  /**
   * Get presigned URL for file access (temporary access)
   * @param objectName - Object name without bucket prefix
   * @param expiresIn - Expiration time in seconds (default: 7 days)
   * @returns Presigned URL
   */
  public async getFileUrl(objectName: string, expiresIn: number = 7 * 24 * 60 * 60): Promise<string> {
    try {
      const url = await this.client.presignedGetObject(this.bucketName, objectName, expiresIn);
      return url;
    } catch (error) {
      console.error('❌ Get presigned URL error:', error);
      throw error;
    }
  }

  /**
   * Get public URL for file access (requires public bucket policy)
   * @param objectName - Object name without bucket prefix
   * @returns Public URL
   */
  public getPublicUrl(objectName: string): string {
    const publicBaseUrl = process.env.MINIO_PUBLIC_URL || 
      `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}`;
    
    return `${publicBaseUrl}/${this.bucketName}/${objectName}`;
  }

  /**
   * Get file URL - prefer presigned URL, fallback to public URL
   * @param objectName - Object name without bucket prefix
   * @param usePublic - If true, return public URL instead of presigned
   * @returns File URL
   */
  public async getFileUrlWithFallback(
    objectName: string, 
    usePublic: boolean = false,
    expiresIn: number = 7 * 24 * 60 * 60
  ): Promise<string> {
    if (usePublic) {
      return this.getPublicUrl(objectName);
    }

    try {
      return await this.getFileUrl(objectName, expiresIn);
    } catch (error) {
      console.warn('⚠️ Presigned URL failed, using public URL:', error);  
      return this.getPublicUrl(objectName);
    }
  }

  /**
   */
  public async fileExists(objectName: string): Promise<boolean> {
    try {
      await this.client.statObject(this.bucketName, objectName);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   */
  public async getFileInfo(objectName: string): Promise<Minio.BucketItemStat> {
    try {
      const stat = await this.client.statObject(this.bucketName, objectName);
      return stat;
    } catch (error) {
      console.error('Get file info error:', error);
      throw error;
    }
  }
}

export default new MinioService();

