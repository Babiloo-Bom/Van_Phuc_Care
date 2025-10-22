import { Router } from 'express';
import OrderController from '@controllers/api/user/OrderController';

const router = Router();

/**
 * @openapi
 * /u/orders:
 *   get:
 *     tags:
 *      - "[USER] Order"
 *     summary: Danh sách order
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
router.get('/', OrderController.index);

/**
 * @openapi
 * /u/orders/{orderId}:
 *   get:
 *     tags:
 *      - "[USER] Order"
 *     summary: Xem order
 *     parameters:
 *      - in: "path"
 *        name: "orderId"
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
router.get('/:orderId', OrderController.show);
router.post('/', OrderController.create);
router.patch('/:orderId', OrderController.update);

export default router;
