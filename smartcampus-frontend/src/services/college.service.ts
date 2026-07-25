import { apiClient } from '@/lib/apiClient';
import type {
  ApiSuccessResponse,
  College,
  CollegeListParams,
  CollegeListResponse,
  CollegePayload,
  SuperAdminDashboardStats,
} from '@/types';

function toQuery(params: CollegeListParams = {}): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export const collegeService = {
  async list(params?: CollegeListParams): Promise<ApiSuccessResponse<CollegeListResponse>> {
    const { data } = await apiClient.get(`/colleges${toQuery(params)}`);
    return data;
  },

  async getById(id: string): Promise<ApiSuccessResponse<{ college: College }>> {
    const { data } = await apiClient.get(`/colleges/${id}`);
    return data;
  },

  async create(payload: CollegePayload): Promise<ApiSuccessResponse<{ college: College }>> {
    const { data } = await apiClient.post('/colleges', payload);
    return data;
  },

  async update(
    id: string,
    payload: Partial<CollegePayload>
  ): Promise<ApiSuccessResponse<{ college: College }>> {
    const { data } = await apiClient.put(`/colleges/${id}`, payload);
    return data;
  },

  async deactivate(id: string): Promise<ApiSuccessResponse<{ college: College }>> {
    const { data } = await apiClient.patch(`/colleges/${id}/deactivate`);
    return data;
  },

  async reactivate(id: string): Promise<ApiSuccessResponse<{ college: College }>> {
    const { data } = await apiClient.patch(`/colleges/${id}/reactivate`);
    return data;
  },

  async remove(id: string): Promise<ApiSuccessResponse> {
    const { data } = await apiClient.delete(`/colleges/${id}`);
    return data;
  },

  async getDashboardStats(): Promise<
    ApiSuccessResponse<{ stats: SuperAdminDashboardStats }>
  > {
    const { data } = await apiClient.get('/admin/dashboard');
    return data;
  },
};
