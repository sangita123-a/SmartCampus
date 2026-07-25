import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '../types/roles';
import { parentController } from '../controllers/parent.controller';
import { linkParentStudentSchema, studentParamSchema } from '../validators/parent.validator';

const router = Router();

router.use(authenticate);

router.get(
  '/dashboard',
  authorize(Role.PARENT, Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  parentController.getDashboard
);

router.get(
  '/students',
  authorize(Role.PARENT, Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  parentController.getLinkedStudents
);

router.get(
  '/students/:studentId',
  authorize(Role.PARENT, Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(studentParamSchema, 'params'),
  parentController.getStudentById
);

router.get(
  '/attendance',
  authorize(Role.PARENT, Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  parentController.getAttendance
);

router.get(
  '/results',
  authorize(Role.PARENT, Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  parentController.getResults
);

router.get(
  '/fees',
  authorize(Role.PARENT, Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  parentController.getFees
);

router.get(
  '/timetable',
  authorize(Role.PARENT, Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  parentController.getTimetable
);

router.get(
  '/notifications',
  authorize(Role.PARENT, Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  parentController.getNotifications
);

// Admin linkage route
router.post(
  '/link',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(linkParentStudentSchema, 'body'),
  parentController.linkStudentToParent
);

export default router;
