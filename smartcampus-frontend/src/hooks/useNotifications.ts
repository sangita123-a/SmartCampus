import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/services/notification.service';
import { CreateNotificationPayload, NotificationFilterParams } from '@/types/notification';

export function useNotificationDashboard() {
  return useQuery({
    queryKey: ['notifications', 'dashboard'],
    queryFn: () => notificationApi.getDashboardMetrics(),
  });
}

export function useNotifications(params?: NotificationFilterParams) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationApi.getNotifications(params),
  });
}

export function useNotificationById(id: string) {
  return useQuery({
    queryKey: ['notifications', id],
    queryFn: () => notificationApi.getNotificationById(id),
    enabled: Boolean(id),
  });
}

export function useMyNotifications() {
  return useQuery({
    queryKey: ['notifications', 'my'],
    queryFn: () => notificationApi.getMyNotifications(),
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNotificationPayload) => notificationApi.createNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => notificationApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'my'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'my'] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
