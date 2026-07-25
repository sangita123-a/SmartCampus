import { Router } from 'express';
import { timetableController } from '../controllers/timetable.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { attachTenant } from '../middlewares/tenant.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '../types/roles';
import {
  createTimetableSchema,
  timetableIdParamSchema,
  timetableQuerySchema,
  updateTimetableSchema,
} from '../validators/timetable.validator';

const router = Router();

router.use(authenticate, attachTenant);

router.get(
  '/dashboard',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  timetableController.dashboard
);

router.get(
  '/weekly',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  timetableController.weeklyView
);

router.get(
  '/',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  validate(timetableQuerySchema, 'query'),
  timetableController.list
);

router.get(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  validate(timetableIdParamSchema, 'params'),
  timetableController.getById
);

router.post(
  '/',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(createTimetableSchema),
  timetableController.create
);

router.put(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(timetableIdParamSchema, 'params'),
  validate(updateTimetableSchema),
  timetableController.update
);

router.delete(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(timetableIdParamSchema, 'params'),
  timetableController.remove
);

export default router;
