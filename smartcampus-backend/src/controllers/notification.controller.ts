import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { notificationService } from '../services/notification.service';

export class NotificationController {
  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const query = req.query as any;

    // College scoping for non-SuperAdmin
    const collegeId = user.role === 'SUPER_ADMIN' ? query.collegeId : user.collegeId;

    const result = await notificationService.getNotifications({
      ...query,
      collegeId,
    });

    res.json({ success: true, ...result });
  });

  getDashboardMetrics = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user.role === 'SUPER_ADMIN' ? undefined : user.collegeId;

    const data = await notificationService.getDashboardMetrics(collegeId);
    res.json({ success: true, data });
  });

  getNotificationById = asyncHandler(async (req: Request, res: Response) => {
    const data = await notificationService.getNotificationById(req.params.id);
    res.json({ success: true, data });
  });

  getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const data = await notificationService.getMyNotifications(user.id);
    res.json({ success: true, data });
  });

  createNotification = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user.collegeId || req.body.collegeId;

    const data = await notificationService.createNotification({
      ...req.body,
      collegeId,
      createdBy: user.id,
    });

    res.status(201).json({ success: true, data });
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const data = await notificationService.markAsRead(req.params.id, user.id);
    res.json({ success: true, data });
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const data = await notificationService.markAllAsRead(user.id);
    res.json({ success: true, data });
  });

  deleteNotification = asyncHandler(async (req: Request, res: Response) => {
    await notificationService.deleteNotification(req.params.id);
    res.json({ success: true, message: 'Notification deleted successfully' });
  });
}

export const notificationController = new NotificationController();
