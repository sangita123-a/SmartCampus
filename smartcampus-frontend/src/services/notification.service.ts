import { api } from '@/lib/api';
import {
  CreateNotificationPayload,
  NotificationDashboardData,
  NotificationFilterParams,
  NotificationItem,
  UserNotification,
} from '@/types/notification';

export const notificationApi = {
  getDashboardMetrics: async () => {
    const res = await api.get<{ success: boolean; data: NotificationDashboardData }>('/notifications/dashboard');
    return res.data.data;
  },

  getNotifications: async (params?: NotificationFilterParams) => {
    const res = await api.get<{
      success: boolean;
      data: NotificationItem[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>('/notifications', { params });
    return res.data;
  },

  getNotificationById: async (id: string) => {
    const res = await api.get<{ success: boolean; data: NotificationItem }>(`/notifications/${id}`);
    return res.data.data;
  },

  getMyNotifications: async () => {
    const res = await api.get<{ success: boolean; data: { unreadCount: number; notifications: UserNotification[] } }>('/notifications/my');
    return res.data.data;
  },

  createNotification: async (payload: CreateNotificationPayload) => {
    const res = await api.post<{ success: boolean; data: NotificationItem }>('/notifications', payload);
    return res.data.data;
  },

  markAsRead: async (notificationId: string) => {
    const res = await api.put<{ success: boolean; data: Record<string, unknown> }>(`/notifications/${notificationId}/read`);
    return res.data.data;
  },

  markAllAsRead: async () => {
    const res = await api.put<{ success: boolean; data: Record<string, unknown> }>('/notifications/read-all');
    return res.data.data;
  },

  deleteNotification: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/notifications/${id}`);
    return res.data;
  },
};
