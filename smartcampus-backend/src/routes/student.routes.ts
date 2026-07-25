import { Router } from 'express';

import { studentController } from '../controllers/student.controller';

import { authenticate } from '../middlewares/auth.middleware';

import { authorize } from '../middlewares/role.middleware';

import { attachTenant } from '../middlewares/tenant.middleware';

import { validate } from '../middlewares/validate.middleware';

import {

  uploadStudentImage,

  uploadStudentImport,

} from '../middlewares/upload.middleware';

import { Role } from '../types/roles';

import {

  bulkIdsSchema,

  bulkStatusSchema,

  createStudentSchema,

  exportFormatSchema,

  studentIdParamSchema,

  studentQuerySchema,

  updateStudentSchema,

} from '../validators/student.validator';



const router = Router();



router.use(authenticate, attachTenant);



router.get(

  '/dashboard',

  authorize(Role.COLLEGE_ADMIN),

  studentController.dashboard

);



router.get(

  '/export',

  authorize(Role.COLLEGE_ADMIN, Role.FACULTY),

  validate(exportFormatSchema, 'query'),

  studentController.export

);



router.post(

  '/import',

  authorize(Role.COLLEGE_ADMIN),

  uploadStudentImport,

  studentController.import

);



router.post(

  '/upload-image',

  authorize(Role.COLLEGE_ADMIN),

  uploadStudentImage,

  studentController.uploadImage

);



router.post(

  '/bulk-delete',

  authorize(Role.COLLEGE_ADMIN),

  validate(bulkIdsSchema),

  studentController.bulkDelete

);



router.patch(

  '/bulk-status',

  authorize(Role.COLLEGE_ADMIN),

  validate(bulkStatusSchema),

  studentController.bulkStatus

);



router.get(

  '/',

  authorize(Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),

  validate(studentQuerySchema, 'query'),

  studentController.list

);



router.get(

  '/:id',

  authorize(Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),

  validate(studentIdParamSchema, 'params'),

  studentController.getById

);



router.post(

  '/',

  authorize(Role.COLLEGE_ADMIN),

  validate(createStudentSchema),

  studentController.create

);



router.put(

  '/:id',

  authorize(Role.COLLEGE_ADMIN),

  validate(studentIdParamSchema, 'params'),

  validate(updateStudentSchema),

  studentController.update

);



router.delete(

  '/:id',

  authorize(Role.COLLEGE_ADMIN),

  validate(studentIdParamSchema, 'params'),

  studentController.remove

);



export default router;

