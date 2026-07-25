import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '../types/roles';
import { libraryController } from '../controllers/library.controller';
import {
  bookQuerySchema,
  createAuthorSchema,
  createBookCategorySchema,
  createBookSchema,
  createPublisherSchema,
  createReservationSchema,
  idParamSchema,
  issueBookSchema,
  returnBookSchema,
  updateBookSchema,
} from '../validators/library.validator';

const router = Router();

router.use(authenticate);

// Categories
router.get(
  '/categories',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN, Role.FACULTY, Role.STUDENT),
  libraryController.listCategories
);

router.post(
  '/categories',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN),
  validate(createBookCategorySchema, 'body'),
  libraryController.createCategory
);

router.delete(
  '/categories/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN),
  validate(idParamSchema, 'params'),
  libraryController.deleteCategory
);

// Authors & Publishers
router.get(
  '/authors',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN, Role.FACULTY, Role.STUDENT),
  libraryController.listAuthors
);

router.post(
  '/authors',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN),
  validate(createAuthorSchema, 'body'),
  libraryController.createAuthor
);

router.get(
  '/publishers',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN, Role.FACULTY, Role.STUDENT),
  libraryController.listPublishers
);

router.post(
  '/publishers',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN),
  validate(createPublisherSchema, 'body'),
  libraryController.createPublisher
);

// Books Inventory
router.get(
  '/books',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN, Role.FACULTY, Role.STUDENT),
  validate(bookQuerySchema, 'query'),
  libraryController.listBooks
);

router.get(
  '/dashboard',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN),
  libraryController.getDashboardCards
);

router.get(
  '/books/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN, Role.FACULTY, Role.STUDENT),
  validate(idParamSchema, 'params'),
  libraryController.getBookById
);

router.post(
  '/books',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN),
  validate(createBookSchema, 'body'),
  libraryController.createBook
);

router.put(
  '/books/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN),
  validate(idParamSchema, 'params'),
  validate(updateBookSchema, 'body'),
  libraryController.updateBook
);

router.delete(
  '/books/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN),
  validate(idParamSchema, 'params'),
  libraryController.deleteBook
);

// Book Issues & Returns
router.get(
  '/issues',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN, Role.FACULTY, Role.STUDENT),
  libraryController.listIssues
);

router.post(
  '/issues',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN, Role.FACULTY),
  validate(issueBookSchema, 'body'),
  libraryController.issueBook
);

router.post(
  '/issues/:id/return',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN),
  validate(idParamSchema, 'params'),
  validate(returnBookSchema, 'body'),
  libraryController.returnBook
);

// Reservations
router.get(
  '/reservations',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN, Role.FACULTY, Role.STUDENT),
  libraryController.listReservations
);

router.post(
  '/reservations',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN, Role.STUDENT),
  validate(createReservationSchema, 'body'),
  libraryController.reserveBook
);

router.post(
  '/reservations/:id/cancel',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.LIBRARIAN, Role.STUDENT),
  validate(idParamSchema, 'params'),
  libraryController.cancelReservation
);

export default router;
