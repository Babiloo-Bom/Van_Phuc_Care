import { Router } from 'express';
import ServiceRegistrationController from '@controllers/api/user/ServiceRegistrationController';

const router = Router();

// Đăng ký dịch vụ
router.post('/register', ServiceRegistrationController.register);
// Lấy danh sách dịch vụ đã đăng ký của user
router.get('/registered', ServiceRegistrationController.listRegistered);

export default router;
