import { Router } from 'express';
import FaqController from '@controllers/api/admin/FaqController';

const router = Router();

/**
 * @openapi
 * /a/faqs:
 *   get:
 *     tags:
 *      - "[ADMIN] Faqs"
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

/**
 * @openapi
 * /a/faqs/{faqId}:
 *   get:
 *     tags:
 *      - "[ADMIN] Faqs"
 *     summary: Xem hỏi đáp chung
 *     parameters:
 *      - in: "path"
 *        name: "faqId"
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
router.get('/:faqId', FaqController.show);

/**
 * @openapi
 * /a/faqs:
 *   post:
 *     tags:
 *      - "[ADMIN] Faqs"
 *     summary: Tạo mới hỏi đáp chung
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tiêu đề hỏi đáp chung"
 *            content:
 *              type: "string"
 *              description: "Nội dung hỏi đáp chung"
 *            slug:
 *              type: "string"
 *              description: ""
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
router.post('/', FaqController.create);

/**
 * @openapi
 * /a/faqs/{faqId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] Faqs"
 *     summary: Cập nhật hỏi đáp chung
 *     parameters:
 *      - in: "path"
 *        name: "faqId"
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tiêu đề hỏi đáp chung"
 *            content:
 *              type: "string"
 *              description: "Nội dung hỏi đáp chung"
 *            status:
 *              type: "string"
 *              description: ""
 *              enum:
 *                - active
 *                - inactive
 *            slug:
 *              type: "string"
 *              description: ""
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
router.patch('/:faqId', FaqController.update);

/**
 * @openapi
 * /a/faqs/{faqId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] Faqs"
 *     summary: Xoá hỏi đáp chung
 *     parameters:
 *      - in: "path"
 *        name: "faqId"
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
router.delete('/:faqId', FaqController.delete);

export default router;
