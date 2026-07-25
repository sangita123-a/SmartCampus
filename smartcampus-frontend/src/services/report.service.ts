import { api } from '@/lib/api';
import {
  AttendanceReportData,
  DashboardAnalyticsData,
  ExamReportData,
  FacultyReportData,
  FeeReportData,
  LibraryReportData,
  ReportFilterParams,
  StudentReportData,
} from '@/types/report';

export const reportApi = {
  getDashboardAnalytics: async () => {
    const res = await api.get<{ success: boolean; data: DashboardAnalyticsData }>('/reports/dashboard');
    return res.data.data;
  },

  getStudentReports: async (params?: ReportFilterParams) => {
    const res = await api.get<{ success: boolean; data: StudentReportData }>('/reports/students', { params });
    return res.data.data;
  },

  getFacultyReports: async (params?: ReportFilterParams) => {
    const res = await api.get<{ success: boolean; data: FacultyReportData }>('/reports/faculty', { params });
    return res.data.data;
  },

  getAttendanceReports: async (params?: ReportFilterParams) => {
    const res = await api.get<{ success: boolean; data: AttendanceReportData }>('/reports/attendance', { params });
    return res.data.data;
  },

  getFeeReports: async (params?: ReportFilterParams) => {
    const res = await api.get<{ success: boolean; data: FeeReportData }>('/reports/fees', { params });
    return res.data.data;
  },

  getExamReports: async (params?: ReportFilterParams) => {
    const res = await api.get<{ success: boolean; data: ExamReportData }>('/reports/exams', { params });
    return res.data.data;
  },

  getLibraryReports: async () => {
    const res = await api.get<{ success: boolean; data: LibraryReportData }>('/reports/library');
    return res.data.data;
  },
};
