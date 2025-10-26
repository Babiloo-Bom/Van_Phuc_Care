import { Router } from 'express';
import AdminRouting from '@configs/routesServer/admin/index';
import UserRouting from '@configs/routesServer/user/index';
import UploadRouting from '@configs/routesServer/Uploaders';
import TestRouting from '@configs/routesServer/test/Test';

const router = Router();

router.use('/a', AdminRouting);
router.use('/u', UserRouting);
router.use('/uploads', UploadRouting);
router.use('/test', TestRouting);

export default router;
