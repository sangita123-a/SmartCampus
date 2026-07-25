import { apiClient } from '@/lib/apiClient';
import type {
  ApiSuccessResponse,
  PaginatedResponse,
  Student,
  StudentDashboardStats,
  StudentImportResult,
  StudentListParams,
  StudentPayload,
  StudentStatus,
} from '@/types';

function toQuery(params: object = {}): string {
  const searchParams = new URLSearchParams();
  Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export const studentService = {
  async getDashboardStats(): Promise<
    ApiSuccessResponse<{ stats: StudentDashboardStats }>
  > {
    const { data } = await apiClient.get('/students/dashboard');
    return data;
  },

  async list(
    params?: StudentListParams
  ): Promise<ApiSuccessResponse<PaginatedResponse<Student>>> {
    const { data } = await apiClient.get(`/students${toQuery(params)}`);
    return data;
  },

  async getById(id: string): Promise<ApiSuccessResponse<{ student: Student }>> {
    const { data } = await apiClient.get(`/students/${id}`);
    return data;
  },

  async create(payload: StudentPayload): Promise<ApiSuccessResponse<{ student: Student }>> {
    const { data } = await apiClient.post('/students', payload);
    return data;
  },

  async update(
    id: string,
    payload: Partial<StudentPayload>
  ): Promise<ApiSuccessResponse<{ student: Student }>> {
    const { data } = await apiClient.put(`/students/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<ApiSuccessResponse> {
    const { data } = await apiClient.delete(`/students/${id}`);
    return data;
  },

  async bulkDelete(ids: string[]): Promise<ApiSuccessResponse<{ deleted: number }>> {
    const { data } = await apiClient.post('/students/bulk-delete', { ids });
    return data;
  },

  async bulkStatus(
    ids: string[],
    status: StudentStatus
  ): Promise<ApiSuccessResponse<{ updated: number }>> {
    const { data } = await apiClient.patch('/students/bulk-status', { ids, status });
    return data;
  },

  async uploadImage(file: File): Promise<ApiSuccessResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('profileImage', file);
    const { data } = await apiClient.post('/students/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return data;
  },

  async importFile(file: File): Promise<ApiSuccessResponse<{ result: StudentImportResult }>> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post('/students/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    });
    return data;
  },

  async exportFile(
    format: 'csv' | 'xlsx',
    params?: Omit<StudentListParams, 'page' | 'limit' | 'sortBy' | 'sortOrder'>
  ): Promise<Blob> {
    const { data } = await apiClient.get(`/students/export${toQuery({ ...params, format })}`, {
      responseType: 'blob',
      timeout: 60000,
    });
    return data;
  },
};
