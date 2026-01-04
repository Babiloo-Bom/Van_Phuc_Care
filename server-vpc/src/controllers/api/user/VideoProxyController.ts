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
const TOKEN_EXPIRY_SECONDS = 300; // 5 phút

interface VideoToken {
  lessonId: string;
  courseId: string;
  userId: string;
  exp: number;
}

export default class VideoProxyController {
  /**
   * Tạo signed token cho video
   * Token chỉ có hiệu lực 5 phút
   */
  public static generateVideoToken(
    lessonId: string,
    courseId: string,
    userId: string
  ): string {
    const payload: VideoToken = {
      lessonId,
      courseId,
      userId,
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS,
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
      const { lessonId, courseId } = req.body;

      if (!lessonId || !courseId) {
        return sendError(res, 400, 'Missing lessonId or courseId');
      }

      // Verify user has access to this course
      const hasAccess = await VideoProxyController.verifyUserAccess(userId, courseId, lessonId);
      if (!hasAccess) {
        return sendError(res, 403, 'Bạn không có quyền truy cập video này');
      }

      // Generate token
      const token = VideoProxyController.generateVideoToken(lessonId, courseId, userId);

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

      // Get video URL (external URL hoặc presigned R2 URL)
      let videoUrl: string;
      if (videoPath.startsWith('http://') || videoPath.startsWith('https://')) {
        // External URL (Pexels, etc.) - stream trực tiếp
        videoUrl = videoPath;
      } else {
        // R2 path - get presigned URL
        const objectName = videoPath.replace(/^\/vanphuccare-video-edu\//, '');
        videoUrl = await CloudflareService.getFileUrl(objectName, 300); // 5 minutes
      }

      // Stream video qua backend để ẩn URL gốc
      const https = await import('https');
      const http = await import('http');
      const urlModule = await import('url');

      const parsedUrl = new urlModule.URL(videoUrl);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      // Set security headers
      res.setHeader('Content-Disposition', 'inline'); // Không cho download
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range');

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
        console.error('❌ Video stream error:', error);
        if (!res.headersSent) {
          sendError(res, 500, 'Failed to stream video');
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
}

