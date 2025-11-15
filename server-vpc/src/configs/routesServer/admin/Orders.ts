import { Router } from 'express';
import OrderController from '@controllers/api/admin/OrderController';

const router = Router();

// Create new order
router.post('/', OrderController.createOrder);

// Create bypass order (for testing)
router.post('/bypass', OrderController.createBypassOrder);

// Get order by ID
router.get('/:id', OrderController.getOrderById);

// Get order by order ID
router.get('/order/:orderId', OrderController.getOrderByOrderId);

// Get user's orders
router.get('/user/:userId', OrderController.getUserOrders);

// Update order status
router.put('/:id/status', OrderController.updateOrderStatus);

// Process payment
router.post('/payment', OrderController.processPayment);

// Get all orders (admin)
router.get('/', OrderController.getAllOrders);

// Get order statistics
router.get('/stats/overview', OrderController.getOrderStats);

export default router;