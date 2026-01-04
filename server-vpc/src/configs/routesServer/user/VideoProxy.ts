import { Router } from 'express';
import VideoProxyController from '@controllers/api/user/VideoProxyController';
import { userPassport } from '@middlewares/passport';
import videoSecurityMiddleware from '@middlewares/videoSecurity';
import { videoRateLimiter } from '@middlewares/rateLimiter';

const router = Router();

// Get video token (requires authentication)
router.post('/token', userPassport.authenticate('jwt', { session: false }), VideoProxyController.getVideoToken);

// Stream video (token-based authentication with security middleware + rate limiting)
// Rate limit: 100 requests per minute per IP
router.get('/stream/:token', videoRateLimiter(100, 60000), videoSecurityMiddleware, VideoProxyController.streamVideo);

// Proxy fetch video for CORS support (used by frontend to create Blob URL)
router.get('/fetch/:token', videoRateLimiter(100, 60000), videoSecurityMiddleware, VideoProxyController.fetchVideoProxy);

// Debug endpoint to check HLS data in R2
// Can be accessed with token in query parameter: ?token=...
router.get('/debug/hls/:lessonId', VideoProxyController.debugHlsData);

export default router;

