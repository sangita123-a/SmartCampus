import { Router } from 'express';
import { facultyController } from '../controllers/faculty.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { attachTenant } from '../middlewares/tenant.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  uploadFacultyImage,
  uploadFacultyImport,
} from '../middlewares/upload.middleware';
import { Role } from '../types/roles';
import {
  bulkFacultyIdsSchema,
  bulkFacultyStatusSchema,
  createFacultySchema,
  facultyExportSchema,
  facultyIdParamSchema,
  facultyQuerySchema,
  updateFacultySchema,
} from '../validators/faculty.validator';

const router = Router();

router.use(authenticate, attachTenant);

router.get('/dashboard', authorize(Role.COLLEGE_ADMIN), facultyController.dashboard);

router.get(
  '/export',
  authorize(Role.COLLEGE_ADMIN),
  validate(facultyExportSchema, 'query'),
  facultyController.export
);

router.post(
  '/import',
  authorize(Role.COLLEGE_ADMIN),
  uploadFacultyImport,
  facultyController.import
);

router.post(
  '/upload-image',
  authorize(Role.COLLEGE_ADMIN),
  uploadFacultyImage,
  facultyController.uploadImage
);

router.post(
  '/bulk-delete',
  authorize(Role.COLLEGE_ADMIN),
  validate(bulkFacultyIdsSchema),
  facultyController.bulkDelete
);

router.patch(
  '/bulk-status',
  authorize(Role.COLLEGE_ADMIN),
  validate(bulkFacultyStatusSchema),
  facultyController.bulkStatus
);

router.get(
  '/',
  authorize(Role.COLLEGE_ADMIN, Role.FACULTY),
  validate(facultyQuerySchema, 'query'),
  facultyController.list
);

router.get(
  '/:id',
  authorize(Role.COLLEGE_ADMIN, Role.FACULTY),
  validate(facultyIdParamSchema, 'params'),
  facultyController.getById
);

router.post(
  '/',
  authorize(Role.COLLEGE_ADMIN),
  validate(createFacultySchema),
  facultyController.create
);

router.put(
  '/:id',
  authorize(Role.COLLEGE_ADMIN),
  validate(facultyIdParamSchema, 'params'),
  validate(updateFacultySchema),
  facultyController.update
);

router.delete(
  '/:id',
  authorize(Role.COLLEGE_ADMIN),
  validate(facultyIdParamSchema, 'params'),
  facultyController.remove
);

export default router;
