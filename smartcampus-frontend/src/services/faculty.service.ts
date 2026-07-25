import { apiClient } from '@/lib/apiClient';
import type {
  ApiSuccessResponse,
  Faculty,
  FacultyDashboardStats,
  FacultyImportResult,
  FacultyListParams,
  FacultyPayload,
  FacultyStatus,
  PaginatedResponse,
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

export const facultyService = {
  async getDashboardStats(): Promise<
    ApiSuccessResponse<{ stats: FacultyDashboardStats }>
  > {
    const { data } = await apiClient.get('/faculty/dashboard');
    return data;
  },

  async list(
    params?: FacultyListParams
  ): Promise<ApiSuccessResponse<PaginatedResponse<Faculty>>> {
    const { data } = await apiClient.get(`/faculty${toQuery(params)}`);
    return data;
  },

  async getById(id: string): Promise<ApiSuccessResponse<{ faculty: Faculty }>> {
    const { data } = await apiClient.get(`/faculty/${id}`);
    return data;
  },

  async create(payload: FacultyPayload): Promise<ApiSuccessResponse<{ faculty: Faculty }>> {
    const { data } = await apiClient.post('/faculty', payload);
    return data;
  },

  async update(
    id: string,
    payload: Partial<FacultyPayload>
  ): Promise<ApiSuccessResponse<{ faculty: Faculty }>> {
    const { data } = await apiClient.put(`/faculty/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<ApiSuccessResponse> {
    const { data } = await apiClient.delete(`/faculty/${id}`);
    return data;
  },

  async bulkDelete(ids: string[]): Promise<ApiSuccessResponse<{ deleted: number }>> {
    const { data } = await apiClient.post('/faculty/bulk-delete', { ids });
    return data;
  },

  async bulkStatus(
    ids: string[],
    status: FacultyStatus
  ): Promise<ApiSuccessResponse<{ updated: number }>> {
    const { data } = await apiClient.patch('/faculty/bulk-status', { ids, status });
    return data;
  },

  async uploadImage(file: File): Promise<ApiSuccessResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('profileImage', file);
    const { data } = await apiClient.post('/faculty/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return data;
  },

  async importFile(file: File): Promise<ApiSuccessResponse<{ result: FacultyImportResult }>> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post('/faculty/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    });
    return data;
  },

  async exportFile(
    format: 'csv' | 'xlsx',
    params?: Omit<FacultyListParams, 'page' | 'limit' | 'sortBy' | 'sortOrder'>
  ): Promise<Blob> {
    const { data } = await apiClient.get(`/faculty/export${toQuery({ ...params, format })}`, {
      responseType: 'blob',
      timeout: 60000,
    });
    return data;
  },
};
