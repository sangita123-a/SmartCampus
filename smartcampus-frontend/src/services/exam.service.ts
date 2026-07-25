import { api } from '@/lib/api';
import {
  ExamDashboardCardsData,
  ExamRecord,
  ExamSubject,
  HallTicketData,
  RankListItem,
  StudentMarksheetData,
} from '@/types/exam';

export const examApi = {
  list: async (params?: Record<string, unknown>) => {
    const res = await api.get<{ success: boolean; data: ExamRecord[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/exams', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<{ success: boolean; data: ExamRecord }>(`/exams/${id}`);
    return res.data.data;
  },

  create: async (data: Partial<ExamRecord>) => {
    const res = await api.post<{ success: boolean; data: ExamRecord }>('/exams', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<ExamRecord>) => {
    const res = await api.put<{ success: boolean; data: ExamRecord }>(`/exams/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/exams/${id}`);
    return res.data;
  },

  addExamSubject: async (data: Partial<ExamSubject>) => {
    const res = await api.post<{ success: boolean; data: ExamSubject }>('/exams/subjects', data);
    return res.data.data;
  },

  removeExamSubject: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/exams/subjects/${id}`);
    return res.data;
  },

  bulkSaveMarks: async (data: { examId: string; subjectId: string; marks: { studentId: string; obtainedMarks: number; resultStatus?: string; remarks?: string }[] }) => {
    const res = await api.post<{ success: boolean; message: string; savedCount: number }>('/exams/marks/bulk', data);
    return res.data;
  },

  publishResults: async (examId: string) => {
    const res = await api.post<{ success: boolean; message: string }>(`/exams/${examId}/publish`);
    return res.data;
  },

  unpublishResults: async (examId: string) => {
    const res = await api.post<{ success: boolean; message: string }>(`/exams/${examId}/unpublish`);
    return res.data;
  },

  getStudentMarksheet: async (studentId: string, examId: string) => {
    const res = await api.get<{ success: boolean; data: StudentMarksheetData }>(`/exams/marksheet/${studentId}/${examId}`);
    return res.data.data;
  },

  getRankList: async (examId: string) => {
    const res = await api.get<{ success: boolean; data: { exam: ExamRecord; rankList: RankListItem[] } }>(`/exams/rank-list/${examId}`);
    return res.data.data;
  },

  getHallTicket: async (studentId: string, examId: string) => {
    const res = await api.get<{ success: boolean; data: HallTicketData }>(`/exams/hall-ticket/${studentId}/${examId}`);
    return res.data.data;
  },

  getDashboardCards: async () => {
    const res = await api.get<{ success: boolean; data: ExamDashboardCardsData }>('/exams/dashboard');
    return res.data.data;
  },
};
