import { Router } from 'express';
import { subjectController } from '../controllers/subject.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { attachTenant } from '../middlewares/tenant.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '../types/roles';
import {
  assignFacultySchema,
  bulkSubjectIdsSchema,
  bulkSubjectStatusSchema,
  createSubjectSchema,
  subjectExportSchema,
  subjectIdParamSchema,
  subjectQuerySchema,
  updateSubjectSchema,
} from '../validators/subject.validator';

const router = Router();

router.use(authenticate, attachTenant);

router.get('/dashboard', authorize(Role.COLLEGE_ADMIN), subjectController.dashboard);

router.get(
  '/export',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY),
  validate(subjectExportSchema, 'query'),
  subjectController.export
);

router.post(
  '/bulk-delete',
  authorize(Role.COLLEGE_ADMIN),
  validate(bulkSubjectIdsSchema),
  subjectController.bulkDelete
);

router.patch(
  '/bulk-status',
  authorize(Role.COLLEGE_ADMIN),
  validate(bulkSubjectStatusSchema),
  subjectController.bulkStatus
);

router.get(
  '/',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT),
  validate(subjectQuerySchema, 'query'),
  subjectController.list
);

router.get(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT),
  validate(subjectIdParamSchema, 'params'),
  subjectController.getById
);

router.post(
  '/',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(createSubjectSchema),
  subjectController.create
);

router.put(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(subjectIdParamSchema, 'params'),
  validate(updateSubjectSchema),
  subjectController.update
);

router.patch(
  '/:id/assign-faculty',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(subjectIdParamSchema, 'params'),
  validate(assignFacultySchema),
  subjectController.assignFaculty
);

router.patch(
  '/:id/remove-faculty',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(subjectIdParamSchema, 'params'),
  subjectController.removeFaculty
);

router.delete(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(subjectIdParamSchema, 'params'),
  subjectController.remove
);

export default router;
