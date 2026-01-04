import { Router } from 'express';
import VideoProxyController from '@controllers/api/user/VideoProxyController';
import { userPassport } from '@middlewares/passport';
import videoSecurityMiddleware from '@middlewares/videoSecurity';

const router = Router();

// Get video token (requires authentication)
router.post('/token', userPassport.authenticate('jwt', { session: false }), VideoProxyController.getVideoToken);

// Stream video (token-based authentication with security middleware)
router.get('/stream/:token', videoSecurityMiddleware, VideoProxyController.streamVideo);

// Proxy fetch video for CORS support (used by frontend to create Blob URL)
router.get('/fetch/:token', videoSecurityMiddleware, VideoProxyController.fetchVideoProxy);

export default router;

