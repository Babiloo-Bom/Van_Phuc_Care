import Queue from 'bull';
import CloudflareService from './cloudflare';
import HlsConverter from './HlsConverter';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

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
    removeOnComplete: true,
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

      // Cleanup temp file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return {
        filename: originalName,
        url: publicUrl,
        hlsUrl: '',
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
    console.log(`🔄 [Video Queue] Converting to HLS: ${originalName}`);

    // Convert video to HLS
    const result = await HlsConverter.convertBufferToHls(
      fileBuffer,
      tempHlsDir,
      originalName
    );
    const { playlistPath, segmentPaths } = result;

    // Update job progress: uploading
    await job.progress(85);
    console.log(`📤 [Video Queue] Uploading HLS to R2: ${originalName}`);

    // Upload HLS playlist
    const playlistBuffer = fs.readFileSync(playlistPath);
    const playlistName = originalName.replace(/\.(mp4|mov|avi|mkv)$/i, '.m3u8');
    const hlsFolder = `${folder}/hls`;
    const playlistObjectName = await CloudflareService.uploadFile(
      playlistBuffer,
      playlistName,
      'application/vnd.apple.mpegurl',
      hlsFolder
    );
    const playlistUrl = CloudflareService.getPublicUrl(playlistObjectName);

    // Get video metadata before conversion
    const qualityMetadata = await HlsConverter.getVideoMetadataFromBuffer(fileBuffer, originalName);

    // Upload all HLS segments (.ts) to R2
    const segmentUrls: string[] = [];
    for (let i = 0; i < segmentPaths.length; i++) {
      const segmentPath = segmentPaths[i];
      const segmentBuffer = fs.readFileSync(segmentPath);
      const segmentFileName = path.basename(segmentPath);
      const segmentObjectName = await CloudflareService.uploadFile(
        segmentBuffer,
        segmentFileName,
        'video/mp2t',
        hlsFolder
      );
      segmentUrls.push(CloudflareService.getPublicUrl(segmentObjectName));
      
      // Update progress for each segment
      const segmentProgress = 85 + Math.floor((i + 1) / segmentPaths.length * 10);
      await job.progress(segmentProgress);
    }

    // Cleanup temp files
    if (fs.existsSync(tempHlsDir)) {
      fs.rmSync(tempHlsDir, { recursive: true, force: true });
    }
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.log(`✅ [Video Queue] Job ${job.id} completed: ${originalName}`);

    return {
      filename: originalName,
      url: playlistUrl,
      hlsUrl: playlistUrl,
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
  return await processVideoJob(job);
});

// Queue event listeners
videoQueue.on('completed', (job, result) => {
  console.log(`✅ [Video Queue] Job ${job.id} completed successfully`);
});

videoQueue.on('failed', (job, err) => {
  console.error(`❌ [Video Queue] Job ${job?.id} failed:`, err.message);
});

videoQueue.on('stalled', (job) => {
  console.warn(`⚠️ [Video Queue] Job ${job.id} stalled`);
});

videoQueue.on('active', (job) => {
  console.log(`🔄 [Video Queue] Job ${job.id} started processing`);
});

export default videoQueue;

