import { Router } from 'express';
import FaqController from '@controllers/api/user/FaqController';

const router = Router();

/**
 * @openapi
 * /u/faqs:
 *   get:
 *     tags:
 *      - "[USER] Faqs"
 *     summary: Danh sách hỏi đáp chung
 *     parameters:
 *      - in: "query"
 *        name: "page"
 *      - in: "query"
 *        name: "limit"
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.get('/', FaqController.index);

export default router;
