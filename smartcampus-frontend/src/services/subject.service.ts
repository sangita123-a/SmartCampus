import { apiClient } from '@/lib/apiClient';
import type {
  AcademicStatus,
  ApiSuccessResponse,
  PaginatedResponse,
  Subject,
  SubjectDashboardStats,
  SubjectListParams,
  SubjectPayload,
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

export const subjectService = {
  async getDashboardStats(): Promise<
    ApiSuccessResponse<{ stats: SubjectDashboardStats }>
  > {
    const { data } = await apiClient.get('/subjects/dashboard');
    return data;
  },

  async list(
    params?: SubjectListParams
  ): Promise<ApiSuccessResponse<PaginatedResponse<Subject>>> {
    const { data } = await apiClient.get(`/subjects${toQuery(params)}`);
    return data;
  },

  async getById(id: string): Promise<ApiSuccessResponse<{ subject: Subject }>> {
    const { data } = await apiClient.get(`/subjects/${id}`);
    return data;
  },

  async create(payload: SubjectPayload): Promise<ApiSuccessResponse<{ subject: Subject }>> {
    const { data } = await apiClient.post('/subjects', payload);
    return data;
  },

  async update(
    id: string,
    payload: Partial<SubjectPayload>
  ): Promise<ApiSuccessResponse<{ subject: Subject }>> {
    const { data } = await apiClient.put(`/subjects/${id}`, payload);
    return data;
  },

  async assignFaculty(
    id: string,
    facultyId: string
  ): Promise<ApiSuccessResponse<{ subject: Subject }>> {
    const { data } = await apiClient.patch(`/subjects/${id}/assign-faculty`, { facultyId });
    return data;
  },

  async removeFaculty(id: string): Promise<ApiSuccessResponse<{ subject: Subject }>> {
    const { data } = await apiClient.patch(`/subjects/${id}/remove-faculty`);
    return data;
  },

  async remove(id: string): Promise<ApiSuccessResponse> {
    const { data } = await apiClient.delete(`/subjects/${id}`);
    return data;
  },

  async bulkDelete(ids: string[]): Promise<ApiSuccessResponse<{ deleted: number }>> {
    const { data } = await apiClient.post('/subjects/bulk-delete', { ids });
    return data;
  },

  async bulkStatus(
    ids: string[],
    status: AcademicStatus
  ): Promise<ApiSuccessResponse<{ updated: number }>> {
    const { data } = await apiClient.patch('/subjects/bulk-status', { ids, status });
    return data;
  },

  async exportFile(
    format: 'csv' | 'xlsx',
    params?: Omit<SubjectListParams, 'page' | 'limit' | 'sortBy' | 'sortOrder'>
  ): Promise<Blob> {
    const { data } = await apiClient.get(`/subjects/export${toQuery({ ...params, format })}`, {
      responseType: 'blob',
      timeout: 60000,
    });
    return data;
  },
};
