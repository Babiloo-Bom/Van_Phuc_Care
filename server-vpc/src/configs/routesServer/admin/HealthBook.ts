import { Router } from 'express';
import HealthBookController from '@controllers/api/admin/HealthBookController';

const router = Router();

// Lấy danh sách health books (có phân trang)
router.get('/all', HealthBookController.index);

// Lấy health book dựa theo email hoặc ID của admin
router.get('/show', HealthBookController.show);

// Lấy health book theo ID
router.get('/:id', HealthBookController.getOne);

// Lấy health book theo ngày và customerId
router.get('/by-date/:customerId', HealthBookController.getByDate);

// Cập nhật health book
router.patch('/:id', HealthBookController.update);

// Tạo health book mới
router.post('/', HealthBookController.create);

// Ghi log health book
router.post('/logs', HealthBookController.createLogs);

// Xóa health book theo ID
router.delete('/:id', HealthBookController.delete);

// API comment (chưa triển khai logic)
router.post('/comment', HealthBookController.comment);

// API lấy nhiệt độ theo ngày
router.get('/temperature', HealthBookController.temperature);

export default router;
