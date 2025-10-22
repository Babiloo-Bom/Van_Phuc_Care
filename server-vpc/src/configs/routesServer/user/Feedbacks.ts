import { Router } from 'express';
import FeedbackController from '@controllers/api/user/FeedbackController';

const router = Router();

/**
 * @openapi
 * /u/feedbacks:
 *   get:
 *     tags:
 *      - "[USER] Feedbacks"
 *     summary: Danh sách phản hồi
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
  * /u/feedbacks:
  *   post:
  *     tags:
  *      - "[USER] Feedbacks"
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
  *            email:
  *              type: "string"
  *              description: ""
  *            phoneNumber:
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
router.get('/:slugProduct', FeedbackController.show);

export default router;
