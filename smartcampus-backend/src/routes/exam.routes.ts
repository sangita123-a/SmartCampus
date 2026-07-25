import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '../types/roles';
import { examController } from '../controllers/exam.controller';
import {
  bulkMarksEntrySchema,
  createExamSchema,
  createExamSubjectSchema,
  examQuerySchema,
  idParamSchema,
  updateExamSchema,
} from '../validators/exam.validator';

const router = Router();

router.use(authenticate);

// Exam Management
router.get(
  '/',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  validate(examQuerySchema, 'query'),
  examController.listExams
);

router.get(
  '/dashboard',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY),
  examController.getDashboardCards
);

router.get(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  validate(idParamSchema, 'params'),
  examController.getExamById
);

router.post(
  '/',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(createExamSchema, 'body'),
  examController.createExam
);

router.put(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(idParamSchema, 'params'),
  validate(updateExamSchema, 'body'),
  examController.updateExam
);

router.delete(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(idParamSchema, 'params'),
  examController.deleteExam
);

// Exam Subjects
router.post(
  '/subjects',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(createExamSubjectSchema, 'body'),
  examController.addExamSubject
);

router.delete(
  '/subjects/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(idParamSchema, 'params'),
  examController.removeExamSubject
);

// Marks Entry & Publishing
router.post(
  '/marks/bulk',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY),
  validate(bulkMarksEntrySchema, 'body'),
  examController.bulkSaveMarks
);

router.post(
  '/:id/publish',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(idParamSchema, 'params'),
  examController.publishResults
);

router.post(
  '/:id/unpublish',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  validate(idParamSchema, 'params'),
  examController.unpublishResults
);

// Marksheets & Rank Lists
router.get(
  '/marksheet/:studentId/:examId',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  examController.getStudentMarksheet
);

router.get(
  '/rank-list/:examId',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  examController.getRankList
);

// Hall Tickets
router.get(
  '/hall-ticket/:studentId/:examId',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT),
  examController.getHallTicket
);

export default router;
