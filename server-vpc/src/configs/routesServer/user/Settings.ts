import { Router } from 'express';
import * as UserSettingsController from '@controllers/api/user/SettingsController';

const router = Router();

// Public: cấu hình EDU (VAT %, ...) - không cần đăng nhập
router.get('/elearning-public', UserSettingsController.getElearningPublic);

export default router;
