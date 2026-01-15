import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

/**
 * HLS Converter Service
 * Convert MP4 to HLS format on-the-fly
 * HLS chia video thành nhiều segments nhỏ (.ts) để chống download
 */

export default class HlsConverter {
  private static readonly SEGMENT_DURATION = 10; // 10 seconds per segment
  private static readonly TEMP_DIR = path.join(os.tmpdir(), 'hls-conversions');
  
  /**
   * Convert MP4 to HLS format
   * @param inputPath Path to MP4 file (local or URL)
   * @param outputDir Directory to save HLS files
   * @returns Path to .m3u8 playlist file
   */
  public static async convertToHls(
    inputPath: string,
    outputDir: string
  ): Promise<string> {
    // Ensure temp directory exists
    if (!fs.existsSync(this.TEMP_DIR)) {
      fs.mkdirSync(this.TEMP_DIR, { recursive: true });
    }

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const playlistPath = path.join(outputDir, 'playlist.m3u8');
    const segmentPattern = path.join(outputDir, 'segment_%03d.ts');

    try {
      // Convert MP4 to HLS using FFmpeg
      const ffmpegCommand = `ffmpeg -i "${inputPath}" \
        -c:v libx264 -c:a aac \
        -hls_time ${this.SEGMENT_DURATION} \
        -hls_list_size 0 \
        -hls_segment_filename "${segmentPattern}" \
        -f hls \
        "${playlistPath}"`;

      await execAsync(ffmpegCommand);

      return playlistPath;
    } catch (error: any) {
      console.error('❌ HLS conversion error:', error);
      throw new Error(`Failed to convert video to HLS: ${error.message}`);
    }
  }

  /**
   * Convert video buffer to HLS format (supports MP4, MOV, AVI, MKV)
   * @param inputBuffer Video file buffer
   * @param outputDir Directory to save HLS files
   * @param originalFilename Optional original filename to extract extension
   * @returns Object containing playlist path and all segment paths
   */
  public static async convertBufferToHls(
    inputBuffer: Buffer,
    outputDir: string,
    originalFilename?: string
  ): Promise<{ playlistPath: string; segmentPaths: string[] }> {
    // Ensure temp directory exists
    if (!fs.existsSync(this.TEMP_DIR)) {
      fs.mkdirSync(this.TEMP_DIR, { recursive: true });
    }

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get extension from original filename or default to .mp4
    let extension = '.mp4';
    if (originalFilename) {
      const extMatch = originalFilename.match(/\.(mp4|mov|avi|mkv|webm|flv)$/i);
      if (extMatch) {
        extension = extMatch[0].toLowerCase();
      }
    }

    // Save buffer to temp file with correct extension
    const tempInputPath = path.join(this.TEMP_DIR, `input_${Date.now()}${extension}`);
    // @ts-ignore - Buffer is compatible with fs.writeFileSync
    fs.writeFileSync(tempInputPath, inputBuffer);

    const playlistPath = path.join(outputDir, 'playlist.m3u8');
    const segmentPattern = path.join(outputDir, 'segment_%03d.ts');

    try {
      // Convert MP4 to HLS using FFmpeg with timeout (30 minutes max for large videos)
      // Calculate timeout based on file size: ~1 minute per 100MB, minimum 5 minutes, maximum 30 minutes
      const fileSizeMB = inputBuffer.length / (1024 * 1024);
      const timeoutMs = Math.max(5 * 60 * 1000, Math.min(30 * 60 * 1000, (fileSizeMB / 100) * 60 * 1000));
      
      console.log(`⏳ [HLS Converter] Starting conversion for ${originalFilename || 'video'} (${fileSizeMB.toFixed(2)}MB), timeout: ${timeoutMs / 1000 / 60} minutes`);
      
      const ffmpegCommand = `ffmpeg -i "${tempInputPath}" \
        -c:v libx264 -c:a aac \
        -hls_time ${this.SEGMENT_DURATION} \
        -hls_list_size 0 \
        -hls_segment_filename "${segmentPattern}" \
        -f hls \
        "${playlistPath}"`;

      // Execute with timeout and process killing
      let ffmpegProcess: any = null;
      console.log(`🚀 [HLS Converter] About to spawn FFmpeg process...`);
      console.log(`🚀 [HLS Converter] Temp input path: ${tempInputPath}`);
      console.log(`🚀 [HLS Converter] Output dir: ${outputDir}`);
      console.log(`🚀 [HLS Converter] Playlist path: ${playlistPath}`);
      
      const execPromise = new Promise<void>((resolve, reject) => {
        try {
          // Use spawn instead of exec to have process handle for killing
          const commandParts = ffmpegCommand.split(/\s+/);
          const command = commandParts[0];
          const args = commandParts.slice(1);
          
          console.log(`🚀 [HLS Converter] Spawning FFmpeg: ${command}`);
          console.log(`🚀 [HLS Converter] Args: ${args.slice(0, 5).join(' ')}...`);
          
          try {
            ffmpegProcess = spawn(command, args, {
              shell: true,
              stdio: 'pipe'
            });
            
            console.log(`✅ [HLS Converter] FFmpeg process spawned (PID: ${ffmpegProcess.pid || 'unknown'})`);
            console.log(`🔍 [HLS Converter] Process details: killed=${ffmpegProcess.killed}, exitCode=${ffmpegProcess.exitCode}, signalCode=${ffmpegProcess.signalCode}`);
          } catch (spawnError: any) {
            console.error(`❌ [HLS Converter] Error during spawn():`, spawnError);
            throw spawnError;
          }
          
          // Check if process was killed immediately (FFmpeg not found)
          if (ffmpegProcess.killed) {
            console.error(`❌ [HLS Converter] FFmpeg process was killed immediately - FFmpeg may not be installed`);
            reject(new Error('FFmpeg process was killed immediately - FFmpeg may not be installed or not in PATH'));
            return;
          }
          
          let stderr = '';
          let hasOutput = false;
          let lastProgressTime = Date.now();
          
          // Set up error handler FIRST before any other events
          ffmpegProcess.on('error', (error: Error) => {
            console.error(`❌ [HLS Converter] FFmpeg spawn error:`, error);
            console.error(`❌ [HLS Converter] Error details:`, {
              message: error.message,
              name: error.name,
              stack: error.stack?.substring(0, 500)
            });
            reject(new Error(`FFmpeg spawn error: ${error.message}`));
          });
          
          ffmpegProcess.stderr.on('data', (data: Buffer) => {
            const output = data.toString();
            stderr += output;
            hasOutput = true;
            
            // Log progress every 10 seconds
            const now = Date.now();
            if (now - lastProgressTime > 10000) {
              console.log(`⏳ [HLS Converter] FFmpeg still running... (last output: ${output.substring(0, 200)})`);
              lastProgressTime = now;
            }
          });
          
          ffmpegProcess.on('close', (code: number, signal: string) => {
            console.log(`🔚 [HLS Converter] FFmpeg process closed - code: ${code}, signal: ${signal || 'none'}`);
            if (code === 0) {
              console.log(`✅ [HLS Converter] FFmpeg completed successfully`);
              resolve();
            } else {
              console.error(`❌ [HLS Converter] FFmpeg exited with code ${code}`);
              console.error(`❌ [HLS Converter] FFmpeg stderr (first 1000 chars): ${stderr.substring(0, 1000)}`);
              reject(new Error(`FFmpeg exited with code ${code}: ${stderr.substring(0, 500)}`));
            }
          });
          
          // Check if process is actually running after a short delay
          setTimeout(() => {
            if (ffmpegProcess) {
              const isRunning = !ffmpegProcess.killed && ffmpegProcess.exitCode === null;
              console.log(`🔍 [HLS Converter] FFmpeg process check - running: ${isRunning}, killed: ${ffmpegProcess.killed}, exitCode: ${ffmpegProcess.exitCode}, hasOutput: ${hasOutput}`);
            }
          }, 2000);
          
        } catch (error: any) {
          console.error(`❌ [HLS Converter] Error in execPromise:`, error);
          reject(new Error(`Failed to create FFmpeg process: ${error.message}`));
        }
      });
      
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => {
          if (ffmpegProcess) {
            console.error(`⏰ [HLS Converter] FFmpeg timeout, killing process...`);
            try {
              ffmpegProcess.kill('SIGKILL');
            } catch (e) {
              console.error(`⚠️ [HLS Converter] Failed to kill FFmpeg process:`, e);
            }
          }
          reject(new Error(`FFmpeg conversion timeout after ${(timeoutMs / 1000 / 60).toFixed(1)} minutes`));
        }, timeoutMs);
      });

      await Promise.race([execPromise, timeoutPromise]);

      // Read all segment files
      const segmentPaths: string[] = [];
      const files = fs.readdirSync(outputDir);
      for (const file of files) {
        if (file.endsWith('.ts')) {
          segmentPaths.push(path.join(outputDir, file));
        }
      }

      // Cleanup temp input file
      if (fs.existsSync(tempInputPath)) {
        fs.unlinkSync(tempInputPath);
      }

      return { playlistPath, segmentPaths };
    } catch (error: any) {
      // Cleanup temp input file on error
      if (fs.existsSync(tempInputPath)) {
        fs.unlinkSync(tempInputPath);
      }
      console.error('❌ HLS conversion error:', error);
      throw new Error(`Failed to convert video to HLS: ${error.message}`);
    }
  }

  /**
   * Stream MP4 as HLS on-the-fly (without saving to disk)
   * This is more efficient but requires more CPU
   */
  public static async streamAsHls(
    inputPath: string,
    outputDir: string
  ): Promise<string> {
    return this.convertToHls(inputPath, outputDir);
  }

  /**
   * Check if FFmpeg is available
   */
  public static async checkFFmpeg(): Promise<boolean> {
    try {
      await execAsync('ffmpeg -version');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get video metadata using ffprobe
   * @param videoPath Path to video file
   * @returns Video metadata (resolution, bitrate, codec, fps)
   */
  public static async getVideoMetadata(videoPath: string): Promise<{
    resolution: string;
    bitrate: string;
    codec: string;
    fps: number;
  }> {
    try {
      const ffprobeCommand = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,bit_rate,codec_name,r_frame_rate -of json "${videoPath}"`;
      const { stdout } = await execAsync(ffprobeCommand);
      const metadata = JSON.parse(stdout);
      
      if (!metadata.streams || metadata.streams.length === 0) {
        return {
          resolution: '',
          bitrate: '',
          codec: '',
          fps: 0,
        };
      }

      const stream = metadata.streams[0];
      const width = stream.width || 0;
      const height = stream.height || 0;
      const resolution = width && height ? `${width}x${height}` : '';
      
      const bitrate = stream.bit_rate ? `${Math.round(parseInt(stream.bit_rate) / 1000)}k` : '';
      const codec = stream.codec_name || '';
      
      // Parse FPS from r_frame_rate (e.g., "30/1" = 30 fps)
      let fps = 0;
      if (stream.r_frame_rate) {
        const [num, den] = stream.r_frame_rate.split('/').map(Number);
        if (den && den > 0) {
          fps = Math.round((num / den) * 10) / 10;
        }
      }

      return {
        resolution,
        bitrate,
        codec,
        fps,
      };
    } catch (error: any) {
      console.error('❌ Error getting video metadata:', error);
      return {
        resolution: '',
        bitrate: '',
        codec: '',
        fps: 0,
      };
    }
  }

  /**
   * Get video metadata from buffer (supports MP4, MOV, AVI, MKV)
   * @param videoBuffer Video file buffer
   * @param originalFilename Optional original filename to extract extension
   * @returns Video metadata
   */
  public static async getVideoMetadataFromBuffer(
    videoBuffer: Buffer,
    originalFilename?: string
  ): Promise<{
    resolution: string;
    bitrate: string;
    codec: string;
    fps: number;
  }> {
    // Get extension from original filename or default to .mp4
    let extension = '.mp4';
    if (originalFilename) {
      const extMatch = originalFilename.match(/\.(mp4|mov|avi|mkv|webm|flv)$/i);
      if (extMatch) {
        extension = extMatch[0].toLowerCase();
      }
    }

    const tempInputPath = path.join(this.TEMP_DIR, `metadata_${Date.now()}${extension}`);
    try {
      // @ts-ignore - Buffer is compatible with fs.writeFileSync
      fs.writeFileSync(tempInputPath, videoBuffer);
      const metadata = await this.getVideoMetadata(tempInputPath);
      return metadata;
    } finally {
      // Cleanup temp file
      if (fs.existsSync(tempInputPath)) {
        fs.unlinkSync(tempInputPath);
      }
    }
  }

  /**
   * Extract thumbnail from video at specific time (default: 1 second)
   * @param videoPath Path to video file
   * @param outputPath Path to save thumbnail image
   * @param timeInSeconds Time in seconds to extract frame (default: 1)
   * @returns Path to thumbnail image
   */
  public static async extractThumbnail(
    videoPath: string,
    outputPath: string,
    timeInSeconds: number = 1
  ): Promise<string> {
    try {
      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Extract frame at specified time using FFmpeg
      // -ss: seek to time
      // -i: input file
      // -vframes 1: extract only 1 frame
      // -q:v 2: high quality JPEG (scale 2-31, lower is better)
      // -vf scale=1280:-1: scale to max width 1280px, maintain aspect ratio
      const ffmpegCommand = `ffmpeg -ss ${timeInSeconds} -i "${videoPath}" -vframes 1 -q:v 2 -vf "scale=1280:-1" "${outputPath}"`;

      await execAsync(ffmpegCommand);
      
      // Verify thumbnail was created
      if (!fs.existsSync(outputPath)) {
        throw new Error('Thumbnail file was not created');
      }

      console.log(`✅ [HLS Converter] Thumbnail extracted: ${outputPath}`);
      return outputPath;
    } catch (error: any) {
      console.error('❌ [HLS Converter] Error extracting thumbnail:', error);
      throw new Error(`Failed to extract thumbnail: ${error.message}`);
    }
  }

  /**
   * Extract thumbnail from video buffer
   * @param videoBuffer Video file buffer
   * @param outputPath Path to save thumbnail image
   * @param originalFilename Optional original filename to extract extension
   * @param timeInSeconds Time in seconds to extract frame (default: 1)
   * @returns Path to thumbnail image
   */
  public static async extractThumbnailFromBuffer(
    videoBuffer: Buffer,
    outputPath: string,
    originalFilename?: string,
    timeInSeconds: number = 1
  ): Promise<string> {
    // Get extension from original filename or default to .mp4
    let extension = '.mp4';
    if (originalFilename) {
      const extMatch = originalFilename.match(/\.(mp4|mov|avi|mkv|webm|flv)$/i);
      if (extMatch) {
        extension = extMatch[0].toLowerCase();
      }
    }

    const tempInputPath = path.join(this.TEMP_DIR, `thumbnail_input_${Date.now()}${extension}`);
    try {
      // @ts-ignore - Buffer is compatible with fs.writeFileSync
      fs.writeFileSync(tempInputPath, videoBuffer);
      const thumbnailPath = await this.extractThumbnail(tempInputPath, outputPath, timeInSeconds);
      return thumbnailPath;
    } finally {
      // Cleanup temp file
      if (fs.existsSync(tempInputPath)) {
        fs.unlinkSync(tempInputPath);
      }
    }
  }
}

