import { Router } from 'express';
import { collegeController } from '../controllers/college.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '../types/roles';

const router = Router();

router.use(authenticate);
router.get('/dashboard', authorize(Role.SUPER_ADMIN), collegeController.dashboard);

export default router;
