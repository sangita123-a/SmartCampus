import { Router } from 'express';
import { attendanceController } from '../controllers/attendance.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { attachTenant } from '../middlewares/tenant.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '../types/roles';
import {
  attendanceIdParamSchema,
  attendanceQuerySchema,
  bulkMarkAttendanceSchema,
  createAttendanceSchema,
  createQRSessionSchema,
  scanQRAttendanceSchema,
  updateAttendanceSchema,
} from '../validators/attendance.validator';

const router = Router();

router.use(authenticate, attachTenant);

router.get(
  '/dashboard',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  attendanceController.dashboard
);

router.get(
  '/reports/student-percentage',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  attendanceController.getStudentPercentage
);

router.get(
  '/reports/faculty-summary',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY),
  attendanceController.getFacultySummary
);

router.post(
  '/qr/session',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY),
  validate(createQRSessionSchema),
  attendanceController.createQRSession
);

router.post(
  '/qr/scan',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT),
  validate(scanQRAttendanceSchema),
  attendanceController.scanQRAttendance
);

router.post(
  '/biometric/ping',
  attendanceController.biometricPing
);

router.post(
  '/bulk',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY),
  validate(bulkMarkAttendanceSchema),
  attendanceController.bulkMark
);

router.get(
  '/',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  validate(attendanceQuerySchema, 'query'),
  attendanceController.list
);

router.get(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  validate(attendanceIdParamSchema, 'params'),
  attendanceController.getById
);

router.post(
  '/',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY),
  validate(createAttendanceSchema),
  attendanceController.create
);

router.put(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY),
  validate(attendanceIdParamSchema, 'params'),
  validate(updateAttendanceSchema),
  attendanceController.update
);

router.delete(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(attendanceIdParamSchema, 'params'),
  attendanceController.remove
);

export default router;
