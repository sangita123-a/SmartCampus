import { api } from '@/lib/api';
import { TimetableDashboardCards, TimetableSlot, WeeklyTimetableGrid } from '@/types/timetable';

export const timetableApi = {
  list: async (params?: Record<string, unknown>) => {
    const res = await api.get<{ success: boolean; data: TimetableSlot[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/timetable', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<{ success: boolean; data: TimetableSlot }>(`/timetable/${id}`);
    return res.data.data;
  },

  create: async (data: Partial<TimetableSlot>) => {
    const res = await api.post<{ success: boolean; data: TimetableSlot }>('/timetable', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<TimetableSlot>) => {
    const res = await api.put<{ success: boolean; data: TimetableSlot }>(`/timetable/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/timetable/${id}`);
    return res.data;
  },

  getDashboardCards: async () => {
    const res = await api.get<{ success: boolean; data: TimetableDashboardCards }>('/timetable/dashboard');
    return res.data.data;
  },

  getWeeklyView: async (params?: { semesterId?: string; facultyId?: string; classroomId?: string }) => {
    const res = await api.get<{ success: boolean; data: WeeklyTimetableGrid }>('/timetable/weekly', { params });
    return res.data.data;
  },
};
