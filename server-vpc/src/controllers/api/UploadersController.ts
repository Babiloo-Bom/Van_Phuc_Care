import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import dayjs from 'dayjs';
import MinioService from '@services/minio';
import CloudflareService from '@services/cloudflare';
import HlsConverter from '@services/HlsConverter';
import { videoQueue, VideoJobData } from '@services/videoQueue';
import FileValidator from '@services/fileValidator';
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
        // Validate file by magic bytes to prevent malicious file extension spoofing
        const validation = FileValidator.validateFileByMagicBytes(file.buffer, file.mimetype);
        if (!validation.isValid) {
          console.error(`⚠️ [File Validation] File ${file.originalname} failed validation:`, validation.error);
          return sendError(res, 400, {
            message: `File validation failed: ${validation.error}`,
            filename: file.originalname,
            detectedType: validation.detectedType,
          });
        }

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
        // Validate file by magic bytes to prevent malicious file extension spoofing
        const validation = FileValidator.validateFileByMagicBytes(file.buffer, file.mimetype);
        if (!validation.isValid) {
          console.error(`⚠️ [File Validation] File ${file.originalname} failed validation:`, validation.error);
          return sendError(res, 400, {
            message: `File validation failed: ${validation.error}`,
            filename: file.originalname,
            detectedType: validation.detectedType,
          });
        }

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
    console.log('📤 [Video Upload] uploadVideoToR2 called');
    console.log('📤 [Video Upload] Request method:', req.method);
    console.log('📤 [Video Upload] Request URL:', req.url);
    console.log('📤 [Video Upload] Has file:', !!req.file);
    console.log('📤 [Video Upload] Has currentAdmin:', !!(req as any).currentAdmin);
    
    const tempHlsDir = path.join(os.tmpdir(), 'hls-uploads', Date.now().toString());
    try {
      // Route dùng .single('file') nên dùng req.file thay vì req.files
      const file = req.file as Express.Multer.File;
      const folder = (req.query.folder as string) || 'courses/intro-videos';
      
      console.log('📤 [Video Upload] Folder:', folder);

      if (!file) {
        return sendError(res, 400, 'No video file uploaded');
      }

      // Validate video file
      if (!file.mimetype.startsWith('video/')) {
        return sendError(res, 400, `File ${file.originalname} is not a video file`);
      }

      // Validate file by magic bytes to prevent malicious file extension spoofing
      const validation = FileValidator.validateVideoFile(file.buffer, file.mimetype);
      if (!validation.isValid) {
        console.error(`⚠️ [Video Validation] File ${file.originalname} failed validation:`, validation.error);
        return sendError(res, 400, {
          message: `Video file validation failed: ${validation.error}`,
          filename: file.originalname,
          detectedType: validation.detectedType,
        });
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
        
        // Get video metadata
        let qualityMetadata = {
          resolution: '',
          bitrate: '',
          codec: '',
          fps: 0,
          segments: 0,
        };
        
        try {
          const metadata = await HlsConverter.getVideoMetadataFromBuffer(file.buffer, file.originalname);
          qualityMetadata = {
            ...metadata,
            segments: 0,
          };
        } catch (error) {
          console.warn('⚠️ Could not get video metadata:', error);
        }

        return sendSuccess(res, { 
          videos: [{
            filename: file.originalname,
            url: publicUrl,
            objectName: objectName,
            size: file.size,
            type: file.mimetype,
            uploadedAt: new Date().toISOString(),
            status: 'ready', // MP4 upload is ready immediately
            hlsUrl: '', // No HLS for MP4 fallback
            qualityMetadata,
            errorMessage: '', // No error
          }],
          message: 'Video uploaded successfully to R2+CDN (MP4)'
        });
      }

      // Status progression: uploading -> queueing -> processing -> ready
      // Use Bull queue to process video with concurrency = 2
      
      // NEW APPROACH: Upload source video to R2 first (avoids /tmp issues between containers)
      // Upload to temporary folder - worker will download from R2 to convert
      const sourceFolder = `${folder}/source`;
      console.log(`📤 [Video Upload] Uploading source video to R2 folder: ${sourceFolder}`);
      
      let sourceObjectKey: string;
      let sourceUrl: string;
      try {
        sourceObjectKey = await CloudflareService.uploadFile(
          file.buffer,
          file.originalname,
          file.mimetype,
          sourceFolder
        );
        sourceUrl = CloudflareService.getPublicUrl(sourceObjectKey);
        console.log(`✅ [Video Upload] Source video uploaded to R2: ${sourceObjectKey}`);
        console.log(`✅ [Video Upload] Source URL: ${sourceUrl}`);
      } catch (uploadError: any) {
        console.error(`❌ [Video Upload] Failed to upload source to R2:`, uploadError);
        throw new Error(`Failed to upload source video to R2: ${uploadError.message}`);
      }
      
      const jobId = `video-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      // Extract lessonId from query if provided (for lesson videos)
      const lessonId = req.query.lessonId as string | undefined;
      console.log(`📋 [Video Upload] Received lessonId: ${lessonId || 'none'}`);
      
      // Create job data with sourceObjectKey (preferred) instead of filePath
      const jobData: VideoJobData = {
        jobId,
        sourceObjectKey, // R2 object key - worker will download from here
        sourceUrl, // R2 public URL (for reference)
        fileName: `${jobId}-${file.originalname}`,
        originalName: file.originalname,
        folder,
        fileSize: file.size,
        mimetype: file.mimetype,
        lessonId: lessonId || undefined, // Add lessonId if provided
        // Note: filePath is no longer used - worker downloads from R2
      };
      
      console.log(`📋 [Video Upload] Job data created with lessonId: ${jobData.lessonId || 'none'}`);
      
      // Add job to queue
      // Use removeOnComplete: 50 to keep completed jobs for status checking
      console.log(`📋 [Video Upload] Adding job to queue: ${jobId}, file: ${file.originalname}, size: ${file.size} bytes`);
      const job = await videoQueue.add(jobData, {
        jobId,
        removeOnComplete: 50, // Keep last 50 completed jobs for status checking
        removeOnFail: false,
      });
      
      console.log(`✅ [Video Upload] Video queued for processing. Job ID: ${job.id}, Queue Job ID: ${job.id}`);
      console.log(`📊 [Video Upload] Queue stats - waiting: ${await videoQueue.getWaitingCount()}, active: ${await videoQueue.getActiveCount()}, completed: ${await videoQueue.getCompletedCount()}`);
      
      // Return immediately with queueing status
      sendSuccess(res, { 
        videos: [{
          filename: file.originalname,
          url: '', // Will be available after processing
          hlsUrl: '', // Will be available after processing
          thumbnail: '', // Will be available after processing
          objectName: '',
          segments: 0,
          size: file.size,
          type: file.mimetype,
          uploadedAt: new Date().toISOString(),
          status: 'queueing', // Video is queued for processing
          qualityMetadata: {
            resolution: '',
            bitrate: '',
            codec: '',
            fps: 0,
            segments: 0,
          },
          errorMessage: '',
          jobId: job.id.toString(), // Return job ID for status checking
        }],
        message: 'Video queued for processing',
        jobId: job.id.toString(),
      });
    } catch (error: any) {
      // Cleanup temp files on error
      if (fs.existsSync(tempHlsDir)) {
        fs.rmSync(tempHlsDir, { recursive: true, force: true });
      }
      console.error('Upload video to R2 error:', error);
      
      // Determine error message
      let errorMessage = 'Lỗi upload video';
      if (error.message?.includes('format') || error.message?.includes('codec')) {
        errorMessage = 'Lỗi định dạng file';
      } else if (error.message?.includes('size') || error.message?.includes('large')) {
        errorMessage = 'File quá lớn';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Upload mất quá nhiều thời gian';
      } else {
        errorMessage = error.message || 'Lỗi upload video';
      }
      
      sendError(res, 500, {
        status: 'error',
        errorMessage,
        filename: (req.file as Express.Multer.File)?.originalname || 'unknown',
      }, error as Error);
    }
  }

  /**
   * Get video processing job status
   * GET /uploads/video/status/:jobId
   */
  public async getVideoJobStatus(req: Request, res: Response) {
    try {
      const { jobId } = req.params;

      if (!jobId) {
        return sendError(res, 400, 'Job ID is required');
      }

      const job = await videoQueue.getJob(jobId);

      if (!job) {
        // Job might have been removed or never existed
        // Return a status indicating we can't find it
        // Frontend should check if video URL exists to determine if it's actually ready
        return sendSuccess(res, {
          jobId,
          status: 'unknown',
          progress: 0,
          state: 'not_found',
          result: null,
          errorMessage: 'Job not found in queue. It may have been completed and removed.',
          createdAt: null,
          processedAt: null,
          finishedAt: null,
        });
      }

      const state = await job.getState();
      const progress = job.progress();
      const result = job.returnvalue;
      const failedReason = job.failedReason;

      let status = 'queueing';
      if (state === 'completed') {
        status = 'ready';
      } else if (state === 'failed') {
        status = 'error';
      } else if (state === 'active') {
        status = 'processing';
      } else if (state === 'waiting' || state === 'delayed') {
        status = 'queueing';
      }

      sendSuccess(res, {
        jobId: job.id.toString(),
        status,
        progress: typeof progress === 'number' ? progress : 0,
        state,
        result: result || null,
        errorMessage: failedReason || null,
        createdAt: new Date(job.timestamp).toISOString(),
        processedAt: job.processedOn ? new Date(job.processedOn).toISOString() : null,
        finishedAt: job.finishedOn ? new Date(job.finishedOn).toISOString() : null,
      });
    } catch (error: any) {
      console.error('Get video job status error:', error);
      sendError(res, 500, error.message || 'Failed to get job status', error as Error);
    }
  }

  /**
   * Cancel/Delete video upload job and cleanup files
   * DELETE /uploads/video/:jobId
   */
  public async cancelVideoUpload(req: Request, res: Response) {
    try {
      const { jobId } = req.params;

      if (!jobId) {
        return sendError(res, 400, 'Job ID is required');
      }

      const job = await videoQueue.getJob(jobId);

      if (!job) {
        return sendError(res, 404, 'Job not found');
      }

      const state = await job.getState();
      const jobData = job.data as VideoJobData;

      // Cancel job if it's still in queue or processing
      if (state === 'waiting' || state === 'delayed' || state === 'active') {
        await job.remove();
        console.log(`🗑️ [Video Upload] Cancelled job ${jobId} (state: ${state})`);
      } else if (state === 'completed') {
        // If already completed, we still need to cleanup files
        console.log(`🗑️ [Video Upload] Job ${jobId} already completed, cleaning up files`);
      }

      // Cleanup temp files and R2 source
      const tempFiles: string[] = [];
      
      // 1. Cleanup uploaded temp file (legacy - if using filePath)
      if (jobData.filePath && fs.existsSync(jobData.filePath)) {
        tempFiles.push(jobData.filePath);
      }

      // 2. Cleanup HLS temp directory
      const tempHlsDir = path.join(os.tmpdir(), 'hls-uploads', jobId);
      if (fs.existsSync(tempHlsDir)) {
        tempFiles.push(tempHlsDir);
      }

      // Delete temp files
      for (const filePath of tempFiles) {
        try {
          if (fs.existsSync(filePath)) {
            if (fs.statSync(filePath).isDirectory()) {
              fs.rmSync(filePath, { recursive: true, force: true });
            } else {
              fs.unlinkSync(filePath);
            }
            console.log(`🗑️ [Video Upload] Deleted temp file: ${filePath}`);
          }
        } catch (error: any) {
          console.warn(`⚠️ [Video Upload] Failed to delete temp file ${filePath}:`, error.message);
        }
      }
      
      // 3. Cleanup source video from R2 (if using sourceObjectKey)
      if (jobData.sourceObjectKey) {
        try {
          await CloudflareService.deleteFile(jobData.sourceObjectKey);
          console.log(`🗑️ [Video Upload] Deleted source video from R2: ${jobData.sourceObjectKey}`);
        } catch (error: any) {
          console.warn(`⚠️ [Video Upload] Failed to delete source from R2 ${jobData.sourceObjectKey}:`, error.message);
        }
      }

      // Cleanup files on R2 if job was processing/completed
      if (state === 'active' || state === 'completed') {
        try {
          const result = job.returnvalue;
          
          // If job completed, delete HLS files from R2
          if (result && result.hlsUrl) {
            const hlsFolder = CloudflareService.extractHlsFolderFromUrl(result.hlsUrl);
            if (hlsFolder) {
              await CloudflareService.deleteFilesByPrefix(hlsFolder);
              console.log(`🗑️ [Video Upload] Deleted HLS folder from R2: ${hlsFolder}`);
            }
          }

          // Also try to delete based on folder structure
          const folder = jobData.folder || 'courses/intro-videos';
          const hlsFolderPath = `${folder}/hls`;
          
          // Try to delete any files that might have been uploaded
          // Note: This is a best-effort cleanup, might not catch all files
          try {
            await CloudflareService.deleteFilesByPrefix(hlsFolderPath);
            console.log(`🗑️ [Video Upload] Cleaned up R2 folder: ${hlsFolderPath}`);
          } catch (error: any) {
            console.warn(`⚠️ [Video Upload] Failed to cleanup R2 folder ${hlsFolderPath}:`, error.message);
          }
        } catch (error: any) {
          console.warn(`⚠️ [Video Upload] Error cleaning up R2 files:`, error.message);
        }
      }

      sendSuccess(res, {
        message: 'Video upload cancelled and files cleaned up successfully',
        jobId: jobId.toString(),
        state,
        cleanedFiles: tempFiles.length,
      });
    } catch (error: any) {
      console.error('Cancel video upload error:', error);
      sendError(res, 500, error.message || 'Failed to cancel video upload', error as Error);
    }
  }
}
export default new UploadController();
