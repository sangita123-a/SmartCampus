import { api } from '@/lib/api';
import {
  AttendanceDashboardCards,
  AttendanceRecord,
  BulkAttendancePayload,
  FacultyAttendanceSummaryReport,
  QRSession,
  StudentAttendancePercentageReport,
} from '@/types/attendance';

export const attendanceApi = {
  list: async (params?: Record<string, unknown>) => {
    const res = await api.get<{ success: boolean; data: AttendanceRecord[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/attendance', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<{ success: boolean; data: AttendanceRecord }>(`/attendance/${id}`);
    return res.data.data;
  },

  create: async (data: Partial<AttendanceRecord>) => {
    const res = await api.post<{ success: boolean; data: AttendanceRecord }>('/attendance', data);
    return res.data.data;
  },

  bulkMark: async (data: BulkAttendancePayload) => {
    const res = await api.post<{ success: boolean; message: string }>('/attendance/bulk', data);
    return res.data;
  },

  update: async (id: string, data: Partial<AttendanceRecord>) => {
    const res = await api.put<{ success: boolean; data: AttendanceRecord }>(`/attendance/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/attendance/${id}`);
    return res.data;
  },

  getDashboardCards: async () => {
    const res = await api.get<{ success: boolean; data: AttendanceDashboardCards }>('/attendance/dashboard');
    return res.data.data;
  },

  getStudentPercentageReport: async (studentId?: string) => {
    const res = await api.get<{ success: boolean; data: StudentAttendancePercentageReport }>(
      '/attendance/reports/student-percentage',
      { params: { studentId } }
    );
    return res.data.data;
  },

  getFacultySummaryReport: async (facultyId?: string) => {
    const res = await api.get<{ success: boolean; data: FacultyAttendanceSummaryReport }>(
      '/attendance/reports/faculty-summary',
      { params: { facultyId } }
    );
    return res.data.data;
  },

  createQRSession: async (data: Record<string, unknown>) => {
    const res = await api.post<{ success: boolean; data: QRSession }>('/attendance/qr/session', data);
    return res.data.data;
  },

  scanQRAttendance: async (data: { sessionCode: string; studentId: string }) => {
    const res = await api.post<{ success: boolean; data: AttendanceRecord }>('/attendance/qr/scan', data);
    return res.data.data;
  },
};
