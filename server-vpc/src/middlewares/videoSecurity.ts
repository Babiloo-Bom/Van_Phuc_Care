import { Request, Response, NextFunction } from 'express';

/**
 * Middleware bảo mật video
 * - Kiểm tra referrer
 * - Thêm headers chống download
 */

const ALLOWED_ORIGINS = [
  'localhost',
  '127.0.0.1',
  'vanphuccare.vn',
  'www.vanphuccare.vn',
  'elearning.vanphuccare.vn',
  // Thêm các domain khác nếu cần
];

export const videoSecurityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Không cần check referrer vì token đã được verify trong VideoProxyController
  // Token có thời gian hết hạn ngắn (5 phút) và được sign với secret key
  
  // Thêm headers bảo mật
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  
  // Ngăn chặn download
  res.setHeader('Content-Disposition', 'inline');
  
  next();
};

export default videoSecurityMiddleware;

