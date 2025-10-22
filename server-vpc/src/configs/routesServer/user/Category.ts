import { Router } from 'express';
import CategoryController from '@controllers/api/user/CategoryController';

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

export default router;
