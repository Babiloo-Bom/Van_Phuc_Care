import { Router } from 'express';
import ProductReviewController from '@controllers/api/admin/ProductReviewsController';

const router = Router();

/**
 * @openapi
 * /a/product-reviews:
 *   get:
 *     tags:
 *      - "[ADMIN] ProductReview"
 *     summary: Danh sách product-review
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
router.get('/', ProductReviewController.index);

/**
 * @openapi
 * /a/product-reviews/{product-reviewId}:
 *   get:
 *     tags:
 *      - "[ADMIN] ProductReview"
 *     summary: Xem product-review
 *     parameters:
 *      - in: "path"
 *        name: "product-reviewId"
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
router.get('/:reviewId', ProductReviewController.show);

/**
 * @openapi
 * /a/product-reviews:
 *   post:
 *     tags:
 *      - "[ADMIN] ProductReview"
 *     summary: Tạo mới product-review
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            order:
 *              type: "number"
 *              description: "Thứ tự product-review"
 *            thumbnail:
 *              type: "string"
 *              description: ""
 *            link:
 *              type: "string"
 *              description: "Đường dẫn"
 *            title:
 *              type: "string"
 *              description: ""
 *            shortDescription:
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
router.post('/', ProductReviewController.create);

/**
 * @openapi
 * /a/product-reviews/{product-reviewId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] ProductReview"
 *     summary: Cập nhật product-review
 *     parameters:
 *      - in: "path"
 *        name: "product-reviewId"
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            order:
 *              type: "number"
 *              description: "Thứ tự product-review"
 *            thumbnail:
 *              type: "string"
 *              description: ""
 *            link:
 *              type: "string"
 *              description: "Đường dẫn"
 *            status:
 *              type: "string"
 *              description: ""
 *              enum:
 *                - active
 *                - inactive
 *            title:
 *              type: "string"
 *              description: ""
 *            shortDescription:
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
router.patch('/:reviewId', ProductReviewController.update);

/**
 * @openapi
 * /a/product-reviews/{product-reviewId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] ProductReview"
 *     summary: Xóa product-review
 *     parameters:
 *      - in: "path"
 *        name: "product-reviewId"
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
router.delete('/:reviewId', ProductReviewController.delete);

export default router;
