import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import dayjs from 'dayjs';
import MinioService from '@services/minio';
import CloudflareService from '@services/cloudflare';
import HlsConverter from '@services/HlsConverter';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

class UploadController {
  public async uploadFirebase (req: Request, res: Response) {
    try {
      const fileAttributes: any = [];
      const files: any[] = req.files as any[];
      await initializeApp({
        apiKey: 'AIzaSyB5KHkEd6N1mjcQDW_JAOEyul26_JL9qbo',
        authDomain: 'gensi-8df36.firebaseapp.com',
        projectId: 'gensi-8df36',
        storageBucket: 'gensi-8df36.appspot.com',
        messagingSenderId: '463049570884',
        appId: '1:463049570884:web:7f5bf4635ffcab2f865a11',
        measurementId: 'G-K0YZ0Y689Z',
      });
      const storage = await getStorage();
      for (const file of files) {
        const attribute: any = {};
        const storageRef = await ref(storage, `${dayjs().format('YYYYMMDDHHmmss')}_${file.originalname}`);
        const metadata = {
          contentType: file.mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        attribute.source = downloadURL;
        attribute.originalname = file.originalname;
        attribute.size = file.size;
        attribute.type = file.mimetype.split('/')[0];
        fileAttributes.push(attribute);
      }
      sendSuccess(res, { fileAttributes });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Upload files to MinIO
   * POST /uploads/minio
   */
  public async uploadMinio(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      const folder = (req.query.folder as string) || 'general';

      if (!files || files.length === 0) {
        return sendError(res, 400, 'No files uploaded');
      }

      const uploadedFiles: any[] = [];

      for (const file of files) {
        const fileUrl = await MinioService.uploadFile(
          file.buffer,
          file.originalname,
          file.mimetype,
          folder
        );

        // Get public URL
        const publicUrl = MinioService.getPublicUrl(fileUrl.replace(`/${MinioService.getBucketName()}/`, ''));

        uploadedFiles.push({
          filename: file.originalname,
          url: publicUrl,
          size: file.size,
          type: file.mimetype,
          uploadedAt: new Date().toISOString(),
        });
      }

      sendSuccess(res, { files: uploadedFiles });
    } catch (error: any) {
      console.error('Upload MinIO error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Upload video to Cloudflare R2 + CDN
   * Convert MP4 to HLS format for better security
   * POST /uploads/video
   */
  public async uploadVideoToR2(req: Request, res: Response) {
    const tempHlsDir = path.join(os.tmpdir(), 'hls-uploads', Date.now().toString());
    try {
      // Route dùng .single('file') nên dùng req.file thay vì req.files
      const file = req.file as Express.Multer.File;
      const folder = (req.query.folder as string) || 'courses/intro-videos';

      if (!file) {
        return sendError(res, 400, 'No video file uploaded');
      }

      // Validate video file
      if (!file.mimetype.startsWith('video/')) {
        return sendError(res, 400, `File ${file.originalname} is not a video file`);
      }

      // Check if FFmpeg is available
      const hasFFmpeg = await HlsConverter.checkFFmpeg();
      if (!hasFFmpeg) {
        console.warn('⚠️ FFmpeg not available, uploading MP4 without HLS conversion');
        // Fallback: upload MP4 directly
        const objectName = await CloudflareService.uploadFile(
          file.buffer,
          file.originalname,
          file.mimetype,
          folder
        );
        const publicUrl = CloudflareService.getPublicUrl(objectName);
        return sendSuccess(res, { 
          videos: [{
            filename: file.originalname,
            url: publicUrl,
            objectName: objectName,
            size: file.size,
            type: file.mimetype,
            uploadedAt: new Date().toISOString(),
          }],
          message: 'Video uploaded successfully to R2+CDN (MP4)'
        });
      }

      // Convert MP4 to HLS
      console.log('🔄 Converting MP4 to HLS format...');
      const { playlistPath, segmentPaths } = await HlsConverter.convertBufferToHls(
        file.buffer,
        tempHlsDir
      );

      // Upload HLS playlist (.m3u8) to R2
      const playlistBuffer = fs.readFileSync(playlistPath);
      const playlistName = file.originalname.replace(/\.(mp4|mov|avi|mkv)$/i, '.m3u8');
      const hlsFolder = `${folder}/hls`;
      const playlistObjectName = await CloudflareService.uploadFile(
        playlistBuffer,
        playlistName,
        'application/vnd.apple.mpegurl',
        hlsFolder
      );
      const playlistUrl = CloudflareService.getPublicUrl(playlistObjectName);

      // Upload all HLS segments (.ts) to R2
      const segmentUrls: string[] = [];
      for (const segmentPath of segmentPaths) {
        const segmentBuffer = fs.readFileSync(segmentPath);
        const segmentFileName = path.basename(segmentPath);
        const segmentObjectName = await CloudflareService.uploadFile(
          segmentBuffer,
          segmentFileName,
          'video/mp2t',
          hlsFolder
        );
        segmentUrls.push(CloudflareService.getPublicUrl(segmentObjectName));
      }

      // Cleanup temp files
      if (fs.existsSync(tempHlsDir)) {
        fs.rmSync(tempHlsDir, { recursive: true, force: true });
      }

      console.log(`✅ HLS conversion complete: ${segmentPaths.length} segments`);

      sendSuccess(res, { 
        videos: [{
          filename: file.originalname,
          url: playlistUrl, // Return HLS playlist URL
          hlsUrl: playlistUrl, // HLS playlist URL
          objectName: playlistObjectName,
          segments: segmentUrls.length,
          size: file.size,
          type: 'application/vnd.apple.mpegurl', // HLS MIME type
          uploadedAt: new Date().toISOString(),
        }],
        message: 'Video uploaded and converted to HLS format successfully'
      });
    } catch (error: any) {
      // Cleanup temp files on error
      if (fs.existsSync(tempHlsDir)) {
        fs.rmSync(tempHlsDir, { recursive: true, force: true });
      }
      console.error('Upload video to R2 error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new UploadController();
