import { Router } from 'express';
import multer from 'multer';
import TicketController from '@controllers/api/user/TicketController';
import { userPassport } from '@middlewares/passport';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Max 5 files
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos only
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  },
});

// User ticket routes - all routes require authentication
router.get('/', userPassport.authenticate('jwt', { session: false }), TicketController.index);
router.get('/:id', userPassport.authenticate('jwt', { session: false }), TicketController.show);
router.post('/', userPassport.authenticate('jwt', { session: false }), upload.array('files', 5), TicketController.create);
router.patch('/:id', userPassport.authenticate('jwt', { session: false }), TicketController.update);
router.delete('/:id', userPassport.authenticate('jwt', { session: false }), TicketController.destroy);

// Ticket comments routes
router.get('/:id/comments', userPassport.authenticate('jwt', { session: false }), TicketController.getComments);
router.post('/:id/comments', userPassport.authenticate('jwt', { session: false }), upload.array('files', 5), TicketController.addComment);

export default router;
