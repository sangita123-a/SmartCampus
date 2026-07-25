import { z } from 'zod';
import { NotificationPriority, NotificationType, TargetAudience } from '@prisma/client';

export const createNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message content is required'),
  notificationType: z.nativeEnum(NotificationType).optional().default(NotificationType.ANNOUNCEMENT),
  targetAudience: z.nativeEnum(TargetAudience).optional().default(TargetAudience.ALL_USERS),
  targetId: z.string().optional(),
  priority: z.nativeEnum(NotificationPriority).optional().default(NotificationPriority.MEDIUM),
  scheduledAt: z.string().datetime({ offset: true }).optional().or(z.string().optional()),
});

export const updateNotificationSchema = createNotificationSchema.partial();

export const queryNotificationSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  notificationType: z.nativeEnum(NotificationType).optional(),
  targetAudience: z.nativeEnum(TargetAudience).optional(),
  priority: z.nativeEnum(NotificationPriority).optional(),
  status: z.string().optional(),
});
