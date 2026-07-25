import { Router } from 'express';
import { collegeController } from '../controllers/college.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { attachTenant } from '../middlewares/tenant.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '../types/roles';
import {
  collegeQuerySchema,
  createCollegeSchema,
  updateCollegeSchema,
} from '../validators/college.validator';

const router = Router();

router.use(authenticate, attachTenant);

router.get(
  '/',
  validate(collegeQuerySchema, 'query'),
  collegeController.list
);

router.get('/:id', collegeController.getById);

router.post(
  '/',
  authorize(Role.SUPER_ADMIN),
  validate(createCollegeSchema),
  collegeController.create
);

router.put(
  '/:id',
  authorize(Role.SUPER_ADMIN),
  validate(updateCollegeSchema),
  collegeController.update
);

router.patch(
  '/:id/deactivate',
  authorize(Role.SUPER_ADMIN),
  collegeController.deactivate
);

router.patch(
  '/:id/reactivate',
  authorize(Role.SUPER_ADMIN),
  collegeController.reactivate
);

router.delete(
  '/:id',
  authorize(Role.SUPER_ADMIN),
  collegeController.remove
);

export default router;
