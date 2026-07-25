import { api } from '@/lib/api';
import { Classroom } from '@/types/classroom';

export const classroomApi = {
  list: async (params?: Record<string, unknown>) => {
    const res = await api.get<{ success: boolean; data: Classroom[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/classrooms', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<{ success: boolean; data: Classroom }>(`/classrooms/${id}`);
    return res.data.data;
  },

  create: async (data: Partial<Classroom>) => {
    const res = await api.post<{ success: boolean; data: Classroom }>('/classrooms', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<Classroom>) => {
    const res = await api.put<{ success: boolean; data: Classroom }>(`/classrooms/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/classrooms/${id}`);
    return res.data;
  },
};
