import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '../types/roles';
import { financeController } from '../controllers/finance.controller';
import {
  collectPaymentSchema,
  createFeeCategorySchema,
  createFeeStructureSchema,
  feeCategoryQuerySchema,
  generateStudentFeesSchema,
  idParamSchema,
  paymentQuerySchema,
  studentFeeQuerySchema,
  updateFeeCategorySchema,
  updateFeeStructureSchema,
} from '../validators/finance.validator';

const router = Router();

router.use(authenticate);

// Fee Categories
router.get(
  '/categories',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT, Role.STUDENT, Role.PARENT),
  validate(feeCategoryQuerySchema, 'query'),
  financeController.listCategories
);

router.get(
  '/categories/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT),
  validate(idParamSchema, 'params'),
  financeController.getCategoryById
);

router.post(
  '/categories',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT),
  validate(createFeeCategorySchema, 'body'),
  financeController.createCategory
);

router.put(
  '/categories/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT),
  validate(idParamSchema, 'params'),
  validate(updateFeeCategorySchema, 'body'),
  financeController.updateCategory
);

router.delete(
  '/categories/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(idParamSchema, 'params'),
  financeController.deleteCategory
);

// Fee Structures
router.get(
  '/structures',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT, Role.STUDENT, Role.PARENT),
  financeController.listStructures
);

router.get(
  '/structures/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT),
  validate(idParamSchema, 'params'),
  financeController.getStructureById
);

router.post(
  '/structures',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT),
  validate(createFeeStructureSchema, 'body'),
  financeController.createStructure
);

router.put(
  '/structures/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT),
  validate(idParamSchema, 'params'),
  validate(updateFeeStructureSchema, 'body'),
  financeController.updateStructure
);

router.delete(
  '/structures/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(idParamSchema, 'params'),
  financeController.deleteStructure
);

// Student Fees
router.post(
  '/student-fees/generate',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT),
  validate(generateStudentFeesSchema, 'body'),
  financeController.generateFees
);

router.get(
  '/student-fees',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT, Role.STUDENT, Role.PARENT),
  validate(studentFeeQuerySchema, 'query'),
  financeController.listStudentFees
);

router.get(
  '/student-fees/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT, Role.STUDENT, Role.PARENT),
  validate(idParamSchema, 'params'),
  financeController.getStudentFeeById
);

router.get(
  '/student-fees/ledger/:studentId',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT, Role.STUDENT, Role.PARENT),
  financeController.getStudentLedger
);

// Payments & Receipts
router.post(
  '/payments',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT),
  validate(collectPaymentSchema, 'body'),
  financeController.collectPayment
);

router.get(
  '/payments',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT, Role.STUDENT, Role.PARENT),
  validate(paymentQuerySchema, 'query'),
  financeController.listPayments
);

router.get(
  '/payments/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT, Role.STUDENT, Role.PARENT),
  validate(idParamSchema, 'params'),
  financeController.getPaymentById
);

// Finance Dashboard & Analytics
router.get(
  '/dashboard',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT),
  financeController.getDashboardCards
);

router.get(
  '/reports/collection',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.ACCOUNTANT),
  financeController.getCollectionReports
);

export default router;
