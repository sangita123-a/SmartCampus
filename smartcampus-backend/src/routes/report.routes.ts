import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '../types/roles';
import { reportController } from '../controllers/report.controller';

const router = Router();

router.use(authenticate);

router.get(
  '/dashboard',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  reportController.getDashboardAnalytics
);

router.get(
  '/students',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY),
  reportController.getStudentReports
);

router.get(
  '/faculty',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  reportController.getFacultyReports
);

router.get(
  '/attendance',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  reportController.getAttendanceReports
);

router.get(
  '/fees',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT, Role.STUDENT, Role.PARENT),
  reportController.getFeeReports
);

router.get(
  '/exams',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  reportController.getExamReports
);

router.get(
  '/library',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN, Role.FACULTY, Role.STUDENT),
  reportController.getLibraryReports
);

export default router;
