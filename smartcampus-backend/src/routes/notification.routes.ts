import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { Role } from '../types/roles';
import { notificationController } from '../controllers/notification.controller';
import { createNotificationSchema, queryNotificationSchema } from '../validators/notification.validator';

const router = Router();

router.use(authenticate);

// User-specific Notification endpoints (Accessible by all roles)
router.get('/my', notificationController.getMyNotifications);
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);

// Admin Dashboard & Broadcast Management endpoints
router.get(
  '/dashboard',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  notificationController.getDashboardMetrics
);

router.get(
  '/',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY),
  validate(queryNotificationSchema, 'query'),
  notificationController.getNotifications
);

router.get(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY),
  notificationController.getNotificationById
);

router.post(
  '/',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY),
  validate(createNotificationSchema, 'body'),
  notificationController.createNotification
);

router.delete(
  '/:id',
  authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN),
  notificationController.deleteNotification
);

export default router;
