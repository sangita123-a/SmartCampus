import { Router } from 'express';

import { semesterController } from '../controllers/semester.controller';

import { authenticate } from '../middlewares/auth.middleware';

import { authorize } from '../middlewares/role.middleware';

import { attachTenant } from '../middlewares/tenant.middleware';

import { validate } from '../middlewares/validate.middleware';

import { Role } from '../types/roles';

import {

  createSemesterSchema,

  semesterIdParamSchema,

  semesterQuerySchema,

  updateSemesterSchema,

} from '../validators/semester.validator';



const router = Router();



router.use(authenticate, attachTenant);



router.get(

  '/',

  authorize(Role.COLLEGE_ADMIN, Role.FACULTY),

  validate(semesterQuerySchema, 'query'),

  semesterController.list

);



router.get(

  '/:id',

  authorize(Role.COLLEGE_ADMIN, Role.FACULTY),

  validate(semesterIdParamSchema, 'params'),

  semesterController.getById

);



router.post(

  '/',

  authorize(Role.COLLEGE_ADMIN),

  validate(createSemesterSchema),

  semesterController.create

);



router.put(

  '/:id',

  authorize(Role.COLLEGE_ADMIN),

  validate(semesterIdParamSchema, 'params'),

  validate(updateSemesterSchema),

  semesterController.update

);



router.patch(

  '/:id/toggle-status',

  authorize(Role.COLLEGE_ADMIN),

  validate(semesterIdParamSchema, 'params'),

  semesterController.toggleStatus

);



router.delete(

  '/:id',

  authorize(Role.COLLEGE_ADMIN),

  validate(semesterIdParamSchema, 'params'),

  semesterController.remove

);



export default router;

