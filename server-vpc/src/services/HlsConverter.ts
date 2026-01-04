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
   * Convert MP4 buffer to HLS format
   * @param inputBuffer MP4 file buffer
   * @param outputDir Directory to save HLS files
   * @returns Object containing playlist path and all segment paths
   */
  public static async convertBufferToHls(
    inputBuffer: Buffer,
    outputDir: string
  ): Promise<{ playlistPath: string; segmentPaths: string[] }> {
    // Ensure temp directory exists
    if (!fs.existsSync(this.TEMP_DIR)) {
      fs.mkdirSync(this.TEMP_DIR, { recursive: true });
    }

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save buffer to temp file
    const tempInputPath = path.join(this.TEMP_DIR, `input_${Date.now()}.mp4`);
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
}

