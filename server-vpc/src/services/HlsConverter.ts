import { exec } from 'child_process';
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
    fs.writeFileSync(tempInputPath, inputBuffer);

    const playlistPath = path.join(outputDir, 'playlist.m3u8');
    const segmentPattern = path.join(outputDir, 'segment_%03d.ts');

    try {
      // Convert MP4 to HLS using FFmpeg
      const ffmpegCommand = `ffmpeg -i "${tempInputPath}" \
        -c:v libx264 -c:a aac \
        -hls_time ${this.SEGMENT_DURATION} \
        -hls_list_size 0 \
        -hls_segment_filename "${segmentPattern}" \
        -f hls \
        "${playlistPath}"`;

      await execAsync(ffmpegCommand);

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
}

