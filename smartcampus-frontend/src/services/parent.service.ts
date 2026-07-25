import { api } from '@/lib/api';
import {
  LinkedStudent,
  ParentAttendanceData,
  ParentDashboardData,
  ParentFeesData,
  ParentNotification,
  ParentResultsData,
} from '@/types/parent';

export const parentApi = {
  getDashboard: async () => {
    const res = await api.get<{ success: boolean; data: ParentDashboardData }>('/parent/dashboard');
    return res.data.data;
  },

  getStudents: async () => {
    const res = await api.get<{ success: boolean; data: LinkedStudent[] }>('/parent/students');
    return res.data.data;
  },

  getStudentById: async (studentId: string) => {
    const res = await api.get<{ success: boolean; data: LinkedStudent }>(`/parent/students/${studentId}`);
    return res.data.data;
  },

  getAttendance: async (studentId?: string) => {
    const res = await api.get<{ success: boolean; data: ParentAttendanceData }>('/parent/attendance', {
      params: { studentId },
    });
    return res.data.data;
  },

  getResults: async (studentId?: string) => {
    const res = await api.get<{ success: boolean; data: ParentResultsData }>('/parent/results', {
      params: { studentId },
    });
    return res.data.data;
  },

  getFees: async (studentId?: string) => {
    const res = await api.get<{ success: boolean; data: ParentFeesData }>('/parent/fees', {
      params: { studentId },
    });
    return res.data.data;
  },

  getTimetable: async (studentId?: string) => {
    const res = await api.get<{ success: boolean; data: { student: LinkedStudent; timetable: Record<string, unknown>[]; upcomingExams: Record<string, unknown>[] } }>('/parent/timetable', {
      params: { studentId },
    });
    return res.data.data;
  },

  getNotifications: async () => {
    const res = await api.get<{ success: boolean; data: { childrenCount: number; notifications: ParentNotification[] } }>('/parent/notifications');
    return res.data.data;
  },
};
