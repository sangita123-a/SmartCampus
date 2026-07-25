import { DeliveryStatus, NotificationPriority, NotificationStatus, NotificationType, Role, TargetAudience } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class NotificationService {
  /**
   * Target Audience Resolver: Finds all target User IDs in college for a given notification.
   */
  async resolveTargetRecipients(collegeId: string, targetAudience: TargetAudience, targetId?: string): Promise<string[]> {
    switch (targetAudience) {
      case TargetAudience.ALL_USERS: {
        const users = await prisma.user.findMany({
          where: { collegeId, isActive: true },
          select: { id: true },
        });
        return users.map((u) => u.id);
      }

      case TargetAudience.STUDENTS: {
        const students = await prisma.student.findMany({
          where: { collegeId, userId: { not: null } },
          select: { userId: true },
        });
        return students.map((s) => s.userId!).filter(Boolean);
      }

      case TargetAudience.FACULTY: {
        const faculty = await prisma.faculty.findMany({
          where: { collegeId, userId: { not: null } },
          select: { userId: true },
        });
        return faculty.map((f) => f.userId!).filter(Boolean);
      }

      case TargetAudience.PARENTS: {
        const parents = await prisma.user.findMany({
          where: { collegeId, role: Role.PARENT, isActive: true },
          select: { id: true },
        });
        return parents.map((p) => p.id);
      }

      case TargetAudience.COLLEGE_ADMIN: {
        const admins = await prisma.user.findMany({
          where: { collegeId, role: Role.COLLEGE_ADMIN, isActive: true },
          select: { id: true },
        });
        return admins.map((a) => a.id);
      }

      case TargetAudience.DEPARTMENT: {
        if (!targetId) return [];
        const [students, faculty] = await Promise.all([
          prisma.student.findMany({ where: { collegeId, departmentId: targetId, userId: { not: null } }, select: { userId: true } }),
          prisma.faculty.findMany({ where: { collegeId, departmentId: targetId, userId: { not: null } }, select: { userId: true } }),
        ]);
        const ids = [...students.map((s) => s.userId!), ...faculty.map((f) => f.userId!)];
        return Array.from(new Set(ids)).filter(Boolean);
      }

      case TargetAudience.COURSE: {
        if (!targetId) return [];
        const students = await prisma.student.findMany({
          where: { collegeId, courseId: targetId, userId: { not: null } },
          select: { userId: true },
        });
        return students.map((s) => s.userId!).filter(Boolean);
      }

      case TargetAudience.SEMESTER: {
        if (!targetId) return [];
        const students = await prisma.student.findMany({
          where: { collegeId, semesterId: targetId, userId: { not: null } },
          select: { userId: true },
        });
        return students.map((s) => s.userId!).filter(Boolean);
      }

      case TargetAudience.INDIVIDUAL_USER: {
        if (!targetId) return [];
        return [targetId];
      }

      default:
        return [];
    }
  }

  async createNotification(data: {
    collegeId: string;
    title: string;
    message: string;
    notificationType?: NotificationType;
    targetAudience?: TargetAudience;
    targetId?: string;
    priority?: NotificationPriority;
    scheduledAt?: string;
    createdBy: string;
  }) {
    const {
      collegeId,
      title,
      message,
      notificationType = NotificationType.ANNOUNCEMENT,
      targetAudience = TargetAudience.ALL_USERS,
      targetId,
      priority = NotificationPriority.MEDIUM,
      scheduledAt,
      createdBy,
    } = data;

    const isScheduled = Boolean(scheduledAt && new Date(scheduledAt) > new Date());
    const status = isScheduled ? NotificationStatus.SCHEDULED : NotificationStatus.SENT;
    const sentAt = isScheduled ? null : new Date();

    const notification = await prisma.notification.create({
      data: {
        collegeId,
        title,
        message,
        notificationType,
        targetAudience,
        targetId,
        priority,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        sentAt,
        createdBy,
      },
    });

    // Resolve target user IDs
    const recipientUserIds = await this.resolveTargetRecipients(collegeId, targetAudience, targetId);

    // Create NotificationRecipient records
    if (recipientUserIds.length > 0) {
      const recipientData = recipientUserIds.map((userId) => ({
        notificationId: notification.id,
        userId,
        isRead: false,
        deliveryStatus: isScheduled ? DeliveryStatus.PENDING : DeliveryStatus.DELIVERED,
      }));

      await prisma.notificationRecipient.createMany({
        data: recipientData,
        skipDuplicates: true,
      });
    }

    // Provider hooks (Decoupled SMTP, SMS, Firebase Push ready)
    if (!isScheduled) {
      this.dispatchExternalChannelsPlaceholder(notification.id, recipientUserIds);
    }

    return notification;
  }

  private dispatchExternalChannelsPlaceholder(notificationId: string, recipientUserIds: string[]) {
    // Decoupled architecture placeholder for SMTP, Twilio SMS, and Firebase Push Cloud Messaging
    // Logs dispatch without blocking main thread
    console.log(`[Notification Engine] Dispatched notification ${notificationId} to ${recipientUserIds.length} recipients via In-App channel.`);
  }

  async getDashboardMetrics(collegeId?: string) {
    const where = collegeId ? { collegeId } : {};

    const [totalNotifications, scheduledNotifications, sentToday, totalRecipients, readRecipients, failedRecipients] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { ...where, status: NotificationStatus.SCHEDULED } }),
      prisma.notification.count({
        where: {
          ...where,
          status: NotificationStatus.SENT,
          sentAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.notificationRecipient.count({
        where: collegeId ? { notification: { collegeId } } : {},
      }),
      prisma.notificationRecipient.count({
        where: collegeId ? { notification: { collegeId }, isRead: true } : { isRead: true },
      }),
      prisma.notificationRecipient.count({
        where: collegeId ? { notification: { collegeId }, deliveryStatus: DeliveryStatus.FAILED } : { deliveryStatus: DeliveryStatus.FAILED },
      }),
    ]);

    const readPercentage = totalRecipients > 0 ? Number(((readRecipients / totalRecipients) * 100).toFixed(2)) : 0;
    const unreadNotifications = totalRecipients - readRecipients;

    return {
      totalNotifications,
      unreadNotifications,
      scheduledNotifications,
      sentToday,
      failedDeliveries: failedRecipients,
      readPercentage,
    };
  }

  async getNotifications(params: {
    collegeId?: string;
    page?: number;
    limit?: number;
    search?: string;
    notificationType?: NotificationType;
    targetAudience?: TargetAudience;
    priority?: NotificationPriority;
    status?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.collegeId) where.collegeId = params.collegeId;
    if (params.notificationType) where.notificationType = params.notificationType;
    if (params.targetAudience) where.targetAudience = params.targetAudience;
    if (params.priority) where.priority = params.priority;
    if (params.status) where.status = params.status as NotificationStatus;

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { message: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          _count: { select: { recipients: true } },
        },
      }),
      prisma.notification.count({ where }),
    ]);

    // Attach read count for each notification
    const notificationsWithReadCount = await Promise.all(
      items.map(async (item) => {
        const readCount = await prisma.notificationRecipient.count({
          where: { notificationId: item.id, isRead: true },
        });
        return {
          ...item,
          readCount,
          totalRecipients: item._count.recipients,
        };
      })
    );

    return {
      data: notificationsWithReadCount,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getNotificationById(id: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        college: { select: { id: true, name: true } },
        _count: { select: { recipients: true } },
      },
    });

    if (!notification) throw new AppError('Notification not found', 404);

    const readCount = await prisma.notificationRecipient.count({
      where: { notificationId: id, isRead: true },
    });

    return {
      ...notification,
      readCount,
      totalRecipients: notification._count.recipients,
    };
  }

  async getMyNotifications(userId: string) {
    const recipients = await prisma.notificationRecipient.findMany({
      where: { userId },
      include: {
        notification: {
          include: {
            creator: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = recipients.filter((r) => !r.isRead).length;

    return {
      unreadCount,
      notifications: recipients.map((r) => ({
        recipientId: r.id,
        notificationId: r.notificationId,
        title: r.notification.title,
        message: r.notification.message,
        type: r.notification.notificationType,
        priority: r.notification.priority,
        isRead: r.isRead,
        readAt: r.readAt,
        sentAt: r.notification.sentAt || r.createdAt,
        creatorName: r.notification.creator?.name || 'System Administrator',
      })),
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const recipient = await prisma.notificationRecipient.findUnique({
      where: {
        notificationId_userId: {
          notificationId,
          userId,
        },
      },
    });

    if (!recipient) throw new AppError('Notification recipient record not found', 404);

    return prisma.notificationRecipient.update({
      where: { id: recipient.id },
      data: {
        isRead: true,
        readAt: new Date(),
        deliveryStatus: DeliveryStatus.READ,
      },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notificationRecipient.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
        deliveryStatus: DeliveryStatus.READ,
      },
    });
  }

  async deleteNotification(id: string) {
    const existing = await prisma.notification.findUnique({ where: { id } });
    if (!existing) throw new AppError('Notification not found', 404);

    return prisma.notification.delete({ where: { id } });
  }
}

export const notificationService = new NotificationService();
