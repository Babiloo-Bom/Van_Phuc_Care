import { Router } from 'express';
import CategoryController from '@controllers/api/admin/CategoryController';

const router = Router();

/**
 * @openapi
 * /a/category:
 *   get:
 *     tags:
 *      - "[ADMIN] Category"
 *     summary: Danh sách danh mục
 *     parameters:
 *      - in: "query"
 *        name: "type"
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
router.get('/', CategoryController.index);

/**
 * @openapi
 * /a/category/{categoryId}:
 *   get:
 *     tags:
 *      - "[ADMIN] Category"
 *     summary: Xem danh mục
 *     parameters:
 *      - in: "path"
 *        name: "categoryId"
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
router.get('/:categoryId', CategoryController.show);

/**
 * @openapi
 * /a/category:
 *   post:
 *     tags:
 *      - "[ADMIN] Category"
 *     summary: Tạo mới danh mục
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tiêu đề danh mục"
 *            thumbnail:
 *              type: "string"
 *              description: ""
 *            type:
 *              type: "string"
 *              enum:
 *                - product
 *                - blog
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
router.post('/', CategoryController.create);

/**
 * @openapi
 * /a/category/{categoryId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] Category"
 *     summary: Cập nhật danh mục
 *     parameters:
 *      - in: "path"
 *        name: "categoryId"
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            title:
 *              type: "string"
 *              description: "Tiêu đề danh mục"
 *            thumbnail:
 *              type: "string"
 *              description: ""
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
router.patch('/:categoryId', CategoryController.update);

/**
 * @openapi
 * /a/category/{categoryId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] Category"
 *     summary: Xóa danh mục
 *     parameters:
 *      - in: "path"
 *        name: "categoryId"
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
router.delete('/:categoryId', CategoryController.delete);

export default router;
