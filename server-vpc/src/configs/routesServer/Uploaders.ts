import UploaderController from '@controllers/api/UploadersController';
import { withoutSavingUploader } from '@middlewares/uploaders';
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
router.post('/video', withoutSavingUploader.single('file'), UploaderController.uploadVideoToR2);

export default router;
