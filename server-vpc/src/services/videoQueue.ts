import Queue from 'bull';
import CloudflareService from './cloudflare';
import HlsConverter from './HlsConverter';
import FileValidator from './fileValidator';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import mongoose from 'mongoose';

// Get TEMP_DIR from HlsConverter (if accessible) or use os.tmpdir
const getTempDir = () => {
  try {
    // @ts-ignore - accessing private static property
    return HlsConverter.TEMP_DIR || path.join(os.tmpdir(), 'hls-conversions');
  } catch {
    return path.join(os.tmpdir(), 'hls-conversions');
  }
};

// Redis connection for Bull queue
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
};

// Create video processing queue
export const videoQueue = new Queue('video-processing', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 50, // Keep last 50 completed jobs for status checking
    removeOnFail: false,
  },
});

// Job data interface
export interface VideoJobData {
  jobId: string;
  filePath: string; // Temporary file path
  fileName: string;
  originalName: string;
  folder: string;
  fileSize: number;
  mimetype: string;
  lessonId?: string; // Optional: lesson ID if this is a lesson video (for auto-update)
}

/**
 * Process video job: Convert to HLS and upload to R2
 */
export async function processVideoJob(job: Queue.Job<VideoJobData>) {
  const { filePath, fileName, originalName, folder, fileSize, mimetype } = job.data;
  const tempHlsDir = path.join(os.tmpdir(), 'hls-uploads', job.id.toString());

  try {
    // Update job progress: processing
    await job.progress(50);
    console.log(`🔄 [Video Queue] Processing job ${job.id}: ${originalName}`);

    // Read file buffer
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const fileBuffer = fs.readFileSync(filePath);

    // Validate file by magic bytes to prevent malicious file extension spoofing
    const validation = FileValidator.validateVideoFile(fileBuffer, mimetype);
    if (!validation.isValid) {
      console.error(`⚠️ [Video Queue] File ${originalName} failed validation:`, validation.error);
      throw new Error(`Video file validation failed: ${validation.error}`);
    }

    // Check if FFmpeg is available
    const hasFFmpeg = await HlsConverter.checkFFmpeg();
    if (!hasFFmpeg) {
      console.warn('⚠️ FFmpeg not available, uploading MP4 without HLS conversion');
      // Fallback: upload MP4 directly
      const objectName = await CloudflareService.uploadFile(
        fileBuffer,
        fileName,
        mimetype,
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
        const metadata = await HlsConverter.getVideoMetadataFromBuffer(fileBuffer, originalName);
        qualityMetadata = {
          ...metadata,
          segments: 0,
        };
      } catch (error) {
        console.warn('⚠️ Could not get video metadata:', error);
      }

      // Extract thumbnail for fallback case (no HLS conversion)
      let thumbnailUrl = '';
      try {
        console.log(`🖼️ [Video Queue] Extracting thumbnail from video (fallback): ${originalName}`);
        const tempThumbnailPath = path.join(os.tmpdir(), `thumb_${Date.now()}.jpg`);
        const tempVideoPath = path.join(getTempDir(), `thumb_${Date.now()}_${originalName}`);
        
        try {
          // @ts-ignore - Buffer is compatible with fs.writeFileSync
          fs.writeFileSync(tempVideoPath, fileBuffer);
          await HlsConverter.extractThumbnail(tempVideoPath, tempThumbnailPath, 1);
          
          if (fs.existsSync(tempThumbnailPath)) {
            const thumbnailBuffer = fs.readFileSync(tempThumbnailPath);
            const thumbnailFolder = `${folder}/thumbnails`;
            const thumbnailFileName = originalName.replace(/\.(mp4|mov|avi|mkv|webm|flv)$/i, '.jpg');
            const thumbnailObjectName = await CloudflareService.uploadFile(
              thumbnailBuffer,
              thumbnailFileName,
              'image/jpeg',
              thumbnailFolder
            );
            thumbnailUrl = CloudflareService.getPublicUrl(thumbnailObjectName);
            console.log(`✅ [Video Queue] Thumbnail uploaded (fallback): ${thumbnailUrl}`);
            
            // Cleanup
            if (fs.existsSync(tempThumbnailPath)) {
              fs.unlinkSync(tempThumbnailPath);
            }
          }
          
          if (fs.existsSync(tempVideoPath)) {
            fs.unlinkSync(tempVideoPath);
          }
        } catch (thumbError: any) {
          console.warn(`⚠️ [Video Queue] Failed to extract thumbnail (fallback):`, thumbError.message);
          if (fs.existsSync(tempThumbnailPath)) {
            try { fs.unlinkSync(tempThumbnailPath); } catch (e) {}
          }
          if (fs.existsSync(tempVideoPath)) {
            try { fs.unlinkSync(tempVideoPath); } catch (e) {}
          }
        }
      } catch (thumbError: any) {
        console.warn(`⚠️ [Video Queue] Thumbnail extraction error (fallback, non-fatal):`, thumbError.message);
      }

      // Cleanup temp file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return {
        filename: originalName,
        url: publicUrl,
        hlsUrl: '',
        thumbnail: thumbnailUrl, // Add thumbnail URL
        objectName: objectName,
        size: fileSize,
        type: mimetype,
        uploadedAt: new Date().toISOString(),
        status: 'ready',
        qualityMetadata,
        errorMessage: '',
      };
    }

    // Update job progress: converting
    await job.progress(70);
    console.log(`🔄 [Video Queue] Converting to HLS: ${originalName} (progress: 70%)`);

    // Convert video to HLS
    // This might take a while depending on video size
    console.log(`⏳ [Video Queue] Starting HLS conversion for ${originalName}...`);
    const conversionStartTime = Date.now();
    let result;
    try {
      result = await HlsConverter.convertBufferToHls(
        fileBuffer,
        tempHlsDir,
        originalName
      );
      const conversionDuration = ((Date.now() - conversionStartTime) / 1000).toFixed(2);
      const { playlistPath, segmentPaths } = result;
      console.log(`✅ [Video Queue] HLS conversion completed in ${conversionDuration}s: ${segmentPaths.length} segments created`);
    } catch (error: any) {
      const conversionDuration = ((Date.now() - conversionStartTime) / 1000).toFixed(2);
      console.error(`❌ [Video Queue] HLS conversion failed after ${conversionDuration}s:`, error.message);
      throw error;
    }
    const { playlistPath, segmentPaths } = result;

    // Update job progress: uploading
    await job.progress(85);
    console.log(`📤 [Video Queue] Uploading HLS to R2: ${originalName}`);

    // Upload HLS playlist
    const playlistBuffer = fs.readFileSync(playlistPath);
    const playlistName = originalName.replace(/\.(mp4|mov|avi|mkv)$/i, '.m3u8');
    const hlsFolder = `${folder}/hls`;
    console.log(`📤 [Video Queue] Uploading HLS playlist: ${playlistName} to folder: ${hlsFolder}`);
    console.log(`📤 [Video Queue] Playlist buffer size: ${playlistBuffer.length} bytes`);
    const playlistObjectName = await CloudflareService.uploadFile(
      playlistBuffer,
      playlistName,
      'application/vnd.apple.mpegurl',
      hlsFolder
    );
    console.log(`✅ [Video Queue] Playlist uploaded successfully: ${playlistObjectName}`);
    const playlistUrl = CloudflareService.getPublicUrl(playlistObjectName);
    console.log(`✅ [Video Queue] Playlist public URL: ${playlistUrl}`);

    // Get video metadata before conversion
    const qualityMetadata = await HlsConverter.getVideoMetadataFromBuffer(fileBuffer, originalName);

    // Extract and upload thumbnail
    let thumbnailUrl = '';
    try {
      console.log(`🖼️ [Video Queue] Extracting thumbnail from video: ${originalName}`);
      const tempThumbnailPath = path.join(tempHlsDir, 'thumbnail.jpg');
      
      // Extract thumbnail at 1 second (or 10% of video duration if available)
      // First, get video duration if possible
      let thumbnailTime = 1;
      try {
        const metadata = await HlsConverter.getVideoMetadataFromBuffer(fileBuffer, originalName);
        // Try to get duration from temp file (if we can read it)
        // For now, use 1 second or 10% of estimated duration
        // We'll extract at 1 second as default
      } catch (e) {
        // Ignore, use default 1 second
      }
      
      // Extract thumbnail from temp file (before cleanup)
      const tempVideoPath = path.join(getTempDir(), `thumb_${Date.now()}_${originalName}`);
      try {
        // @ts-ignore - Buffer is compatible with fs.writeFileSync
        fs.writeFileSync(tempVideoPath, fileBuffer);
        await HlsConverter.extractThumbnail(tempVideoPath, tempThumbnailPath, thumbnailTime);
        
        // Upload thumbnail to R2
        if (fs.existsSync(tempThumbnailPath)) {
          const thumbnailBuffer = fs.readFileSync(tempThumbnailPath);
          const thumbnailFolder = `${folder}/thumbnails`;
          const thumbnailFileName = originalName.replace(/\.(mp4|mov|avi|mkv|webm|flv)$/i, '.jpg');
          const thumbnailObjectName = await CloudflareService.uploadFile(
            thumbnailBuffer,
            thumbnailFileName,
            'image/jpeg',
            thumbnailFolder
          );
          thumbnailUrl = CloudflareService.getPublicUrl(thumbnailObjectName);
          console.log(`✅ [Video Queue] Thumbnail uploaded: ${thumbnailUrl}`);
          
          // Cleanup thumbnail temp file
          if (fs.existsSync(tempThumbnailPath)) {
            fs.unlinkSync(tempThumbnailPath);
          }
        }
        
        // Cleanup temp video file
        if (fs.existsSync(tempVideoPath)) {
          fs.unlinkSync(tempVideoPath);
        }
      } catch (thumbError: any) {
        console.warn(`⚠️ [Video Queue] Failed to extract thumbnail:`, thumbError.message);
        // Don't fail the job if thumbnail extraction fails
        if (fs.existsSync(tempThumbnailPath)) {
          try { fs.unlinkSync(tempThumbnailPath); } catch (e) {}
        }
        if (fs.existsSync(tempVideoPath)) {
          try { fs.unlinkSync(tempVideoPath); } catch (e) {}
        }
      }
    } catch (thumbError: any) {
      console.warn(`⚠️ [Video Queue] Thumbnail extraction error (non-fatal):`, thumbError.message);
    }

    // Upload all HLS segments (.ts) to R2
    const segmentUrls: string[] = [];
    console.log(`📤 [Video Queue] Uploading ${segmentPaths.length} HLS segments to folder: ${hlsFolder}`);
    for (let i = 0; i < segmentPaths.length; i++) {
      const segmentPath = segmentPaths[i];
      const segmentBuffer = fs.readFileSync(segmentPath);
      const segmentFileName = path.basename(segmentPath);
      console.log(`📤 [Video Queue] Uploading segment ${i + 1}/${segmentPaths.length}: ${segmentFileName} (${segmentBuffer.length} bytes)`);
      const segmentObjectName = await CloudflareService.uploadFile(
        segmentBuffer,
        segmentFileName,
        'video/mp2t',
        hlsFolder
      );
      console.log(`✅ [Video Queue] Segment ${i + 1}/${segmentPaths.length} uploaded: ${segmentObjectName}`);
      segmentUrls.push(CloudflareService.getPublicUrl(segmentObjectName));
      
      // Update progress for each segment
      const segmentProgress = 85 + Math.floor((i + 1) / segmentPaths.length * 10);
      await job.progress(segmentProgress);
    }
    console.log(`✅ [Video Queue] All ${segmentPaths.length} segments uploaded successfully`);

    // Update job progress to 100% before cleanup
    await job.progress(100);
    console.log(`✅ [Video Queue] Job ${job.id} progress: 100%`);

    // Cleanup temp files
    if (fs.existsSync(tempHlsDir)) {
      fs.rmSync(tempHlsDir, { recursive: true, force: true });
    }
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.log(`✅ [Video Queue] Job ${job.id} completed: ${originalName}`);
    console.log(`✅ [Video Queue] Job ${job.id} result hlsUrl: ${playlistUrl}`);

    // Verify upload by listing objects in folder
    try {
      // @ts-ignore - @aws-sdk/client-s3 is installed but TypeScript may not recognize it
      const { S3Client, ListObjectsV2Command } = await import('@aws-sdk/client-s3');
      const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: hlsFolder + '/',
      });
      const tempClient = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
        },
        forcePathStyle: true,
      });
      const listResponse = await tempClient.send(listCommand);
      const uploadedObjects = listResponse.Contents || [];
      console.log(`✅ [Video Queue] Verification: Found ${uploadedObjects.length} objects in folder ${hlsFolder}/`);
      console.log(`✅ [Video Queue] Expected: 1 playlist + ${segmentPaths.length} segments = ${1 + segmentPaths.length} objects`);
      if (uploadedObjects.length > 0) {
        console.log(`✅ [Video Queue] Uploaded objects:`, uploadedObjects.map((obj: any) => obj.Key).join(', '));
      } else {
        console.error(`❌ [Video Queue] WARNING: No objects found in folder ${hlsFolder}/ after upload!`);
      }
    } catch (verifyError: any) {
      console.warn(`⚠️ [Video Queue] Could not verify upload:`, verifyError.message);
    }

    return {
      filename: originalName,
      url: playlistUrl,
      hlsUrl: playlistUrl,
      thumbnail: thumbnailUrl, // Add thumbnail URL
      objectName: playlistObjectName,
      segments: segmentUrls.length,
      size: fileSize,
      type: 'application/vnd.apple.mpegurl',
      uploadedAt: new Date().toISOString(),
      status: 'ready',
      qualityMetadata: {
        ...qualityMetadata,
        segments: segmentUrls.length,
      },
      errorMessage: '',
    };
  } catch (error: any) {
    console.error(`❌ [Video Queue] Job ${job.id} failed:`, error);
    
    // Cleanup temp files on error
    if (fs.existsSync(tempHlsDir)) {
      fs.rmSync(tempHlsDir, { recursive: true, force: true });
    }
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    // Determine error message
    let errorMessage = 'Lỗi xử lý video';
    if (error.message?.includes('format') || error.message?.includes('codec')) {
      errorMessage = 'Lỗi định dạng file';
    } else if (error.message?.includes('size') || error.message?.includes('large')) {
      errorMessage = 'File quá lớn';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Xử lý mất quá nhiều thời gian';
    } else {
      errorMessage = error.message || 'Lỗi xử lý video';
    }

    throw new Error(errorMessage);
  }
}

// Process jobs with concurrency = 2 (2 videos at a time)
videoQueue.process(2, async (job) => {
  console.log(`🚀 [Video Queue] Worker picked up job ${job.id}: ${job.data.originalName}`);
  return await processVideoJob(job);
});

// Import Lessons model to update video status
import LessonsModel from '@mongodb/lessons';

// Queue event listeners
videoQueue.on('completed', async (job, result) => {
  console.log(`✅ [Video Queue] Job ${job.id} completed successfully`);
  console.log(`✅ [Video Queue] Result:`, JSON.stringify(result, null, 2));
  
  // Auto-update lesson video in database
  try {
    const jobId = job.id.toString();
    const { lessonId } = job.data;
    
    console.log(`🔍 [Video Queue] Looking for lesson - jobId: ${jobId}, lessonId: ${lessonId || 'none'}`);
    
    let lesson = null;
    
    // If lessonId is provided in job data, find lesson directly
    if (lessonId) {
      lesson = await LessonsModel.model.findById(lessonId);
      if (lesson) {
        console.log(`✅ [Video Queue] Found lesson ${lesson._id} by lessonId`);
      } else {
        console.log(`⚠️ [Video Queue] Lesson ${lessonId} not found in database`);
      }
    }
    
    // If not found by lessonId, try finding by jobId
    if (!lesson) {
      lesson = await LessonsModel.model.findOne({
        'videos.jobId': jobId
      });
      if (lesson) {
        console.log(`✅ [Video Queue] Found lesson ${lesson._id} by jobId`);
      }
    }
    
    if (lesson) {
      const videos = (lesson as any).videos || [];
      const videoIndex = videos.findIndex((v: any) => v.jobId === jobId);
      
      if (videoIndex !== -1) {
        // Found video by jobId - update it (thumbnail sẽ được upload thủ công, không tự động từ video)
        videos[videoIndex] = {
          ...videos[videoIndex],
          videoUrl: result.url || videos[videoIndex].videoUrl,
          hlsUrl: result.hlsUrl || videos[videoIndex].hlsUrl,
          // Không tự động update thumbnail - admin sẽ upload thủ công
          status: 'ready',
          qualityMetadata: result.qualityMetadata || videos[videoIndex].qualityMetadata,
          errorMessage: '',
        };
        
        await LessonsModel.model.findByIdAndUpdate(lesson._id, {
          videos: videos
        });
        
        console.log(`✅ [Video Queue] Auto-updated lesson ${lesson._id} video ${videoIndex} with hlsUrl: ${result.hlsUrl}`);
      } else if (lessonId && videos.length > 0) {
        // Video not found by jobId but lessonId exists - update first video and add jobId (thumbnail sẽ được upload thủ công)
        videos[0] = {
          ...videos[0],
          videoUrl: result.url || videos[0].videoUrl,
          hlsUrl: result.hlsUrl || videos[0].hlsUrl,
          // Không tự động update thumbnail - admin sẽ upload thủ công
          status: 'ready',
          jobId: jobId, // Ensure jobId is saved
          qualityMetadata: result.qualityMetadata || videos[0].qualityMetadata,
          errorMessage: '',
        };
        
        await LessonsModel.model.findByIdAndUpdate(lesson._id, {
          videos: videos
        });
        
        console.log(`✅ [Video Queue] Auto-updated lesson ${lesson._id} video 0 with hlsUrl: ${result.hlsUrl} (added jobId: ${jobId})`);
      } else {
        console.log(`⚠️ [Video Queue] Video with jobId ${jobId} not found in lesson videos array`);
      }
    } else {
      console.log(`⚠️ [Video Queue] No lesson found - jobId: ${jobId}, lessonId: ${lessonId || 'none'}`);
      console.log(`⚠️ [Video Queue] This might be an intro video or lesson not saved to database yet`);
      
      // Check if this is an intro video (folder is 'courses/intro-videos')
      const { folder } = job.data;
      if (folder === 'courses/intro-videos') {
        console.log(`🔍 [Video Queue] This is an intro video, looking for course with introVideoJobId: ${jobId}`);
        
        try {
          // Find course by introVideoJobId
          const Course = mongoose.models.Course || mongoose.model('Course', new mongoose.Schema({}, { strict: false }));
          const course = await Course.findOne({ introVideoJobId: jobId });
          
          if (course) {
            console.log(`✅ [Video Queue] Found course ${course._id} by introVideoJobId`);
            
            // Update course intro video (thumbnail sẽ được upload thủ công, không tự động từ video)
            await Course.findByIdAndUpdate(course._id, {
              introVideo: result.url || course.introVideo,
              introVideoHlsUrl: result.hlsUrl || course.introVideoHlsUrl,
              // Không tự động update thumbnail - admin sẽ upload thủ công
              introVideoStatus: 'ready',
              introVideoQualityMetadata: result.qualityMetadata || course.introVideoQualityMetadata,
            });
            
            console.log(`✅ [Video Queue] Updated course ${course._id} intro video`);
          } else {
            console.log(`⚠️ [Video Queue] Course with introVideoJobId ${jobId} not found - course may not be saved yet`);
            console.log(`⚠️ [Video Queue] Thumbnail will be available when course is saved: ${result.thumbnail}`);
          }
        } catch (courseError: any) {
          console.error(`⚠️ [Video Queue] Error updating course intro video:`, courseError.message);
          // Don't throw - this is a background update
        }
      }
    }
  } catch (error: any) {
    console.error(`⚠️ [Video Queue] Error auto-updating lesson video:`, error.message);
    console.error(`⚠️ [Video Queue] Error stack:`, error.stack);
    // Don't throw - this is a background update, shouldn't fail the job
  }
});

videoQueue.on('failed', async (job, err) => {
  console.error(`❌ [Video Queue] Job ${job?.id} failed:`, err.message);
  
  // Auto-update lesson video status to error
  try {
    if (job) {
      const jobId = job.id.toString();
      const lesson = await LessonsModel.model.findOne({
        'videos.jobId': jobId
      });
      
      if (lesson) {
        const videos = (lesson as any).videos || [];
        const videoIndex = videos.findIndex((v: any) => v.jobId === jobId);
        
        if (videoIndex !== -1) {
          videos[videoIndex] = {
            ...videos[videoIndex],
            status: 'error',
            errorMessage: err.message || 'Lỗi xử lý video',
          };
          
          await LessonsModel.model.findByIdAndUpdate(lesson._id, {
            videos: videos
          });
          
          console.log(`✅ [Video Queue] Auto-updated lesson ${lesson._id} video ${videoIndex} status to error`);
        }
      }
    }
  } catch (error: any) {
    console.error(`⚠️ [Video Queue] Error auto-updating lesson video error status:`, error.message);
  }
});

videoQueue.on('stalled', (job) => {
  console.warn(`⚠️ [Video Queue] Job ${job.id} stalled`);
});

videoQueue.on('active', (job) => {
  console.log(`🔄 [Video Queue] Job ${job.id} started processing: ${job.data.originalName}`);
});

videoQueue.on('waiting', (jobId) => {
  console.log(`⏳ [Video Queue] Job ${jobId} is waiting in queue`);
});

videoQueue.on('error', (error) => {
  console.error(`❌ [Video Queue] Queue error:`, error);
});

export default videoQueue;

