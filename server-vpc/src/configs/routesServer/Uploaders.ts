import UploaderController from '@controllers/api/UploadersController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { adminPassport } from '@middlewares/passport';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /uploads:
 *   post:
 *     tags:
 *      - "Uploaders"
 *     summary: Upload file image to Firebase
 *     consumes:
 *      - "multipart/form-data"
 *     produces:
 *      - "application/json"
 *     parameters:
 *      - in: "formData"
 *        name: "files"
 *        description: "files"
 *        required: false
 *        allowMultiple: false
 *        type: "file"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/', withoutSavingUploader.any(), UploaderController.uploadFirebase);

/**
 * @openapi
 * /uploads/minio:
 *   post:
 *     tags:
 *      - "Uploaders"
 *     summary: Upload file to MinIO storage
 *     consumes:
 *      - "multipart/form-data"
 *     parameters:
 *      - in: "query"
 *        name: "folder"
 *        description: "Folder to store files (default: general)"
 *        required: false
 *        type: "string"
 *      - in: "formData"
 *        name: "files"
 *        description: "files to upload"
 *        required: true
 *        allowMultiple: true
 *        type: "file"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       400:
 *         description: No files uploaded
 *       500:
 *        description: Server error
 */
router.post('/minio', withoutSavingUploader.any(), UploaderController.uploadMinio);

/**
 * @openapi
 * /uploads/video:
 *   post:
 *     tags:
 *      - "Uploaders"
 *     summary: Upload video file to Cloudflare R2 + CDN
 *     consumes:
 *      - "multipart/form-data"
 *     parameters:
 *      - in: "query"
 *        name: "folder"
 *        description: "Folder to store video (default: courses/intro-videos)"
 *        required: false
 *        type: "string"
 *      - in: "formData"
 *        name: "file"
 *        description: "Video file to upload"
 *        required: true
 *        type: "file"
 *     responses:
 *       200:
 *         description: "Upload success"
 *       400:
 *         description: No video file uploaded or invalid file type
 *       500:
 *         description: Server error
 *     security:
 *      - Bearer: []
 */
// Video upload route - authentication must come BEFORE multer
router.post('/video', 
  adminPassport.authenticate('jwt', { session: false }),
  withoutSavingUploader.single('file'), 
  UploaderController.uploadVideoToR2
);

/**
 * @openapi
 * /uploads/video/status/:jobId:
 *   get:
 *     tags:
 *      - "Uploaders"
 *     summary: Get video processing job status
 *     parameters:
 *      - in: "path"
 *        name: "jobId"
 *        description: "Job ID from video upload response"
 *        required: true
 *        type: "string"
 *     responses:
 *       200:
 *         description: "Job status retrieved successfully"
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.get('/video/status/:jobId', adminPassport.authenticate('jwt', { session: false }), UploaderController.getVideoJobStatus);

/**
 * @openapi
 * /uploads/video/:jobId:
 *   delete:
 *     tags:
 *      - "Uploaders"
 *     summary: Cancel/Delete video upload job and cleanup files
 *     parameters:
 *      - in: "path"
 *        name: "jobId"
 *        description: "Job ID from video upload response"
 *        required: true
 *        type: "string"
 *     responses:
 *       200:
 *         description: "Video upload cancelled and files cleaned up successfully"
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.delete('/video/:jobId', adminPassport.authenticate('jwt', { session: false }), UploaderController.cancelVideoUpload);

export default router;
