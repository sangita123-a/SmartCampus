import { Router } from 'express';

import { collegeAdminController } from '../controllers/collegeAdmin.controller';

import { authenticate } from '../middlewares/auth.middleware';

import { authorize } from '../middlewares/role.middleware';

import { attachTenant } from '../middlewares/tenant.middleware';

import { Role } from '../types/roles';



const router = Router();



router.use(authenticate, attachTenant);

router.get('/dashboard', authorize(Role.COLLEGE_ADMIN), collegeAdminController.dashboard);



export default router;

