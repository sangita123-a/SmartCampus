import { Router } from 'express';

import { departmentController } from '../controllers/department.controller';

import { authenticate } from '../middlewares/auth.middleware';

import { authorize } from '../middlewares/role.middleware';

import { attachTenant } from '../middlewares/tenant.middleware';

import { validate } from '../middlewares/validate.middleware';

import { Role } from '../types/roles';

import {

  createDepartmentSchema,

  departmentIdParamSchema,

  departmentQuerySchema,

  updateDepartmentSchema,

} from '../validators/department.validator';



const router = Router();



router.use(authenticate, attachTenant);



router.get(

  '/',

  authorize(Role.COLLEGE_ADMIN, Role.FACULTY),

  validate(departmentQuerySchema, 'query'),

  departmentController.list

);



router.get(

  '/:id',

  authorize(Role.COLLEGE_ADMIN, Role.FACULTY),

  validate(departmentIdParamSchema, 'params'),

  departmentController.getById

);



router.post(

  '/',

  authorize(Role.COLLEGE_ADMIN),

  validate(createDepartmentSchema),

  departmentController.create

);



router.put(

  '/:id',

  authorize(Role.COLLEGE_ADMIN),

  validate(departmentIdParamSchema, 'params'),

  validate(updateDepartmentSchema),

  departmentController.update

);



router.patch(

  '/:id/toggle-status',

  authorize(Role.COLLEGE_ADMIN),

  validate(departmentIdParamSchema, 'params'),

  departmentController.toggleStatus

);



router.delete(

  '/:id',

  authorize(Role.COLLEGE_ADMIN),

  validate(departmentIdParamSchema, 'params'),

  departmentController.remove

);



export default router;

