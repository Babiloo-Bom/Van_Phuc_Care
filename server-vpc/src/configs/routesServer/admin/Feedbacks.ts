import { Router } from 'express';
import FeedbackController from '@controllers/api/admin/FeedbackController';

const router = Router();

/**
 * @openapi
 * /a/feedbacks:
 *   get:
 *     tags:
 *      - "[ADMIN] Feedbacks"
 *     summary: Danh sách phản hồi
 *     parameters:
 *      - in: "query"
 *        name: "page"
 *      - in: "query"
 *        name: "limit"
 *      - in: "query"
 *        name: "createdBy"
 *        enum:
 *          - admin
 *          - customer
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
router.get('/', FeedbackController.index);

/**
 * @openapi
 * /a/feedbacks/{feedbackId}:
 *   get:
 *     tags:
 *      - "[ADMIN] Feedbacks"
 *     summary: Xem phản hồi
 *     parameters:
 *      - in: "path"
 *        name: "feedbackId"
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
router.get('/:feedbackId', FeedbackController.show);

/**
  * @openapi
  * /a/feedbacks:
  *   post:
  *     tags:
  *      - "[ADMIN] Feedbacks"
  *     summary: Tạo mới phản hồi
  *     parameters:
  *      - in: "body"
  *        name: "body"
  *        description: "Thông tin"
  *        schema:
  *          type: "object"
  *          properties:
  *            avatar:
  *              type: "string"
  *              description: ""
  *            position:
  *              type: "string"
  *              description: "vị trí"
  *            content:
  *              type: "string"
  *              description: ""
  *            fullname:
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
router.post('/', FeedbackController.create);

/**
  * @openapi
  * /a/feedbacks/{feedbackId}:
  *   patch:
  *     tags:
  *      - "[ADMIN] Feedbacks"
  *     summary: Cập nhật phản hồi
  *     parameters:
  *      - in: "path"
  *        name: "feedbackId"
  *      - in: "body"
  *        name: "body"
  *        description: "Thông tin"
  *        schema:
  *          type: "object"
  *          properties:
  *            avatar:
  *              type: "string"
  *              description: ""
  *            position:
  *              type: "string"
  *              description: ""
  *            content:
  *              type: "string"
  *              description: "Nội dung"
  *            fullname:
  *              type: "string"
  *              description: ""
  *            status:
  *              type: "string"
  *              description: ""
  *              enum:
  *                - active
  *                - inactive
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
router.patch('/:feedbackId', FeedbackController.update);

/**
   * @openapi
   * /a/feedbacks/{feedbackId}:
   *   delete:
   *     tags:
   *      - "[ADMIN] Feedbacks"
   *     summary: Xoá bài viết phản hồi
   *     parameters:
   *      - in: "path"
   *        name: "feedbackId"
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
router.delete('/:feedbackId', FeedbackController.delete);

export default router;
