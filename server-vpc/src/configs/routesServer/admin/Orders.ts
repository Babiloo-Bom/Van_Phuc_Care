import { Router } from 'express';
import OrderController from '@controllers/api/admin/OrderController';

const router = Router();

// Create new order
router.post('/', OrderController.createOrder);

// Create bypass order (for testing)
router.post('/bypass', OrderController.createBypassOrder);

// Manual activation - Kích hoạt thủ công
router.post('/manual-activation', OrderController.manualActivation);

// Process payment
router.post('/payment', OrderController.processPayment);

// Get all orders (admin) - Must be before /:id
router.get('/', OrderController.getAllOrders);

// Get order statistics - Must be before /:id
router.get('/stats/overview', OrderController.getOrderStats);

// Get revenue by month (for chart) - Must be before /:id
router.get('/revenue-by-month', OrderController.getRevenueByMonth);

// Get order by order ID - Must be before /:id
router.get('/order/:orderId', OrderController.getOrderByOrderId);

// Get user's orders - Must be before /:id
router.get('/user/:userId', OrderController.getUserOrders);

// Update order status
router.put('/:id/status', OrderController.updateOrderStatus);

// Get order by ID - Must be last (catch-all dynamic route)
router.get('/:id', OrderController.getOrderById);

export default router;