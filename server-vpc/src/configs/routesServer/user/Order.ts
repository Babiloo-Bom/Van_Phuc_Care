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
router.get('/:orderId', OrderController.getOrderByOrderId);
router.post('/', OrderController.create);
router.patch('/:orderId', OrderController.update);
router.post('/payment', OrderController.processPayment);
router.post('/payment/vnpay', (req, res) => OrderController.processPaymentVnpay(req, res));
router.post('/payment/vnpay-ipn', (req, res) => OrderController.paymentVnpayIpn(req, res));
router.post('/payment/vnpay-verify', (req, res) => OrderController.paymentVnpayVerify(req, res));
router.post('/payment/qr/create', OrderController.createQRCode);
router.post('/payment/sepay-webhook', (req, res) => OrderController.sepayWebhook(req, res));
router.get('/payment/qr/status/:orderId', OrderController.checkQRPaymentStatus);
export default router;
