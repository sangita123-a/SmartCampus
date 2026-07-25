export type NotificationType =
  | 'ANNOUNCEMENT'
  | 'CIRCULAR'
  | 'FEE_REMINDER'
  | 'ATTENDANCE_ALERT'
  | 'EXAM_NOTICE'
  | 'HOLIDAY_NOTICE'
  | 'ASSIGNMENT_NOTICE'
  | 'EMERGENCY_ALERT'
  | 'GENERAL';

export type TargetAudience =
  | 'ALL_USERS'
  | 'STUDENTS'
  | 'FACULTY'
  | 'PARENTS'
  | 'COLLEGE_ADMIN'
  | 'DEPARTMENT'
  | 'COURSE'
  | 'SEMESTER'
  | 'INDIVIDUAL_USER';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type NotificationStatus = 'DRAFT' | 'SCHEDULED' | 'SENT' | 'FAILED' | 'CANCELLED';

export interface NotificationItem {
  id: string;
  collegeId: string;
  title: string;
  message: string;
  notificationType: NotificationType;
  targetAudience: TargetAudience;
  targetId?: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  scheduledAt?: string;
  sentAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator?: { id: string; name: string; email: string };
  readCount?: number;
  totalRecipients?: number;
}

export interface UserNotification {
  recipientId: string;
  notificationId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: string;
  sentAt: string;
  creatorName: string;
}

export interface NotificationDashboardData {
  totalNotifications: number;
  unreadNotifications: number;
  scheduledNotifications: number;
  sentToday: number;
  failedDeliveries: number;
  readPercentage: number;
}

export interface CreateNotificationPayload {
  title: string;
  message: string;
  notificationType?: NotificationType;
  targetAudience?: TargetAudience;
  targetId?: string;
  priority?: NotificationPriority;
  scheduledAt?: string;
}

export interface NotificationFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  notificationType?: NotificationType;
  targetAudience?: TargetAudience;
  priority?: NotificationPriority;
  status?: string;
}
