import { Router } from 'express';

import { courseController } from '../controllers/course.controller';

import { authenticate } from '../middlewares/auth.middleware';

import { authorize } from '../middlewares/role.middleware';

import { attachTenant } from '../middlewares/tenant.middleware';

import { validate } from '../middlewares/validate.middleware';

import { Role } from '../types/roles';

import {

  courseIdParamSchema,

  courseQuerySchema,

  createCourseSchema,

  updateCourseSchema,

} from '../validators/course.validator';



const router = Router();



router.use(authenticate, attachTenant);



router.get(

  '/',

  authorize(Role.COLLEGE_ADMIN, Role.FACULTY),

  validate(courseQuerySchema, 'query'),

  courseController.list

);



router.get(

  '/:id',

  authorize(Role.COLLEGE_ADMIN, Role.FACULTY),

  validate(courseIdParamSchema, 'params'),

  courseController.getById

);



router.post(

  '/',

  authorize(Role.COLLEGE_ADMIN),

  validate(createCourseSchema),

  courseController.create

);



router.put(

  '/:id',

  authorize(Role.COLLEGE_ADMIN),

  validate(courseIdParamSchema, 'params'),

  validate(updateCourseSchema),

  courseController.update

);



router.patch(

  '/:id/toggle-status',

  authorize(Role.COLLEGE_ADMIN),

  validate(courseIdParamSchema, 'params'),

  courseController.toggleStatus

);



router.delete(

  '/:id',

  authorize(Role.COLLEGE_ADMIN),

  validate(courseIdParamSchema, 'params'),

  courseController.remove

);



export default router;

