import { Router } from 'express';
import { classroomController } from '../controllers/classroom.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { attachTenant } from '../middlewares/tenant.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '../types/roles';
import {
  classroomIdParamSchema,
  classroomQuerySchema,
  createClassroomSchema,
  updateClassroomSchema,
} from '../validators/classroom.validator';

const router = Router();

router.use(authenticate, attachTenant);

router.get(
  '/',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  validate(classroomQuerySchema, 'query'),
  classroomController.list
);

router.get(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  validate(classroomIdParamSchema, 'params'),
  classroomController.getById
);

router.post(
  '/',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(createClassroomSchema),
  classroomController.create
);

router.put(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(classroomIdParamSchema, 'params'),
  validate(updateClassroomSchema),
  classroomController.update
);

router.delete(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(classroomIdParamSchema, 'params'),
  classroomController.remove
);

export default router;
