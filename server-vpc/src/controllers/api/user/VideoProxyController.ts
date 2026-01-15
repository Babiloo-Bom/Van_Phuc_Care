import { Request, Response } from 'express';
import { sendError } from '@libs/response';
import CloudflareService from '@services/cloudflare';
import mongoose from 'mongoose';
import crypto from 'crypto';

/**
 * Video Proxy Controller
 * Stream video qua backend để bảo vệ URL gốc
 * - Tạo signed token ngắn hạn (5 phút)
 * - Verify token trước khi stream
 * - Thêm headers chống download
 */

// Secret key để sign token (nên lưu trong env)
const VIDEO_TOKEN_SECRET = process.env.VIDEO_TOKEN_SECRET || 'vanphuccare-video-secret-2025';
const TOKEN_EXPIRY_SECONDS = 300; // 5 phút - token hết hạn sau 5 phút

interface VideoToken {
  lessonId?: string; // Optional for intro video
  courseId: string;
  userId: string;
  exp: number;
  isIntroVideo?: boolean; // Flag to indicate intro video
}

export default class VideoProxyController {
  /**
   * Helper: Detect protocol (http/https) correctly when behind proxy
   */
  private static getProtocol(req: Request): string {
    // Check X-Forwarded-Proto header first (set by proxy/load balancer)
    const forwardedProto = req.get('x-forwarded-proto');
    const isHttps = forwardedProto === 'https' || 
                   req.secure || 
                   (req.headers['x-forwarded-ssl'] === 'on');
    return isHttps ? 'https' : 'http';
  }

  /**
   * Helper: Get host correctly when behind proxy
   */
  private static getHost(req: Request): string {
    // Prefer X-Forwarded-Host if available (set by proxy/load balancer)
    const forwardedHost = req.get('x-forwarded-host');
    return forwardedHost || req.get('host') || 'localhost';
  }

  /**
   * Tạo signed token cho video
   * Token chỉ có hiệu lực 5 phút
   */
  public static generateVideoToken(
    courseId: string,
    userId: string,
    lessonId?: string,
    isIntroVideo?: boolean
  ): string {
    const payload: VideoToken = {
      courseId,
      userId,
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS,
      ...(lessonId ? { lessonId } : {}),
      ...(isIntroVideo ? { isIntroVideo: true } : {}),
    };

    const data = JSON.stringify(payload);
    const signature = crypto
      .createHmac('sha256', VIDEO_TOKEN_SECRET)
      .update(data)
      .digest('hex');

    // Encode payload + signature
    const token = Buffer.from(`${data}.${signature}`).toString('base64url');
    return token;
  }

  /**
   * Verify và decode token
   */
  private static verifyToken(token: string): VideoToken | null {
    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf8');
      const [data, signature] = decoded.split('.');

      if (!data || !signature) return null;

      // Verify signature
      const expectedSignature = crypto
        .createHmac('sha256', VIDEO_TOKEN_SECRET)
        .update(data)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.warn('⚠️ Invalid video token signature');
        return null;
      }

      const payload: VideoToken = JSON.parse(data);

      // Check expiry
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        console.warn('⚠️ Video token expired');
        return null;
      }

      return payload;
    } catch (error) {
      console.error('❌ Error verifying video token:', error);
      return null;
    }
  }

  /**
   * API: Lấy video token
   * POST /api/u/video/token
   * Body: { lessonId, courseId }
   */
  public static async getVideoToken(req: Request, res: Response) {
    try {
      const currentUser = (req as any).currentUser;
      if (!currentUser) {
        return sendError(res, 401, 'Unauthorized');
      }

      const userId = currentUser._id?.toString() || currentUser.id?.toString();
      const { lessonId, courseId, isIntroVideo } = req.body;

      if (!courseId) {
        return sendError(res, 400, 'Missing courseId');
      }

      // For intro video, only need courseId
      // For lesson video, need both lessonId and courseId
      if (!isIntroVideo && !lessonId) {
        return sendError(res, 400, 'Missing lessonId for lesson video');
      }

      // Verify user has access to this course
      if (isIntroVideo) {
        // For intro video, just verify course access (intro video is usually public/preview)
        // You can add course access check here if needed
      } else {
        const hasAccess = await VideoProxyController.verifyUserAccess(userId, courseId, lessonId);
        if (!hasAccess) {
          return sendError(res, 403, 'Bạn không có quyền truy cập video này');
        }
      }

      // Generate token
      const token = VideoProxyController.generateVideoToken(courseId, userId, lessonId, isIntroVideo);

      res.json({
        success: true,
        data: {
          token,
          expiresIn: TOKEN_EXPIRY_SECONDS,
        },
      });
    } catch (error: any) {
      console.error('❌ Error getting video token:', error);
      sendError(res, 500, error.message);
    }
  }

  /**
   * API: Stream video
   * GET /api/u/video/stream/:token
   * Stream video qua backend để ẩn URL gốc
   * Supports Range requests for seeking
   */
  public static async streamVideo(req: Request, res: Response) {
    try {
      const { token } = req.params;
      console.log('📦 [Video Stream] Request received, token:', token?.substring(0, 50) + '...');

      // Verify token
      const payload = VideoProxyController.verifyToken(token);
      if (!payload) {
        console.error('❌ [Video Stream] Invalid or expired token');
        return sendError(res, 401, 'Invalid or expired video token');
      }

      console.log('📦 [Video Stream] Token verified, lessonId:', payload.lessonId, 'isIntroVideo:', payload.isIntroVideo);

      // Check if this is intro video
      if (payload.isIntroVideo) {
        // Get course to find intro video URL
        const CoursesModel = (await import('@mongodb/courses')).default;
        const course = await CoursesModel.model.findById(payload.courseId);

        if (!course) {
          console.error('❌ [Video Stream] Course not found:', payload.courseId);
          return sendError(res, 404, 'Course not found');
        }

        const courseData: any = course.toObject();
        console.log('📦 [Video Stream] Course found, checking for segment request...');

        // Get intro video URL
        const introVideoUrl = courseData.introVideoHlsUrl || courseData.introVideo;
        if (!introVideoUrl) {
          console.error('❌ [Video Stream] Intro video not found for course:', payload.courseId);
          return sendError(res, 404, 'Intro video not found');
        }

        console.log('📦 [Video Stream] Intro video URL:', introVideoUrl);

        // Check if this is a segment request (from HLS manifest)
        const segmentPath = req.query.segment as string | undefined;
        console.log('📦 [Video Stream] Is segment request:', !!segmentPath);

        if (segmentPath) {
          // This is a segment request for intro video
          let decodedSegmentPath: string;
          try {
            decodedSegmentPath = decodeURIComponent(segmentPath);
          } catch (decodeError: any) {
            console.error('❌ Error decoding segment path:', decodeError);
            return sendError(res, 400, 'Invalid segment path');
          }

          if (!decodedSegmentPath || decodedSegmentPath.trim() === '') {
            console.error('❌ Empty segment path');
            return sendError(res, 400, 'Segment path is required');
          }

          console.log('📦 [Video Stream] Intro video segment request:', decodedSegmentPath);

          // Extract segment filename
          let segmentFileName: string;
          try {
            if (decodedSegmentPath.startsWith('http://') || decodedSegmentPath.startsWith('https://')) {
              const urlModule = await import('url');
              const parsedUrl = new urlModule.URL(decodedSegmentPath);
              segmentFileName = parsedUrl.pathname.split('/').pop() || '';
            } else {
              segmentFileName = decodedSegmentPath.split('/').pop() || '';
            }

            if (!segmentFileName || segmentFileName.trim() === '') {
              console.error('❌ Cannot extract segment filename from path:', decodedSegmentPath);
              return sendError(res, 400, 'Invalid segment path format');
            }

            console.log('📦 [Video Stream] Intro video segment filename:', segmentFileName);
          } catch (extractError: any) {
            console.error('❌ Error extracting segment filename:', extractError);
            return sendError(res, 400, `Failed to extract segment filename: ${extractError.message}`);
          }

          // Extract base path from intro video URL
          // URL format: https://...r2.dev/courses/intro-videos/hls/{timestamp}-video.m3u8
          // Segment format: courses/intro-videos/hls/{timestamp}-segment_000.ts
          let extractedBasePath: string | null = null;
          let timestamp: string | null = null;
          
          try {
            if (introVideoUrl.startsWith('http://') || introVideoUrl.startsWith('https://')) {
              const urlModule = await import('url');
              const parsedVideoUrl = new urlModule.URL(introVideoUrl);
              let videoPathname = parsedVideoUrl.pathname;
              
              // Remove leading slash
              if (videoPathname.startsWith('/')) {
                videoPathname = videoPathname.substring(1);
              }

              // Extract base path: courses/intro-videos/hls/
              const lastSlash = videoPathname.lastIndexOf('/');
              if (lastSlash > 0) {
                extractedBasePath = videoPathname.substring(0, lastSlash);
                console.log('📦 [Video Stream] Extracted base path from intro video URL:', extractedBasePath);
                
                // Extract timestamp from manifest filename (e.g., {timestamp}-video.m3u8)
                const manifestFileName = videoPathname.substring(lastSlash + 1);
                const timestampMatch = manifestFileName.match(/^(\d{10,})-/);
                if (timestampMatch) {
                  timestamp = timestampMatch[1];
                  console.log('📦 [Video Stream] Extracted timestamp from intro video URL:', timestamp);
                }
              } else {
                // Fallback: use courses/intro-videos/hls
                extractedBasePath = 'courses/intro-videos/hls';
              }
            } else {
              // If not a full URL, assume it's already a path
              const pathParts = introVideoUrl.split('/');
              const hlsIndex = pathParts.findIndex((part: string) => part === 'hls');
              if (hlsIndex !== -1) {
                extractedBasePath = pathParts.slice(0, hlsIndex + 1).join('/');
                // Try to extract timestamp from last part
                if (pathParts.length > hlsIndex + 1) {
                  const lastPart = pathParts[pathParts.length - 1];
                  const timestampMatch = lastPart.match(/^(\d{10,})-/);
                  if (timestampMatch) {
                    timestamp = timestampMatch[1];
                  }
                }
              } else {
                extractedBasePath = 'courses/intro-videos/hls';
              }
            }
          } catch (extractError: any) {
            console.error('❌ Error extracting base path from intro video URL:', extractError);
            // Fallback to default path
            extractedBasePath = 'courses/intro-videos/hls';
          }

          // Try multiple folder patterns, prioritizing extracted path
          const folderPatterns: string[] = [];
          if (extractedBasePath) {
            folderPatterns.push(extractedBasePath);
          }
          if (timestamp) {
            folderPatterns.push(`courses/intro-videos/hls`);
          }
          // Fallback
          folderPatterns.push('courses/intro-videos/hls');

          console.log('📦 [Video Stream] Will try folder patterns:', folderPatterns);
          console.log('📦 [Video Stream] Looking for segment ending with:', segmentFileName);

          // List objects in folder to find segment with matching filename
          // Segment format: {timestamp}-segment_000.ts
          // We need to find segment that ends with segmentFileName
          let segmentObject: any = null;
          let foundFolder: string | null = null;

          try {
            // Dynamic import to avoid TypeScript errors
            // @ts-ignore - @aws-sdk/client-s3 is installed but TypeScript may not recognize it
            const { ListObjectsV2Command, S3Client } = await import('@aws-sdk/client-s3');
            
            const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
            console.log('📦 [Video Stream] Bucket name:', bucketName);
            
            // Create a temporary client instance
            const tempClient = new S3Client({
              region: "auto",
              endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
              credentials: {
                accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
              },
              forcePathStyle: true,
            });

            // Try each folder pattern
            for (const folderPattern of folderPatterns) {
              try {
                console.log(`📦 [Video Stream] Listing objects in folder: ${folderPattern}`);
                const listCommand = new ListObjectsV2Command({
                  Bucket: bucketName,
                  Prefix: folderPattern.endsWith('/') ? folderPattern : `${folderPattern}/`,
                });

                const listResponse = await tempClient.send(listCommand);
                
                if (listResponse.Contents && listResponse.Contents.length > 0) {
                  // Find segment that ends with segmentFileName
                  segmentObject = listResponse.Contents.find((obj: any) => {
                    const objKey = obj.Key || '';
                    return objKey.endsWith(segmentFileName);
                  });

                  if (segmentObject) {
                    foundFolder = folderPattern;
                    console.log(`✅ [Video Stream] Found intro video segment: ${segmentObject.Key}`);
                    break;
                  }
                }
              } catch (listError: any) {
                console.warn(`⚠️ [Video Stream] Error listing objects in ${folderPattern}:`, listError.message);
                // Continue to next pattern
              }
            }

            if (!segmentObject || !foundFolder) {
              console.error('❌ [Video Stream] Intro video segment not found in any folder pattern');
              return sendError(res, 404, 'Segment not found');
            }

            // Get segment from R2 using the found object key
            const segmentKey = segmentObject.Key;
            console.log('📦 [Video Stream] Getting intro video segment from R2:', segmentKey);

            const segmentBuffer = await CloudflareService.getFile(segmentKey);
            if (!segmentBuffer) {
              console.error('❌ [Video Stream] Intro video segment not found in R2:', segmentKey);
              return sendError(res, 404, 'Segment not found');
            }

            // Set headers for video segment
            res.setHeader('Content-Type', 'video/mp2t');
            res.setHeader('Content-Length', segmentBuffer.length);
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.setHeader('Accept-Ranges', 'bytes');

            // Send segment
            res.send(segmentBuffer);
            return;
          } catch (segmentError: any) {
            console.error('❌ [Video Stream] Error getting intro video segment from R2:', segmentError);
            return sendError(res, 500, 'Failed to get video segment');
          }
        } else {
          // This is a manifest request (.m3u8) for intro video
          console.log('📦 [Video Stream] Intro video manifest request');

          // Get manifest from R2
          try {
            // Extract manifest path from intro video URL
            let manifestPath: string;
            if (introVideoUrl.startsWith('http://') || introVideoUrl.startsWith('https://')) {
              const urlModule = await import('url');
              const parsedUrl = new urlModule.URL(introVideoUrl);
              manifestPath = parsedUrl.pathname;
              if (manifestPath.startsWith('/')) {
                manifestPath = manifestPath.substring(1);
              }
            } else {
              manifestPath = introVideoUrl;
            }

            console.log('📦 [Video Stream] Intro video manifest path:', manifestPath);

            const manifestBuffer = await CloudflareService.getFile(manifestPath);
            if (!manifestBuffer) {
              console.error('❌ [Video Stream] Intro video manifest not found in R2:', manifestPath);
              return sendError(res, 404, 'Manifest not found');
            }

            let manifestContent = manifestBuffer.toString('utf8');

            // Rewrite segment URLs to use proxy
            // Replace segment URLs with proxy URLs
            const protocol = VideoProxyController.getProtocol(req);
            const host = VideoProxyController.getHost(req);
            const baseUrl = `${protocol}://${host}`;

            // Replace segment paths with proxy URLs
            manifestContent = manifestContent.replace(
              /^([^#\n]+\.ts)$/gm,
              (match: string) => {
                const segmentUrl = `${baseUrl}/api/u/video/stream/${token}?segment=${encodeURIComponent(match)}`;
                return segmentUrl;
              }
            );

            // Set headers for HLS manifest
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            res.setHeader('Content-Length', Buffer.byteLength(manifestContent));
            res.setHeader('Cache-Control', 'public, max-age=60');

            // Send manifest
            res.send(manifestContent);
            return;
          } catch (manifestError: any) {
            console.error('❌ [Video Stream] Error getting intro video manifest from R2:', manifestError);
            return sendError(res, 500, 'Failed to get video manifest');
          }
        }
      }

      // Original lesson video logic
      // Get lesson to find video URL
      const LessonsModel = (await import('@mongodb/lessons')).default;
      const lesson = await LessonsModel.model.findById(payload.lessonId);

      if (!lesson) {
        console.error('❌ [Video Stream] Lesson not found:', payload.lessonId);
        return sendError(res, 404, 'Lesson not found');
      }

      const lessonData: any = lesson.toObject();
      let videoPath: string | null = null;
      console.log('📦 [Video Stream] Lesson found, checking for segment request...');

      // Check if this is a segment request (from HLS manifest)
      const segmentPath = req.query.segment as string | undefined;
      console.log('📦 [Video Stream] Is segment request:', !!segmentPath);
      
      if (segmentPath) {
        // This is a segment request - need to find the actual segment in R2
        let decodedSegmentPath: string;
        try {
          decodedSegmentPath = decodeURIComponent(segmentPath);
        } catch (decodeError: any) {
          console.error('❌ Error decoding segment path:', decodeError);
          return sendError(res, 400, 'Invalid segment path');
        }
        
        if (!decodedSegmentPath || decodedSegmentPath.trim() === '') {
          console.error('❌ Empty segment path');
          return sendError(res, 400, 'Segment path is required');
        }
        
        console.log('📦 Segment request:', decodedSegmentPath);
        
        // Get video URL from lesson to understand the storage structure
        // Priority: hlsUrl (for HLS videos) > videoUrl (for MP4 videos)
        let lessonVideoUrl: string | null = null;
        if (lessonData.videos && lessonData.videos.length > 0) {
          const firstVideo = lessonData.videos[0];
          lessonVideoUrl = firstVideo.hlsUrl || firstVideo.videoUrl || null;
        } else if (lessonData.hlsUrl) {
          lessonVideoUrl = lessonData.hlsUrl;
        } else if (lessonData.videoUrl) {
          lessonVideoUrl = lessonData.videoUrl;
        }
        console.log('📦 Lesson video URL from DB:', lessonVideoUrl);
        
        // Extract segment filename from URL or path
        let segmentFileName: string;
        try {
          if (decodedSegmentPath.startsWith('http://') || decodedSegmentPath.startsWith('https://')) {
            const urlModule = await import('url');
            const parsedUrl = new urlModule.URL(decodedSegmentPath);
            segmentFileName = parsedUrl.pathname.split('/').pop() || '';
          } else {
            segmentFileName = decodedSegmentPath.split('/').pop() || '';
          }
          
          if (!segmentFileName || segmentFileName.trim() === '') {
            console.error('❌ Cannot extract segment filename from path:', decodedSegmentPath);
            return sendError(res, 400, 'Invalid segment path format');
          }
          
          console.log('📦 Segment filename:', segmentFileName);
        } catch (extractError: any) {
          console.error('❌ Error extracting segment filename:', extractError);
          return sendError(res, 400, `Failed to extract segment filename: ${extractError.message}`);
        }
        
        // Try to extract timestamp from segment URL to find the correct folder
        // URL format: https://...r2.dev/courses/lessons/{timestamp}/hls/segment_000.ts
        // Object format might be: lessons/{lessonId}/videos/hls/{timestamp}-segment_000.ts
        // OR: lessons/{timestamp}/videos/hls/{timestamp}-segment_000.ts
        const lessonId = payload.lessonId;
        
        // Extract path information from lesson video URL and segment URL
        let timestamp: string | null = null;
        let extractedBasePath: string | null = null;
        
        // First, try to extract from lesson video URL (more reliable)
        // Objects are stored with prefix: courses/lessons/{timestamp}/hls/
        try {
          if (lessonVideoUrl && (lessonVideoUrl.startsWith('http://') || lessonVideoUrl.startsWith('https://'))) {
            const urlModule = await import('url');
            const parsedVideoUrl = new urlModule.URL(lessonVideoUrl);
            let videoPathname = parsedVideoUrl.pathname;
            if (videoPathname.startsWith('/')) videoPathname = videoPathname.substring(1);
            // KEEP 'courses' prefix - objects are stored with this prefix
            // Get folder (everything except filename)
            const lastSlash = videoPathname.lastIndexOf('/');
            if (lastSlash > 0) {
              extractedBasePath = videoPathname.substring(0, lastSlash);
              // Don't add /videos - objects are stored as courses/lessons/{timestamp}/hls/ (no videos/)
              console.log('📦 Extracted base path from lesson video URL (keeping courses/ prefix):', extractedBasePath);
            }
          }
        } catch (urlExtractError: any) {
          console.warn('⚠️ Error extracting base path from lesson video URL:', urlExtractError.message);
          // Continue with other methods
        }
        
        // Also extract timestamp from segment URL as fallback
        try {
          if (decodedSegmentPath.startsWith('http://') || decodedSegmentPath.startsWith('https://')) {
            const urlModule = await import('url');
            const parsedUrl = new urlModule.URL(decodedSegmentPath);
            const pathParts = parsedUrl.pathname.split('/').filter(p => p);
            const lessonsIndex = pathParts.indexOf('lessons');
            if (lessonsIndex >= 0 && lessonsIndex + 1 < pathParts.length) {
              const potentialTimestamp = pathParts[lessonsIndex + 1];
              if (/^\d{10,}$/.test(potentialTimestamp)) {
                timestamp = potentialTimestamp;
                console.log('📦 Extracted timestamp from segment URL:', timestamp);
              }
            }
          }
        } catch (timestampExtractError: any) {
          console.warn('⚠️ Error extracting timestamp from segment URL:', timestampExtractError.message);
          // Continue with other methods
        }
        
        // Try multiple folder patterns, prioritizing extracted path
        // Objects are stored as: courses/lessons/{timestamp}/hls/
        const folderPatterns: string[] = [];
        if (extractedBasePath) {
          folderPatterns.push(extractedBasePath); // This should be courses/lessons/{timestamp}/hls
        }
        if (timestamp) {
          // Add courses/ prefix patterns with timestamp
          folderPatterns.push(`courses/lessons/${timestamp}/hls`);
          folderPatterns.push(`courses/lessons/${timestamp}/`);
          // Also try without courses/ prefix (fallback)
          folderPatterns.push(`lessons/${timestamp}/hls`);
          folderPatterns.push(`lessons/${timestamp}/`);
        }
        // Fallback with lesson ID
        folderPatterns.push(`courses/lessons/${lessonId}/hls`);
        folderPatterns.push(`courses/lessons/${lessonId}/`);
        folderPatterns.push(`lessons/${lessonId}/videos/hls`);
        folderPatterns.push(`lessons/${lessonId}/hls`);
        
        console.log('📦 Using lesson ID from token:', lessonId);
        console.log('📦 Will try folder patterns:', folderPatterns);
        
        console.log('📦 Looking for segment ending with:', segmentFileName);
        
        // List objects in folder to find segment with matching filename
        // Segment format: {timestamp}-segment_000.ts
        // We need to find segment that ends with segmentFileName
        let segmentObject: any = null;
        let foundFolder: string | null = null;
        
        try {
          // Dynamic import to avoid TypeScript errors
          // @ts-ignore - @aws-sdk/client-s3 is installed but TypeScript may not recognize it
          const { ListObjectsV2Command, S3Client } = await import('@aws-sdk/client-s3');
          
          // Use CloudflareService to list objects
          const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
          console.log('📦 Bucket name:', bucketName);
          
          // Get S3Client from CloudflareService (need to access private client)
          // Alternative: Add public method to CloudflareService for listing
          // For now, create a new client instance
          const tempClient = new S3Client({
            region: "auto",
            endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
              accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
              secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
            },
            forcePathStyle: true,
          });
          
          // Try each folder pattern until we find the segment
          for (const baseFolder of folderPatterns) {
            console.log(`📦 Trying folder pattern: ${baseFolder}/`);
            const listCommand = new ListObjectsV2Command({
              Bucket: bucketName,
              Prefix: baseFolder + '/',
            });
            
            let listResponse = await tempClient.send(listCommand);
            let objects = listResponse.Contents || [];
            
            console.log(`📦 Found ${objects.length} objects in folder: ${baseFolder}/`);
            if (objects.length > 0) {
              console.log(`📦 Sample object keys:`, objects.slice(0, 3).map((obj: any) => obj.Key));
              
              // Find segment that ends with the requested filename
              const found = objects.find((obj: any) => {
                const objKey = obj.Key || '';
                return objKey.endsWith(segmentFileName) && objKey.endsWith('.ts');
              });
              
              if (found) {
                segmentObject = found;
                foundFolder = baseFolder;
                console.log(`✅ Found segment in folder: ${baseFolder}`);
                console.log(`✅ Segment object key: ${found.Key}`);
                break;
              }
            }
          }
          
          // If still not found, log error
          if (!segmentObject) {
            console.error(`❌ [Segment Search] Segment not found after trying all folder patterns!`);
            console.error(`❌ [Segment Search] Looking for: ${segmentFileName}`);
            console.error(`❌ [Segment Search] Tried ${folderPatterns.length} folder patterns:`, folderPatterns);
            // If segment not found in R2, try to stream directly from the URL in the request
            // This handles cases where segments are stored externally or in a different format
            console.warn('⚠️ Segment not found in R2, trying to stream from URL directly');
            console.warn('⚠️ Segment filename:', segmentFileName);
            
            // Use the segment URL from the request directly
            if (decodedSegmentPath && (decodedSegmentPath.startsWith('http://') || decodedSegmentPath.startsWith('https://'))) {
              // This is a full URL - stream directly from it
              videoPath = decodedSegmentPath;
              console.log('📦 Streaming segment directly from URL:', videoPath);
            } else if (decodedSegmentPath && lessonVideoUrl) {
              // Relative path - construct full URL from manifest base URL
              try {
                const urlModule = await import('url');
                const parsedManifestUrl = new urlModule.URL(lessonVideoUrl);
                const manifestBaseUrl = lessonVideoUrl.substring(0, lessonVideoUrl.lastIndexOf('/'));
                videoPath = manifestBaseUrl + '/' + decodedSegmentPath;
                console.log('📦 Constructed segment URL from manifest:', videoPath);
              } catch (urlError: any) {
                console.error('❌ Error constructing segment URL:', urlError);
                return sendError(res, 500, `Failed to construct segment URL: ${urlError.message}`);
              }
            } else {
              console.error('❌ Cannot construct segment URL - missing segment path or manifest URL');
              console.error('❌ decodedSegmentPath:', decodedSegmentPath);
              console.error('❌ lessonVideoUrl:', lessonVideoUrl);
              return sendError(res, 404, `Segment ${segmentFileName || 'unknown'} not found`);
            }
            
            // Ensure videoPath was set
            if (!videoPath) {
              console.error('❌ videoPath is still null after trying to construct segment URL');
              return sendError(res, 404, `Segment ${segmentFileName || 'unknown'} not found`);
            }
          } else {
            videoPath = segmentObject.Key;
            console.log('✅ Found segment object in R2:', videoPath);
          }
        } catch (error: any) {
          console.error('❌ [Segment Request] Error listing objects:', error);
          console.error('❌ [Segment Request] Error details:', {
            message: error.message,
            name: error.name,
            code: error.Code || error.code,
            stack: error.stack?.substring(0, 500),
          });
          // Don't return error here - try to fallback to direct URL streaming
          console.warn('⚠️ [Segment Request] Attempting fallback to direct URL streaming');
          try {
            if (decodedSegmentPath && (decodedSegmentPath.startsWith('http://') || decodedSegmentPath.startsWith('https://'))) {
              videoPath = decodedSegmentPath;
              console.log('📦 [Segment Request] Fallback: Using segment URL directly:', videoPath);
            } else if (decodedSegmentPath && lessonVideoUrl) {
              const urlModule = await import('url');
              const parsedManifestUrl = new urlModule.URL(lessonVideoUrl);
              const manifestBaseUrl = lessonVideoUrl.substring(0, lessonVideoUrl.lastIndexOf('/'));
              videoPath = manifestBaseUrl + '/' + decodedSegmentPath;
              console.log('📦 [Segment Request] Fallback: Constructed segment URL:', videoPath);
            } else {
              console.error('❌ [Segment Request] Cannot fallback - missing data');
              console.error('❌ decodedSegmentPath:', decodedSegmentPath);
              console.error('❌ lessonVideoUrl:', lessonVideoUrl);
              return sendError(res, 500, `Failed to find segment: ${error.message}`);
            }
          } catch (fallbackError: any) {
            console.error('❌ [Segment Request] Fallback also failed:', fallbackError);
            return sendError(res, 500, `Failed to find segment: ${error.message}`);
          }
        }
      } else {
        // This is a manifest or MP4 request - get video path from lesson
        // Priority: hlsUrl (for HLS videos) > videoUrl (for MP4 videos)
        console.log('📦 [Manifest Request] Getting video path from lesson');
        console.log('📦 [Manifest Request] Lesson has videos array:', !!lessonData.videos, lessonData.videos?.length || 0);
        console.log('📦 [Manifest Request] Lesson hlsUrl:', lessonData.hlsUrl);
        console.log('📦 [Manifest Request] Lesson videoUrl:', lessonData.videoUrl);
        
        if (lessonData.videos && lessonData.videos.length > 0) {
          const firstVideo = lessonData.videos[0];
          console.log('📦 [Manifest Request] First video hlsUrl:', firstVideo.hlsUrl);
          console.log('📦 [Manifest Request] First video videoUrl:', firstVideo.videoUrl);
          // Prefer hlsUrl if available (for HLS videos)
          videoPath = firstVideo.hlsUrl || firstVideo.videoUrl || null;
        } else if (lessonData.hlsUrl) {
          videoPath = lessonData.hlsUrl;
        } else if (lessonData.videoUrl) {
          videoPath = lessonData.videoUrl;
        }
        
        console.log('📦 [Manifest Request] Final videoPath:', videoPath || 'null');
      }

      if (!videoPath) {
        console.error('❌ [Video Stream] Video path is null after processing');
        console.error('❌ [Video Stream] Lesson ID:', payload.lessonId);
        console.error('❌ [Video Stream] Lesson data:', {
          hasVideos: !!lessonData.videos,
          videosLength: lessonData.videos?.length || 0,
          hasHlsUrl: !!lessonData.hlsUrl,
          hasVideoUrl: !!lessonData.videoUrl,
        });
        return sendError(res, 404, 'Video not found for this lesson');
      }

      // Check if it's HLS manifest
      const isHls = videoPath.endsWith('.m3u8');
      
      // Store original object name for segment URL construction
      let originalObjectName: string | null = null;
      
      // Get video URL (external URL hoặc presigned R2 URL)
      let videoUrl: string;
      if (videoPath.startsWith('http://') || videoPath.startsWith('https://')) {
        // Check if this is an R2 public URL (need to convert to presigned URL)
        const r2PublicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;
        if (r2PublicUrl && videoPath.startsWith(r2PublicUrl)) {
          // This is an R2 public URL - extract object name and create presigned URL
          // URL format: https://xxx.r2.dev/object/name/path
          originalObjectName = videoPath.replace(r2PublicUrl, '').replace(/^\//, '');
          console.log('📦 R2 public URL detected, extracting object name:', originalObjectName);
          console.log('📦 Getting presigned URL for object:', originalObjectName);
          videoUrl = await CloudflareService.getFileUrl(originalObjectName, 300); // 5 minutes
          console.log('📦 Presigned URL created:', videoUrl.substring(0, 100) + '...');
        } else {
          // External URL (Pexels, etc.) - stream trực tiếp
          videoUrl = videoPath;
        }
      } else {
        // R2 path (object name) - get presigned URL
        // Remove leading slash and /vanphuccare-video-edu/ prefix if present
        originalObjectName = videoPath.replace(/^\/vanphuccare-video-edu\//, '').replace(/^\//, '');
        console.log('📦 Getting presigned URL for object:', originalObjectName);
        videoUrl = await CloudflareService.getFileUrl(originalObjectName, 300); // 5 minutes
        console.log('📦 Presigned URL created:', videoUrl.substring(0, 100) + '...');
      }

      // Stream video qua backend để ẩn URL gốc
      const https = await import('https');
      const http = await import('http');
      const urlModule = await import('url');
      
      // Helper function to extract base path from URL
      const extractBasePath = (url: string): string => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
          const parsedUrl = new urlModule.URL(url);
          let pathname = parsedUrl.pathname;
          if (pathname.startsWith('/')) pathname = pathname.substring(1);
          const lastSlash = pathname.lastIndexOf('/');
          return lastSlash > 0 ? pathname.substring(0, lastSlash) : '';
        }
        return '';
      };

      const parsedUrl = new urlModule.URL(videoUrl);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      // Set security headers to prevent download
      // Content-Disposition: inline prevents browser from suggesting download
      res.setHeader('Content-Disposition', isHls ? 'inline' : 'inline; filename="video.mp4"');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('Content-Security-Policy', "default-src 'self'; media-src 'self' blob: data:");
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for streaming
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range');
      
      // Block known download tools by User-Agent
      const userAgent = req.headers['user-agent'] || '';
      const downloadTools = ['coccoc', 'idm', 'internet download manager', 'wget', 'curl', 'aria2'];
      const isDownloadTool = downloadTools.some(tool => userAgent.toLowerCase().includes(tool));
      
      if (isDownloadTool && !req.headers.range) {
        // If it's a download tool and not a Range request (video seeking), block it
        console.warn('⚠️ Blocked download tool:', userAgent);
        return sendError(res, 403, 'Direct download not allowed');
      }

      // Handle Range requests for video seeking
      const range = req.headers.range;

      console.log('📦 [Video Stream] Proxying request to:', videoUrl.substring(0, 100) + '...');
      
      const proxyRequest = protocol.get(videoUrl, {
        headers: range ? { Range: range } : {},
      }, (proxyResponse) => {
        const statusCode = proxyResponse.statusCode || 200;
        console.log('📦 [Video Stream] Proxy response status:', statusCode);
        
        // If R2 returns 404, return 404 to client
        if (statusCode === 404) {
          console.error('❌ [Video Stream] R2 returned 404 for video:', videoUrl);
          if (!res.headersSent) {
            return sendError(res, 404, 'Video file not found in storage');
          }
          return;
        }
        
        // Forward status and headers
        res.status(statusCode);
        
        // Set content headers first
        if (proxyResponse.headers['content-type']) {
          res.setHeader('Content-Type', proxyResponse.headers['content-type']);
        } else if (isHls) {
          res.setHeader('Content-Type', 'application/x-mpegURL'); // For HLS manifest
        } else {
          res.setHeader('Content-Type', 'video/mp4'); // Default for MP4
        }
        if (proxyResponse.headers['content-length']) {
          res.setHeader('Content-Length', proxyResponse.headers['content-length']);
        }
        if (proxyResponse.headers['content-range']) {
          res.setHeader('Content-Range', proxyResponse.headers['content-range']);
        }
        if (proxyResponse.headers['accept-ranges']) {
          res.setHeader('Accept-Ranges', proxyResponse.headers['accept-ranges']);
        }

        // RE-SET security headers AFTER content headers để không bị overwrite
        res.setHeader('Content-Disposition', isHls ? 'inline' : 'inline; filename="video.mp4"'); // Chống download
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('Content-Security-Policy', "default-src 'self'; media-src 'self' blob: data:");
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for streaming
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Range');
        // KHÔNG set Access-Control-Allow-Credentials vì không dùng credentials

        // For HLS manifest, parse and rewrite segment URLs to use proxy
        if (isHls) {
          let manifestData = '';
          proxyResponse.on('data', (chunk) => {
            manifestData += chunk.toString();
          });
          proxyResponse.on('error', (error: any) => {
            console.error('❌ [Video Stream] Error reading manifest data:', error);
            if (!res.headersSent) {
              return sendError(res, 500, 'Failed to read manifest data');
            }
          });
          proxyResponse.on('end', () => {
            if (!manifestData || manifestData.trim() === '') {
              console.error('❌ [Video Stream] Manifest data is empty');
              if (!res.headersSent) {
                return sendError(res, 500, 'Manifest file is empty');
              }
              return;
            }
            // Parse manifest and replace segment URLs with proxy URLs
            const manifestLines = manifestData.split('\n');
            
            // Extract base URL from videoUrl (actual URL, not videoPath)
            // videoUrl is the presigned/public URL from R2
            // We'll use this to construct segment URLs
            const manifestBaseUrl = videoUrl.substring(0, videoUrl.lastIndexOf('/'));
            
            console.log('📦 Manifest base URL:', manifestBaseUrl);
            
            // Detect protocol and host correctly when behind proxy/load balancer
            const protocol = VideoProxyController.getProtocol(req);
            const host = VideoProxyController.getHost(req);
            const baseProxyUrl = `${protocol}://${host}/api/u/video/stream/${token}`;
            console.log('📦 [Manifest] Base proxy URL:', baseProxyUrl);
            
            const modifiedManifest = manifestLines.map((line: string) => {
              // Skip comments and empty lines
              if (line.startsWith('#') || line.trim() === '') {
                return line;
              }
              // Replace segment URLs with proxy URLs
              const segmentLine = line.trim();
              if (segmentLine && segmentLine.endsWith('.ts')) {
                // Extract segment path
                let segmentPath: string;
                if (segmentLine.startsWith('http://') || segmentLine.startsWith('https://')) {
                  // Full URL - use as is (will be extracted in segment request handler)
                  segmentPath = segmentLine;
                } else {
                  // Relative path - combine with base URL from manifest
                  segmentPath = manifestBaseUrl + '/' + segmentLine;
                }
                // Encode segment path as query param
                const segmentParam = encodeURIComponent(segmentPath);
                // Return proxy URL with segment query param
                return `${baseProxyUrl}?segment=${segmentParam}`;
              }
              return line;
            }).join('\n');
            
            res.setHeader('Content-Length', Buffer.byteLength(modifiedManifest, 'utf8'));
            res.end(modifiedManifest);
          });
        } else {
          // Stream video data directly for MP4
          proxyResponse.pipe(res);
        }
      });

      proxyRequest.on('error', (error: any) => {
        console.error('❌ [Video Stream] Proxy request error:', error);
        console.error('❌ [Video Stream] Error details:', {
          message: error.message,
          code: error.code,
          errno: error.errno,
          syscall: error.syscall,
          hostname: error.hostname,
        });
        if (!res.headersSent) {
          // Check if it's a DNS or connection error
          if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            return sendError(res, 503, 'Video storage service unavailable');
          }
          return sendError(res, 500, `Failed to stream video: ${error.message}`);
        }
      });
      
      // Handle timeout
      proxyRequest.setTimeout(30000, () => {
        console.error('❌ [Video Stream] Proxy request timeout');
        proxyRequest.destroy();
        if (!res.headersSent) {
          return sendError(res, 504, 'Video stream request timeout');
        }
      });

    } catch (error: any) {
      console.error('❌ Error streaming video:', error);
      sendError(res, 500, error.message);
    }
  }

  /**
   * API: Proxy fetch video để hỗ trợ CORS
   * GET /api/u/video/fetch/:token
   * Stream video qua backend để frontend có thể tạo Blob URL
   */
  public static async fetchVideoProxy(req: Request, res: Response) {
    try {
      const { token } = req.params;

      // Verify token
      const payload = VideoProxyController.verifyToken(token);
      if (!payload) {
        return sendError(res, 401, 'Invalid or expired video token');
      }

      // Get lesson to find video URL
      const LessonsModel = (await import('@mongodb/lessons')).default;
      const lesson = await LessonsModel.model.findById(payload.lessonId);

      if (!lesson) {
        return sendError(res, 404, 'Lesson not found');
      }

      const lessonData: any = lesson.toObject();
      let videoPath: string | null = null;

      // Get video path from lesson
      if (lessonData.videoUrl) {
        videoPath = lessonData.videoUrl;
      } else if (lessonData.videos && lessonData.videos.length > 0) {
        videoPath = lessonData.videos[0].videoUrl;
      }

      if (!videoPath) {
        return sendError(res, 404, 'Video not found');
      }

      // Get presigned URL
      let videoUrl: string;
      if (videoPath.startsWith('http://') || videoPath.startsWith('https://')) {
        videoUrl = videoPath;
      } else {
        const objectName = videoPath.replace(/^\/vanphuccare-video-edu\//, '');
        videoUrl = await CloudflareService.getFileUrl(objectName, 300);
      }

      // Fetch video from R2 and stream to client
      const https = await import('https');
      const http = await import('http');
      const urlModule = await import('url');

      const parsedUrl = new urlModule.URL(videoUrl);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      // Set CORS and security headers
      // Allow all origins (vì frontend không dùng credentials)
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'no-store');

      // Handle Range requests for video seeking
      const range = req.headers.range;

      const proxyRequest = protocol.get(videoUrl, {
        headers: range ? { Range: range } : {},
      }, (proxyResponse) => {
        // Forward status and headers
        res.status(proxyResponse.statusCode || 200);
        
        if (proxyResponse.headers['content-type']) {
          res.setHeader('Content-Type', proxyResponse.headers['content-type']);
        }
        if (proxyResponse.headers['content-length']) {
          res.setHeader('Content-Length', proxyResponse.headers['content-length']);
        }
        if (proxyResponse.headers['content-range']) {
          res.setHeader('Content-Range', proxyResponse.headers['content-range']);
        }
        if (proxyResponse.headers['accept-ranges']) {
          res.setHeader('Accept-Ranges', proxyResponse.headers['accept-ranges']);
        }

        // Stream video data
        proxyResponse.pipe(res);
      });

      proxyRequest.on('error', (error) => {
        console.error('❌ Video proxy error:', error);
        if (!res.headersSent) {
          sendError(res, 500, 'Failed to fetch video');
        }
      });

    } catch (error: any) {
      console.error('❌ Error in video proxy:', error);
      sendError(res, 500, error.message);
    }
  }

  /**
   * Verify user has access to course/lesson
   */
  private static async verifyUserAccess(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<boolean> {
    try {
      // Check if user has purchased the course
      const OrderModel = (await import('@mongodb/orders')).default;
      const completedOrder = await OrderModel.model.findOne({
        userId: userId,
        'items.courseId': courseId,
        status: 'completed',
      });

      if (completedOrder) return true;

      // Check if lesson is preview
      const LessonsModel = (await import('@mongodb/lessons')).default;
      const lesson = await LessonsModel.model.findById(lessonId);
      if (lesson && (lesson as any).isPreview) return true;

      // Check if user is admin
      const UserModel = (await import('@mongodb/users')).default;
      const user = await UserModel.model.findById(userId);
      if (user && ((user as any).role === 'admin' || (user as any).courseCompleted?.includes(courseId))) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Error verifying user access:', error);
      return false;
    }
  }

  /**
   * Debug endpoint: Check HLS data in R2 for a lesson
   * GET /api/u/video/debug/hls/:lessonId?token=...
   * Can be accessed with token in query parameter for easy testing
   */
  public static async debugHlsData(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;
      const token = req.query.token as string;
      
      // Verify token if provided
      if (token) {
        const payload = VideoProxyController.verifyToken(token);
        if (!payload) {
          return sendError(res, 401, 'Invalid or expired token');
        }
        // Verify lesson ID matches
        if (payload.lessonId !== lessonId) {
          return sendError(res, 403, 'Token lesson ID does not match');
        }
      } else {
        // Try JWT authentication as fallback
        const currentUser = (req as any).currentUser;
        if (!currentUser) {
          return sendError(res, 401, 'Unauthorized - provide token in query parameter or JWT in header');
        }
      }

      // Get lesson to find video URL
      const LessonsModel = (await import('@mongodb/lessons')).default;
      const lesson = await LessonsModel.model.findById(lessonId);

      if (!lesson) {
        return sendError(res, 404, 'Lesson not found');
      }

      const lessonData: any = lesson.toObject();
      
      // Get video URL from lesson
      let videoUrl: string | null = null;
      if (lessonData.videoUrl) {
        videoUrl = lessonData.videoUrl;
      } else if (lessonData.videos && lessonData.videos.length > 0) {
        videoUrl = lessonData.videos[0].videoUrl;
      }

      // List objects in R2 with different prefixes
      // @ts-ignore
      const { ListObjectsV2Command, S3Client } = await import('@aws-sdk/client-s3');
      
      const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
      const tempClient = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
        },
        forcePathStyle: true,
      });

      const prefixesToCheck = [
        `lessons/${lessonId}/videos/hls/`,
        `lessons/${lessonId}/videos/`,
        `lessons/${lessonId}/`,
        `lessons/`,
        // Also check with courses/ prefix (as seen in video URL)
        `courses/lessons/${lessonId}/videos/hls/`,
        `courses/lessons/${lessonId}/videos/`,
        `courses/lessons/${lessonId}/`,
        `courses/lessons/`,
        `courses/`,
      ];

      // Get public base URL to understand URL structure
      const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';
      
      const results: any = {
        lessonId,
        videoUrl,
        publicBaseUrl,
        bucketName,
        checks: [] as any[],
      };
      
      // Extract object name from video URL if it's a public URL
      let extractedObjectName: string | null = null;
      if (videoUrl && videoUrl.startsWith(publicBaseUrl)) {
        extractedObjectName = videoUrl.substring(publicBaseUrl.length);
        // Remove leading slash
        if (extractedObjectName.startsWith('/')) extractedObjectName = extractedObjectName.substring(1);
        results.extractedObjectName = extractedObjectName;
        
        // Extract folder from object name
        const lastSlash = extractedObjectName.lastIndexOf('/');
        if (lastSlash > 0) {
          const extractedFolder = extractedObjectName.substring(0, lastSlash);
          results.extractedFolder = extractedFolder;
          // Also check this exact folder
          prefixesToCheck.unshift(extractedFolder + '/');
        }
      }

      for (const prefix of prefixesToCheck) {
        const listCommand = new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: prefix,
          MaxKeys: 100,
        });
        
        const listResponse = await tempClient.send(listCommand);
        const objects = listResponse.Contents || [];
        
        // Filter for HLS files
        const hlsFiles = objects.filter((obj: any) => {
          const key = obj.Key || '';
          return key.endsWith('.m3u8') || key.endsWith('.ts');
        });

        const checkResult = {
          prefix,
          totalObjects: objects.length,
          hlsFiles: hlsFiles.length,
          hlsFileKeys: hlsFiles.map((obj: any) => obj.Key),
          allObjectKeys: objects.map((obj: any) => obj.Key).slice(0, 10), // First 10 for preview
        };

        results.checks.push(checkResult);
      }

      // Also check if video URL contains timestamp pattern
      if (videoUrl) {
        const urlModule = await import('url');
        try {
          const parsedUrl = new urlModule.URL(videoUrl);
          const pathParts = parsedUrl.pathname.split('/').filter(p => p);
          const lessonsIndex = pathParts.indexOf('lessons');
          if (lessonsIndex >= 0 && lessonsIndex + 1 < pathParts.length) {
            const potentialTimestamp = pathParts[lessonsIndex + 1];
            if (/^\d{10,}$/.test(potentialTimestamp)) {
              results.extractedTimestamp = potentialTimestamp;
              // Check with timestamp prefix (both with and without courses/)
              const timestampPrefixes = [
                `lessons/${potentialTimestamp}/`,
                `lessons/${potentialTimestamp}/videos/hls/`,
                `lessons/${potentialTimestamp}/hls/`,
                `courses/lessons/${potentialTimestamp}/`,
                `courses/lessons/${potentialTimestamp}/videos/hls/`,
                `courses/lessons/${potentialTimestamp}/hls/`,
              ];
              
              for (const timestampPrefix of timestampPrefixes) {
                const timestampCommand = new ListObjectsV2Command({
                  Bucket: bucketName,
                  Prefix: timestampPrefix,
                  MaxKeys: 100,
                });
                const timestampResponse = await tempClient.send(timestampCommand);
                const timestampObjects = timestampResponse.Contents || [];
                const timestampHlsFiles = timestampObjects.filter((obj: any) => {
                  const key = obj.Key || '';
                  return key.endsWith('.m3u8') || key.endsWith('.ts');
                });
                
                results.checks.push({
                  prefix: timestampPrefix,
                  totalObjects: timestampObjects.length,
                  hlsFiles: timestampHlsFiles.length,
                  hlsFileKeys: timestampHlsFiles.map((obj: any) => obj.Key),
                  allObjectKeys: timestampObjects.map((obj: any) => obj.Key).slice(0, 10),
                });
              }
            }
          }
        } catch (e) {
          // Ignore URL parsing errors
        }
      }

      return res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error: any) {
      console.error('❌ Debug HLS data error:', error);
      return sendError(res, 500, error.message);
    }
  }
}

