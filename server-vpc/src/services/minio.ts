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
        console.log(`Created MinIO bucket: ${this.bucketName}`);
      } else {
        console.log(`MinIO bucket exists: ${this.bucketName}`);
      }
    } catch (error) {
      console.error('MinIO initialization error:', error);
    }
  }

  /**
   */
  public async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
    folder: string = 'general'
  ): Promise<string> {
    try {
      const objectName = `${folder}/${Date.now()}-${fileName}`.replace(/ /g, '');
      const objectNameClean = objectName.replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, '')
      await this.client.putObject(this.bucketName, objectNameClean, fileBuffer, fileBuffer.length, {
        'Content-Type': contentType,
      });

      const fileUrl = `/${this.bucketName}/${objectName}`;
      
      return fileUrl;
    } catch (error) {
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
   */
  public async getFileUrl(objectName: string, expiresIn: number = 7 * 24 * 60 * 60): Promise<string> {
    try {
      const url = await this.client.presignedGetObject(this.bucketName, objectName, expiresIn);
      return url;
    } catch (error) {
      console.error('Get file URL error:', error);
      throw error;
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

