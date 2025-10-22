import { Router } from 'express';
import ProductController from '@controllers/api/user/ProductController';

const router = Router();

/**
 * @openapi
 * /u/products:
 *   get:
 *     tags:
 *      - "[USER] Products"
 *     summary: Danh sách sản phẩm
 *     parameters:
 *      - in: "query"
 *        name: "page"
 *      - in: "query"
 *        name: "limit"
 *      - in: "query"
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
router.get('/', ProductController.index);
router.get('/recommends', ProductController.recommends);
router.get('/:productId', ProductController.show);

export default router;
