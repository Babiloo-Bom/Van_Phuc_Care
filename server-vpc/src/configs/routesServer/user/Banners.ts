import { Router } from 'express';
import BannerController from '@controllers/api/user/BannerController';

const router = Router();

/**
 * @openapi
 * /u/banners:
 *   get:
 *     tags:
 *      - "[USER] Banners"
 *     summary: Lấy danh sách banner theo trang
 *     parameters:
 *      - in: "query"
 *        name: "pageType"
 *        required: true
 *        description: "all-courses hoặc my-courses"
 *        schema:
 *          type: "string"
 *          enum: ["all-courses", "my-courses"]
 *     responses:
 *       200:
 *         description: Return data.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Error can't get data.
 */
router.get('/', BannerController.index);

export default router;

