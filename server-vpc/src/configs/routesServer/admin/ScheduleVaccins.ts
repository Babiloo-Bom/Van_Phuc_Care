import { Router } from 'express';
import ScheduleVaccinsController from '@controllers/api/admin/ScheduleVaccinsController';

const router = Router();

// Lấy danh sách tất cả schedule vaccins
router.get('/', ScheduleVaccinsController.index);

// Lấy chi tiết 1 schedule vaccin theo id
router.get('/:id', ScheduleVaccinsController.show);

// Tạo mới schedule vaccin
router.post('/', ScheduleVaccinsController.create);

// Cập nhật schedule vaccin theo id
router.patch('/:id', ScheduleVaccinsController.update);


export default router;
